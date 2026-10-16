import React, { useState } from 'react';
import { UPTRegion, KawasanName, OfficerUser } from '../types';
import { 
  MapPin, 
  Layers, 
  Search, 
  Info, 
  CheckCircle2, 
  Droplets, 
  Zap, 
  School, 
  Activity, 
  Compass, 
  X, 
  ExternalLink, 
  ChevronRight, 
  Mountain, 
  Building2,
  Edit3
} from 'lucide-react';

interface InteractiveMapProps {
  uptList: UPTRegion[];
  selectedUPT: UPTRegion | null;
  onSelectUPT: (upt: UPTRegion | null) => void;
  onNavigateTab: (tab: string) => void;
  currentOfficer?: OfficerUser | null;
  onEditUPT?: (upt: UPTRegion) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  uptList,
  selectedUPT,
  onSelectUPT,
  onNavigateTab,
  currentOfficer,
  onEditUPT
}) => {
  const isMainAdmin = Boolean(
    currentOfficer?.isAdmin || 
    currentOfficer?.nip === '197909202010011002' || 
    currentOfficer?.role === 'Administrator Utama'
  );

  const [filterKawasan, setFilterKawasan] = useState<'all' | KawasanName>('all');
  const [filterCommodity, setFilterCommodity] = useState<string>('all');
  const [filterSHM, setFilterSHM] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<'all' | 'shm' | 'infrastruktur'>('all');

  // Filtered UPTs
  const filteredUPTs = uptList.filter((upt) => {
    const matchesKawasan = filterKawasan === 'all' || upt.kawasan === filterKawasan;
    const matchesSearch =
      upt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upt.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upt.kawasan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCommodity =
      filterCommodity === 'all' ||
      upt.primaryCommodity.toLowerCase().includes(filterCommodity.toLowerCase()) ||
      upt.secondaryCommodity.toLowerCase().includes(filterCommodity.toLowerCase());

    const matchesSHM =
      filterSHM === 'all' ||
      (filterSHM === 'high' && upt.shmCompletedPercentage >= 90) ||
      (filterSHM === 'medium' && upt.shmCompletedPercentage >= 70 && upt.shmCompletedPercentage < 90) ||
      (filterSHM === 'low' && upt.shmCompletedPercentage < 70);

    return matchesKawasan && matchesSearch && matchesCommodity && matchesSHM;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>Sistem Informasi Geospasial Transmigrasi (GIS)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Peta Sebaran 2 Kawasan: Masamba (6 UPT) & Seko (Dataran Tinggi)
            </h2>
            <p className="text-xs text-slate-500">
              Monitoring geospasial real-time batas HPL, sertifikat SHM, serta sarana permukiman 6 UPT di Kawasan Masamba dan 2 UPT di Kawasan Seko.
            </p>
          </div>

          {/* Kawasan Quick Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs self-start md:self-auto">
            <button
              onClick={() => setFilterKawasan('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                filterKawasan === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Kawasan (8 UPT)
            </button>
            <button
              onClick={() => setFilterKawasan('Kawasan Masamba')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                filterKawasan === 'Kawasan Masamba' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kawasan Masamba (6 UPT)
            </button>
            <button
              onClick={() => setFilterKawasan('Kawasan Seko')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                filterKawasan === 'Kawasan Seko' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kawasan Seko (2 UPT)
            </button>
          </div>
        </div>

        {/* Secondary Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari UPT (Lantang Tallang, Sepakat, Maipi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            />
          </div>

          {/* Commodity filter */}
          <div>
            <select
              value={filterCommodity}
              onChange={(e) => setFilterCommodity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            >
              <option value="all">Semua Komoditas Unggulan</option>
              <option value="kakao">Kakao (Cacao)</option>
              <option value="sawit">Kelapa Sawit</option>
              <option value="padi">Padi Sawah Irigasi</option>
              <option value="kopi">Kopi Arabika Seko</option>
              <option value="nilam">Minyak Atsiri Nilam</option>
            </select>
          </div>

          {/* Layer Focus */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`flex-1 py-1 rounded-md font-medium text-center transition-colors cursor-pointer ${
                activeLayer === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Status SHM
            </button>
            <button
              onClick={() => setActiveLayer('infrastruktur')}
              className={`flex-1 py-1 rounded-md font-medium text-center transition-colors cursor-pointer ${
                activeLayer === 'infrastruktur' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kondisi Akses Poros
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-sm relative min-h-[540px] flex flex-col justify-between p-4 sm:p-6 text-white">
          {/* Top Map Overlays */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700 pointer-events-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Peta Geospasial Kabupaten Luwu Utara</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Zona 1: Kawasan Masamba &middot; Zona 2: Kawasan Seko
              </div>
            </div>

            <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 pointer-events-auto">
              {filteredUPTs.length} dari {uptList.length} UPT Ditampilkan
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="absolute inset-0 z-0 p-4 flex items-center justify-center">
            <svg
              viewBox="0 0 1000 700"
              className="w-full h-full max-h-[580px] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="luwuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                </linearGradient>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
              </defs>

              <rect width="1000" height="700" fill="url(#gridPattern)" />

              {/* Kabupaten Boundary Outline */}
              <path
                d="M 180 80 
                   Q 260 40, 360 90 
                   T 520 120 
                   Q 680 140, 840 220 
                   Q 920 280, 890 380 
                   Q 860 440, 780 480 
                   Q 660 520, 580 580 
                   Q 460 620, 380 580 
                   Q 280 540, 220 440 
                   Q 150 340, 140 200 
                   Z"
                fill="url(#luwuGradient)"
                stroke="#334155"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* ZONASI 1: KAWASAN MASAMBA BOUNDARY HULL (Baebunta, Masamba, Sukamaju, Bone-Bone) */}
              <rect
                x="360"
                y="260"
                width="430"
                height="150"
                rx="20"
                fill="#10b981"
                fillOpacity={filterKawasan === 'Kawasan Masamba' ? '0.14' : '0.07'}
                stroke="#10b981"
                strokeWidth={filterKawasan === 'Kawasan Masamba' ? '2.5' : '1.5'}
                strokeDasharray="6 3"
              />
              <text x="375" y="285" fill="#34d399" fontSize="12" fontWeight="700" letterSpacing="0.5">
                ZONA KAWASAN MASAMBA (Kec. Baebunta, Masamba, Sukamaju, Bone-Bone)
              </text>

              {/* ZONASI 2: KAWASAN SEKO BOUNDARY HULL */}
              <rect
                x="200"
                y="110"
                width="140"
                height="130"
                rx="20"
                fill="#f59e0b"
                fillOpacity={filterKawasan === 'Kawasan Seko' ? '0.14' : '0.07'}
                stroke="#f59e0b"
                strokeWidth={filterKawasan === 'Kawasan Seko' ? '2.5' : '1.5'}
                strokeDasharray="6 3"
              />
              <text x="210" y="132" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.5">
                ZONA KAWASAN SEKO
              </text>

              {/* Major Rivers (Sungai Masamba & Rongkong) */}
              <path
                d="M 320 100 Q 380 260, 480 340 T 570 540"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeOpacity="0.45"
              />

              {/* Poros Masamba Road */}
              <path
                d="M 390 380 L 460 340 L 530 330 L 620 340"
                fill="none"
                stroke="#64748b"
                strokeWidth="3"
                strokeDasharray="4 3"
                strokeOpacity="0.6"
              />

              {/* Capital City Marker */}
              <circle cx="500" cy="330" r="5" fill="#f59e0b" />
              <text x="510" y="325" fill="#e2e8f0" fontSize="11" fontWeight="600">
                Pusat Masamba
              </text>

              {/* Interactive UPT Markers */}
              {filteredUPTs.map((upt) => {
                const cx = (upt.coordinates.x / 100) * 1000;
                const cy = (upt.coordinates.y / 100) * 700;
                const isSelected = selectedUPT?.id === upt.id;

                let markerColor = upt.kawasan === 'Kawasan Masamba' ? '#10b981' : '#f59e0b';
                if (activeLayer === 'infrastruktur') {
                  markerColor = upt.roadCondition === 'Baik' ? '#10b981' : upt.roadCondition === 'Sedang' ? '#f59e0b' : '#f43f5e';
                }

                return (
                  <g
                    key={upt.id}
                    onClick={() => onSelectUPT(upt)}
                    className="cursor-pointer group transition-transform"
                    transform={`translate(${cx}, ${cy})`}
                  >
                    {isSelected && (
                      <circle
                        r="24"
                        fill={markerColor}
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      r={isSelected ? "17" : "12"}
                      fill="#0f172a"
                      stroke={markerColor}
                      strokeWidth={isSelected ? "3" : "2"}
                    />

                    <circle
                      r={isSelected ? "8" : "5.5"}
                      fill={markerColor}
                    />

                    <text
                      y={isSelected ? "-22" : "-16"}
                      textAnchor="middle"
                      fill={isSelected ? "#ffffff" : "#cbd5e1"}
                      fontSize={isSelected ? "13" : "11"}
                      fontWeight={isSelected ? "700" : "500"}
                      className="transition-colors drop-shadow-md select-none"
                    >
                      {upt.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="z-10 bg-slate-900/95 backdrop-blur-md p-3 rounded-lg border border-slate-700 max-w-lg text-xs space-y-1.5 self-start">
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Legenda Zonasi & Kawasan
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Kawasan Masamba (6 UPT: Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Kawasan Seko (Dataran Tinggi Seko Padang & Hoyane)
              </span>
            </div>
          </div>
        </div>

        {/* Selected UPT Detail Inspector (Right Column) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
          {selectedUPT ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 font-mono">
                      {selectedUPT.kawasan}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedUPT.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedUPT.district} &middot; Penempatan Thn {selectedUPT.yearEstablished}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isMainAdmin && onEditUPT && (
                    <button
                      type="button"
                      onClick={() => onEditUPT(selectedUPT)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      title={`Edit data ${selectedUPT.name}`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit UPT</span>
                    </button>
                  )}
                  <button
                    onClick={() => onSelectUPT(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedUPT.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Kependudukan</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedUPT.totalKK} KK
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    ({selectedUPT.totalSouls} Jiwa)
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Sertifikat SHM</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {selectedUPT.shmCompletedPercentage}%
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {Math.round((selectedUPT.totalKK * selectedUPT.shmCompletedPercentage) / 100)} Bidang Terbit
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Komposisi Warga</span>
                  <span className="font-medium text-slate-800">
                    {selectedUPT.tpaCount} TPA / {selectedUPT.tpsCount} TPS
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {selectedUPT.originProvinces.slice(0, 2).join(', ')}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Akses Poros</span>
                  <span className={`font-semibold ${
                    selectedUPT.roadCondition === 'Baik' ? 'text-emerald-700' :
                    selectedUPT.roadCondition === 'Sedang' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {selectedUPT.roadCondition}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Air: {selectedUPT.waterAccessPercentage}% &middot; Listrik: {selectedUPT.electricityPercentage}%
                  </span>
                </div>
              </div>

              {/* Komoditas */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-500 font-medium">Komoditas Sentra:</span>
                <div className="flex flex-wrap items-center gap-1.5 text-slate-700">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded font-medium border border-emerald-200">
                    {selectedUPT.primaryCommodity}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200">
                    {selectedUPT.secondaryCommodity}
                  </span>
                </div>
              </div>

              {/* Fasilitas Sosial */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2 text-slate-600">
                  <Activity className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <span>{selectedUPT.healthFacility}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <School className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span>{selectedUPT.educationFacility}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {isMainAdmin && onEditUPT && (
                  <button
                    onClick={() => onEditUPT(selectedUPT)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Data Lengkap UPT Ini</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('pertanahan')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Lihat Daftar Bidang Tanah {selectedUPT.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <MapPin className="w-10 h-10 text-slate-300 stroke-1" />
              <div className="text-sm font-semibold text-slate-700">Pilih UPT di Peta Kawasan</div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Pilih salah satu dari 6 UPT Kawasan Masamba (Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung) 
                atau Kawasan Seko untuk memeriksa detail bidang tanah, kependudukan, dan infrastruktur.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Peta Geospasial Resmi Disnakertrans Kab. Luwu Utara
          </div>
        </div>
      </div>
    </div>
  );
};
