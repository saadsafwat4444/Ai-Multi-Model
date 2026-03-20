"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/config";

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // First, get token from backend using cookies
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User authenticated, getting token...');
          
          // Try to extract token from cookies (this is a workaround)
          // In a real app, you'd get the token from the backend response
          const cookies = document.cookie.split(';');
          let token = null;
          
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'token') {
              token = value;
              break;
            }
          }
          
          if (token) {
            // Store token in localStorage
            localStorage.setItem('token', token);
            console.log('Token stored in localStorage');
            
            // Verify token with backend
            const verifyResponse = await fetch(`${API_URL}/auth/store-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              console.log('Token verified successfully:', verifyData);
              router.push('/dashboard');
            } else {
              console.error('Failed to verify token');
              router.push('/auth/login?error=verify_failed');
            }
          } else {
            console.error('No token found in cookies');
            router.push('/auth/login?error=no_cookie_token');
          }
        } else {
          console.error('Authentication failed');
          router.push('/auth/login?error=auth_failed');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return null;
}
