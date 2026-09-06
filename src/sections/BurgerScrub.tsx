import { useEffect, useRef } from 'react'
import { SITE_CONFIG } from '../data/config'
import { useCartStore } from '../store/cartStore'

/** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in scroll-progress space. */
type Window4 = [number, number, number, number]

const LINES = [
  'Pão brioche tostado na manteiga.',
  'Blend de 160g na chapa quente.',
  'Cheddar, bacon, tomate e alface.',
]

/** One window per rendered line: the brand headline first, then LINES. */
const CHAPTERS: Window4[] = [
  [0, 0, 0.16, 0.23],
  [0.23, 0.3, 0.42, 0.49],
  [0.47, 0.54, 0.64, 0.71],
  [0.69, 0.76, 0.88, 0.94],
]

/** The video reaches its last frame here; the rest of the pin lets it settle. */
const VIDEO_END = 0.96

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const ease = (v: number) => {
  const t = clamp(v)
  return t * t * (3 - 2 * t)
}

function opacityFor(progress: number, chapter: Window4 | undefined) {
  if (!chapter) return 0
  const [inStart, inEnd, outStart, outEnd] = chapter
  if (progress < inStart || progress > outEnd) return 0
  const fadeIn = inEnd > inStart ? ease((progress - inStart) / (inEnd - inStart)) : 1
  const fadeOut = outEnd > outStart ? 1 - ease((progress - outStart) / (outEnd - outStart)) : 1
  return Math.min(fadeIn, fadeOut)
}

export function BurgerScrub() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const openCart = useCartStore((state) => state.openCart)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const video = videoRef.current
    if (!section || !stage || !video) return

    const lines = Array.from(copyRef.current?.querySelectorAll<HTMLElement>('.scrub-line') ?? [])
    const cue = cueRef.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.dataset.mode = 'static'
      section.style.setProperty('--scrub-progress', '1')
      lines.forEach((line, i) => {
        line.style.opacity = i === 0 ? '1' : '0'
        line.style.transform = 'none'
      })
      return
    }

    // Width only: a wide touchscreen laptop should still get the full-size asset.
    const isMobile = window.matchMedia('(max-width: 900px)').matches
    // Below this delta a seek costs more than it visually gains.
    const seekThreshold = isMobile ? 0.03 : 0.018

    let target = 0
    let smoothed = 0
    let tickRaf = 0
    let scrollRaf = 0
    let seeking = false
    let seekStartedAt = 0
    let lastTs = 0
    let primed = false

    const duration = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0)

    function render(progress: number) {
      section!.style.setProperty('--scrub-progress', progress.toFixed(4))

      for (let i = 0; i < lines.length; i++) {
        const o = opacityFor(progress, CHAPTERS[i])
        lines[i].style.opacity = o.toFixed(3)
        lines[i].style.transform = `translate3d(0, ${((1 - o) * 12).toFixed(2)}px, 0)`
      }
      if (cue) cue.style.opacity = (1 - ease((progress - 0.06) / 0.1)).toFixed(3)
    }

    // Always cancel before scheduling: a frame dropped while the tab is hidden
    // would otherwise leave a stale id here and stall the loop for good.
    function ensureTick() {
      if (tickRaf) cancelAnimationFrame(tickRaf)
      tickRaf = requestAnimationFrame(tick)
    }

    function readScroll() {
      scrollRaf = 0
      const top = section!.getBoundingClientRect().top + window.scrollY
      const range = Math.max(1, section!.offsetHeight - stage!.offsetHeight)
      target = clamp((window.scrollY - top) / range)
      if (!primed) {
        primed = true
        smoothed = target
      }
      render(target)
      ensureTick()
    }

    function scheduleRead() {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      scrollRaf = requestAnimationFrame(readScroll)
    }

    function tick(ts: number) {
      tickRaf = 0
      const dt = lastTs ? Math.min(64, ts - lastTs) : 16.7
      lastTs = ts

      // Frame-rate independent lerp so fast and slow displays feel the same.
      const alpha = 1 - Math.pow(1 - 0.2, dt / 16.7)
      smoothed += (target - smoothed) * alpha
      if (Math.abs(target - smoothed) < 0.0004) smoothed = target

      const d = duration()
      if (d > 0 && !seeking && !video!.seeking) {
        const time = clamp(smoothed / VIDEO_END) * Math.max(0, d - 0.04)
        if (Math.abs(video!.currentTime - time) > seekThreshold) {
          seeking = true
          seekStartedAt = ts
          try {
            video!.currentTime = time
          } catch {
            seeking = false
          }
        }
      }
      // Watchdog: never let a dropped `seeked` event stall the loop.
      if (seeking && (video!.seeking === false || ts - seekStartedAt > 400)) seeking = false

      if (Math.abs(target - smoothed) >= 0.0004 || seeking) {
        tickRaf = requestAnimationFrame(tick)
      } else {
        lastTs = 0
      }
    }

    function onSeeked() {
      seeking = false
      ensureTick()
    }

    // Coming back from a hidden tab: rAF was paused, so re-sync from scratch.
    function onVisible() {
      if (document.visibilityState !== 'visible') return
      lastTs = 0
      seeking = false
      readScroll()
    }

    function onLoaded() {
      section!.dataset.mode = 'video'
      readScroll()
    }

    function onError() {
      section!.dataset.mode = 'static'
    }

    video.addEventListener('loadedmetadata', readScroll)
    video.addEventListener('loadeddata', onLoaded, { once: true })
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    window.addEventListener('scroll', scheduleRead, { passive: true })
    window.addEventListener('resize', readScroll, { passive: true })
    window.addEventListener('orientationchange', readScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisible)

    // iOS refuses to decode frames for seeking until the element has played once.
    const warm = () => {
      const p = video.play()
      if (p) p.then(() => video.pause()).catch(() => {})
    }
    window.addEventListener('pointerdown', warm, { once: true, passive: true })

    video.src = isMobile ? SITE_CONFIG.media.scrubMobile : SITE_CONFIG.media.scrub
    video.load()
    readScroll()

    return () => {
      window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', readScroll)
      window.removeEventListener('orientationchange', readScroll)
      window.removeEventListener('pointerdown', warm)
      document.removeEventListener('visibilitychange', onVisible)
      video.removeEventListener('loadedmetadata', readScroll)
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
      if (tickRaf) cancelAnimationFrame(tickRaf)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
    }
  }, [])

  return (
    <section ref={sectionRef} id="top" className="scrub" data-mode="loading" aria-labelledby="scrub-title">
      <div ref={stageRef} className="scrub-stage">
        <div className="scrub-media">
          <video
            ref={videoRef}
            className="scrub-video"
            muted
            playsInline
            preload="auto"
            poster={SITE_CONFIG.media.poster}
            aria-hidden="true"
            tabIndex={-1}
          />
          <img
            src={SITE_CONFIG.media.final}
            alt={`Hambúrguer artesanal da ${SITE_CONFIG.brand}, com cheddar, bacon e cebola roxa.`}
            className="scrub-still"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div ref={copyRef} className="scrub-copy">
          <p className="scrub-kicker">
            {SITE_CONFIG.address.city} — {SITE_CONFIG.address.state}
          </p>
          <div className="scrub-lines">
            <h1 id="scrub-title" className="scrub-line scrub-title">
              {SITE_CONFIG.brand}
            </h1>
            {LINES.map((line) => (
              <p key={line} className="scrub-line" aria-hidden="true">
                {line}
              </p>
            ))}
          </div>

          <p className="scrub-support">{SITE_CONFIG.tagline} Peça pelo WhatsApp e retire ou receba em casa.</p>

          <div className="scrub-actions">
            <a
              href="#cardapio"
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 font-body text-sm font-bold uppercase tracking-wider text-paper transition-colors hover:bg-graphite"
            >
              Ver o cardápio
            </a>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-3.5 font-body text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-graphite hover:text-paper"
            >
              Pedir agora
            </button>
          </div>

          <div className="scrub-rail" aria-hidden="true">
            <i />
          </div>
        </div>

        <div ref={cueRef} className="scrub-cue" aria-hidden="true">
          <span />
          Role para montar
        </div>
      </div>
    </section>
  )
}
