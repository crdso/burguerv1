/**
 * Regenerates the scroll-scrub media from the untouched source `hamburguer.mp4`.
 * Run with: npm run media
 *
 * The source has a 60-frame GOP (4 keyframes total), which makes `currentTime`
 * seeking stutter. These outputs use a 5-frame GOP so every scroll tick lands
 * near a keyframe. The crop removes a watermark baked into the source corner.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import ffmpeg from 'ffmpeg-static'

const SRC = 'hamburguer.mp4'
const OUT = 'public/media'

// Assembly finishes at ~3.8s; the rest of the source is static ambience.
const DURATION = 4.4
// Source is 720x1280 with a watermark in the bottom ~110px.
const CROP = 'crop=720:1168:0:0'

const GOP = ['-g', '5', '-keyint_min', '5', '-sc_threshold', '0']
const BASE = ['-an', '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-movflags', '+faststart']

function run(args) {
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
}

mkdirSync(OUT, { recursive: true })

run(['-i', SRC, '-t', String(DURATION), '-vf', CROP, ...BASE, ...GOP, '-crf', '25', `${OUT}/hamburguer-scrub.mp4`])
run(['-i', SRC, '-t', String(DURATION), '-vf', `${CROP},scale=540:-2`, ...BASE, ...GOP, '-crf', '27', `${OUT}/hamburguer-scrub-mobile.mp4`])

run(['-i', SRC, '-vf', CROP, '-frames:v', '1', '-q:v', '4', `${OUT}/hamburguer-poster.jpg`])
run(['-ss', String(DURATION - 0.05), '-i', SRC, '-vf', CROP, '-frames:v', '1', '-q:v', '4', `${OUT}/hamburguer-final.jpg`])

console.log('scrub media written to', OUT)
