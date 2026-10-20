import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggleButton } from '../components/common/ThemeToggleButton';
import { BrandWordmark } from '../components/common/BrandWordmark';
import { LanguageSelector } from '../components/common/LanguageSelector';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateLegal: (route: 'privacy' | 'terms') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateLegal }) => {
  const { login, register, error, loading, clearError } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMsg(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationMsg(t.pleaseEnterEmail);
      return;
    }
    if (!password) {
      setValidationMsg(t.pleaseEnterPassword);
      return;
    }
    if (password.length < 6) {
      setValidationMsg(t.passwordTooShort);
      return;
    }

    if (mode === 'signup') {
      const ok = await register(trimmedEmail, password);
      if (ok) {
        onLoginSuccess();
      }
    } else {
      const ok = await login(trimmedEmail, password);
      if (ok) {
        onLoginSuccess();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between quantix-bg text-slate-800 dark:text-slate-100 p-4 sm:p-6 transition-colors duration-200">
      {/* Top Bar with Mode Change & Language Change Icons */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold shadow-sm">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            <BrandWordmark />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="icon" />
          <ThemeToggleButton />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white mb-3 shadow-md font-extrabold text-2xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <BrandWordmark />
          </h1>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 uppercase tracking-widest font-bold">
            {t.brandSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                clearError();
                setValidationMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.signIn}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearError();
                setValidationMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.createAccount}
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {mode === 'signin' ? t.operatorSignIn : t.registerOperator}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mode === 'signin'
                ? t.authSignInHelp
                : t.authRegisterHelp}
            </p>
          </div>

          {/* Validation or Auth Error Notice */}
          {(error || validationMsg) && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span className="font-medium leading-relaxed">{validationMsg || t.authFailed}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address Input */}
            <div>
              <label htmlFor="email-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.emailAddress}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationMsg) setValidationMsg(null);
                  }}
                  placeholder="operator@gasguard.local"
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Input with Visibility Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.password}
                </label>
                {mode === 'signin' && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{t.minPassword}</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationMsg) setValidationMsg(null);
                  }}
                  placeholder={t.enterPassword}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider uppercase shadow-xs cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? t.signIn : t.createAccount}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Footer Legal */}
      <footer className="w-full max-w-md mx-auto text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-4 mb-2 font-medium">
          <button
            onClick={() => onNavigateLegal('privacy')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline cursor-pointer"
          >
            {t.privacyPolicy}
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateLegal('terms')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline cursor-pointer"
          >
            {t.termsConditions}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {t.brandSubtitle}
        </p>
      </footer>
    </div>
  );
};
