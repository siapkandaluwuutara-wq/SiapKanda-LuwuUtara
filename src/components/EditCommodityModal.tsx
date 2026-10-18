import React, { useState, useEffect } from 'react';
import { CommodityStat, OfficerUser } from '../types';
import { X, Save, Edit3, Plus, Trash2, Sprout, CheckCircle2, ShieldCheck, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface EditCommodityModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: CommodityStat | null;
  currentOfficer: OfficerUser | null;
  onSaveCommodity: (commodity: CommodityStat) => void;
  onDeleteCommodity?: (id: string) => void;
}

export const EditCommodityModal: React.FC<EditCommodityModalProps> = ({
  isOpen,
  onClose,
  commodity,
  currentOfficer,
  onSaveCommodity,
  onDeleteCommodity
}) => {
  const isEditing = Boolean(commodity);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Perkebunan' | 'Pangan' | 'Hortikultura'>('Perkebunan');
  const [kawasanFocus, setKawasanFocus] = useState('Kawasan Masamba (6 UPT)');
  const [totalAreaHa, setTotalAreaHa] = useState<number>(1000);
  const [annualProductionTon, setAnnualProductionTon] = useState<number>(1500);
  const [avgYieldPerHaTon, setAvgYieldPerHaTon] = useState<number>(1.2);
  const [localPricePerKg, setLocalPricePerKg] = useState<number>(50000);
  const [activePoktanCount, setActivePoktanCount] = useState<number>(20);
  const [trendPercentage, setTrendPercentage] = useState<number>(5.0);
  const [processingCentersText, setProcessingCentersText] = useState('');
  const [leadSubdistrictsText, setLeadSubdistrictsText] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (commodity) {
      setName(commodity.name);
      setCategory(commodity.category);
      setKawasanFocus(commodity.kawasanFocus);
      setTotalAreaHa(commodity.totalAreaHa);
      setAnnualProductionTon(commodity.annualProductionTon);
      setAvgYieldPerHaTon(commodity.avgYieldPerHaTon);
      setLocalPricePerKg(commodity.localPricePerKg);
      setActivePoktanCount(commodity.activePoktanCount);
      setTrendPercentage(commodity.trendPercentage);
      setProcessingCentersText(commodity.processingCenters.join(', '));
      setLeadSubdistrictsText(commodity.leadSubdistricts.join(', '));
      setFotoUrl(commodity.fotoUrl || '');
    } else {
      setName('');
      setCategory('Perkebunan');
      setKawasanFocus('Kawasan Masamba (6 UPT)');
      setTotalAreaHa(500);
      setAnnualProductionTon(600);
      setAvgYieldPerHaTon(1.2);
      setLocalPricePerKg(45000);
      setActivePoktanCount(15);
      setTrendPercentage(5.0);
      setProcessingCentersText('Sentra Produksi Luwu Utara');
      setLeadSubdistrictsText('Masamba, Seko');
      setFotoUrl('');
    }
    setIsSuccess(false);
    setShowDeleteConfirm(false);
  }, [commodity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const processingCenters = processingCentersText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const leadSubdistricts = leadSubdistrictsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const savedCommodity: CommodityStat = {
      id: commodity ? commodity.id : `komoditas-${Date.now()}`,
      name: name.trim(),
      category,
      kawasanFocus: kawasanFocus.trim() || 'Kawasan Masamba & Seko',
      totalAreaHa: Number(totalAreaHa) || 0,
      annualProductionTon: Number(annualProductionTon) || 0,
      avgYieldPerHaTon: Number(avgYieldPerHaTon) || 0,
      localPricePerKg: Number(localPricePerKg) || 0,
      activePoktanCount: Number(activePoktanCount) || 0,
      trendPercentage: Number(trendPercentage) || 0,
      processingCenters: processingCenters.length > 0 ? processingCenters : ['Sentra Pengolahan Bersama'],
      leadSubdistricts: leadSubdistricts.length > 0 ? leadSubdistricts : ['Kabupaten Luwu Utara'],
      fotoUrl: fotoUrl.trim() || undefined
    };

    onSaveCommodity(savedCommodity);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const handleDelete = () => {
    if (commodity && onDeleteCommodity) {
      onDeleteCommodity(commodity.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10 w-auto" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Panel Administrator Disnakertrans
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  {isEditing ? 'Mode Edit Data' : 'Tambah Komoditas'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <span>{isEditing ? `Edit: ${commodity?.name}` : 'Tambah Komoditas Unggulan Baru'}</span>
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

        {/* Administrator Info Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Petugas Berwenang: <strong>{currentOfficer?.name || 'Administrator Utama Disnakertrans'}</strong> ({currentOfficer?.role || 'Admin'})
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
            Sinkronisasi Otomatis ke Database & Portal
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {isSuccess && (
            <div className="p-3.5 bg-emerald-600 text-white rounded-xl flex items-center gap-2.5 text-xs font-semibold shadow-md animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Data komoditas berhasil disimpan dan langsung diperbarui pada portal ekonomi!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Komoditas */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nama Komoditas & Varietas Unggulan *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kakao Fermentasi Masamba, Kopi Arabika Seko"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kategori Tanaman *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              >
                <option value="Perkebunan">Perkebunan</option>
                <option value="Pangan">Pangan</option>
                <option value="Hortikultura">Hortikultura</option>
              </select>
            </div>

            {/* Kawasan Fokus */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kawasan Fokus Sentra *
              </label>
              <input
                type="text"
                required
                value={kawasanFocus}
                onChange={(e) => setKawasanFocus(e.target.value)}
                placeholder="Contoh: Kawasan Masamba (6 UPT) / Kawasan Seko"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Luas Tanam (Ha) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Luas Tanam Terpadu (Ha) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={totalAreaHa}
                onChange={(e) => setTotalAreaHa(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
              />
            </div>

            {/* Produksi Tahunan (Ton) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Produksi Tahunan (Ton / Tahun) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={annualProductionTon}
                onChange={(e) => setAnnualProductionTon(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
              />
            </div>

            {/* Produktivitas (Ton / Ha) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Produktivitas Rata-rata (Ton / Ha) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={avgYieldPerHaTon}
                onChange={(e) => setAvgYieldPerHaTon(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
              />
            </div>

            {/* Harga Pasar Lokal (Rp / Kg) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Harga Patokan Pasar Lokal (Rp / Kg) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={localPricePerKg}
                  onChange={(e) => setLocalPricePerKg(parseInt(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono font-bold text-emerald-800"
                />
              </div>
            </div>

            {/* Jumlah Poktan Aktif */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Jumlah Kelompok Tani (Poktan) Binaan *
              </label>
              <input
                type="number"
                min="0"
                required
                value={activePoktanCount}
                onChange={(e) => setActivePoktanCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
              />
            </div>

            {/* Tren Pertumbuhan (%) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tren Pertumbuhan Tahunan (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={trendPercentage}
                  onChange={(e) => setTrendPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
              </div>
            </div>

            {/* Sentra Pengolahan Bersama (SPB) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Sentra Pengolahan Bersama (SPB) / Pabrik / Kemitraan
              </label>
              <input
                type="text"
                value={processingCentersText}
                onChange={(e) => setProcessingCentersText(e.target.value)}
                placeholder="Contoh: Sentra Fermentasi Lantang Tallang, Unit Pengolahan Sepakat, Koperasi Seko"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Gunakan tanda koma (,) untuk memisahkan sentra pengolahan.
              </span>
            </div>

            {/* Kecamatan & UPT Utama */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kecamatan & UPT Penghasil Utama
              </label>
              <input
                type="text"
                value={leadSubdistrictsText}
                onChange={(e) => setLeadSubdistrictsText(e.target.value)}
                placeholder="Contoh: Masamba (Lantang Tallang, Sepakat), Baebunta (Buso), Seko (Seko Padang)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Gunakan tanda koma (,) untuk memisahkan wilayah kecamatan / UPT.
              </span>
            </div>
          </div>

          {/* Delete confirmation section */}
          {showDeleteConfirm && isEditing && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Konfirmasi Penghapusan Komoditas</span>
              </div>
              <p className="text-xs text-rose-700">
                Apakah Anda yakin ingin menghapus data komoditas <strong>{commodity?.name}</strong>? Tindakan ini akan menghapus komoditas dari daftar tampilan.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Ya, Hapus Komoditas
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
              {isEditing && onDeleteCommodity && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Komoditas</span>
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
                <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Komoditas'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
