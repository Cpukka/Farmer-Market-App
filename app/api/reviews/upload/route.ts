// app/api/reviews/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from "../../../lib/auth"
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    
    if (files.length > 4) {
      return NextResponse.json(
        { error: 'Maximum 4 images allowed' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []
    
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        )
      }

      // In production, upload to cloud storage (S3, Cloudinary, etc.)
      // For now, save to public/uploads temporarily
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filename = `${uuidv4()}-${file.name}`
      const publicPath = `/uploads/reviews/${filename}`
      const filePath = join(process.cwd(), 'public', 'uploads', 'reviews', filename)
      
      await writeFile(filePath, buffer)
      uploadedUrls.push(publicPath)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}