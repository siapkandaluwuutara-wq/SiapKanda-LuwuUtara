import React, { useState, useEffect } from 'react';
import { InfrastructureItem, UPTRegion, OfficerUser, KawasanName } from '../types';
import { X, Save, Edit3, Plus, Trash2, Building, CheckCircle2, ShieldCheck, AlertTriangle, Layers, Percent } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface EditInfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InfrastructureItem | null;
  uptList: UPTRegion[];
  currentOfficer: OfficerUser | null;
  onSaveItem: (item: InfrastructureItem) => void;
  onDeleteItem?: (id: string) => void;
}

export const EditInfrastructureModal: React.FC<EditInfrastructureModalProps> = ({
  isOpen,
  onClose,
  item,
  uptList,
  currentOfficer,
  onSaveItem,
  onDeleteItem
}) => {
  const isEditing = Boolean(item);

  const [name, setName] = useState('');
  const [selectedUptId, setSelectedUptId] = useState(uptList[0]?.id || '');
  const [category, setCategory] = useState<InfrastructureItem['category']>('Jalan & Jembatan');
  const [spec, setSpec] = useState('');
  const [condition, setCondition] = useState<InfrastructureItem['condition']>('Baik');
  const [completionRate, setCompletionRate] = useState<number>(100);
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [fundedBy, setFundedBy] = useState<InfrastructureItem['fundedBy']>('APBN');
  const [lastInspected, setLastInspected] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSelectedUptId(item.uptId);
      setCategory(item.category);
      setSpec(item.spec);
      setCondition(item.condition);
      setCompletionRate(item.completionRate);
      setTargetYear(item.targetYear);
      setFundedBy(item.fundedBy);
      setLastInspected(item.lastInspected);
    } else {
      setName('');
      setSelectedUptId(uptList[0]?.id || '');
      setCategory('Jalan & Jembatan');
      setSpec('');
      setCondition('Baik');
      setCompletionRate(100);
      setTargetYear(new Date().getFullYear());
      setFundedBy('APBN');
      
      const now = new Date();
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      setLastInspected(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    }
    setIsSuccess(false);
    setShowDeleteConfirm(false);
  }, [item, isOpen, uptList]);

  if (!isOpen) return null;

  const currentChosenUpt = uptList.find(u => u.id === selectedUptId) || uptList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !spec.trim()) return;

    const savedItem: InfrastructureItem = {
      id: item ? item.id : `INF-${Date.now()}`,
      uptId: currentChosenUpt.id,
      uptName: currentChosenUpt.name,
      kawasan: currentChosenUpt.kawasan,
      category,
      name: name.trim(),
      spec: spec.trim(),
      condition,
      completionRate: Math.min(100, Math.max(0, Number(completionRate) || 0)),
      targetYear: Number(targetYear) || new Date().getFullYear(),
      fundedBy,
      lastInspected: lastInspected.trim() || 'Terverifikasi Disnakertrans'
    };

    onSaveItem(savedItem);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const handleDelete = () => {
    if (item && onDeleteItem) {
      onDeleteItem(item.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10 w-auto" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Panel Administrator Disnakertrans
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  {isEditing ? 'Mode Edit Sarpras' : 'Tambah Paket Baru'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <Building className="w-5 h-5 text-emerald-400" />
                <span>{isEditing ? `Edit: ${item?.name}` : 'Tambah Paket Sarana & Prasarana'}</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Officer Info Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Petugas: <strong>{currentOfficer?.name || 'Administrator Utama Disnakertrans'}</strong> ({currentOfficer?.role || 'Admin'})
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
            Update Monitoring Sarpras Terpadu
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {isSuccess && (
            <div className="p-3.5 bg-emerald-600 text-white rounded-xl flex items-center gap-2.5 text-xs font-semibold shadow-md animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Paket infrastruktur berhasil disimpan dan langsung diperbarui pada daftar monitoring!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Paket Sarpras */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nama Paket Pembangunan / Sarpras *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Peningkatan Poros Jalan Masamba - Lantang Tallang"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Lokasi UPT */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Lokasi Unit Pemukiman Transmigrasi (UPT) *
              </label>
              <select
                value={selectedUptId}
                onChange={(e) => setSelectedUptId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              >
                {uptList.map((upt) => (
                  <option key={upt.id} value={upt.id}>
                    {upt.name} ({upt.kawasan})
                  </option>
                ))}
              </select>
              {currentChosenUpt && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Kawasan Terpilih:</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                    currentChosenUpt.kawasan === 'Kawasan Masamba'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentChosenUpt.kawasan}
                  </span>
                </div>
              )}
            </div>

            {/* Kategori Sarpras */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kategori Sarpras *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              >
                <option value="Jalan & Jembatan">Jalan & Jembatan</option>
                <option value="Air Bersih">Air Bersih (SPAM/Sumur)</option>
                <option value="Listrik & Penerangan">Listrik & Penerangan (PJUTS)</option>
                <option value="Pemukiman">Pemukiman (RTJK & Fasos)</option>
                <option value="Fasilitas Sosial">Fasilitas Sosial / Medis / Sekolah</option>
              </select>
            </div>

            {/* Spesifikasi Teknis */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Spesifikasi Teknis / Dimensi Konstruksi *
              </label>
              <input
                type="text"
                required
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                placeholder="Contoh: Pengaspalan Hotmix & Drainase Beton (Panjang 5.4 KM)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Kondisi Fisik */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kondisi Fisik Saat Ini *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-semibold"
              >
                <option value="Baik" className="text-emerald-700 font-bold">Baik (100% Fungsional)</option>
                <option value="Rusak Ringan" className="text-blue-700 font-semibold">Rusak Ringan</option>
                <option value="Rusak Sedang" className="text-amber-700 font-semibold">Rusak Sedang</option>
                <option value="Rusak Berat" className="text-rose-700 font-bold">Rusak Berat</option>
                <option value="Perlu Perbaikan" className="text-purple-700 font-semibold">Perlu Perbaikan</option>
              </select>
            </div>

            {/* Progres Penyelesaian (%) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Progres Realisasi Fisik (%) *
                </label>
                <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {completionRate}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={completionRate}
                  onChange={(e) => setCompletionRate(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={completionRate}
                  onChange={(e) => setCompletionRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 text-xs text-center font-mono font-bold border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    completionRate === 100 ? 'bg-emerald-600' :
                    completionRate >= 75 ? 'bg-blue-600' :
                    completionRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Tahun Anggaran */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tahun Anggaran / Target Selesai *
              </label>
              <input
                type="number"
                min="1990"
                max="2035"
                required
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
              />
            </div>

            {/* Sumber Pendanaan */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Sumber Pendanaan *
              </label>
              <select
                value={fundedBy}
                onChange={(e) => setFundedBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              >
                <option value="APBN">APBN (Kementerian Transmigrasi)</option>
                <option value="APBD Prov">APBD Provinsi Sulawesi Selatan</option>
                <option value="APBD Luwu Utara">APBD Kab. Luwu Utara</option>
                <option value="Dana Desa / Swadaya">Dana Desa / Swadaya Warga</option>
              </select>
            </div>

            {/* Tanggal Terakhir Inspeksi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tanggal Inspeksi Lapangan Terakhir *
              </label>
              <input
                type="text"
                required
                value={lastInspected}
                onChange={(e) => setLastInspected(e.target.value)}
                placeholder="Contoh: 18 Oktober 2024"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Delete confirmation section */}
          {showDeleteConfirm && isEditing && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Konfirmasi Hapus Paket Sarpras</span>
              </div>
              <p className="text-xs text-rose-700">
                Apakah Anda yakin ingin menghapus paket <strong>{item?.name}</strong>? Tindakan ini akan menghapusnya dari daftar pemantauan infrastruktur.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Ya, Hapus Paket
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {isEditing && onDeleteItem && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Paket</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Paket Sarpras'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
