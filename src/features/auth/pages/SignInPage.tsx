import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../lib/constants';
import { useNavigation } from '../../../navigation/NavigationContext';

export default function SignInPage() {
  const { navigate } = useNavigation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: 'shahrukh@fliq.pk',
    password: 'password123',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.email || !formData.password) {
      setGeneralError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const response: any = await authService.login(formData);
      const user = response?.data?.user || response?.data;
      const token = response?.token;
      login(user, token);
      navigate(ROUTES.HOME);
    } catch (error: any) {
      console.error('LOGIN ERROR:', error);
      setGeneralError('Unable to sign in. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-md mb-3">
          F
        </div>
        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Fliq</h1>
        <h2 className="mt-1 text-lg font-bold text-gray-800">See what's happening</h2>
        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
          Join the calmer public square for Pakistan to share thoughts and connect with creators.
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
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {generalError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center border border-red-100">
                {generalError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(ROUTES.SIGN_UP)}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
