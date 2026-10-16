import React, { useState, useEffect } from 'react';
import { UPTRegion, KawasanInfo, KawasanName, OfficerUser } from '../types';
import { 
  X, 
  Building, 
  MapPin, 
  Edit3, 
  CheckCircle2, 
  Save, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  RotateCcw, 
  Layers, 
  Sprout, 
  Users, 
  FileCheck2, 
  Activity, 
  School, 
  Compass, 
  Info,
  Check
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { UPT_DATA, KAWASAN_SUMMARY } from '../data/mockData';

interface KawasanUptManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  uptList: UPTRegion[];
  kawasanList: KawasanInfo[];
  onSaveUPT: (updatedUPT: UPTRegion) => void;
  onSaveKawasan: (updatedKawasan: KawasanInfo) => void;
  onResetToDefault?: () => void;
  initialTab?: 'kawasan' | 'upt';
  initialSelectedUPTId?: string;
  initialSelectedKawasanId?: string;
  currentOfficer: OfficerUser | null;
}

export const KawasanUptManagementModal: React.FC<KawasanUptManagementModalProps> = ({
  isOpen,
  onClose,
  uptList,
  kawasanList,
  onSaveUPT,
  onSaveKawasan,
  onResetToDefault,
  initialTab = 'kawasan',
  initialSelectedUPTId,
  initialSelectedKawasanId,
  currentOfficer
}) => {
  const [activeTab, setActiveTab] = useState<'kawasan' | 'upt'>('kawasan');
  const [uptSearchQuery, setUptSearchQuery] = useState('');
  const [uptKawasanFilter, setUptKawasanFilter] = useState<'all' | KawasanName>('all');
  
  // Editing state for UPT
  const [editingUPT, setEditingUPT] = useState<UPTRegion | null>(null);
  
  // Editing state for Kawasan
  const [editingKawasan, setEditingKawasan] = useState<KawasanInfo | null>(null);

  // Success toast/notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      if (initialSelectedUPTId) {
        const found = uptList.find(u => u.id === initialSelectedUPTId);
        if (found) {
          setEditingUPT({ ...found });
          setActiveTab('upt');
        }
      } else {
        setEditingUPT(null);
      }

      if (initialSelectedKawasanId) {
        const foundK = kawasanList.find(k => k.id === initialSelectedKawasanId || k.name === initialSelectedKawasanId);
        if (foundK) {
          setEditingKawasan({ ...foundK });
          setActiveTab('kawasan');
        }
      } else {
        setEditingKawasan(null);
      }
    }
  }, [isOpen, initialTab, initialSelectedUPTId, initialSelectedKawasanId, uptList, kawasanList]);

  if (!isOpen) return null;

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // UPT Editing Handlers
  const handleStartEditUPT = (upt: UPTRegion) => {
    setEditingUPT({ ...upt });
  };

  const handleSaveUPTSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUPT) return;

    onSaveUPT(editingUPT);
    showNotification(`Data ${editingUPT.name} berhasil diperbarui dan tersimpan permanen!`);
    setEditingUPT(null);
  };

  // Kawasan Editing Handlers
  const handleStartEditKawasan = (kawasan: KawasanInfo) => {
    setEditingKawasan({ ...kawasan });
  };

  const handleSaveKawasanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKawasan) return;

    onSaveKawasan(editingKawasan);
    showNotification(`Data ${editingKawasan.name} berhasil diperbarui dan tersimpan permanen!`);
    setEditingKawasan(null);
  };

  // Filter UPT List
  const filteredUPTs = uptList.filter(upt => {
    const matchSearch = upt.name.toLowerCase().includes(uptSearchQuery.toLowerCase()) ||
                        upt.district.toLowerCase().includes(uptSearchQuery.toLowerCase()) ||
                        upt.primaryCommodity.toLowerCase().includes(uptSearchQuery.toLowerCase());
    const matchKawasan = uptKawasanFilter === 'all' || upt.kawasan === uptKawasanFilter;
    return matchSearch && matchKawasan;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo
              src="/Luwu_Utara_Logo_(North_Luwu).png"
              alt="Logo Resmi Kabupaten Luwu Utara"
              className="h-10 sm:h-12 w-auto object-contain shrink-0"
              allowZoom={false}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Panel Edit Data Kawasan & UPT
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>AKSES ADMINISTRATOR</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Disnakertrans Kab. Luwu Utara &middot; Administrator: <strong>{currentOfficer?.name || 'Iswady, SE'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onResetToDefault && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data Kawasan dan UPT ke setelan default awal? Perubahan yang belum disimpan akan hilang.')) {
                    onResetToDefault();
                    showNotification('Data Kawasan dan UPT berhasil direset ke standar awal.', 'info');
                    setEditingUPT(null);
                    setEditingKawasan(null);
                  }
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="Reset seluruh data kawasan dan UPT ke data awal bawaan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Standar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              aria-label="Tutup panel edit"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className={`px-4 py-2 text-xs flex items-center gap-2 animate-in slide-in-from-top duration-200 ${
            notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Tab Switcher (When not actively editing a single item) */}
        {!editingUPT && !editingKawasan && (
          <div className="flex items-center border-b border-slate-200 px-6 bg-white shrink-0">
            <button
              onClick={() => setActiveTab('kawasan')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'kawasan'
                  ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Data 2 Kawasan Terpadu ({kawasanList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('upt')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'upt'
                  ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Data Unit Pemukiman Transmigrasi ({uptList.length} UPT)</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* ========================================================= */}
          {/* VIEW 1: EDIT FORM KAWASAN                                  */}
          {/* ========================================================= */}
          {editingKawasan ? (
            <form onSubmit={handleSaveKawasanSubmit} className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingKawasan(null)}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer"
                    title="Kembali ke daftar kawasan"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Edit Data Kawasan: {editingKawasan.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">ID: {editingKawasan.id}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">
                  {editingKawasan.uptCount} UPT Terintegrasi
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Kawasan Terpadu: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingKawasan.name}
                    onChange={(e) => setEditingKawasan({ ...editingKawasan, name: e.target.value as KawasanName })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Deskripsi Profil & Cakupan Kawasan: *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingKawasan.description}
                    onChange={(e) => setEditingKawasan({ ...editingKawasan, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                    placeholder="Tuliskan latar belakang, kondisi geografis, dan sentra komoditas kawasan..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Total Luas Wilayah (Ha): *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingKawasan.totalAreaHa}
                      onChange={(e) => setEditingKawasan({ ...editingKawasan, totalAreaHa: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Total KK Kawasan: *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingKawasan.totalKK}
                      onChange={(e) => setEditingKawasan({ ...editingKawasan, totalKK: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Jumlah UPT Aktif: *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editingKawasan.uptCount}
                      onChange={(e) => setEditingKawasan({ ...editingKawasan, uptCount: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Komoditas Unggulan Kawasan (Pisahkan dengan tanda koma):
                  </label>
                  <input
                    type="text"
                    value={editingKawasan.primaryCommodities.join(', ')}
                    onChange={(e) => {
                      const comms = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                      setEditingKawasan({ ...editingKawasan, primaryCommodities: comms });
                    }}
                    placeholder="Contoh: Kakao Fermentasi, Kelapa Sawit, Padi Sawah Irigasi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {editingKawasan.primaryCommodities.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingKawasan(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan Kawasan</span>
                </button>
              </div>
            </form>
          ) : editingUPT ? (
            /* ========================================================= */
            /* VIEW 2: EDIT FORM UPT                                      */
            /* ========================================================= */
            <form onSubmit={handleSaveUPTSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUPT(null)}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer"
                    title="Kembali ke daftar UPT"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Edit Data UPT: {editingUPT.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">ID: {editingUPT.id} &middot; {editingUPT.kawasan}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-xs font-mono">
                  SHM {editingUPT.shmCompletedPercentage}%
                </span>
              </div>

              <div className="space-y-5 text-xs">
                {/* 1. Identitas & Lokasi */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    1. Identitas & Lokasi Unit Pemukiman
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Nama Unit Pemukiman Transmigrasi (UPT): *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUPT.name}
                        onChange={(e) => setEditingUPT({ ...editingUPT, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Kawasan Terpadu: *
                      </label>
                      <select
                        value={editingUPT.kawasan}
                        onChange={(e) => setEditingUPT({ ...editingUPT, kawasan: e.target.value as KawasanName })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="Kawasan Masamba">Kawasan Masamba</option>
                        <option value="Kawasan Seko">Kawasan Seko</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Kecamatan di Kabupaten Luwu Utara: *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUPT.district}
                        onChange={(e) => setEditingUPT({ ...editingUPT, district: e.target.value })}
                        placeholder="Contoh: Kecamatan Masamba / Baebunta / Seko / Sukamaju / Bone-Bone"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tahun Penempatan Awal: *
                      </label>
                      <input
                        type="number"
                        required
                        min={1970}
                        max={2030}
                        value={editingUPT.yearEstablished}
                        onChange={(e) => setEditingUPT({ ...editingUPT, yearEstablished: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Deskripsi Profil Wilayah: *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingUPT.description}
                      onChange={(e) => setEditingUPT({ ...editingUPT, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      placeholder="Ringkasan sentra agribisnis, kondisi umum UPT..."
                    />
                  </div>
                </div>

                {/* 2. Demografi & Kependudukan */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-700" />
                    2. Demografi & Kependudukan Warga Transmigran
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Total Kepala Keluarga (KK): *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={editingUPT.totalKK}
                        onChange={(e) => setEditingUPT({ ...editingUPT, totalKK: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Total Jiwa: *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={editingUPT.totalSouls}
                        onChange={(e) => setEditingUPT({ ...editingUPT, totalSouls: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        TPA (Penduduk Asal Luar): *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={editingUPT.tpaCount}
                        onChange={(e) => setEditingUPT({ ...editingUPT, tpaCount: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        TPS (Penduduk Setempat): *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={editingUPT.tpsCount}
                        onChange={(e) => setEditingUPT({ ...editingUPT, tpsCount: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Provinsi Asal Transmigran (Pisahkan tanda koma):
                    </label>
                    <input
                      type="text"
                      value={editingUPT.originProvinces.join(', ')}
                      onChange={(e) => {
                        const provs = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                        setEditingUPT({ ...editingUPT, originProvinces: provs });
                      }}
                      placeholder="Contoh: Jawa Tengah, DIY Yogyakarta, Jawa Timur, Sulawesi Selatan"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Lahan & Pertanahan SHM */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    3. Pertanahan & Komoditas Unggulan
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Luas Total HPL (Hektar): *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={editingUPT.totalAreaHa}
                        onChange={(e) => setEditingUPT({ ...editingUPT, totalAreaHa: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Realisasi SHM Terbit (%): *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
                        required
                        value={editingUPT.shmCompletedPercentage}
                        onChange={(e) => setEditingUPT({ ...editingUPT, shmCompletedPercentage: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Komoditas Utama: *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUPT.primaryCommodity}
                        onChange={(e) => setEditingUPT({ ...editingUPT, primaryCommodity: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Komoditas Sekunder / Penunjang: *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUPT.secondaryCommodity}
                        onChange={(e) => setEditingUPT({ ...editingUPT, secondaryCommodity: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Infrastruktur & Layanan Dasar */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-700" />
                    4. Infrastruktur Permukiman & Fasilitas Sosial
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Kondisi Akses Jalan Poros: *
                      </label>
                      <select
                        value={editingUPT.roadCondition}
                        onChange={(e) => setEditingUPT({ ...editingUPT, roadCondition: e.target.value as 'Baik' | 'Sedang' | 'Perlu Perbaikan' })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="Baik">Baik (Aspal / Rabat Beton)</option>
                        <option value="Sedang">Sedang (Pengerasan / Sirtu)</option>
                        <option value="Perlu Perbaikan">Perlu Perbaikan (Tanah / Rusak)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Akses Air Bersih (%): *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={0}
                        max={100}
                        required
                        value={editingUPT.waterAccessPercentage}
                        onChange={(e) => setEditingUPT({ ...editingUPT, waterAccessPercentage: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Akses Listrik PLN (%): *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={0}
                        max={100}
                        required
                        value={editingUPT.electricityPercentage}
                        onChange={(e) => setEditingUPT({ ...editingUPT, electricityPercentage: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Fasilitas Kesehatan:
                      </label>
                      <input
                        type="text"
                        value={editingUPT.healthFacility}
                        onChange={(e) => setEditingUPT({ ...editingUPT, healthFacility: e.target.value })}
                        placeholder="Contoh: Pustu & Poskesdes"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Fasilitas Pendidikan:
                      </label>
                      <input
                        type="text"
                        value={editingUPT.educationFacility}
                        onChange={(e) => setEditingUPT({ ...editingUPT, educationFacility: e.target.value })}
                        placeholder="Contoh: SD Inpres & PAUD"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Koordinat GIS */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-700" />
                    5. Koordinat Geografis & Peta Interaktif
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Latitude:
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={editingUPT.coordinates.lat}
                        onChange={(e) => setEditingUPT({
                          ...editingUPT,
                          coordinates: { ...editingUPT.coordinates, lat: Number(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Longitude:
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={editingUPT.coordinates.lng}
                        onChange={(e) => setEditingUPT({
                          ...editingUPT,
                          coordinates: { ...editingUPT.coordinates, lng: Number(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Posisi X Peta (%):
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editingUPT.coordinates.x}
                        onChange={(e) => setEditingUPT({
                          ...editingUPT,
                          coordinates: { ...editingUPT.coordinates, x: Number(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Posisi Y Peta (%):
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editingUPT.coordinates.y}
                        onChange={(e) => setEditingUPT({
                          ...editingUPT,
                          coordinates: { ...editingUPT.coordinates, y: Number(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUPT(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan UPT</span>
                </button>
              </div>
            </form>
          ) : activeTab === 'kawasan' ? (
            /* ========================================================= */
            /* VIEW 3: DAFTAR KAWASAN LIST                               */
            /* ========================================================= */
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Daftar Kawasan Transmigrasi Terpadu
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pilih salah satu kawasan di bawah untuk mengubah deskripsi, luas wilayah, atau komoditas sentra.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kawasanList.map((kawasan) => (
                  <div 
                    key={kawasan.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 relative group hover:border-emerald-600/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                            Zonasi Terpadu Kab. Luwu Utara
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-base mt-0.5">
                            {kawasan.name}
                          </h5>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-xs font-mono">
                          {kawasan.uptCount} UPT
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {kawasan.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-3 text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">Total Luas</span>
                          <span className="font-bold text-slate-900 font-mono">{kawasan.totalAreaHa.toLocaleString('id-ID')} Ha</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">Total KK</span>
                          <span className="font-bold text-slate-900 font-mono">{kawasan.totalKK.toLocaleString('id-ID')} KK</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-slate-400 block mb-1">Komoditas Sentra:</span>
                        <div className="flex flex-wrap gap-1">
                          {kawasan.primaryCommodities.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => handleStartEditKawasan(kawasan)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Data {kawasan.name}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* VIEW 4: DAFTAR UPT TABLE                                  */
            /* ========================================================= */
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={uptSearchQuery}
                    onChange={(e) => setUptSearchQuery(e.target.value)}
                    placeholder="Cari nama UPT, kecamatan, atau komoditas..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filter Kawasan:</span>
                  <select
                    value={uptKawasanFilter}
                    onChange={(e) => setUptKawasanFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="all">Semua Kawasan ({uptList.length} UPT)</option>
                    <option value="Kawasan Masamba">Kawasan Masamba</option>
                    <option value="Kawasan Seko">Kawasan Seko</option>
                  </select>
                </div>
              </div>

              {/* Table of UPTs */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-3.5">Nama UPT</th>
                        <th className="py-3 px-3">Kawasan & Kecamatan</th>
                        <th className="py-3 px-3 text-right">KK / Jiwa</th>
                        <th className="py-3 px-3 text-right">Luas HPL</th>
                        <th className="py-3 px-3 text-center">SHM (%)</th>
                        <th className="py-3 px-3">Komoditas Sentra</th>
                        <th className="py-3 px-3 text-center">Akses Jalan</th>
                        <th className="py-3 px-3.5 text-center">Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUPTs.map((upt) => (
                        <tr key={upt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3.5">
                            <span className="font-bold text-slate-900 block">{upt.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Penempatan Thn {upt.yearEstablished}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-medium text-emerald-800 block">{upt.kawasan}</span>
                            <span className="text-[11px] text-slate-500">{upt.district}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono">
                            <span className="font-bold text-slate-900 block">{upt.totalKK} KK</span>
                            <span className="text-[10px] text-slate-400">({upt.totalSouls} Jiwa)</span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-800 font-medium">
                            {upt.totalAreaHa.toLocaleString('id-ID')} Ha
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full font-mono font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {upt.shmCompletedPercentage}%
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-[150px]">
                            <span className="font-medium text-slate-800 block truncate">{upt.primaryCommodity}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{upt.secondaryCommodity}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              upt.roadCondition === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                              upt.roadCondition === 'Sedang' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {upt.roadCondition}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              onClick={() => handleStartEditUPT(upt)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                              title={`Edit seluruh data ${upt.name}`}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Data</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredUPTs.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            Tidak ditemukan UPT yang sesuai dengan kata kunci pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            <span>Setiap perubahan data Kawasan dan UPT akan langsung tersinkronisasi ke seluruh modul sistem SIAP KANDA.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
