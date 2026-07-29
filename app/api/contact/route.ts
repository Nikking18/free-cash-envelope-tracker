import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_subject', `New Website Suggestion from ${name} — Free Cash Envelope Tracker`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    const res = await fetch('https://formsubmit.co/ajax/nikhilkhanpara@gmail.com', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.freecashtracker.online',
        'Referer': 'https://www.freecashtracker.online/',
      },
      body: formData.toString(),
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact API Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
