import React, { useState } from 'react';
import { TransmigrantKK, UPTRegion, OfficerUser } from '../types';
import { X, Plus, Save, UserPlus, CheckCircle2, Building, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  uptList: UPTRegion[];
  onAddKK: (kk: TransmigrantKK) => void;
  currentOfficer?: OfficerUser | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  uptList,
  onAddKK,
  currentOfficer
}) => {
  const [namaKK, setNamaKK] = useState('');
  const [nikKK, setNikKK] = useState('');
  const [namaPasangan, setNamaPasangan] = useState('');
  const [jumlahAnggota, setJumlahAnggota] = useState<number>(4);
  const [selectedUptId, setSelectedUptId] = useState(uptList[0]?.id || '');
  const [blokNomor, setBlokNomor] = useState('');
  const [tahunPenempatan, setTahunPenempatan] = useState<number>(2024);
  const [asalKategori, setAsalKategori] = useState<'TPA' | 'TPS'>('TPA');
  const [provinsiAsal, setProvinsiAsal] = useState('Jawa Tengah');
  const [kabupatenAsal, setKabupatenAsal] = useState('Banyumas');
  const [statusSertifikat, setStatusSertifikat] = useState<'SHM Terbit' | 'Proses BPN' | 'Verifikasi HPL' | 'Kendala Batas'>('Proses BPN');
  const [nomorSHM, setNomorSHM] = useState('');
  const [luasLP, setLuasLP] = useState<number>(0.25);
  const [luasLU1, setLuasLU1] = useState<number>(1.0);
  const [luasLU2, setLuasLU2] = useState<number>(1.0);
  const [kelompokTani, setKelompokTani] = useState('');
  const [fotoLahanUrl, setFotoLahanUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFotoLahanUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKK || !nikKK || !blokNomor) return;

    const chosenUpt = uptList.find(u => u.id === selectedUptId) || uptList[0];
    const newRecord: TransmigrantKK = {
      id: `KK-${Date.now()}`,
      registrationNumber: `REG-TR-${tahunPenempatan}-${chosenUpt.name.slice(4, 7).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      nikKepalaKeluarga: nikKK,
      namaKepalaKeluarga: namaKK,
      namaPasangan: namaPasangan || undefined,
      jumlahAnggota: jumlahAnggota,
      kawasan: chosenUpt.kawasan,
      uptId: chosenUpt.id,
      uptName: chosenUpt.name,
      blokNomor: blokNomor,
      tahunPenempatan: tahunPenempatan,
      asalKategori: asalKategori,
      provinsiAsal: provinsiAsal,
      kabupatenAsal: kabupatenAsal,
      statusSertifikat: statusSertifikat,
      nomorSHM: nomorSHM || undefined,
      luasLahanPekaranganHa: luasLP,
      luasLahanUsaha1Ha: luasLU1,
      luasLahanUsaha2Ha: luasLU2,
      komoditasDikelola: ['Kakao', 'Kelapa Sawit'],
      kelompokTani: kelompokTani || `Poktan ${chosenUpt.name.split(' ')[1] || 'Trans'} Mandiri`,
      bantuanSaprotanTerima: ['Bibit Bersertifikat', 'Pupuk NPK Tahap 1'],
      fotoLahanUrl: fotoLahanUrl || undefined,
      tanggalUpdateTerakhir: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      petugasPengubah: currentOfficer?.name || 'Petugas Disnakertrans Luwu Utara'
    };

    onAddKK(newRecord);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <BrandLogo
              src="/Luwu_Utara_Logo_(North_Luwu).png"
              alt="Logo Resmi Kabupaten Luwu Utara"
              className="h-11 w-auto object-contain shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Input Data Transmigran Baru
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  SIAP KANDA
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Petugas Pencatat: <strong>{currentOfficer?.name || 'Petugas Disnakertrans Kab. Luwu Utara'}</strong>
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Data Transmigran Berhasil Didaftarkan!</h4>
            <p className="text-xs text-slate-500">
              Rekam data untuk Kepala Keluarga <strong>{namaKK}</strong> telah disimpan ke pangkalan data dan nomor registrasi warkah telah diterbitkan secara otomatis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Profil KK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Kepala Keluarga (KK) *</label>
                <input
                  type="text"
                  required
                  value={namaKK}
                  onChange={(e) => setNamaKK(e.target.value)}
                  placeholder="Contoh: Sudirman, S.Pd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIK Kepala Keluarga (16 digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nikKK}
                  onChange={(e) => setNikKK(e.target.value)}
                  placeholder="7322..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Pasangan (Istri/Suami)</label>
                <input
                  type="text"
                  value={namaPasangan}
                  onChange={(e) => setNamaPasangan(e.target.value)}
                  placeholder="Nama pasangan bila ada"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jumlah Anggota Keluarga (Jiwa)</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={jumlahAnggota}
                  onChange={(e) => setJumlahAnggota(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            {/* Lokasi Penempatan */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pilih UPT Penempatan *</label>
                <select
                  value={selectedUptId}
                  onChange={(e) => setSelectedUptId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  {uptList.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor Blok / Kapling *</label>
                <input
                  type="text"
                  required
                  value={blokNomor}
                  onChange={(e) => setBlokNomor(e.target.value)}
                  placeholder="Contoh: Blok B-14"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tahun Penempatan</label>
                <input
                  type="number"
                  value={tahunPenempatan}
                  onChange={(e) => setTahunPenempatan(parseInt(e.target.value) || 2024)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            {/* Asal Daerah */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kategori Asal</label>
                <select
                  value={asalKategori}
                  onChange={(e) => setAsalKategori(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="TPA">TPA (Penduduk Asal Luar Sulawesi)</option>
                  <option value="TPS">TPS (Penduduk Setempat Luwu Utara)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Provinsi Asal</label>
                <input
                  type="text"
                  value={provinsiAsal}
                  onChange={(e) => setProvinsiAsal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kabupaten Asal</label>
                <input
                  type="text"
                  value={kabupatenAsal}
                  onChange={(e) => setKabupatenAsal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Status SHM */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status Sertifikat Hak Milik (SHM)</label>
                <select
                  value={statusSertifikat}
                  onChange={(e) => setStatusSertifikat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="Proses BPN">Proses Pengukuran BPN</option>
                  <option value="SHM Terbit">SHM Terbit (Telah Diserahkan)</option>
                  <option value="Verifikasi HPL">Verifikasi Dokumen HPL</option>
                  <option value="Kendala Batas">Kendala Batas / Mediasi</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor SHM (Jika Sudah Terbit)</label>
                <input
                  type="text"
                  value={nomorSHM}
                  onChange={(e) => setNomorSHM(e.target.value)}
                  placeholder="Contoh: SHM.07322.01999/2025"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            {/* Luas Lahan */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Lahan Pekarangan (Ha)</label>
                <input
                  type="number"
                  step="0.05"
                  value={luasLP}
                  onChange={(e) => setLuasLP(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Lahan Usaha I (Ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={luasLU1}
                  onChange={(e) => setLuasLU1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Lahan Usaha II (Ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={luasLU2}
                  onChange={(e) => setLuasLU2(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            {/* Foto Dokumentasi Lahan */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-slate-700 font-semibold">
                Foto Dokumentasi Rumah / Lahan Kapling (Opsional):
              </label>
              <div className="flex items-center gap-3">
                {fotoLahanUrl ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 relative shrink-0">
                    <img src={fotoLahanUrl} alt="Lahan" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotoLahanUrl('')}
                      className="absolute top-0 right-0 p-0.5 bg-rose-600 text-white rounded-bl text-[9px]"
                      title="Hapus foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fotoLahanUrl}
                    onChange={(e) => setFotoLahanUrl(e.target.value)}
                    placeholder="Atau tempel URL foto..."
                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Rekam Data Transmigran</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
