import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, logoUrl = '/Luwu_Utara_Logo_(North_Luwu).png' }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Instansi & Identitas SIAP KANDA */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <BrandLogo
                src={logoUrl}
                alt="Logo Resmi Kabupaten Luwu Utara"
                className="h-12 w-auto object-contain shrink-0 cursor-pointer"
                allowZoom={true}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white">SIAP KANDA</span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Luwu Utara
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Dinas Transmigrasi dan Tenaga Kerja Kab. Luwu Utara
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Sistem Informasi Data Administrasi Pengembangan Kawasan Transmigrasi Terpadu.
              Inisiatif Pemerintah Kabupaten Luwu Utara melalui Dinas Transmigrasi dan Tenaga Kerja
              untuk menjamin akuntabilitas, percepatan sertifikasi hak atas tanah (SHM), dan pemantauan
              kesejahteraan warga transmigran secara transparan dan terintegrasi.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sinergi Bersama Kementerian Transmigrasi RI & Kantor Pertanahan ATR/BPN Kab. Luwu Utara</span>
            </div>
          </div>

          {/* Col 2: Akses Cepat Navigasi */}
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Layanan & Menu
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Ringkasan & Demografi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('peta')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Peta Spasial Kawasan UPT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pertanahan')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Status Sertifikasi Tanah (SHM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('komoditas')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Potensi Komoditas & Poktan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('infrastruktur')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Monitoring Infrastruktur Fisik
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Lapor Kanda (Aspirasi Warga)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak & Pelayanan Lapangan */}
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Kontak Kantor Disnakertrans
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>Kompleks Perkantoran Gabungan Dinas, Jl. Simpurusiang No. 27, Masamba, Kab. Luwu Utara 92961</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>(0473) 21001 / Hotline 0821-9977-0066</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>disnakertrans@luwuutarakab.go.id</span>
              </div>
              <div className="pt-2 text-xs text-slate-400">
                Jam Layanan Publik: Senin - Jumat (08.00 - 16.00 WITA)
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Pemerintah Kabupaten Luwu Utara. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Kebijakan Privasi</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-300">Standar Pelayanan Publik</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-300">Satu Data Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
