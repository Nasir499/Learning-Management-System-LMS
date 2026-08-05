/*
Bulk repair script for lecture video references.

Usage:
  - Dry run (no DB writes):
      node scripts/repairLectures.js

  - Apply fixes (write changes to DB):
      node scripts/repairLectures.js --apply

Requirements:
  - A working .env in server/ with MONGO_URI and Cloudinary credentials:
      CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - Internet access to call Cloudinary API

What it does:
  - Connects to MongoDB and loads Course documents
  - For each lecture that has video.public_id, calls Cloudinary API to check resource
    - If resource exists: regenerates a secure_url and updates lecture.video.secure_url if changed
    - If resource returns 404: clears lecture.video (so frontend will show Upload UI)
  - Prints a summary and, when --apply is provided, saves modified courses.
*/

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'
import path from 'path'
import fs from 'fs'

// Load env from server/.env (assumes script is run with CWD = server/)
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI || process.env.DATABASE_URL
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment. Set it in server/.env')
  process.exit(2)
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary credentials not found in environment. The script will attempt to run but Cloudinary calls will fail.')
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const apply = process.argv.includes('--apply')

// Import Course model dynamically (relative to server/)
const CourseModelPath = path.resolve(process.cwd(), 'models', 'course.model.js')
if (!fs.existsSync(CourseModelPath)) {
  console.error('Cannot find Course model at', CourseModelPath)
  process.exit(3)
}

let Course
try {
  // Import using dynamic import; file uses ES module default export
  const mod = await import(`file://${CourseModelPath}`)
  Course = mod.default || mod.Course || mod
} catch (err) {
  console.error('Failed to import Course model:', err)
  process.exit(4)
}

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('Connected to MongoDB')

  const courses = await Course.find({}).lean()
  console.log(`Found ${courses.length} courses. Scanning lectures...`) 

  let totalLectures = 0
  let checked = 0
  let updated = 0
  let cleared = 0
  const changedCourses = []

  for (const course of courses) {
    if (!course.lectures || !Array.isArray(course.lectures) || course.lectures.length === 0) continue
    totalLectures += course.lectures.length

    let needsSave = false
    for (let i = 0; i < course.lectures.length; i++) {
      const lecture = course.lectures[i]
      if (!lecture || !lecture.video || !lecture.video.public_id) continue

      checked++
      const publicId = lecture.video.public_id
      try {
        const resource = await cloudinary.v2.api.resource(publicId, { resource_type: 'video' })
        const secure = cloudinary.v2.url(publicId, { resource_type: 'video', secure: true })
        if (!lecture.video.secure_url || lecture.video.secure_url !== secure) {
          // update in-memory object
          course.lectures[i].video.secure_url = secure
          needsSave = true
          updated++
          console.log(`Will update secure_url for course ${course._id} lecture ${lecture._id} (public_id=${publicId})`)
        }
      } catch (err) {
        // Cloudinary API returned an error - if 404, resource missing
        const httpCode = err && err.http_code ? err.http_code : (err && err.statusCode) ? err.statusCode : null
        if (httpCode === 404) {
          // clear the broken reference
          course.lectures[i].video = undefined
          needsSave = true
          cleared++
          console.log(`Will clear missing video for course ${course._id} lecture ${lecture._id} (public_id=${publicId})`)
        } else {
          console.warn(`Cloudinary check failed for ${publicId} (course ${course._id} lecture ${lecture._id}):`, err && err.message ? err.message : err)
        }
      }
    }

    if (needsSave) changedCourses.push(course._id)

    // If apply mode, fetch the full Mongoose doc and save modifications
    if (apply && needsSave) {
      try {
        const live = await Course.findById(course._id)
        if (!live) continue
        // copy changed lectures from the lean object back to mongoose doc
        live.lectures = course.lectures
        live.numberoflectures = Array.isArray(live.lectures) ? live.lectures.length : 0
        await live.save()
        console.log(`Saved changes for course ${course._id}`)
      } catch (err) {
        console.error(`Failed to save course ${course._id}:`, err)
      }
    }
  }

  console.log('Scan complete')
  console.log(`Total lectures: ${totalLectures}, checked: ${checked}, will update secure_url: ${updated}, will clear missing: ${cleared}`)
  if (!apply && (updated > 0 || cleared > 0)) {
    console.log('\nRun with --apply to persist the above changes to the database')
  }

  await mongoose.disconnect()
  process.exit(0)
}

main().catch(err => {
  console.error('Script failed:', err)
  process.exit(1)
})
