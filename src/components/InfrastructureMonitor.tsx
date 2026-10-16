import React, { useState } from 'react';
import { InfrastructureItem, UPTRegion, PortalImages, OfficerUser } from '../types';
import { 
  Building, 
  Droplets, 
  Zap, 
  Home, 
  Activity, 
  School, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter,
  Plus,
  ArrowRight
} from 'lucide-react';

interface InfrastructureMonitorProps {
  infrastructureList: InfrastructureItem[];
  uptList: UPTRegion[];
  onOpenReportModal: (category?: string) => void;
  images?: PortalImages;
  currentOfficer?: OfficerUser | null;
  onOpenPhotoModal?: () => void;
}

export const InfrastructureMonitor: React.FC<InfrastructureMonitorProps> = ({
  infrastructureList,
  uptList,
  onOpenReportModal,
  images,
  currentOfficer,
  onOpenPhotoModal
}) => {
  const [filterKawasan, setFilterKawasan] = useState<'all' | 'Kawasan Masamba' | 'Kawasan Seko'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUpt, setFilterUpt] = useState<string>('all');

  const filteredItems = infrastructureList.filter((item) => {
    const matchesKawasan = filterKawasan === 'all' || item.kawasan === filterKawasan;
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesUpt = filterUpt === 'all' || item.uptId === filterUpt;
    return matchesKawasan && matchesCat && matchesUpt;
  });

  const infraPhoto = images?.infrastructure || '/src/assets/images/infrastruktur_transmigrasi_1791420229259.jpg';

  return (
    <div className="space-y-8">
      {/* Top Banner with Image and Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase">
              <Building className="w-3.5 h-3.5" />
              <span>Sarana & Prasarana Permukiman</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Monitoring Fisik Infrastruktur Kawasan Transmigrasi Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pemantauan berkelanjutan terhadap keterhubungan jalan poros penghubung antar desa, 
              jaringan air minum perpipaan (SPAM), penerangan lampu jalan tenaga surya, serta fasilitas kesehatan dan sekolah 
              pada seluruh Unit Pemukiman Transmigrasi di Luwu Utara.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Akses Air Bersih</span>
                <span className="text-lg font-bold font-mono text-slate-900">86.2%</span>
                <span className="text-[10px] text-emerald-700 block">Rata-rata Kawasan</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Elektrifikasi Listrik</span>
                <span className="text-lg font-bold font-mono text-slate-900">91.4%</span>
                <span className="text-[10px] text-emerald-700 block">PLN & Solar Cell</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Konektivitas Poros</span>
                <span className="text-lg font-bold font-mono text-slate-900">72.0 KM</span>
                <span className="text-[10px] text-emerald-700 block">Hotmix & Rabat</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenReportModal('Jalan Rusak')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Lapor Kerusakan Sarpras Warga</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] group">
            <img
              src={infraPhoto}
              alt="Pembangunan Prasarana Transmigrasi Luwu Utara"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {currentOfficer && onOpenPhotoModal && (
              <button
                onClick={onOpenPhotoModal}
                className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md"
              >
                <span>Ganti Foto Sarpras</span>
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <div className="text-xs text-white">
                <p className="font-semibold">Poros Utama Kawasan Masamba & Seko</p>
                <p className="text-slate-300 text-[11px]">Fasilitas Air Bersih SPAM & PJUTS Binaan APBN / Pemda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Interactive Items */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm">Daftar Proyek & Paket Pembangunan Fasilitas</h3>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="all">Semua Kategori Sarpras</option>
              <option value="Jalan & Jembatan">Jalan & Jembatan</option>
              <option value="Air Bersih">Air Bersih (SPAM/Sumur)</option>
              <option value="Listrik & Penerangan">Listrik & Penerangan (PJUTS)</option>
              <option value="Fasilitas Sosial">Fasilitas Sosial / Medis</option>
            </select>

            {/* Filter Kawasan */}
            <select
              value={filterKawasan}
              onChange={(e) => setFilterKawasan(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="all">Semua Kawasan (Masamba & Seko)</option>
              <option value="Kawasan Masamba">Kawasan Masamba (6 UPT)</option>
              <option value="Kawasan Seko">Kawasan Seko (2 UPT)</option>
            </select>

            {/* Filter UPT */}
            <select
              value={filterUpt}
              onChange={(e) => setFilterUpt(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="all">Semua UPT</option>
              {uptList
                .filter(u => filterKawasan === 'all' || u.kawasan === filterKawasan)
                .map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Table List of Infrastructure Projects */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3">Nama Paket Sarpras</th>
                <th className="py-2.5 px-3">Kawasan & UPT</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Kondisi & Progres</th>
                <th className="py-2.5 px-3">Sumber Dana</th>
                <th className="py-2.5 px-3 text-right">Inspeksi Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">{item.spec}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      item.kawasan === 'Kawasan Masamba' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {item.kawasan}
                    </span>
                    <div className="font-medium text-slate-800 mt-0.5">{item.uptName.split(' (')[0]}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {item.category}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        item.condition === 'Baik' ? 'text-emerald-700' :
                        item.condition === 'Rusak Ringan' ? 'text-blue-700' :
                        item.condition === 'Rusak Sedang' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {item.condition}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({item.completionRate}%)
                      </span>
                    </div>
                    <div className="w-24 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${item.completionRate === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {item.fundedBy} ({item.targetYear})
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                    {item.lastInspected}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
