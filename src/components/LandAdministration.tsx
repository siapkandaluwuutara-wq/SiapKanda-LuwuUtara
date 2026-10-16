import React, { useState } from 'react';
import { TransmigrantKK, UPTRegion, KawasanName, OfficerUser } from '../types';
import { 
  Search, 
  Download, 
  FileCheck2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Building,
  RefreshCw,
  Mountain,
  Edit3,
  Plus,
  LogIn,
  Lock,
  UserCheck,
  Users,
  Layers
} from 'lucide-react';

interface LandAdministrationProps {
  kkList: TransmigrantKK[];
  uptList: UPTRegion[];
  onOpenCheckModal: (prefilledNik?: string) => void;
  onSelectDetailKK: (kk: TransmigrantKK) => void;
  currentOfficer?: OfficerUser | null;
  onOpenLoginModal?: () => void;
  onEditKK?: (kk: TransmigrantKK) => void;
  onOpenAddModal?: () => void;
  onOpenOfficerManageModal?: () => void;
  onOpenKawasanUptModal?: () => void;
}

export const LandAdministration: React.FC<LandAdministrationProps> = ({
  kkList,
  uptList,
  onOpenCheckModal,
  onSelectDetailKK,
  currentOfficer,
  onOpenLoginModal,
  onEditKK,
  onOpenAddModal,
  onOpenOfficerManageModal,
  onOpenKawasanUptModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKawasanFilter, setSelectedKawasanFilter] = useState<'all' | KawasanName>('all');
  const [selectedUptFilter, setSelectedUptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered dataset
  const filteredKK = kkList.filter((kk) => {
    const matchesSearch =
      kk.namaKepalaKeluarga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kk.nikKepalaKeluarga.includes(searchQuery) ||
      kk.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kk.blokNomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kk.nomorSHM && kk.nomorSHM.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesKawasan = selectedKawasanFilter === 'all' || kk.kawasan === selectedKawasanFilter;
    const matchesUpt = selectedUptFilter === 'all' || kk.uptId === selectedUptFilter;
    const matchesStatus = selectedStatusFilter === 'all' || kk.statusSertifikat === selectedStatusFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || kk.asalKategori === selectedCategoryFilter;

    return matchesSearch && matchesKawasan && matchesUpt && matchesStatus && matchesCategory;
  });

  // Available UPT options depending on Kawasan filter
  const availableUPTs = selectedKawasanFilter === 'all'
    ? uptList
    : uptList.filter(u => u.kawasan === selectedKawasanFilter);

  // Pagination
  const totalPages = Math.ceil(filteredKK.length / itemsPerPage) || 1;
  const paginatedKK = filteredKK.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Quick stat counts
  const totalShmTerbit = kkList.filter(k => k.statusSertifikat === 'SHM Terbit').length;
  const totalProsesBpn = kkList.filter(k => k.statusSertifikat === 'Proses BPN').length;
  const totalVerifikasiHpl = kkList.filter(k => k.statusSertifikat === 'Verifikasi HPL').length;
  const totalKendala = kkList.filter(k => k.statusSertifikat === 'Kendala Batas').length;

  const handleExportCSV = () => {
    const headers = ['No Registrasi', 'Nama Kepala Keluarga', 'NIK', 'Kawasan', 'UPT', 'Blok', 'Asal', 'Status SHM', 'Nomor SHM', 'LP (Ha)', 'LU 1 (Ha)', 'LU 2 (Ha)', 'Kelompok Tani'];
    const rows = filteredKK.map(k => [
      k.registrationNumber,
      k.namaKepalaKeluarga,
      k.nikKepalaKeluarga,
      k.kawasan,
      k.uptName,
      k.blokNomor,
      `${k.asalKategori} (${k.provinsiAsal})`,
      k.statusSertifikat,
      k.nomorSHM || '-',
      k.luasLahanPekaranganHa,
      k.luasLahanUsaha1Ha,
      k.luasLahanUsaha2Ha,
      k.kelompokTani
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_administrasi_shm_luwu_utara_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Summary */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase">
              <span>Buku Induk Registrasi Hak Atas Tanah Transmigran</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Administrasi & Sertifikasi Hak Milik (SHM) Kawasan Masamba & Seko
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Basis data transparan pembagian Lahan Pekarangan (LP), Lahan Usaha I, dan Lahan Usaha II 
              pada 6 UPT Kawasan Masamba (Lantang Tallang, Sepakat, Maipi, Buso, Pongkase, Bantimurung) dan Kawasan Seko.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Rekap CSV</span>
            </button>
            <button
              onClick={() => onOpenCheckModal()}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek NIK Transmigran</span>
            </button>
          </div>
        </div>

        {/* Officer Active Bar */}
        {currentOfficer ? (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-900 font-semibold">
                Sesi Petugas: <strong>{currentOfficer.name}</strong> ({currentOfficer.role})
              </span>
              <span className="text-amber-700 hidden md:inline">&middot; Akses edit warkah & input transmigran aktif</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(currentOfficer?.isAdmin || currentOfficer?.nip === '197909202010011002') && onOpenKawasanUptModal && (
                <button
                  onClick={onOpenKawasanUptModal}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                  title="Kelola dan edit data Kawasan serta seluruh UPT"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Edit Kawasan & UPT</span>
                </button>
              )}
              {(currentOfficer?.isAdmin || currentOfficer?.nip === '197909202010011002') && onOpenOfficerManageModal && (
                <button
                  onClick={onOpenOfficerManageModal}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                  title="Kelola, tambah, dan ubah User ID petugas lapangan"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Kelola User ID Petugas</span>
                </button>
              )}
              {onOpenAddModal && (
                <button
                  onClick={onOpenAddModal}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Input Transmigran Baru</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px]">
              Petugas Disnakertrans dapat masuk dengan User ID untuk menambah atau mengedit data transmigran dan sertifikat.
            </span>
            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 text-[11px] cursor-pointer shrink-0 ml-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login Petugas</span>
              </button>
            )}
          </div>
        )}

        {/* Status Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div 
            onClick={() => { setSelectedStatusFilter('SHM Terbit'); setCurrentPage(1); }}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              selectedStatusFilter === 'SHM Terbit' ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>SHM Terbit</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalShmTerbit} KK</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Diserahkan ke Pemilik</div>
          </div>

          <div 
            onClick={() => { setSelectedStatusFilter('Proses BPN'); setCurrentPage(1); }}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              selectedStatusFilter === 'Proses BPN' ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>Proses Pengukuran BPN</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalProsesBpn} KK</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Warkah Ukur Kadastral</div>
          </div>

          <div 
            onClick={() => { setSelectedStatusFilter('Verifikasi HPL'); setCurrentPage(1); }}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              selectedStatusFilter === 'Verifikasi HPL' ? 'bg-blue-50 border-blue-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>Verifikasi HPL</span>
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalVerifikasiHpl} KK</div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5">Pemeriksaan Subjek Hak</div>
          </div>

          <div 
            onClick={() => { setSelectedStatusFilter('Kendala Batas'); setCurrentPage(1); }}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              selectedStatusFilter === 'Kendala Batas' ? 'bg-rose-50 border-rose-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>Kendala Batas / Mediasi</span>
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalKendala} KK</div>
            <div className="text-[11px] text-rose-700 font-medium mt-0.5">Fasilitasi Mediasi Pemda</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        {/* Kawasan Filter Buttons */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Filter Kawasan:</span>
          <button
            onClick={() => { setSelectedKawasanFilter('all'); setSelectedUptFilter('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedKawasanFilter === 'all' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Kawasan (Masamba & Seko)
          </button>
          <button
            onClick={() => { setSelectedKawasanFilter('Kawasan Masamba'); setSelectedUptFilter('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedKawasanFilter === 'Kawasan Masamba' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kawasan Masamba (6 UPT)
          </button>
          <button
            onClick={() => { setSelectedKawasanFilter('Kawasan Seko'); setSelectedUptFilter('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedKawasanFilter === 'Kawasan Seko' ? 'bg-amber-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kawasan Seko (2 UPT)
          </button>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama KK, NIK, No. Reg, atau Blok..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            />
          </div>

          {/* UPT dropdown */}
          <div>
            <select
              value={selectedUptFilter}
              onChange={(e) => { setSelectedUptFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            >
              <option value="all">Semua UPT Terpilih ({availableUPTs.length})</option>
              {availableUPTs.map((upt) => (
                <option key={upt.id} value={upt.id}>
                  {upt.name} ({upt.district})
                </option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => { setSelectedStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            >
              <option value="all">Semua Status Sertifikat</option>
              <option value="SHM Terbit">SHM Terbit</option>
              <option value="Proses BPN">Proses BPN</option>
              <option value="Verifikasi HPL">Verifikasi HPL</option>
              <option value="Kendala Batas">Kendala Batas</option>
            </select>
          </div>

          {/* Category dropdown & reset */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => { setSelectedCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            >
              <option value="all">Semua Kategori (TPA & TPS)</option>
              <option value="TPA">TPA (Penduduk Asal)</option>
              <option value="TPS">TPS (Penduduk Setempat)</option>
            </select>

            {(searchQuery || selectedKawasanFilter !== 'all' || selectedUptFilter !== 'all' || selectedStatusFilter !== 'all' || selectedCategoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedKawasanFilter('all');
                  setSelectedUptFilter('all');
                  setSelectedStatusFilter('all');
                  setSelectedCategoryFilter('all');
                  setCurrentPage(1);
                }}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer shrink-0"
                title="Reset filter"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No. Registrasi & NIK</th>
                <th className="py-3 px-4">Nama Kepala Keluarga</th>
                <th className="py-3 px-4">Kawasan & UPT</th>
                <th className="py-3 px-4">Asal Wilayah</th>
                <th className="py-3 px-4 text-right">Alokasi Lahan (Ha)</th>
                <th className="py-3 px-4">Status Sertifikat (SHM)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedKK.length > 0 ? (
                paginatedKK.map((kk) => {
                  const totalHa = (
                    kk.luasLahanPekaranganHa +
                    kk.luasLahanUsaha1Ha +
                    kk.luasLahanUsaha2Ha
                  ).toFixed(2);

                  return (
                    <tr 
                      key={kk.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectDetailKK(kk)}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-semibold text-slate-900">{kk.registrationNumber}</div>
                        <div className="text-[11px] text-slate-400 tracking-wider">
                          NIK: {kk.nikKepalaKeluarga.slice(0, 6)}******{kk.nikKepalaKeluarga.slice(-4)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{kk.namaKepalaKeluarga}</div>
                        {kk.namaPasangan && (
                          <div className="text-[11px] text-slate-500">Istri: {kk.namaPasangan} ({kk.jumlahAnggota} Jiwa)</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          kk.kawasan === 'Kawasan Masamba' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {kk.kawasan}
                        </span>
                        <div className="font-medium text-slate-800 mt-0.5">{kk.uptName}</div>
                        <div className="text-[11px] text-emerald-700 font-mono font-medium">{kk.blokNomor}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${kk.asalKategori === 'TPA' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                          <span className="font-medium text-slate-900">{kk.asalKategori}</span>
                          <span className="text-slate-400">({kk.kabupatenAsal})</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{kk.provinsiAsal} &middot; Thn {kk.tahunPenempatan}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <div className="font-bold text-slate-900">{totalHa} Ha</div>
                        <div className="text-[10px] text-slate-400">
                          LP {kk.luasLahanPekaranganHa} | LU1 {kk.luasLahanUsaha1Ha} | LU2 {kk.luasLahanUsaha2Ha}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {kk.statusSertifikat === 'SHM Terbit' && (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>SHM Terbit</span>
                            </span>
                          )}
                          {kk.statusSertifikat === 'Proses BPN' && (
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Proses BPN</span>
                            </span>
                          )}
                          {kk.statusSertifikat === 'Verifikasi HPL' && (
                            <span className="text-blue-700 font-semibold flex items-center gap-1">
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>Verifikasi HPL</span>
                            </span>
                          )}
                          {kk.statusSertifikat === 'Kendala Batas' && (
                            <span className="text-rose-700 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Kendala Batas</span>
                            </span>
                          )}
                        </div>
                        {kk.nomorSHM && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[140px]">
                            {kk.nomorSHM}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDetailKK(kk);
                            }}
                            className="px-2.5 py-1 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors cursor-pointer text-[11px] whitespace-nowrap"
                            title="Lihat lembar warkah lengkap"
                          >
                            Detail
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentOfficer && onEditKK) {
                                onEditKK(kk);
                              } else if (onOpenLoginModal) {
                                onOpenLoginModal();
                              }
                            }}
                            className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer text-[11px] flex items-center gap-1 whitespace-nowrap ${
                              currentOfficer
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-semibold shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200'
                            }`}
                            title={currentOfficer ? `Edit data ${kk.namaKepalaKeluarga}` : 'Login Petugas untuk mengedit data ini'}
                          >
                            <Edit3 className="w-3 h-3 text-amber-700" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-slate-600">Tidak ada data transmigran yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau sesuaikan filter Kawasan & UPT di atas.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            Menampilkan <span className="font-mono font-semibold text-slate-800">{paginatedKK.length}</span> dari{' '}
            <span className="font-mono font-semibold text-slate-800">{filteredKK.length}</span> data transmigran terdaftar
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 font-mono">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
