import React from 'react';
import { ArrowLeft, Moon, Sun, Monitor, Check } from 'lucide-react';
import { ROUTES } from '../../../lib/constants';
import { useTheme } from '../../../hooks/useTheme';
import { useNavigation } from '../../../navigation/NavigationContext';

export default function DisplaySettingsPage() {
  const { navigate } = useNavigation();
  const { theme, setTheme, rawTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, desc: 'Clean, crisp white interface' },
    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Calm, low-light dark aesthetics' },
    { value: 'system', label: 'System', icon: Monitor, desc: 'Follows operating system settings' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-white/95 backdrop-blur-xs border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate(ROUTES.SETTINGS_ACCOUNT)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          title="Back to settings"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Display & Appearance</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-1">Theme Preferences</h2>
          <p className="text-xs text-gray-500 mb-4">
            Manage how Fliq looks on your device. Changes are saved locally.
          </p>

          <div className="space-y-2.5">
            {themeOptions.map((opt) => {
              const isSelected = rawTheme === opt.value || (!rawTheme && opt.value === 'light');
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-600 leading-relaxed">
          <strong className="font-semibold text-gray-800">Calmer experience design:</strong>{' '}
          Fliq uses softer contrast ratios and calming emerald accents to reduce visual fatigue during long reading and writing sessions.
        </div>
      </div>
    </div>
  );
}
