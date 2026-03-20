import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('=== Auth Check API Route ===');
  console.log('All headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Get Authorization header instead of cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    console.log('Auth header:', authHeader);
    console.log('Token found:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      console.log('No token found in authorization header');
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // Validate token with backend
    const backendUrl = process.env.API_URL || 'https://ai-multi-model-production-ef6f.up.railway.app';
    console.log('Backend URL:', backendUrl);
    
    const response = await fetch(`${backendUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('Backend response data:', data);
      return NextResponse.json({ user: data.user });
    } else {
      const errorText = await response.text();
      console.log('Backend error response:', errorText);
      return NextResponse.json({ error: 'Invalid token', details: errorText }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Authentication failed', details: error.message }, { status: 401 });
  }
}
 