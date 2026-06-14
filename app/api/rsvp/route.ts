import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const RSVP_ENDPOINT =
  process.env.NEXT_PUBLIC_RSVP_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyF7hfTXoQHWHwwq13syhCktAicjsTlokS1i7dJU7Kxhfc3nAZGm0Ab3YUYnKKUztREQw/exec'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Honeypot check
    if (data._hp) {
      return NextResponse.json({ ok: true })
    }

    // Send as URL-encoded form data — GAS doPost(e) reads e.parameter
    const body = new URLSearchParams()
    Object.entries(data).forEach(([k, v]) => body.append(k, String(v ?? '')))

    const gasRes = await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      redirect: 'follow', // GAS always redirects once before responding
    })

    if (!gasRes.ok) {
      console.error('GAS responded with status:', gasRes.status)
      return NextResponse.json({ ok: false, error: 'GAS error' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('RSVP submission error:', err)
    return NextResponse.json({ ok: false, error: 'Submission failed' }, { status: 500 })
  }
}
