/**
 * Builds the scroll-scrub media from the untouched source `burguer.mp4`.
 * Run with: npm run media
 *
 * The source is a 2160x3840 cutout of the burger on a pure white background.
 * H.264 carries no alpha, so instead of keying at runtime we key the white here
 * and composite onto the exact page colour — the burger then reads as floating
 * free on the page with no visible video box and no per-frame work in the browser.
 *
 * The source also has a sparse GOP, which makes `currentTime` seeking stutter,
 * so these outputs use a 5-frame GOP: every scroll tick lands near a keyframe.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import ffmpeg from 'ffmpeg-static'

const SRC = 'burguer.mp4'
const OUT = 'public/media'

/**
 * Must match --page in src/index.css or the seam becomes visible. Note yuv420p
 * conversion shifts this by one level on output, so --page carries the measured
 * result (#fcfaf8) rather than the value fed in here.
 */
const PAGE = '0xFCFBF8'
/** The burger finishes assembling at ~3.5s; the rest of the source is static. */
const DURATION = 3.8
/**
 * Keys the white matte. The page is near-white, so any residual matte pixel is
 * imperceptible against it — a gentle key is safe here and keeps more of the
 * bun's highlights and sesame seeds than the wider key a dark page needed.
 */
const KEY = 'colorkey=0xFFFFFF:0.04:0.04'

const GOP = ['-g', '5', '-keyint_min', '5', '-sc_threshold', '0']
const BASE = ['-an', '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-movflags', '+faststart']

function run(args) {
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
}

/** Key white -> composite on the page colour -> scale to `w`. */
function flatten(w) {
  return `color=c=${PAGE}:s=2160x3840[bg];[0:v]${KEY}[k];[bg][k]overlay,scale=${w}:-2`
}

mkdirSync(OUT, { recursive: true })

run(['-i', SRC, '-t', String(DURATION), '-filter_complex', flatten(1080), ...BASE, ...GOP, '-crf', '23', `${OUT}/hamburguer-scrub.mp4`])
run(['-i', SRC, '-t', String(DURATION), '-filter_complex', flatten(720), ...BASE, ...GOP, '-crf', '25', `${OUT}/hamburguer-scrub-mobile.mp4`])

// Stills come from the encoded scrub file so they match its frames exactly.
run(['-i', `${OUT}/hamburguer-scrub.mp4`, '-frames:v', '1', '-q:v', '3', `${OUT}/hamburguer-poster.jpg`])
run(['-sseof', '-0.1', '-i', `${OUT}/hamburguer-scrub.mp4`, '-update', '1', '-q:v', '3', `${OUT}/hamburguer-final.jpg`])

console.log('scrub media written to', OUT)
