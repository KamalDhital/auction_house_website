'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const code = searchParams.get('code');
        const userType = searchParams.get('userType');
        const email = searchParams.get('email');

        const response = await instance.post('/verify_user', {
          code,
          userType,
          email
        });

        if (response.data.statusCode === 200) {
          setVerificationStatus('success');
          // Redirect based on user type
          if (userType === 'buyer') {
            router.push('/buyer');
          } else if (userType === 'seller') {
            router.push('/seller');
          }
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        setVerificationStatus('failed');
        console.error('Verification error:', error);
      }
    };

    if (searchParams.get('code')) {
      verifyUser();
    }
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-6 bg-white rounded shadow-md text-center">
        {verificationStatus === 'pending' && (
          <>
            <h2 className="text-xl mb-4">Verifying Your Email</h2>
            <p className="mb-4">Please wait while we verify your email address...</p>
          </>
        )}
        
        {verificationStatus === 'success' && (
          <>
            <h2 className="text-xl mb-4">Email Verified Successfully!</h2>
            <p className="mb-4">Your email has been verified. You will be redirected to login.</p>
          </>
        )}
        
        {verificationStatus === 'failed' && (
          <>
            <h2 className="text-xl mb-4 text-red-500">Verification Failed</h2>
            <p className="mb-4">There was an error verifying your email.</p>
          </>
        )}

        <button 
          onClick={() => router.push('/login')} 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}