import React, { useState } from 'react';
import { Search, UserCheck, LogIn, LogOut, Plus, Image as ImageIcon, ShieldCheck, ChevronDown, Users, Layers } from 'lucide-react';
import { OfficerUser } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCheckModal: () => void;
  currentOfficer: OfficerUser | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  onOpenPhotoModal: () => void;
  onOpenOfficerManageModal?: () => void;
  onOpenKawasanUptModal?: () => void;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckModal,
  currentOfficer,
  onOpenLoginModal,
  onLogout,
  onOpenAddModal,
  onOpenPhotoModal,
  onOpenOfficerManageModal,
  onOpenKawasanUptModal,
  logoUrl = '/Luwu_Utara_Logo_(North_Luwu).png'
}) => {
  const [isOfficerMenuOpen, setIsOfficerMenuOpen] = useState(false);

  const isMainAdmin = currentOfficer?.isAdmin || currentOfficer?.nip === '197909202010011002';

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'peta', label: 'Peta Kawasan' },
    { id: 'pertanahan', label: 'Administrasi & SHM' },
    { id: 'komoditas', label: 'Komoditas' },
    { id: 'infrastruktur', label: 'Infrastruktur' },
    { id: 'layanan', label: 'Layanan Publik' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark with Official Logo (Tampil dengan ukuran & proporsi asli) */}
        <div className="flex items-center gap-3">
          <BrandLogo
            src={logoUrl}
            alt="Logo Resmi Kabupaten Luwu Utara"
            className="h-13 sm:h-15 w-auto object-contain shrink-0 drop-shadow-sm cursor-pointer"
            allowZoom={true}
          />
          <button
            onClick={() => setActiveTab('beranda')}
            className="text-left group cursor-pointer"
          >
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors leading-none">
              SIAP KANDA
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 tracking-wide uppercase mt-1">
              Kabupaten Luwu Utara
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === item.id
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Cek Transmigran (Public) */}
          <button
            onClick={onOpenCheckModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Cek transparansi data alokasi lahan & hak sertifikat transmigran"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Cek Transmigran</span>
          </button>

          {/* Petugas Login / Profile */}
          {!currentOfficer ? (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Petugas</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsOfficerMenuOpen(!isOfficerMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 transition-colors cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentOfficer.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <span className="block font-bold leading-none truncate max-w-[120px]">{currentOfficer.name.split(',')[0]}</span>
                  <span className="block text-[10px] text-emerald-700 font-normal">{currentOfficer.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-700 ml-0.5" />
              </button>

              {/* Officer Dropdown Menu */}
              {isOfficerMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 text-xs z-50 animate-in fade-in duration-150"
                  onClick={() => setIsOfficerMenuOpen(false)}
                >
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <span className="font-bold text-slate-900 block truncate">{currentOfficer.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">NIP: {currentOfficer.nip}</span>
                    <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">{currentOfficer.office}</span>
                  </div>

                  <button
                    onClick={onOpenAddModal}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-700 text-left transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>+ Input Transmigran Baru</span>
                  </button>

                  <button
                    onClick={onOpenPhotoModal}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-700 text-left transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Kelola & Ganti Foto Portal</span>
                  </button>

                  {isMainAdmin && onOpenKawasanUptModal && (
                    <button
                      onClick={onOpenKawasanUptModal}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-700 hover:bg-amber-50 text-left transition-colors cursor-pointer font-medium border-t border-slate-100"
                    >
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span>Edit Data Kawasan & UPT</span>
                    </button>
                  )}

                  {isMainAdmin && onOpenOfficerManageModal && (
                    <button
                      onClick={onOpenOfficerManageModal}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-50 text-left transition-colors cursor-pointer font-medium border-t border-slate-100"
                    >
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Kelola Petugas Lapangan</span>
                    </button>
                  )}

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer mt-1 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Keluar dari Sesi Petugas</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs gap-3 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
              activeTab === item.id
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
