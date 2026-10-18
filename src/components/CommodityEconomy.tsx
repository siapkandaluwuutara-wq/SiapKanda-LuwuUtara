import React, { useState } from 'react';
import { CommodityStat, UPTRegion, OfficerUser } from '../types';
import { 
  Sprout, 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Calculator, 
  Scale, 
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Edit3,
  Plus,
  Trash2,
  ShieldCheck,
  RotateCcw,
  LogIn
} from 'lucide-react';

interface CommodityEconomyProps {
  commodities: CommodityStat[];
  uptList: UPTRegion[];
  currentOfficer?: OfficerUser | null;
  onOpenLoginModal?: () => void;
  onEditCommodity?: (commodity: CommodityStat) => void;
  onAddCommodity?: () => void;
  onDeleteCommodity?: (commodityId: string) => void;
  onResetCommodities?: () => void;
}

export const CommodityEconomy: React.FC<CommodityEconomyProps> = ({
  commodities,
  uptList,
  currentOfficer,
  onOpenLoginModal,
  onEditCommodity,
  onAddCommodity,
  onDeleteCommodity,
  onResetCommodities
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    commodities[0]?.id || 'komoditas-kakao'
  );
  
  // Interactive Farm Yield Simulation Calculator
  const [calcLuasHa, setCalcLuasHa] = useState<number>(2.0); // 2 Ha default (LU 1 + LU 2)
  const [calcCommodityId, setCalcCommodityId] = useState<string>(
    commodities[0]?.id || 'komoditas-kakao'
  );

  const selectedCommodity = commodities.find(c => c.id === selectedCommodityId) || commodities[0] || {
    id: 'unknown',
    name: 'Tidak ada data komoditas',
    category: 'Perkebunan',
    kawasanFocus: '-',
    totalAreaHa: 0,
    annualProductionTon: 0,
    avgYieldPerHaTon: 0,
    localPricePerKg: 0,
    activePoktanCount: 0,
    processingCenters: [],
    leadSubdistricts: [],
    trendPercentage: 0
  };

  // Dynamic calculation logic linked to real commodity stats
  const activeCalcCommodity = commodities.find(c => c.id === calcCommodityId) || selectedCommodity;
  const yieldKg = calcLuasHa * (activeCalcCommodity.avgYieldPerHaTon * 1000);
  const revenue = yieldKg * activeCalcCommodity.localPricePerKg;

  const isOfficer = Boolean(currentOfficer);

  return (
    <div className="space-y-8">
      {/* Header Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" />
              <span>Pemberdayaan Ekonomi Kerakyatan 2 Kawasan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Komoditas Unggulan Kawasan Masamba & Kawasan Seko
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Monitoring produktivitas panen dan pembinaan Kelompok Tani (Poktan) transmigran di 6 UPT Kawasan Masamba 
              (Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung) serta sentra Kopi Arabika di Kawasan Seko.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs">
              <span className="text-emerald-900 font-bold block">Sentra Bumi Kakao Sulsel</span>
              <span className="text-emerald-700 text-[11px]">Kontribusi Transmigran: 38% Pasokan Kakao Kab. Luwu Utara</span>
            </div>
          </div>
        </div>

        {/* Admin Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {isOfficer ? (
            <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Mode Admin: <strong>{currentOfficer?.name}</strong> ({currentOfficer?.role}) &middot; Anda berwenang mengedit data komoditas
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Data resmi statistik panen Dinas Tenaga Kerja dan Transmigrasi Kab. Luwu Utara</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isOfficer ? (
              <>
                {onAddCommodity && (
                  <button
                    onClick={onAddCommodity}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Komoditas</span>
                  </button>
                )}
                {onResetCommodities && (
                  <button
                    onClick={onResetCommodities}
                    title="Kembalikan data ke standar awal"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Default</span>
                  </button>
                )}
              </>
            ) : (
              onOpenLoginModal && (
                <button
                  onClick={onOpenLoginModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Login Petugas untuk Edit</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Commodity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {commodities.map((item) => {
          const isSelected = item.id === selectedCommodityId;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedCommodityId(item.id)}
              className={`bg-white rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected 
                  ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/20' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Fokus: {item.kawasanFocus}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    +{item.trendPercentage}% Thn
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
                  <div className="p-2 bg-slate-50/80 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Luas Tanam</span>
                    <span className="font-mono font-bold text-slate-800 text-xs">{item.totalAreaHa.toLocaleString('id-ID')} Ha</span>
                  </div>
                  <div className="p-2 bg-slate-50/80 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Produksi</span>
                    <span className="font-mono font-bold text-slate-800 text-xs">{item.annualProductionTon.toLocaleString('id-ID')} Ton</span>
                  </div>
                  <div className="p-2 bg-slate-50/80 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Produktivitas</span>
                    <span className="font-mono font-medium text-slate-800 text-xs">{item.avgYieldPerHaTon} Ton/Ha</span>
                  </div>
                  <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Harga Lokal</span>
                    <span className="font-mono font-bold text-emerald-800 text-xs">Rp {item.localPricePerKg.toLocaleString('id-ID')}/Kg</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500">
                  <span className="text-slate-400 block text-[11px] font-medium">Sentra Kecamatan / UPT:</span>
                  <span className="text-slate-700 font-medium text-[11px] leading-tight block mt-0.5">
                    {item.leadSubdistricts.join(', ')}
                  </span>
                </div>
              </div>

              {/* Card Footer: Admin Actions or Details link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  {item.activePoktanCount} Kelompok Tani
                </span>

                <div className="flex items-center gap-1.5">
                  {isOfficer && onEditCommodity && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCommodity(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Edit data komoditas ini"
                    >
                      <Edit3 className="w-3 h-3 text-emerald-700" />
                      <span>Edit</span>
                    </button>
                  )}

                  {isOfficer && onDeleteCommodity && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus data komoditas "${item.name}"?`)) {
                          onDeleteCommodity(item.id);
                        }
                      }}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Hapus komoditas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="text-emerald-700 font-medium text-[11px] group-hover:translate-x-0.5 transition-transform">
                    Pilih Detail &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Commodity In-Depth Inspection & Hilirisasi */}
      {selectedCommodity && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  Analisis Agribisnis Terpadu
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-semibold">
                  {selectedCommodity.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedCommodity.name}</h3>
            </div>

            <div className="flex items-center gap-3">
              {isOfficer && onEditCommodity && (
                <button
                  type="button"
                  onClick={() => onEditCommodity(selectedCommodity)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data Komoditas Ini</span>
                </button>
              )}
              <div className="text-xs text-slate-500 hidden md:block">
                Kawasan Fokus: <strong className="text-slate-800">{selectedCommodity.kawasanFocus}</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Hilirisasi & Mitra */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Rantai Pasok & Sentra Pengolahan Bersama (SPB)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pemerintah Kabupaten Luwu Utara memberikan pendampingan teknis dan fasilitasi alsintan (alat dan mesin pertanian) 
                mulai dari pra-panen, fermentasi pasca panen standar internasional, hingga penyerapan hasil panen oleh koperasi transmigran 
                dan pabrik pengolahan mitra.
              </p>

              <div className="space-y-2 text-xs">
                {selectedCommodity.processingCenters && selectedCommodity.processingCenters.map((center, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                    <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold text-slate-800">{center}</span>
                    <span className="text-slate-400 text-[11px] ml-auto">Fasilitas Binaan Pemda</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                <span className="font-bold text-emerald-950 block">Wilayah Sebaran Utama:</span>
                <span className="text-emerald-800 leading-relaxed block">
                  {selectedCommodity.leadSubdistricts ? selectedCommodity.leadSubdistricts.join(' &bull; ') : '-'}
                </span>
              </div>
            </div>

            {/* Right: Interactive Farmer Harvest Simulation */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Simulasi Potensi Hasil Panen Transmigran</span>
                </div>
                <span className="text-[11px] text-slate-400">Estimasi Bruto / Musim</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Pilih Komoditas:</label>
                  <select
                    value={calcCommodityId}
                    onChange={(e) => setCalcCommodityId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {commodities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Luas Garapan Lahan:</label>
                  <select
                    value={calcLuasHa}
                    onChange={(e) => setCalcLuasHa(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value={1.0}>1.0 Hektar (Lahan Usaha I)</option>
                    <option value={2.0}>2.0 Hektar (LU I + LU II Standar)</option>
                    <option value={2.5}>2.5 Hektar (Pekarangan + LU I & II)</option>
                    <option value={3.0}>3.0 Hektar (Optimalisasi Kelompok)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5 text-xs shadow-2xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Produktivitas Rata-rata:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {activeCalcCommodity.avgYieldPerHaTon} Ton / Ha
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600 border-t border-slate-100 pt-2">
                  <span>Harga Patokan Pasar:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    Rp {activeCalcCommodity.localPricePerKg.toLocaleString('id-ID')} / Kg
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600 border-t border-slate-100 pt-2">
                  <span>Estimasi Volume Panen:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {Math.round(yieldKg).toLocaleString('id-ID')} Kg / Tahun
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 border-t border-slate-100 pt-2">
                  <span className="font-semibold">Nilai Penjualan Perkiraan:</span>
                  <span className="font-mono font-bold text-emerald-700 text-base tabular-nums">
                    Rp {Math.round(revenue).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                *Kalkulasi terhubung dinamis dengan data produktivitas dan harga pasar aktual yang dapat diperbarui oleh Administrator Disnakertrans.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
