import React, { useState } from 'react';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../lib/constants';
import { useNavigation } from '../../../navigation/NavigationContext';

export default function ForgotPasswordPage() {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setGeneralError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      await authService.forgotPassword(email);
      setSuccessMessage('Password reset link has been sent to your email');
      setEmail('');
    } catch (error: any) {
      console.error('FORGOT PASSWORD ERROR:', error);
      setGeneralError('Unable to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-md mb-3">
          F
        </div>
        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Forgot Password</h1>
        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                placeholder="name@fliq.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {generalError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center border border-red-100">
                {generalError}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs text-center border border-emerald-100">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => navigate(ROUTES.SIGN_IN)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Back to Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
