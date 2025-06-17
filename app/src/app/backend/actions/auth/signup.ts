/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '../../../backend/utils/server'
import { z } from "zod"

// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

export async function signup(data: FormData) {
  const email = data.get("email") as string
  const password = data.get("password") as string

  if (!email || !password) {
    return {
      error: "Missing email or password",
    }
  }

  try {
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: data.get("full_name") as string,
        },
      },
    })

    if (authError) {
      console.error("Supabase signup error:", authError)
      return {
        error: authError.message,
      }
    }

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Acme!",
      react: EmailTemplate({ firstName: data.get("full_name") as string }),
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error during signup:", error)
    return {
      error: error.message,
    }
  }
}
