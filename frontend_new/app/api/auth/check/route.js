import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // For development, we'll just check if token exists
    // In production, you'd validate the token with your backend
    const user = { 
      id: 1, 
      name: 'Test User', 
      email: 'test@example.com',
      avatar: 'https://via.placeholder.com/150'
    };

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
