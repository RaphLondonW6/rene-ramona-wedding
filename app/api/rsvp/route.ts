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

    // GAS returns a 302 redirect after receiving the POST data.
    // In Cloudflare Workers, redirect:'manual' gives an opaqueredirect
    // response with status 0 — that still means GAS received the data.
    // We treat anything that isn't a hard network error as success.
    const gasRes = await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      redirect: 'manual',
    })

    // gasRes.type === 'error' means a real network failure
    if (gasRes.type === 'error') {
      console.error('GAS network error')
      return NextResponse.json({ ok: false, error: 'GAS network error' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('RSVP submission error:', err)
    return NextResponse.json({ ok: false, error: 'Submission failed' }, { status: 500 })
  }
}
