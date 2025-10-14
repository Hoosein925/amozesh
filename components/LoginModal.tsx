import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setError('');
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('کد کاربری یا رمز عبور اشتباه است.');
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={handleClose}>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">ورود مدیر سیستم</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-600 mb-2 text-right">کد کاربری</label>
            <input
              id="username"
              type="number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-slate-600 mb-2 text-right">رمز عبور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30">
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;