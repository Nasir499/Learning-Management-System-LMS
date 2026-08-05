import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function main(){
  try{
    const tmp = path.resolve(process.cwd(), 'scripts', 'tmp.png')
    // 1x1 transparent PNG base64
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9p0h1wAAAABJRU5ErkJggg=='
    fs.writeFileSync(tmp, Buffer.from(base64, 'base64'))

    console.log('Uploading test image to Cloudinary...')
    const res = await cloudinary.v2.uploader.upload(tmp, { folder: 'lms_test', resource_type: 'image' })
    console.log('Upload result:', res)

    fs.unlinkSync(tmp)
    process.exit(0)
  }catch(err){
    console.error('Upload failed:', err)
    process.exit(1)
  }
}

main()
