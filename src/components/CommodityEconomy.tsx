import React, { useState } from 'react';
import { CommodityStat, UPTRegion } from '../types';
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
  ArrowUpRight
} from 'lucide-react';

interface CommodityEconomyProps {
  commodities: CommodityStat[];
  uptList: UPTRegion[];
}

export const CommodityEconomy: React.FC<CommodityEconomyProps> = ({
  commodities,
  uptList
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('komoditas-kakao');
  
  // Interactive Farm Yield Simulation Calculator
  const [calcLuasHa, setCalcLuasHa] = useState<number>(2.0); // 2 Ha default (LU 1 + LU 2)
  const [calcCommodityType, setCalcCommodityType] = useState<string>('kakao');

  const selectedCommodity = commodities.find(c => c.id === selectedCommodityId) || commodities[0];

  // Calculation logic
  const getSimulatedIncome = () => {
    if (calcCommodityType === 'kakao') {
      const yieldKg = calcLuasHa * 1260; // 1.26 ton/ha
      const revenue = yieldKg * 135000;
      return { yieldKg, revenue, label: 'Kakao Fermentasi Masamba' };
    } else if (calcCommodityType === 'kopi') {
      const yieldKg = calcLuasHa * 700; // 0.7 ton/ha biji kopi arabika
      const revenue = yieldKg * 140000;
      return { yieldKg, revenue, label: 'Kopi Arabika Seko Specialty' };
    } else if (calcCommodityType === 'sawit') {
      const yieldKg = calcLuasHa * 7620; // 7.62 ton/ha TBS
      const revenue = yieldKg * 2850;
      return { yieldKg, revenue, label: 'Tandan Buah Segar (TBS) Sawit' };
    } else {
      const yieldKg = calcLuasHa * 5280; // 5.28 ton/ha gabah
      const revenue = yieldKg * 8500;
      return { yieldKg, revenue, label: 'Padi Sawah Irigasi / Tarone' };
    }
  };

  const simulation = getSimulatedIncome();

  return (
    <div className="space-y-8">
      {/* Header Overview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase">
              <Sprout className="w-3.5 h-3.5" />
              <span>Pemberdayaan Ekonomi Kerakyatan 2 Kawasan</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Komoditas Unggulan Kawasan Masamba & Kawasan Seko
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Monitoring produktivitas panen dan pembinaan Kelompok Tani (Poktan) transmigran di 6 UPT Kawasan Masamba 
              (Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung) serta sentra Kopi Arabika di Kawasan Seko.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs">
            <div>
              <span className="text-emerald-900 font-bold block">Sentra Bumi Kakao Sulsel</span>
              <span className="text-emerald-700">Kontribusi Transmigran: 38% Pasokan Kakao Kab. Luwu Utara</span>
            </div>
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
              className={`bg-white rounded-xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected ? 'border-emerald-600 shadow-sm ring-1 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500">{item.category}</span>
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{item.trendPercentage}% Thn
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Luas Tanam Terpadu</span>
                    <span className="font-mono font-bold text-slate-800">{item.totalAreaHa.toLocaleString('id-ID')} Ha</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Produksi Tahunan</span>
                    <span className="font-mono font-bold text-slate-800">{item.annualProductionTon.toLocaleString('id-ID')} Ton</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Produktivitas Rata-rata</span>
                    <span className="font-mono font-medium text-slate-800">{item.avgYieldPerHaTon} Ton / Ha</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Harga Lokal Pasar</span>
                    <span className="font-mono font-bold text-emerald-700">Rp {item.localPricePerKg.toLocaleString('id-ID')}/Kg</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500">
                  <span className="text-slate-400 block text-[11px]">Kecamatan Utama:</span>
                  <span className="text-slate-700 font-medium">{item.leadSubdistricts.join(', ')}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{item.activePoktanCount} Kelompok Tani Aktif</span>
                <span className="text-emerald-700 font-medium">Pilih Detail &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Commodity In-Depth Inspection & Hilirisasi */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <span className="text-xs text-emerald-700 font-semibold uppercase">Analisis Agribisnis Terpadu</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedCommodity.name}</h3>
          </div>
          <div className="text-xs text-slate-500">
            Pusat Pengolahan: <strong className="text-slate-800">{selectedCommodity.processingCenters.join(', ')}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left: Hilirisasi & Mitra */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Rantai Pasok & Sentra Pengolahan Bersama (SPB)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pemerintah Kabupaten Luwu Utara memberikan pendampingan teknis dan fasilitasi alsintan (alat dan mesin pertanian) 
              mulai dari pra-panen, fermentasi pasca panen standar internasional, hingga penyerapan hasil panen oleh koperasi transmigran 
              dan pabrik pengolahan mitra.
            </p>

            <div className="space-y-2 text-xs">
              {selectedCommodity.processingCenters.map((center, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-800">{center}</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Fasilitas Binaan Pemda</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Farmer Harvest Simulation */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>Simulasi Potensi Hasil Panen Transmigran</span>
              </div>
              <span className="text-[11px] text-slate-400">Estimasi Bruto / Musim</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Pilih Komoditas:</label>
                <select
                  value={calcCommodityType}
                  onChange={(e) => setCalcCommodityType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                >
                  <option value="kakao">Kakao Fermentasi Masamba</option>
                  <option value="kopi">Kopi Arabika Seko Specialty</option>
                  <option value="sawit">Kelapa Sawit (TBS)</option>
                  <option value="padi">Padi Sawah / Tarone</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Luas Garapan Lahan:</label>
                <select
                  value={calcLuasHa}
                  onChange={(e) => setCalcLuasHa(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                >
                  <option value={1.0}>1.0 Hektar (Lahan Usaha I)</option>
                  <option value={2.0}>2.0 Hektar (LU I + LU II Standar)</option>
                  <option value={2.5}>2.5 Hektar (Pekarangan + LU I & II)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Estimasi Volume Panen:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {Math.round(simulation.yieldKg).toLocaleString('id-ID')} Kg / Tahun
                </span>
              </div>
              <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-1.5">
                <span>Nilai Penjualan Perkiraan:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                  Rp {Math.round(simulation.revenue).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              *Perhitungan didasarkan pada rerata panen normal 1 tahun dan harga patokan pasar Disnakertrans & Dinas Pertanian Luwu Utara tahun berjalan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
