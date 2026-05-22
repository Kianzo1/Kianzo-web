import sharp from 'sharp'
import { readdir, rename, unlink } from 'fs/promises'
import { join, extname, basename } from 'path'

const FOLDERS = [
  'public/carrizo/imagenes',
  'public/istore/products',
  'public/portfolio',
]

const MAX_WIDTH  = 1400  // px máximo
const QUALITY    = 78    // WebP quality (78 es visualmente idéntico a original)
const SUPPORTED  = ['.jpg', '.jpeg', '.png', '.webp']

let totalOriginal = 0
let totalNew      = 0
let converted     = 0
let skipped       = 0

for (const folder of FOLDERS) {
  console.log(`\n📁 ${folder}`)
  let files
  try { files = await readdir(folder) } catch { console.log('  (no existe)'); continue }

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!SUPPORTED.includes(ext)) {
      console.log(`  ⏭  ${file} (formato no soportado, saltando)`)
      skipped++
      continue
    }

    const src  = join(folder, file)
    const name = basename(file, ext)
    const dst  = join(folder, name + '.webp')

    try {
      const info = await sharp(src)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(dst)

      const srcSize = (await import('fs')).statSync(src).size
      const dstSize = info.size

      totalOriginal += srcSize
      totalNew      += dstSize
      converted++

      const saving = Math.round((1 - dstSize / srcSize) * 100)
      console.log(`  ✅ ${file} → ${name}.webp  (${Math.round(srcSize/1024)}KB → ${Math.round(dstSize/1024)}KB, -${saving}%)`)

      // Borra el original solo si es diferente al destino
      if (src !== dst) await unlink(src)
    } catch (err) {
      console.log(`  ❌ ${file}: ${err.message}`)
      skipped++
    }
  }
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`✅ Convertidas: ${converted} imágenes`)
console.log(`⏭  Saltadas:    ${skipped}`)
console.log(`📦 Antes:  ${Math.round(totalOriginal/1024/1024*10)/10} MB`)
console.log(`📦 Después: ${Math.round(totalNew/1024/1024*10)/10} MB`)
console.log(`💾 Ahorro:  ${Math.round((1 - totalNew/totalOriginal)*100)}%`)
