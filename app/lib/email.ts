// lib/email.ts - Create this file
import nodemailer from 'nodemailer'

// Configure your email service (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Farmer Market Connect <noreply@farmermarketconnect.com>',
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Then update the API route to send emails:
import { sendEmail } from '@/lib/email'

// Add these after saving to database:
// Send confirmation to farmer
await sendEmail({
  to: email,
  subject: 'Your Farmer Application Received - Farmer Market Connect',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Thank you for applying to Farmer Market Connect!</h1>
      <p>We've received your application and will review it within 24 hours.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #374151; margin-bottom: 15px;">Application Details:</h2>
        <ul style="color: #6b7280; list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li style="margin-bottom: 8px;"><strong>Farm:</strong> ${farmName}</li>
          <li style="margin-bottom: 8px;"><strong>Location:</strong> ${location}</li>
          <li style="margin-bottom: 8px;"><strong>Products:</strong> ${products}</li>
        </ul>
      </div>
      
      <p>You'll hear from us soon!</p>
      <p>Best regards,<br>The Farmer Market Connect Team</p>
    </div>
  `
})

// Send notification to admin
await sendEmail({
  to: process.env.ADMIN_EMAIL || 'admin@farmermarketconnect.com',
  subject: 'New Farmer Application',
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h1>New Farmer Application</h1>
      <p><strong>Application ID:</strong> ${application.id}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      
      <h2>Details:</h2>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
        <li><strong>Farm:</strong> ${farmName}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Farm Size:</strong> ${farmSize || 'Not specified'}</li>
        <li><strong>Products:</strong> ${products}</li>
        <li><strong>Experience:</strong> ${experience || 'Not specified'}</li>
        <li><strong>Certifications:</strong> ${certifications || 'None'}</li>
      </ul>
    </div>
  `
})