import React, { useState } from 'react';
import { OfficerUser, OfficerAccount } from '../types';
import { getStoredOfficers } from '../data/officerData';
import { X, Lock, KeyRound, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface OfficerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (officer: OfficerUser) => void;
  officersList?: OfficerAccount[];
}

export const OfficerLoginModal: React.FC<OfficerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  officersList
}) => {
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeOfficer, setActiveOfficer] = useState<OfficerUser | null>(null);

  if (!isOpen) return null;

  const currentAccounts = officersList && officersList.length > 0 
    ? officersList 
    : getStoredOfficers();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const trimmedUser = userIdInput.trim().toLowerCase();
    const found = currentAccounts.find(
      acc => (acc.userId.toLowerCase() === trimmedUser || acc.nip.toLowerCase() === trimmedUser) &&
             acc.passwordHash === passwordInput
    );

    if (found) {
      if (found.status === 'Nonaktif') {
        setErrorMessage('Akun ini telah dinonaktifkan. Silakan hubungi Administrator Sistem.');
        return;
      }

      const isMainAdmin = found.isAdmin || found.nip === '197909202010011002' || found.role === 'Administrator Utama';

      const officerData: OfficerUser = {
        userId: found.userId,
        nip: found.nip,
        name: found.name,
        role: found.role,
        office: found.office,
        isAdmin: isMainAdmin,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA'
      };
      setActiveOfficer(officerData);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(officerData);
        setIsSuccess(false);
        setUserIdInput('');
        setPasswordInput('');
        onClose();
      }, 1000);
    } else {
      setErrorMessage('User ID / NIP atau Kata Sandi tidak sesuai. Silakan periksa kembali.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo
              src="/Luwu_Utara_Logo_(North_Luwu).png"
              alt="Logo Resmi Kabupaten Luwu Utara"
              className="h-11 w-auto object-contain shrink-0"
              allowZoom={false}
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Login User ID Petugas
              </h3>
              <p className="text-[11px] text-slate-500">
                Disnakertrans Kabupaten Luwu Utara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
            aria-label="Tutup form login"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess && activeOfficer ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900">Login Berhasil!</h4>
            <p className="text-xs text-slate-700">
              Selamat bertugas, <strong>{activeOfficer.name}</strong>
            </p>
            <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {activeOfficer.role}
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              {activeOfficer.isAdmin 
                ? 'Hak akses penuh diaktifkan: input & edit transmigran, kelola foto portal, dan kelola user ID petugas lapangan.'
                : 'Hak akses penginputan data, pengeditan rekam transmigran, dan manajemen foto telah diaktifkan.'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 text-xs">
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  User ID Petugas atau NIP:
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="Masukkan User ID atau NIP"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kata Sandi (Password):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 p-2.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 text-[11px]">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Masuk ke Portal Petugas
              </button>
            </form>

            {/* Security note without revealing accounts */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Akses resmi terbatas bagi Petugas Disnakertrans Kabupaten Luwu Utara.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
