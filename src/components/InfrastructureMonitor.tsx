import React, { useState } from 'react';
import { InfrastructureItem, UPTRegion, PortalImages, OfficerUser } from '../types';
import { DEFAULT_PORTAL_IMAGES } from '../data/portalImages';
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
  ArrowRight,
  Edit3,
  Trash2,
  ShieldCheck,
  RotateCcw,
  LogIn
} from 'lucide-react';

interface InfrastructureMonitorProps {
  infrastructureList: InfrastructureItem[];
  uptList: UPTRegion[];
  onOpenReportModal: (category?: string) => void;
  images?: PortalImages;
  currentOfficer?: OfficerUser | null;
  onOpenPhotoModal?: () => void;
  onOpenLoginModal?: () => void;
  onEditInfrastructure?: (item: InfrastructureItem) => void;
  onAddInfrastructure?: () => void;
  onDeleteInfrastructure?: (itemId: string) => void;
  onResetInfrastructure?: () => void;
}

export const InfrastructureMonitor: React.FC<InfrastructureMonitorProps> = ({
  infrastructureList,
  uptList,
  onOpenReportModal,
  images,
  currentOfficer,
  onOpenPhotoModal,
  onOpenLoginModal,
  onEditInfrastructure,
  onAddInfrastructure,
  onDeleteInfrastructure,
  onResetInfrastructure
}) => {
  const [filterKawasan, setFilterKawasan] = useState<'all' | 'Kawasan Masamba' | 'Kawasan Seko'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUpt, setFilterUpt] = useState<string>('all');

  const isOfficer = Boolean(currentOfficer);

  const filteredItems = infrastructureList.filter((item) => {
    const matchesKawasan = filterKawasan === 'all' || item.kawasan === filterKawasan;
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesUpt = filterUpt === 'all' || item.uptId === filterUpt;
    return matchesKawasan && matchesCat && matchesUpt;
  });

  const infraPhoto = images?.infrastructure || DEFAULT_PORTAL_IMAGES.infrastructure;

  // Real-time aggregate calculations from actual data
  const totalItems = infrastructureList.length;
  const goodConditionCount = infrastructureList.filter(i => i.condition === 'Baik').length;
  const avgCompletion = totalItems > 0 
    ? Math.round(infrastructureList.reduce((acc, curr) => acc + curr.completionRate, 0) / totalItems) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner with Image and Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
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
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Kondisi Baik/Fungsional</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  {totalItems > 0 ? `${Math.round((goodConditionCount / totalItems) * 100)}%` : '0%'}
                </span>
                <span className="text-[10px] text-slate-400 block">{goodConditionCount} dari {totalItems} paket</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Rerata Progres Fisik</span>
                <span className="text-lg font-bold font-mono text-slate-900">{avgCompletion}%</span>
                <span className="text-[10px] text-emerald-700 block">Realisasi Lapangan</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Paket Terpantau</span>
                <span className="text-lg font-bold font-mono text-slate-900">{totalItems} Paket</span>
                <span className="text-[10px] text-emerald-700 block">APBN & APBD</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenReportModal('Jalan Rusak')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <span>Lapor Kerusakan Sarpras Warga</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {isOfficer ? (
                onAddInfrastructure && (
                  <button
                    onClick={onAddInfrastructure}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Paket Sarpras</span>
                  </button>
                )
              ) : (
                onOpenLoginModal && (
                  <button
                    onClick={onOpenLoginModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Login Petugas untuk Edit Data</span>
                  </button>
                )
              )}
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
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
        {/* Top Control Bar with Admin badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Daftar Paket Sarpras & Pembangunan Fasilitas</h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-semibold">
                {filteredItems.length} dari {infrastructureList.length} paket
              </span>
            </div>
            {isOfficer && (
              <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Administrator Aktif: <strong>{currentOfficer?.name}</strong> &middot; Anda dapat menambah, mengedit, atau menghapus paket infrastruktur.</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOfficer && (
              <>
                {onAddInfrastructure && (
                  <button
                    onClick={onAddInfrastructure}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Paket</span>
                  </button>
                )}
                {onResetInfrastructure && (
                  <button
                    onClick={onResetInfrastructure}
                    title="Kembalikan data ke standar awal"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Default</span>
                  </button>
                )}
              </>
            )}

            {/* Filter category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Kategori Sarpras</option>
              <option value="Jalan & Jembatan">Jalan & Jembatan</option>
              <option value="Air Bersih">Air Bersih (SPAM/Sumur)</option>
              <option value="Listrik & Penerangan">Listrik & Penerangan (PJUTS)</option>
              <option value="Pemukiman">Pemukiman (RTJK & Fasos)</option>
              <option value="Fasilitas Sosial">Fasilitas Sosial / Medis</option>
            </select>

            {/* Filter Kawasan */}
            <select
              value={filterKawasan}
              onChange={(e) => setFilterKawasan(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Kawasan (Masamba & Seko)</option>
              <option value="Kawasan Masamba">Kawasan Masamba (6 UPT)</option>
              <option value="Kawasan Seko">Kawasan Seko (2 UPT)</option>
            </select>

            {/* Filter UPT */}
            <select
              value={filterUpt}
              onChange={(e) => setFilterUpt(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-3.5">Nama Paket Sarpras</th>
                <th className="py-3 px-3">Kawasan & UPT</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Kondisi & Progres</th>
                <th className="py-3 px-3">Sumber Dana</th>
                <th className="py-3 px-3 text-right">Inspeksi Terakhir</th>
                {isOfficer && (
                  <th className="py-3 px-3 text-center">Aksi Admin</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={isOfficer ? 7 : 6} className="py-8 text-center text-slate-400">
                    Tidak ada paket sarpras yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3.5 max-w-xs">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.spec}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.kawasan === 'Kawasan Masamba' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {item.kawasan}
                      </span>
                      <div className="font-semibold text-slate-800 mt-1">{item.uptName.split(' (')[0]}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${
                          item.condition === 'Baik' ? 'text-emerald-700' :
                          item.condition === 'Rusak Ringan' ? 'text-blue-700' :
                          item.condition === 'Rusak Sedang' ? 'text-amber-700' :
                          item.condition === 'Rusak Berat' ? 'text-rose-700' : 'text-purple-700'
                        }`}>
                          {item.condition}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({item.completionRate}%)
                        </span>
                      </div>
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            item.completionRate === 100 ? 'bg-emerald-600' :
                            item.completionRate >= 75 ? 'bg-blue-600' :
                            item.completionRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.completionRate}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                      <div>{item.fundedBy}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Tahun {item.targetYear}</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {item.lastInspected}
                    </td>
                    {isOfficer && (
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {onEditInfrastructure && (
                            <button
                              type="button"
                              onClick={() => onEditInfrastructure(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold transition-colors cursor-pointer"
                              title="Edit data paket sarpras ini"
                            >
                              <Edit3 className="w-3 h-3 text-emerald-700" />
                              <span>Edit</span>
                            </button>
                          )}
                          {onDeleteInfrastructure && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Hapus paket sarpras "${item.name}"?`)) {
                                  onDeleteInfrastructure(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Hapus paket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
