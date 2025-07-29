"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
    debugger;
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!firstName || !lastName || !email || !message) {
        return { success: false, error: "All fields are required" }
    }

    try {
        // Send notification email to gym owner
        debugger;

        await resend.emails.send({
            from: "FitZone <onboarding@resend.dev>",
            to: [process.env.CONTACT_EMAIL || "denizsanli4@gmail.com"], // Your designated email
            subject: `New Contact Form Message from ${firstName} ${lastName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
            <h2 style="color: #fff; margin-bottom: 20px; text-align: center;">🏋️ New Contact Form Message</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #fff; margin-bottom: 15px;">Contact Details:</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
              <h3 style="color: #fff; margin-bottom: 15px;">Message:</h3>
              <p style="line-height: 1.6; margin: 0;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; opacity: 0.8;">Reply to this message by responding to ${email}</p>
            </div>
          </div>
        </div>
      `,
        })

        // Send auto-reply to user
        await resend.emails.send({
            from: "FitZone <onboarding@resend.dev>",//TODO fix this mail
            to: [email],
            subject: "Thank you for contacting FitZone! 💪",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #fff; margin-bottom: 10px;">🏋️ FitZone</h1>
              <h2 style="color: #fff; margin: 0;">Thank You for Reaching Out!</h2>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <p style="margin: 0 0 15px 0; font-size: 16px;">Hi ${firstName},</p>
              <p style="margin: 0 0 15px 0; line-height: 1.6;">
                Thank you for contacting FitZone! We've received your message and our team will get back to you within 24 hours.
              </p>
              <p style="margin: 0 0 15px 0; line-height: 1.6;">
                In the meantime, feel free to explore our facilities and programs. We're excited to help you on your fitness journey!
              </p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #fff; margin-bottom: 15px;">Your Message:</h3>
              <p style="line-height: 1.6; margin: 0; font-style: italic;">"${message}"</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <div style="margin-bottom: 20px;">
                <a href="tel:+15551234567" style="color: #fff; text-decoration: none; margin: 0 15px;">📞 (555) 123-4567</a>
                <a href="mailto:info@fitzone.com" style="color: #fff; text-decoration: none; margin: 0 15px;">✉️ info@fitzone.com</a>
              </div>
              <p style="font-size: 14px; opacity: 0.8; margin: 0;">
                123 Fitness Street, New York, NY 10001
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
              <p style="font-size: 12px; opacity: 0.7; margin: 0;">
                © 2024 FitZone. Transform your body, transform your life.
              </p>
            </div>
          </div>
        </div>
      `,
        })

        return { success: true, message: "Message sent successfully!" }
    } catch (error) {
        console.error("Email sending failed:", error)
        return { success: false, error: "Failed to send message. Please try again." }
    }
}
