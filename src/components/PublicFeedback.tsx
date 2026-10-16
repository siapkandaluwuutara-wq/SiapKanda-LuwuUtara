import React, { useState } from 'react';
import { PublicFeedbackTicket, UPTRegion } from '../types';
import { 
  FileText, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface PublicFeedbackProps {
  tickets: PublicFeedbackTicket[];
  uptList: UPTRegion[];
  onAddTicket: (ticket: PublicFeedbackTicket) => void;
  defaultCategory?: string;
}

export const PublicFeedback: React.FC<PublicFeedbackProps> = ({
  tickets,
  uptList,
  onAddTicket,
  defaultCategory = 'Keterlambatan SHM'
}) => {
  const [activeTab, setActiveTab] = useState<'lapor' | 'lacak'>('lapor');

  // Form State
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [kontak, setKontak] = useState('');
  const [selectedUpt, setSelectedUpt] = useState(uptList[0]?.name || '');
  const [kategori, setKategori] = useState<any>(defaultCategory);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<PublicFeedbackTicket | null>(null);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedResult, setTrackedResult] = useState<PublicFeedbackTicket | null>(null);
  const [hasTracked, setHasTracked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nik || !judul || !deskripsi) {
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const matchingUpt = uptList.find(u => u.name === selectedUpt || u.id === selectedUpt);
    const newTicket: PublicFeedbackTicket = {
      id: `TCK-${Date.now()}`,
      ticketNumber: `SIAP-${new Date().getFullYear()}-${randomNum}`,
      namaPelapor: nama,
      nikPelapor: nik,
      kontak: kontak || '-',
      kawasan: matchingUpt?.kawasan || 'Kawasan Masamba',
      uptTerkait: selectedUpt,
      kategori: kategori,
      judul: judul,
      deskripsi: deskripsi,
      tanggalLapor: new Date().toISOString().slice(0, 10),
      status: 'Diterima',
      catatanPetugas: 'Laporan telah masuk ke sistem antrean verifikasi lapangan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Luwu Utara.'
    };

    onAddTicket(newTicket);
    setSubmittedTicket(newTicket);
    // Reset form
    setNama('');
    setNik('');
    setKontak('');
    setJudul('');
    setDeskripsi('');
  };

  const handleTrack = () => {
    if (!trackQuery.trim()) return;
    const found = tickets.find(t => 
      t.ticketNumber.toLowerCase() === trackQuery.trim().toLowerCase() ||
      t.nikPelapor === trackQuery.trim()
    );
    setTrackedResult(found || null);
    setHasTracked(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Transparansi & Akuntabilitas Publik</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Lapor Kanda &middot; Aspirasi & Pengaduan Warga Transmigran
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Kanal resmi pengaduan publik untuk warga pemukiman transmigrasi Kabupaten Luwu Utara terkait 
              keterlambatan sertifikat tanah (SHM), sengketa patok batas, kerusakan fasilitas jalan poros/air, 
              maupun distribusi sarana produksi pertanian (saprotan).
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab('lapor')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'lapor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buat Laporan Baru
            </button>
            <button
              onClick={() => setActiveTab('lacak')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'lacak' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lacak Status Tiket
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Buat Laporan */}
      {activeTab === 'lapor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {submittedTicket ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Laporan Berhasil Terkirim ke Sistem SIAP KANDA!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Nomor tiket registrasi resmi Anda adalah:
                </p>
                <div className="inline-block px-4 py-2 bg-white border border-emerald-400 rounded-lg font-mono font-bold text-emerald-800 text-base shadow-sm">
                  {submittedTicket.ticketNumber}
                </div>
                <p className="text-xs text-slate-500">
                  Simpan nomor tiket ini untuk memantau proses verifikasi lapangan dan tindak lanjut oleh petugas Disnakertrans Kab. Luwu Utara.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Kirim Pengaduan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Formulir Pengaduan / Aspirasi Warga
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Nama Lengkap Pelapor *
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Nama sesuai KTP"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      NIK Pelapor (16 digit) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      placeholder="7322xxxxxxxxxxxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Nomor HP / WhatsApp Aktif
                    </label>
                    <input
                      type="text"
                      value={kontak}
                      onChange={(e) => setKontak(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Wilayah UPT Terkait *
                    </label>
                    <select
                      value={selectedUpt}
                      onChange={(e) => setSelectedUpt(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                    >
                      {uptList.map((upt) => (
                        <option key={upt.id} value={upt.name}>
                          {upt.name} ({upt.district})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Kategori Laporan / Kendala *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Keterlambatan SHM">Keterlambatan Sertifikasi SHM (LP / LU I / LU II)</option>
                    <option value="Sengketa Batas Tanah">Sengketa / Pergeseran Patok Batas Kapling</option>
                    <option value="Jalan Rusak">Kerusakan Jalan Poros / Jembatan Penghubung</option>
                    <option value="Sarana Air Bersih">Kerusakan Sarana Air Bersih (SPAM/Sumur)</option>
                    <option value="Bantuan Saprotan">Penyaluran Bantuan Bibit & Saprotan Poktan</option>
                    <option value="Lainnya">Pengaduan Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Judul Pengaduan Singkat *
                  </label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Klarifikasi jadwal sertifikat Lahan Usaha II Blok C"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Uraian Detail Masalah & Kronologis *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Jelaskan nomor kapling, saksi batas, kendala di lapangan, atau kondisi sarana saat ini..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan Resmi</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Info & Standar Pelayanan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>Alur Penanganan Pengaduan Disnakertrans</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Setiap laporan yang masuk akan melewati tahapan verifikasi transparan dan terpantau:
              </p>

              <ol className="space-y-2 text-slate-600 list-decimal list-inside">
                <li>
                  <strong>Penerimaan Berkas (1x24 Jam)</strong>: Sistem mencatat tiket dan menugaskan petugas verifikator bidang.
                </li>
                <li>
                  <strong>Cek Lapangan (3-5 Hari Kerja)</strong>: Tim Disnakertrans berkoordinasi dengan Kepala UPT, juru ukur desa, atau ATR/BPN.
                </li>
                <li>
                  <strong>Tindak Lanjut & Mediasi</strong>: Penerbitan rekomendasi penyelesaian atau perbaikan fasilitas.
                </li>
                <li>
                  <strong>Pelaporan Hasil</strong>: Warga menerima pembaruan status dan berita acara penyelesaian.
                </li>
              </ol>
            </div>

            {/* Rekap Pengaduan Terkini */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs">Daftar Pengaduan Terbuka Terkini</h4>
                <span className="text-[11px] text-slate-400 font-mono">{tickets.length} Tiket</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {tickets.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{t.ticketNumber}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        t.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'Dalam Penanganan' ? 'bg-amber-100 text-amber-800' :
                        t.status === 'Verifikasi Lapangan' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="font-medium text-slate-900 line-clamp-1">{t.judul}</div>
                    <div className="text-[11px] text-slate-500">{t.uptTerkait.split(' (')[0]} &middot; {t.tanggalLapor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Lacak Tiket */}
      {activeTab === 'lacak' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-3xl mx-auto space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base">
              Pelacakan Status Pengaduan Warga
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan nomor tiket pengaduan (contoh: SIAP-2024-0982) atau NIK pelapor untuk memeriksa respons petugas.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Contoh: SIAP-2024-0982 atau 7322051208750001"
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-600"
              />
              <button
                onClick={handleTrack}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Lacak Tiket
              </button>
            </div>

            {/* Quick preset */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <span>Contoh tiket:</span>
              <button 
                onClick={() => { setTrackQuery('SIAP-2024-0982'); }} 
                className="text-emerald-700 hover:underline font-mono cursor-pointer"
              >
                SIAP-2024-0982
              </button>
              <span aria-hidden="true">&middot;</span>
              <button 
                onClick={() => { setTrackQuery('SIAP-2024-1014'); }} 
                className="text-emerald-700 hover:underline font-mono cursor-pointer"
              >
                SIAP-2024-1014
              </button>
            </div>
          </div>

          {/* Tracking Result */}
          {hasTracked && (
            <div className="pt-4 border-t border-slate-100">
              {trackedResult ? (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {trackedResult.ticketNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                        {trackedResult.judul}
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        Pelapor: {trackedResult.namaPelapor} &middot; Lokasi: {trackedResult.uptTerkait} &middot; Tanggal: {trackedResult.tanggalLapor}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-semibold text-xs">
                      {trackedResult.status}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-medium block text-[11px]">Deskripsi Pengaduan:</span>
                    <p className="text-slate-700 leading-relaxed">{trackedResult.deskripsi}</p>
                  </div>

                  {trackedResult.catatanPetugas && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                      <span className="text-emerald-900 font-bold block text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Tanggapan Resmi Petugas Disnakertrans Kab. Luwu Utara:
                      </span>
                      <p className="text-slate-800 leading-relaxed">{trackedResult.catatanPetugas}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                  Nomor tiket &quot;{trackQuery}&quot; tidak ditemukan. Pastikan nomor dimasukkan secara lengkap.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
