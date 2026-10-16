import React from 'react';
import { TransmigrantKK, OfficerUser } from '../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  Printer, 
  MapPin, 
  Building, 
  Users, 
  Layers, 
  FileText,
  AlertTriangle,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TransmigrantDetailModalProps {
  kk: TransmigrantKK | null;
  onClose: () => void;
  onReportIssue: (kk: TransmigrantKK) => void;
  currentOfficer?: OfficerUser | null;
  onEditKK?: (kk: TransmigrantKK) => void;
}

export const TransmigrantDetailModal: React.FC<TransmigrantDetailModalProps> = ({
  kk,
  onClose,
  onReportIssue,
  currentOfficer,
  onEditKK
}) => {
  if (!kk) return null;

  const totalHa = (
    kk.luasLahanPekaranganHa +
    kk.luasLahanUsaha1Ha +
    kk.luasLahanUsaha2Ha
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Official Logo & Warkah Identity */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <BrandLogo
              src="/Luwu_Utara_Logo_(North_Luwu).png"
              alt="Logo Resmi Kabupaten Luwu Utara"
              className="h-12 w-auto object-contain shrink-0"
              allowZoom={true}
            />
            <div>
              <div className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                Buku Induk Registrasi Hak Transmigran Disnakertrans
              </div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">
                {kk.namaKepalaKeluarga}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                No. Reg: {kk.registrationNumber} &middot; NIK: {kk.nikKepalaKeluarga}
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Officer Edit Bar if logged in */}
          {currentOfficer && onEditKK && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="text-amber-900 text-xs">
                <span className="font-bold">Mode Petugas:</span> Anda memiliki izin mengedit data warkah, status SHM, luas lahan, dan foto untuk KK ini.
              </div>
              <button
                onClick={() => {
                  onEditKK(kk);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 ml-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Data Transmigran</span>
              </button>
            </div>
          )}

          {/* Status Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              {kk.statusSertifikat === 'SHM Terbit' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : kk.statusSertifikat === 'Proses BPN' ? (
                <Clock className="w-5 h-5 text-amber-600" />
              ) : kk.statusSertifikat === 'Verifikasi HPL' ? (
                <FileCheck2 className="w-5 h-5 text-blue-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <span className="font-bold text-slate-900 text-sm">{kk.statusSertifikat}</span>
                <span className="text-slate-500 block text-[11px]">
                  {kk.nomorSHM ? `Nomor Buku Tanah: ${kk.nomorSHM}` : 'Warkah ukur dan dokumen yuridis sedang berproses di ATR/BPN Masamba'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-slate-900 text-sm">{totalHa} Ha</span>
              <span className="text-slate-400 block text-[11px]">Alokasi Hak Total</span>
            </div>
          </div>

          {/* Profil Keluarga & Penempatan */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[11px]">Wilayah Penempatan</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mb-1">{kk.kawasan}</span>
              <span className="font-bold text-slate-900 block">{kk.uptName}</span>
              <span className="text-emerald-700 font-mono font-semibold block">{kk.blokNomor}</span>
              <span className="text-slate-500 block text-[11px]">Tahun Masuk: {kk.tahunPenempatan}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[11px]">Asal Daerah Transmigran</span>
              <span className="font-bold text-slate-900 block">{kk.asalKategori} ({kk.provinsiAsal})</span>
              <span className="text-slate-600 block">Kabupaten: {kk.kabupatenAsal}</span>
              <span className="text-slate-500 block text-[11px]">
                {kk.namaPasangan ? `Pasangan: ${kk.namaPasangan} (${kk.jumlahAnggota} Jiwa)` : `${kk.jumlahAnggota} Jiwa`}
              </span>
            </div>
          </div>

          {/* Rincian Bidang Tanah Alokasi Transmigran */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">
              Rincian Alokasi Kapling Tanah (Surat Keputusan Bupati Luwu Utara)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Lahan Pekarangan (LP)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{kk.luasLahanPekaranganHa} Ha</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Rumah & Pekarangan</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Lahan Usaha I (LU I)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{kk.luasLahanUsaha1Ha} Ha</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tanaman Pangan / Utama</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Lahan Usaha II (LU II)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{kk.luasLahanUsaha2Ha} Ha</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Kebun Kakao / Sawit</span>
              </div>
            </div>
          </div>

          {/* Foto Dokumentasi Lahan jika tersedia */}
          {kk.fotoLahanUrl && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Dokumentasi Foto Lahan / Rumah Transmigran</span>
              </div>
              <div className="aspect-video max-h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                <img
                  src={kk.fotoLahanUrl}
                  alt={`Lahan ${kk.namaKepalaKeluarga}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Kelembagaan Petani & Bantuan Saprotan */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Kelompok Tani (Poktan): {kk.kelompokTani}</span>
              <span className="text-slate-500 text-[11px]">Binaan Disnakertrans Luwu Utara</span>
            </div>
            <div className="text-slate-600">
              Komoditas Aktif: <strong className="text-slate-900">{kk.komoditasDikelola.join(', ')}</strong>
            </div>
            <div className="text-slate-500 pt-1 border-t border-slate-100">
              Bantuan Sarana Produksi Diterima: {kk.bantuanSaprotanTerima.join(' &middot; ')}
            </div>
            {kk.tanggalUpdateTerakhir && (
              <div className="text-[11px] text-slate-400 pt-1">
                Terakhir dimutakhirkan: {kk.tanggalUpdateTerakhir} {kk.petugasPengubah ? `oleh ${kk.petugasPengubah}` : ''}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => onReportIssue(kk)}
              className="flex items-center gap-1.5 text-rose-700 hover:text-rose-800 font-medium cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Laporkan Masalah / Sengketa Kapling Ini</span>
            </button>

            <div className="flex items-center gap-2">
              {currentOfficer && onEditKK && (
                <button
                  onClick={() => onEditKK(kk)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Warkah</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
