import React, { useState } from 'react';
import { UPTRegion, KawasanInfo } from '../types';
import { 
  FileCheck2, 
  Users, 
  MapPin, 
  Mountain, 
  Layers, 
  Edit3, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Sprout
} from 'lucide-react';

interface KawasanStatisticChartProps {
  kawasanInfo: KawasanInfo;
  uptList: UPTRegion[];
  theme: 'emerald' | 'amber';
  subtitle: string;
  isMainAdmin?: boolean;
  isActiveFilter: boolean;
  onToggleFilter: () => void;
  onSelectUPT?: (upt: UPTRegion) => void;
  onEditKawasan?: (kawasan: KawasanInfo) => void;
}

export const KawasanStatisticChart: React.FC<KawasanStatisticChartProps> = ({
  kawasanInfo,
  uptList,
  theme,
  subtitle,
  isMainAdmin,
  isActiveFilter,
  onToggleFilter,
  onSelectUPT,
  onEditKawasan
}) => {
  const [metricTab, setMetricTab] = useState<'shm' | 'kependudukan' | 'lahan'>('shm');

  // Aggregated stats
  const totalKK = uptList.reduce((acc, u) => acc + u.totalKK, 0);
  const totalSouls = uptList.reduce((acc, u) => acc + u.totalSouls, 0);
  const totalAreaHa = uptList.reduce((acc, u) => acc + u.totalAreaHa, 0);
  const totalTPA = uptList.reduce((acc, u) => acc + u.tpaCount, 0);
  const totalTPS = uptList.reduce((acc, u) => acc + u.tpsCount, 0);
  const avgSHM = uptList.length > 0
    ? Math.round((uptList.reduce((acc, u) => acc + u.shmCompletedPercentage, 0) / uptList.length) * 10) / 10
    : 0;

  // Max values for relative bar scaling
  const maxKK = Math.max(...uptList.map(u => u.totalKK), 1);
  const maxArea = Math.max(...uptList.map(u => u.totalAreaHa), 1);

  // Demographic percentages
  const tpaPercent = totalKK > 0 ? Math.round((totalTPA / totalKK) * 100) : 0;
  const tpsPercent = totalKK > 0 ? 100 - tpaPercent : 0;

  const isEmerald = theme === 'emerald';

  return (
    <div 
      className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
        isActiveFilter
          ? isEmerald
            ? 'bg-emerald-50/40 border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
            : 'bg-amber-50/40 border-amber-600 ring-2 ring-amber-600/20 shadow-md'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* 1. Header Card */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isEmerald ? 'text-emerald-800' : 'text-amber-800'
            }`}>
              {isEmerald ? <Layers className="w-3.5 h-3.5 shrink-0" /> : <Mountain className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{subtitle}</span>
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
              {kawasanInfo.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {kawasanInfo.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isMainAdmin && onEditKawasan && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditKawasan(kawasanInfo);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                title={`Edit data ${kawasanInfo.name}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Kawasan</span>
              </button>
            )}
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
              isEmerald ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {uptList.length} UPT
            </span>
          </div>
        </div>

        {/* 2. Chart Metric Switcher Tabs */}
        <div className="flex items-center gap-1.5 pt-4 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMetricTab('shm');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              metricTab === 'shm'
                ? isEmerald 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Grafik SHM (%)</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMetricTab('kependudukan');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              metricTab === 'kependudukan'
                ? isEmerald 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kependudukan & Demografi</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMetricTab('lahan');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              metricTab === 'lahan'
                ? isEmerald 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Luas Lahan HPL (Ha)</span>
          </button>
        </div>
      </div>

      {/* 3. Dynamic Chart Content Area */}
      <div className="p-5 sm:p-6 space-y-4 flex-1">
        {/* ========================================== */}
        {/* TAB 1: GRAFIK REALISASI SHM (%)           */}
        {/* ========================================== */}
        {metricTab === 'shm' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-slate-600 font-medium">Rerata Capaian Sertifikasi Kawasan:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-slate-900">{avgSHM}%</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  avgSHM >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {avgSHM >= 80 ? 'Progres Tinggi' : 'Akselerasi BPN'}
                </span>
              </div>
            </div>

            {/* List of Bars per UPT */}
            <div className="space-y-3">
              {uptList.map((upt) => {
                const terbitCount = Math.round((upt.totalKK * upt.shmCompletedPercentage) / 100);
                return (
                  <div 
                    key={upt.id}
                    onClick={() => onSelectUPT && onSelectUPT(upt)}
                    className="group/item hover:bg-slate-50/80 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-900 group-hover/item:text-emerald-700 transition-colors truncate">
                          {upt.name}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline truncate font-medium">
                          ({upt.district})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {terbitCount}/{upt.totalKK} Bidang
                        </span>
                        <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                          upt.shmCompletedPercentage >= 85 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : upt.shmCompletedPercentage >= 70
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {upt.shmCompletedPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          upt.shmCompletedPercentage >= 85
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            : upt.shmCompletedPercentage >= 70
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                            : 'bg-gradient-to-r from-rose-500 to-rose-600'
                        }`}
                        style={{ width: `${upt.shmCompletedPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: GRAFIK KEPENDUDUKAN & DEMOGRAFI    */}
        {/* ========================================== */}
        {metricTab === 'kependudukan' && (
          <div className="space-y-4">
            {/* Demographic Ratio Breakdown Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Komposisi Warga Kawasan:</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Total: <strong>{totalKK.toLocaleString('id-ID')} KK</strong> ({totalSouls.toLocaleString('id-ID')} Jiwa)
                </span>
              </div>

              {/* Proportional Segment Bar */}
              <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500" 
                  style={{ width: `${tpaPercent}%` }}
                  title={`TPA (Penduduk Asal): ${totalTPA} KK (${tpaPercent}%)`}
                />
                <div 
                  className="bg-emerald-600 h-full transition-all duration-500" 
                  style={{ width: `${tpsPercent}%` }}
                  title={`TPS (Penduduk Setempat): ${totalTPS} KK (${tpsPercent}%)`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-700">TPA (Asal Luar): <strong>{totalTPA} KK ({tpaPercent}%)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-700">TPS (Lokal): <strong>{totalTPS} KK ({tpsPercent}%)</strong></span>
                </div>
              </div>
            </div>

            {/* Per-UPT KK Comparison Chart */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Perbandingan Jumlah KK per Unit Pemukiman:
              </span>
              {uptList.map((upt) => {
                const uTpaPercent = Math.round((upt.tpaCount / upt.totalKK) * 100);
                const uTpsPercent = 100 - uTpaPercent;
                const widthPercent = Math.max(Math.round((upt.totalKK / maxKK) * 100), 15);

                return (
                  <div 
                    key={upt.id}
                    onClick={() => onSelectUPT && onSelectUPT(upt)}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-slate-900 truncate">{upt.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({upt.totalSouls} Jiwa)</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-xs shrink-0">
                        {upt.totalKK} KK
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div 
                        className="h-full rounded-full flex overflow-hidden transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      >
                        <div className="bg-blue-600 h-full" style={{ width: `${uTpaPercent}%` }} />
                        <div className="bg-emerald-600 h-full" style={{ width: `${uTpsPercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: GRAFIK LUAS LAHAN HPL (HA)         */}
        {/* ========================================== */}
        {metricTab === 'lahan' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-slate-600 font-medium">Total Luas Pencadangan HPL:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-extrabold text-sm text-slate-900">
                  {totalAreaHa.toLocaleString('id-ID')} Ha
                </span>
                <span className="text-slate-500 text-[11px] font-mono">
                  (~{(totalAreaHa / totalKK).toFixed(1)} Ha/KK)
                </span>
              </div>
            </div>

            {/* List of Area Bars per UPT */}
            <div className="space-y-3">
              {uptList.map((upt) => {
                const areaPercent = Math.max(Math.round((upt.totalAreaHa / maxArea) * 100), 10);
                const shareOfKawasan = totalAreaHa > 0 
                  ? ((upt.totalAreaHa / totalAreaHa) * 100).toFixed(1) 
                  : '0';

                return (
                  <div 
                    key={upt.id}
                    onClick={() => onSelectUPT && onSelectUPT(upt)}
                    className="group/item hover:bg-slate-50/80 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-900 group-hover/item:text-emerald-700 transition-colors truncate">
                          {upt.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {upt.primaryCommodity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {shareOfKawasan}% luas
                        </span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {upt.totalAreaHa.toLocaleString('id-ID')} Ha
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isEmerald 
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-600' 
                            : 'bg-gradient-to-r from-amber-500 to-amber-600'
                        }`}
                        style={{ width: `${areaPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer Summary Stats & Filter Action */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-600 text-[11px] flex-wrap">
          <span>Luas: <strong className="font-mono text-slate-800">{totalAreaHa.toLocaleString('id-ID')} Ha</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>Warga: <strong className="font-mono text-slate-800">{totalKK.toLocaleString('id-ID')} KK</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>SHM: <strong className="font-mono text-emerald-800 font-bold">{avgSHM}%</strong></span>
        </div>

        <button
          type="button"
          onClick={onToggleFilter}
          className={`font-semibold flex items-center gap-1 cursor-pointer transition-colors text-xs self-start sm:self-auto ${
            isActiveFilter
              ? isEmerald ? 'text-emerald-800 font-bold' : 'text-amber-800 font-bold'
              : isEmerald ? 'text-emerald-700 hover:text-emerald-800' : 'text-amber-700 hover:text-amber-800'
          }`}
        >
          <span>{isActiveFilter ? 'Sedang Difilter' : 'Filter UPT Kawasan Ini'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
