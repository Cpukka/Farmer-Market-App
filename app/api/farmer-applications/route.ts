// app/api/farmer-applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      farmName, 
      location, 
      farmSize,
      products, 
      experience,
      certifications,
      hearAboutUs
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !farmName || !location || !products) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check for existing application with this email
    const existingApplication = await prisma.farmerApplication.findUnique({
      where: { email }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      )
    }

    // Save application to database
    const application = await prisma.farmerApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        farmName,
        location,
        farmSize: farmSize || null,
        products,
        experience: experience || null,
        certifications: certifications || null,
        hearAboutUs: hearAboutUs || null,
        status: 'PENDING'
      }
    })

    // In a real application, you would send email notifications here
    // For now, we'll just log it
    console.log('New farmer application received:', {
      id: application.id,
      email: application.email,
      farmName: application.farmName
    })

    return NextResponse.json({ 
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application.id,
        email: application.email
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting farmer application:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'An application with this email already exists' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Optional: Add authentication for admin to view applications
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}