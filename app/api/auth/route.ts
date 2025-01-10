import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  if (password === process.env.PASSWORD_SECRET) {
    (await cookies()).set('auth', 'true', { httpOnly: true })
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } else {
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

