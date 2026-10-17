import React, { useState } from 'react';
import { PortalImages, UPTRegion, OfficerUser } from '../types';
import { DEFAULT_PORTAL_IMAGES } from '../data/portalImages';
import { X, Image as ImageIcon, Upload, RefreshCw, CheckCircle2, Sparkles, Building, Layers, Eye } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PortalImages;
  onUpdateImages: (newImages: PortalImages) => void;
  uptList: UPTRegion[];
  currentOfficer: OfficerUser | null;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  images,
  onUpdateImages,
  uptList,
  currentOfficer
}) => {
  const [activeSection, setActiveSection] = useState<'logo_hero' | 'komoditas_sarpras' | 'upt'>('logo_hero');
  const [logoUrl, setLogoUrl] = useState(images.logoUrl || '/Luwu_Utara_Logo_(North_Luwu).png');
  const [heroBanner, setHeroBanner] = useState(images.heroBanner);
  const [commodityKakao, setCommodityKakao] = useState(images.commodityKakao);
  const [infrastructure, setInfrastructure] = useState(images.infrastructure);
  const [uptImages, setUptImages] = useState<Record<string, string>>(images.uptImages || {});
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setter(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUptFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    uptId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUptImages(prev => ({
          ...prev,
          [uptId]: dataUrl
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updated: PortalImages = {
      logoUrl,
      heroBanner,
      commodityKakao,
      infrastructure,
      uptImages
    };
    onUpdateImages(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan semua gambar ke foto default sistem SIAP KANDA?')) {
      const defaults: PortalImages = { ...DEFAULT_PORTAL_IMAGES };
      setLogoUrl(defaults.logoUrl || '');
      setHeroBanner(defaults.heroBanner);
      setCommodityKakao(defaults.commodityKakao);
      setInfrastructure(defaults.infrastructure);
      setUptImages({});
      onUpdateImages(defaults);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Kelola & Edit Semua Gambar / Foto Portal
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Mode Petugas
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Petugas: <strong>{currentOfficer?.name || 'Petugas Disnakertrans'}</strong> &middot; Perbarui logo resmi, visual hero, sentra komoditas, dan foto dokumentasi UPT.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSection('logo_hero')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'logo_hero'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Logo Resmi & Hero Banner
          </button>
          <button
            onClick={() => setActiveSection('komoditas_sarpras')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'komoditas_sarpras'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Foto Komoditas & Sarpras
          </button>
          <button
            onClick={() => setActiveSection('upt')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'upt'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Foto Dokumentasi 8 Sentra UPT Kawasan
          </button>
        </div>

        {savedNotice && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Semua pembaruan foto berhasil disimpan dan langsung diterapkan pada portal publik!</span>
          </div>
        )}

        <div className="p-6 space-y-6 text-xs">
          {activeSection === 'logo_hero' && (
            <div className="space-y-6">
              {/* Item 0: Logo Resmi SIAP KANDA */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Logo Resmi SIAP KANDA (Lambang Kabupaten Luwu Utara)
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Ukuran Asli 400 × 483 px
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Tampil di samping tulisan SIAP KANDA pada Header, Hero Banner, Warkah Surat, dan Footer dengan proporsi warna dan bentuk asli.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center min-h-[140px] shadow-sm">
                    <img
                      src={logoUrl}
                      alt="Logo Resmi Kabupaten Luwu Utara"
                      className="h-24 w-auto object-contain"
                      style={{ aspectRatio: '400 / 483' }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-2">Rasio Asli 1:1.20</span>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-slate-700 font-medium">Unggah File Logo Baru:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setLogoUrl)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <div className="pt-1">
                      <label className="block text-slate-700 font-medium mb-1">Atau Gunakan Tautan URL Logo:</label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="Contoh: /Luwu_Utara_Logo_(North_Luwu).png"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 1: Hero Banner */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Foto Hero Banner Utama
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tampil di bagian paling atas beranda (pemandangan lanskap permukiman transmigrasi Luwu Utara).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 bg-slate-900 shadow-inner">
                    <img
                      src={heroBanner}
                      alt="Preview Hero Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-slate-700 font-medium">Unggah File Foto Baru dari Komputer:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setHeroBanner)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <div className="pt-1">
                      <label className="block text-slate-700 font-medium mb-1">Atau Gunakan Tautan URL Gambar:</label>
                      <input
                        type="text"
                        value={heroBanner}
                        onChange={(e) => setHeroBanner(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'komoditas_sarpras' && (
            <div className="space-y-6">
              {/* Item 2: Komoditas Kakao */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Foto Panen Kakao & Agribisnis (Bumi Kakao)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tampil pada spotlight hilirisasi dan kartu agribisnis transmigran di UPT Lantang Tallang / Sepakat.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 shadow-inner">
                    <img
                      src={commodityKakao}
                      alt="Preview Komoditas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-slate-700 font-medium">Unggah File Foto Panen Baru:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setCommodityKakao)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <div className="pt-1">
                      <label className="block text-slate-700 font-medium mb-1">Atau Gunakan Tautan URL Gambar:</label>
                      <input
                        type="text"
                        value={commodityKakao}
                        onChange={(e) => setCommodityKakao(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 3: Infrastruktur Sarpras */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Foto Infrastruktur Sarpras (Jalan, SPAM & Pustu)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tampil pada modul pemantauan sarana fisik jalan poros dan air bersih pemukiman.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 shadow-inner">
                    <img
                      src={infrastructure}
                      alt="Preview Infrastruktur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-slate-700 font-medium">Unggah File Foto Sarpras Baru:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setInfrastructure)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <div className="pt-1">
                      <label className="block text-slate-700 font-medium mb-1">Atau Gunakan Tautan URL Gambar:</label>
                      <input
                        type="text"
                        value={infrastructure}
                        onChange={(e) => setInfrastructure(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'upt' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Petugas dapat mengunggah foto dokumentasi spesifik untuk masing-masing 8 UPT di Kawasan Masamba dan Kawasan Seko:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {uptList.map((upt) => {
                  const currentPhoto = uptImages[upt.id] || heroBanner;
                  return (
                    <div key={upt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{upt.name}</span>
                          <span className="text-[10px] text-slate-500">{upt.district} &middot; {upt.kawasan}</span>
                        </div>
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden border border-slate-300 bg-slate-900 relative">
                        <img
                          src={currentPhoto}
                          alt={upt.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUptFileUpload(e, upt.id)}
                          className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Foto Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Semua Perubahan Foto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
