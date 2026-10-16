import React, { useState } from 'react';
import { TransmigrantKK } from '../types';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  Download, 
  Printer, 
  ShieldCheck, 
  MapPin, 
  User, 
  Users,
  Layers, 
  Sprout 
} from 'lucide-react';

interface PublicVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  kkList: TransmigrantKK[];
  prefilledQuery?: string;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({
  isOpen,
  onClose,
  kkList,
  prefilledQuery = ''
}) => {
  const [query, setQuery] = useState(prefilledQuery);
  const [searchResult, setSearchResult] = useState<TransmigrantKK | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (searchTerm: string) => {
    const cleanTerm = searchTerm.trim().toLowerCase();
    if (!cleanTerm) return;

    const found = kkList.find((kk) =>
      kk.nikKepalaKeluarga === cleanTerm ||
      kk.registrationNumber.toLowerCase() === cleanTerm ||
      kk.namaKepalaKeluarga.toLowerCase().includes(cleanTerm)
    );

    setSearchResult(found || null);
    setHasSearched(true);
  };

  const handleQuickSelect = (nik: string) => {
    setQuery(nik);
    handleSearch(nik);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Verifikasi & Transparansi Data Hak Transmigran
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan Status Alokasi Bidang Tanah & Sertifikat Hak Milik (SHM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Search Input Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Masukkan NIK (16 digit), No. Registrasi, atau Nama Lengkap Kepala Keluarga:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Contoh: 7322051208750001 atau Sutrisno"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>
              <button
                onClick={() => handleSearch(query)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                Cari Data
              </button>
            </div>

            {/* Quick Demo Preset Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
              <span>Coba data demo:</span>
              <button
                onClick={() => handleQuickSelect('7322011208750001')}
                className="text-emerald-700 hover:underline font-mono cursor-pointer"
              >
                Sutrisno (UPT Lantang Tallang - Masamba)
              </button>
              <span aria-hidden="true">&middot;</span>
              <button
                onClick={() => handleQuickSelect('7322012409820005')}
                className="text-emerald-700 hover:underline font-mono cursor-pointer"
              >
                Lalu M. Zaenudin (UPT Pongkase - Masamba)
              </button>
              <span aria-hidden="true">&middot;</span>
              <button
                onClick={() => handleQuickSelect('7322021212850009')}
                className="text-emerald-700 hover:underline font-mono cursor-pointer"
              >
                Martinus (UPT Seko Padang - Seko)
              </button>
            </div>
          </div>

          {/* Result Card */}
          {hasSearched && (
            <div>
              {searchResult ? (
                <div className="border border-emerald-300 bg-emerald-50/30 rounded-xl p-5 space-y-4">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-200 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {searchResult.registrationNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                          {searchResult.asalKategori} ({searchResult.kabupatenAsal}, {searchResult.provinsiAsal})
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">
                        {searchResult.namaKepalaKeluarga}
                      </h4>
                      {searchResult.namaPasangan && (
                        <p className="text-xs text-slate-600">
                          Pasangan: {searchResult.namaPasangan} &middot; Tanggungan: {searchResult.jumlahAnggota} Jiwa
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[11px] text-slate-500">Status Hak Tanah:</div>
                      <div className="text-sm font-bold text-emerald-800 flex items-center sm:justify-end gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{searchResult.statusSertifikat}</span>
                      </div>
                      {searchResult.nomorSHM && (
                        <div className="text-xs font-mono font-medium text-slate-700 mt-0.5">
                          {searchResult.nomorSHM}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parcel breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Lokasi UPT</span>
                      <span className="font-semibold text-slate-900">{searchResult.uptName.split(' (')[0]}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Blok & Kapling</span>
                      <span className="font-semibold text-emerald-800 font-mono">{searchResult.blokNomor}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Total Lahan</span>
                      <span className="font-semibold text-slate-900 font-mono">
                        {(searchResult.luasLahanPekaranganHa + searchResult.luasLahanUsaha1Ha + searchResult.luasLahanUsaha2Ha).toFixed(2)} Ha
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Penempatan</span>
                      <span className="font-semibold text-slate-900 font-mono">Tahun {searchResult.tahunPenempatan}</span>
                    </div>
                  </div>

                  {/* Land parcels detail */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div className="font-semibold text-slate-800">Rincian Hak Pembagian Lahan:</div>
                    <div className="grid grid-cols-3 gap-2 text-slate-600">
                      <div>
                        <span>Lahan Pekarangan (LP):</span>
                        <strong className="block font-mono text-slate-900">{searchResult.luasLahanPekaranganHa} Ha</strong>
                      </div>
                      <div>
                        <span>Lahan Usaha I (LU I):</span>
                        <strong className="block font-mono text-slate-900">{searchResult.luasLahanUsaha1Ha} Ha</strong>
                      </div>
                      <div>
                        <span>Lahan Usaha II (LU II):</span>
                        <strong className="block font-mono text-slate-900">{searchResult.luasLahanUsaha2Ha} Ha</strong>
                      </div>
                    </div>
                  </div>

                  {/* Saprotan & Poktan */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-semibold text-slate-800">Kelompok Tani: {searchResult.kelompokTani}</span>
                    </div>
                    <div className="text-slate-500">
                      Komoditas Dikelola: <strong className="text-slate-700">{searchResult.komoditasDikelola.join(', ')}</strong>
                    </div>
                    <div className="text-slate-500 pt-1 border-t border-slate-100">
                      Saprotan Diterima: {searchResult.bantuanSaprotanTerima.join(' &middot; ')}
                    </div>
                  </div>

                  {/* Print / Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-500">
                      *Tervalidasi di Buku Induk Disnakertrans Luwu Utara
                    </div>
                    <button
                      onClick={handlePrintCertificate}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Surat Bukti Warkah</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">Data Tidak Ditemukan</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Data dengan kata kunci &quot;{query}&quot; belum terdaftar di pangkalan data publik SIAP KANDA.
                    Pastikan NIK atau nama ditulis sesuai e-KTP atau kartu penempatan transmigran.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
