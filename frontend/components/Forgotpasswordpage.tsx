'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Call your forgot password API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = () => {
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Back Button */}
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Login</span>
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fadeIn">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Forgot Password?
            </span>
          </h2>
          <p className="text-gray-600 text-base max-w-sm mx-auto">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl py-10 px-8 shadow-2xl rounded-3xl border border-white/50 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-green-900 mb-1">Email Sent!</h3>
                  <p className="text-sm text-green-700">
                    Check your inbox for password reset instructions. Don't forget to check spam folder!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  disabled={success}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter the email associated with your account
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-lg">Sending Email...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-lg">Email Sent</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">Send Reset Link</span>
                </>
              )}
            </button>

            {/* Resend Button */}
            {success && (
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setError('');
                }}
                className="w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Didn't receive email? Try again
              </button>
            )}
          </form>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-xs text-gray-600 text-center">
              <strong className="text-gray-900">Note:</strong> The reset link will expire in 1 hour for security reasons.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link 
              href="/login" 
              className="font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}