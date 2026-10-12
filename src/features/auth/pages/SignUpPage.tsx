import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../lib/constants';
import { useNavigation } from '../../../navigation/NavigationContext';

export default function SignUpPage() {
  const { navigate } = useNavigation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setGeneralError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setGeneralError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const response: any = await authService.register(formData);
      const user = response.data?.user || response.data;
      const token = response.token;
      login(user, token);
      navigate(ROUTES.HOME);
    } catch (error: any) {
      console.error('REGISTER ERROR:', error);
      setGeneralError('Unable to sign up. Please try again.');
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
        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Join Fliq</h1>
        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
          Create an account to start sharing insights, participating in Pakistan trends, and connecting.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                placeholder="Bilal Ahmed"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                placeholder="bilal@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
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
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
