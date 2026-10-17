import React, { useState } from 'react';
import { UPTRegion, CommodityStat, KawasanInfo, KawasanName, PortalImages, OfficerUser } from '../types';
import { KAWASAN_SUMMARY } from '../data/mockData';
import { 
  Users, 
  MapPin, 
  FileCheck2, 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Download, 
  Building, 
  Layers, 
  Compass, 
  Mountain,
  Image as ImageIcon,
  Edit2,
  Edit3
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { KawasanStatisticChart } from './KawasanStatisticChart';

interface DashboardOverviewProps {
  uptList: UPTRegion[];
  commodities: CommodityStat[];
  onSelectUPT: (upt: UPTRegion) => void;
  onNavigateTab: (tab: string) => void;
  onOpenCheckModal: () => void;
  images: PortalImages;
  currentOfficer: OfficerUser | null;
  onOpenPhotoModal: () => void;
  kawasanList?: KawasanInfo[];
  onEditKawasan?: (kawasan: KawasanInfo) => void;
  onEditUPT?: (upt: UPTRegion) => void;
  onOpenKawasanUptModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  uptList,
  commodities,
  onSelectUPT,
  onNavigateTab,
  onOpenCheckModal,
  images,
  currentOfficer,
  onOpenPhotoModal,
  kawasanList,
  onEditKawasan,
  onEditUPT,
  onOpenKawasanUptModal
}) => {
  const [activeKawasanFilter, setActiveKawasanFilter] = useState<'all' | KawasanName>('all');
  const isMainAdmin = Boolean(
    currentOfficer?.isAdmin || 
    currentOfficer?.nip === '197909202010011002' || 
    currentOfficer?.role === 'Administrator Utama'
  );

  const effectiveKawasanList = kawasanList && kawasanList.length > 0 ? kawasanList : KAWASAN_SUMMARY;
  const masambaKawasan = effectiveKawasanList.find(k => k.id === 'kawasan-masamba' || k.name === 'Kawasan Masamba') || KAWASAN_SUMMARY[0];
  const sekoKawasan = effectiveKawasanList.find(k => k.id === 'kawasan-seko' || k.name === 'Kawasan Seko') || KAWASAN_SUMMARY[1];

  // Filter UPTs by Kawasan
  const displayedUPTs = activeKawasanFilter === 'all'
    ? uptList
    : uptList.filter(u => u.kawasan === activeKawasanFilter);

  // Aggregate stats
  const totalKK = uptList.reduce((acc, u) => acc + u.totalKK, 0);
  const totalSouls = uptList.reduce((acc, u) => acc + u.totalSouls, 0);
  const totalAreaHa = uptList.reduce((acc, u) => acc + u.totalAreaHa, 0);
  const totalTPA = uptList.reduce((acc, u) => acc + u.tpaCount, 0);
  const totalTPS = uptList.reduce((acc, u) => acc + u.tpsCount, 0);
  const avgSHM = Math.round(uptList.reduce((acc, u) => acc + u.shmCompletedPercentage, 0) / uptList.length);

  const masambaUPTs = uptList.filter(u => u.kawasan === 'Kawasan Masamba');
  const sekoUPTs = uptList.filter(u => u.kawasan === 'Kawasan Seko');

  return (
    <div className="space-y-10">
      {/* 1. Hero Section with dynamic photo asset & officer edit button */}
      <section className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 min-h-[460px] flex items-end group">
        <div className="absolute inset-0 z-0">
          <img
            src={images.heroBanner}
            alt="Kawasan Pemukiman Transmigrasi Terpadu Kabupaten Luwu Utara"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-900/30" />
        </div>

        {/* Officer Quick Edit Photo Badge */}
        {currentOfficer && (
          <button
            onClick={onOpenPhotoModal}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
            title="Ganti foto hero banner ini"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ganti Foto Hero Banner</span>
          </button>
        )}

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-4">
          <div className="flex items-center gap-3">
            <BrandLogo
              src={images.logoUrl || '/Luwu_Utara_Logo_(North_Luwu).png'}
              alt="Logo Resmi Kabupaten Luwu Utara"
              className="h-12 sm:h-14 w-auto object-contain shrink-0 drop-shadow-md cursor-pointer"
              allowZoom={true}
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-300 uppercase">
                <span>Dinas Tenaga Kerja & Transmigrasi Kab. Luwu Utara</span>
                <span aria-hidden="true">&middot;</span>
                <span>2 Kawasan Terpadu (Masamba & Seko)</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Pemerintah Kabupaten Luwu Utara &middot; Provinsi Sulawesi Selatan
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Sistem Informasi Data Administrasi Pengembangan Kawasan Transmigrasi Terpadu
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Portal resmi monitoring real-time dan keterbukaan publik atas hak legalitas lahan (SHM), kependudukan,
            potensi komoditas, dan infrastruktur permukiman di <strong className="text-white font-semibold">Kawasan Masamba</strong> (6 UPT: Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung) 
            dan <strong className="text-white font-semibold">Kawasan Seko</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onOpenCheckModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>Cek Status Hak Transmigran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('peta')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <span>Buka Peta 2 Kawasan (GIS)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Dua Kawasan Transmigrasi Terpadu Spotlight */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">
                Struktur 2 Kawasan Transmigrasi Terpadu Luwu Utara
              </h2>
              {isMainAdmin && onOpenKawasanUptModal && (
                <button
                  type="button"
                  onClick={onOpenKawasanUptModal}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  title="Buka panel edit kawasan dan UPT"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Kelola Kawasan & UPT</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Pembagian kawasan strategis pengembangan transmigrasi Kabupaten Luwu Utara sesuai basis zonasi dan potensi komoditas wilayah.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveKawasanFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeKawasanFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Kawasan ({uptList.length} UPT)
            </button>
            <button
              onClick={() => setActiveKawasanFilter('Kawasan Masamba')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeKawasanFilter === 'Kawasan Masamba' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kawasan Masamba ({masambaUPTs.length} UPT)
            </button>
            <button
              onClick={() => setActiveKawasanFilter('Kawasan Seko')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeKawasanFilter === 'Kawasan Seko' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kawasan Seko ({sekoUPTs.length} UPT)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Grafik Statistik Sentra Lembah & Hinterland Kawasan Masamba */}
          <KawasanStatisticChart
            kawasanInfo={masambaKawasan}
            uptList={masambaUPTs}
            theme="emerald"
            subtitle="Sentra Lembah & Hinterland (Kec. Baebunta, Masamba, Sukamaju, Bone-Bone)"
            isMainAdmin={isMainAdmin}
            isActiveFilter={activeKawasanFilter === 'Kawasan Masamba'}
            onToggleFilter={() => setActiveKawasanFilter(activeKawasanFilter === 'Kawasan Masamba' ? 'all' : 'Kawasan Masamba')}
            onSelectUPT={onSelectUPT}
            onEditKawasan={onEditKawasan}
          />

          {/* Card 2: Grafik Statistik Sentra Dataran Tinggi Kawasan Seko */}
          <KawasanStatisticChart
            kawasanInfo={sekoKawasan}
            uptList={sekoUPTs}
            theme="amber"
            subtitle="Sentra Dataran Tinggi (1.100 - 1.800 mdpl)"
            isMainAdmin={isMainAdmin}
            isActiveFilter={activeKawasanFilter === 'Kawasan Seko'}
            onToggleFilter={() => setActiveKawasanFilter(activeKawasanFilter === 'Kawasan Seko' ? 'all' : 'Kawasan Seko')}
            onSelectUPT={onSelectUPT}
            onEditKawasan={onEditKawasan}
          />
        </div>
      </section>

      {/* 3. Key Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Total Kepala Keluarga</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalKK.toLocaleString('id-ID')} <span className="text-sm font-sans font-normal text-slate-500">KK</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span>{totalSouls.toLocaleString('id-ID')} jiwa terdata</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-emerald-700 font-medium">2 Kawasan</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Luas HPL Kawasan</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalAreaHa.toLocaleString('id-ID')} <span className="text-sm font-sans font-normal text-slate-500">Ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span>Masamba & Seko</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-slate-600">Terbina</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Realisasi SHM Tanah</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {avgSHM}% <span className="text-sm font-sans font-normal text-slate-500">rerata</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-700 font-medium">Kerjasama BPN Masamba</span>
            <span aria-hidden="true">&middot;</span>
            <span>Target 95%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Komoditas Sentra</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
            Kakao & Kopi Seko
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span>114 Poktan Transmigran</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-emerald-700">Luwu Utara</span>
          </div>
        </div>
      </section>

      {/* 4. Daftar UPT Sesuai Filter Kawasan */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">
                Unit Pemukiman Transmigrasi ({displayedUPTs.length} UPT)
              </h2>
              {isMainAdmin && onOpenKawasanUptModal && (
                <button
                  type="button"
                  onClick={onOpenKawasanUptModal}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  title="Buka panel kelola dan edit seluruh UPT"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data UPT</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {activeKawasanFilter === 'all' 
                ? 'Menampilkan seluruh UPT di Kawasan Masamba (6 UPT) dan Kawasan Seko (2 UPT).'
                : `Menampilkan UPT di bawah ${activeKawasanFilter}.`}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('peta')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Peta Spasial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedUPTs.map((upt) => (
            <div
              key={upt.id}
              onClick={() => onSelectUPT(upt)}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-600/50 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                      {upt.kawasan}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {upt.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isMainAdmin && onEditUPT && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditUPT(upt);
                        }}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title={`Edit seluruh data ${upt.name}`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit UPT</span>
                      </button>
                    )}
                    <span className="text-[11px] text-slate-500 font-mono">
                      Thn {upt.yearEstablished}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-emerald-800 font-medium">
                  {upt.district}
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jumlah KK</span>
                    <span className="font-mono font-semibold text-slate-800">{upt.totalKK} KK</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Luas HPL</span>
                    <span className="font-mono font-semibold text-slate-800">{upt.totalAreaHa} Ha</span>
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Sertifikat SHM</span>
                    <span className="font-mono font-medium text-slate-900">{upt.shmCompletedPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${upt.shmCompletedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate max-w-[170px]">{upt.primaryCommodity}</span>
                <span className="text-emerald-700 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Detail <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Spotlight Hilirisasi & Sentra Ekonomi */}
      <section className="bg-slate-900 text-white rounded-2xl overflow-hidden p-6 sm:p-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wide uppercase">
              <span>Hilirisasi & Penguatan Ekonomi Kawasan</span>
              <span aria-hidden="true">&middot;</span>
              <span>Luwu Utara</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Kakao Masamba & Kopi Arabika Dataran Tinggi Seko
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Melalui sistem terpadu SIAP KANDA, integrasi perkebunan kakao klonal di 6 UPT Kawasan Masamba 
              (Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung) serta kopi arabika organik di Kawasan Seko 
              dipantau langsung hasil panen dan legalitas lahannya.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-800/50">
                <div className="text-xs text-slate-400">Kakao Kawasan Masamba</div>
                <div className="text-lg font-bold font-mono text-emerald-400">12.400 Ton/Th</div>
                <div className="text-[11px] text-slate-400">Klonal MCC 02 & Sulawesi 1</div>
              </div>
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-800/50">
                <div className="text-xs text-slate-400">Kopi Arabika Seko</div>
                <div className="text-lg font-bold font-mono text-amber-400">1.850 Ton/Th</div>
                <div className="text-[11px] text-slate-400">Organik Ketinggian 1.400 mdpl</div>
              </div>
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-800/50 col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400">Padi Sawah & Tarone</div>
                <div className="text-lg font-bold font-mono text-emerald-400">18.200 Ton/Th</div>
                <div className="text-[11px] text-slate-400">Lumbung Pangan Luwu Utara</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('komoditas')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <span>Lihat Data Komoditas Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-4/3 lg:aspect-square group">
            <img
              src={images.commodityKakao}
              alt="Panen Kakao di Kawasan Masamba Luwu Utara"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {currentOfficer && (
              <button
                onClick={onOpenPhotoModal}
                className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title="Ganti foto komoditas"
              >
                <Edit2 className="w-3 h-3 text-emerald-400" />
                <span>Ganti Foto</span>
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-xs text-white">
                <p className="font-semibold">Sentra Fermentasi Kakao Masamba</p>
                <p className="text-slate-300 text-[11px]">UPT Lantang Tallang & UPT Sepakat</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
