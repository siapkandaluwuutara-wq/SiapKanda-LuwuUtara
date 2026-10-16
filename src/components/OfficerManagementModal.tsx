import React, { useState } from 'react';
import { OfficerAccount, OfficerUser, OfficerRole } from '../types';
import { 
  X, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  MapPin, 
  Briefcase, 
  Phone, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface OfficerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: OfficerUser | null;
  officers: OfficerAccount[];
  onUpdateOfficers: (newOfficers: OfficerAccount[]) => void;
}

export const OfficerManagementModal: React.FC<OfficerManagementModalProps> = ({
  isOpen,
  onClose,
  currentOfficer,
  officers,
  onUpdateOfficers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<OfficerAccount | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [alertNotice, setAlertNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<{
    userId: string;
    nip: string;
    name: string;
    role: OfficerRole | string;
    office: string;
    wilayahTugas: string;
    phone: string;
    passwordHash: string;
    status: 'Aktif' | 'Nonaktif';
  }>({
    userId: '',
    nip: '',
    name: '',
    role: 'Petugas Lapangan',
    office: 'Disnakertrans Kab. Luwu Utara',
    wilayahTugas: 'Kecamatan Masamba (UPT Lantang Tallang, Sepakat, Maipi)',
    phone: '',
    passwordHash: '',
    status: 'Aktif'
  });

  if (!isOpen) return null;

  // Notice helper
  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertNotice({ type, text });
    setTimeout(() => {
      setAlertNotice(null);
    }, 3500);
  };

  // Password visibility toggle per row
  const toggleShowPassword = (userId: string) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Open Form to Add
  const handleOpenAdd = () => {
    setEditingTarget(null);
    setFormData({
      userId: 'petugas_' + Math.random().toString(36).substring(2, 6),
      nip: '',
      name: '',
      role: 'Petugas Lapangan',
      office: 'Disnakertrans Kab. Luwu Utara',
      wilayahTugas: 'Kecamatan Masamba (UPT Lantang Tallang, Sepakat, Maipi)',
      phone: '',
      passwordHash: 'lapangan' + new Date().getFullYear(),
      status: 'Aktif'
    });
    setIsEditingModalOpen(true);
  };

  // Open Form to Edit
  const handleOpenEdit = (acc: OfficerAccount) => {
    setEditingTarget(acc);
    setFormData({
      userId: acc.userId,
      nip: acc.nip,
      name: acc.name,
      role: acc.role,
      office: acc.office,
      wilayahTugas: acc.wilayahTugas || '',
      phone: acc.phone || '',
      passwordHash: acc.passwordHash,
      status: acc.status
    });
    setIsEditingModalOpen(true);
  };

  // Save Add or Edit
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUserId = formData.userId.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanNip = formData.nip.trim().replace(/\s+/g, '');
    const cleanName = formData.name.trim();

    if (!cleanUserId) {
      showAlert('error', 'User ID wajib diisi dan tidak boleh kosong.');
      return;
    }
    if (!cleanNip) {
      showAlert('error', 'NIP petugas wajib diisi.');
      return;
    }
    if (!cleanName) {
      showAlert('error', 'Nama lengkap petugas wajib diisi.');
      return;
    }
    if (!formData.passwordHash.trim()) {
      showAlert('error', 'Password tidak boleh kosong.');
      return;
    }

    if (editingTarget) {
      // Editing existing account
      // Check if new userId conflicts with another user
      const conflict = officers.find(
        o => o.userId.toLowerCase() === cleanUserId && o.userId.toLowerCase() !== editingTarget.userId.toLowerCase()
      );
      if (conflict) {
        showAlert('error', `User ID '${cleanUserId}' sudah dipakai oleh petugas lain.`);
        return;
      }

      const updatedList = officers.map(o => {
        if (o.userId.toLowerCase() === editingTarget.userId.toLowerCase()) {
          return {
            ...o,
            userId: cleanUserId,
            nip: cleanNip,
            name: cleanName,
            role: formData.role,
            office: formData.office.trim(),
            wilayahTugas: formData.wilayahTugas.trim(),
            phone: formData.phone.trim(),
            passwordHash: formData.passwordHash.trim(),
            status: formData.status,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });

      onUpdateOfficers(updatedList);
      setIsEditingModalOpen(false);
      showAlert('success', `Data akun User ID '${cleanUserId}' (${cleanName}) berhasil diperbarui.`);
    } else {
      // Adding new account
      const exists = officers.some(
        o => o.userId.toLowerCase() === cleanUserId || o.nip === cleanNip
      );
      if (exists) {
        showAlert('error', `User ID '${cleanUserId}' atau NIP '${cleanNip}' sudah terdaftar.`);
        return;
      }

      const newAccount: OfficerAccount = {
        userId: cleanUserId,
        nip: cleanNip,
        name: cleanName,
        role: formData.role,
        office: formData.office.trim(),
        wilayahTugas: formData.wilayahTugas.trim(),
        phone: formData.phone.trim(),
        passwordHash: formData.passwordHash.trim(),
        status: formData.status,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };

      const updatedList = [...officers, newAccount];
      onUpdateOfficers(updatedList);
      setIsEditingModalOpen(false);
      showAlert('success', `Petugas Lapangan baru '${cleanName}' (User ID: ${cleanUserId}) berhasil ditambahkan.`);
    }
  };

  // Toggle active status
  const handleToggleStatus = (acc: OfficerAccount) => {
    if (acc.isAdmin || acc.nip === '197909202010011002') {
      showAlert('error', 'Akun Administrator Utama tidak dapat dinonaktifkan.');
      return;
    }

    const newStatus: 'Aktif' | 'Nonaktif' = acc.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const updated = officers.map(o => o.userId === acc.userId ? { ...o, status: newStatus } : o);
    onUpdateOfficers(updated);
    showAlert('success', `Status User ID ${acc.userId} diubah menjadi ${newStatus}.`);
  };

  // Delete account
  const handleDeleteAccount = (acc: OfficerAccount) => {
    if (acc.isAdmin || acc.nip === '197909202010011002') {
      showAlert('error', 'Akun Administrator Utama (Iswady, SE) dilindungi dan tidak dapat dihapus.');
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus User ID petugas '${acc.userId}' (${acc.name})?`)) {
      return;
    }

    const filtered = officers.filter(o => o.userId !== acc.userId);
    onUpdateOfficers(filtered);
    showAlert('success', `User ID petugas '${acc.userId}' telah dihapus.`);
  };

  // Filtered officers list
  const filteredOfficers = officers.filter(acc => {
    const matchesSearch = 
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.nip.includes(searchQuery) ||
      (acc.wilayahTugas && acc.wilayahTugas.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = 
      roleFilter === 'all' ? true :
      roleFilter === 'lapangan' ? acc.role === 'Petugas Lapangan' :
      roleFilter === 'admin' ? (acc.isAdmin || acc.role === 'Administrator Utama') :
      acc.role !== 'Petugas Lapangan' && !acc.isAdmin;

    return matchesSearch && matchesRole;
  });

  const totalLapangan = officers.filter(o => o.role === 'Petugas Lapangan').length;
  const totalAktif = officers.filter(o => o.status === 'Aktif').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo
              src="/Luwu_Utara_Logo_(North_Luwu).png"
              alt="Logo Resmi Kabupaten Luwu Utara"
              className="h-11 sm:h-12 w-auto object-contain shrink-0"
              allowZoom={true}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Manajemen User ID Petugas Lapangan
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  Hak Akses Penuh: Administrator Utama
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengaturan hak akses, penambahan, dan pengubahan akun petugas lapangan Disnakertrans Kab. Luwu Utara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer shrink-0"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Identity Banner */}
        <div className="bg-emerald-900 text-white px-5 py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-xs shrink-0">
              IS
            </div>
            <div>
              <span className="font-semibold block text-emerald-100">
                Akun Admin Berwenang: <strong>Iswady, SE</strong> &middot; NIP: 197909202010011002
              </span>
              <span className="text-[11px] text-emerald-300">
                Memiliki hak akses penuh untuk membuat, memperbarui, mengatur password, dan menonaktifkan akun petugas lapangan.
              </span>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-sm transition-colors text-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Tambah Petugas Lapangan</span>
          </button>
        </div>

        {/* Toast Alert */}
        {alertNotice && (
          <div className={`px-5 py-2.5 text-xs flex items-center gap-2 border-b ${
            alertNotice.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            {alertNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{alertNotice.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block font-medium">Total Akun Petugas</span>
              <span className="text-xl font-bold text-slate-900">{officers.length}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sistem SIAP KANDA</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[11px] text-emerald-700 block font-medium">Petugas Lapangan</span>
              <span className="text-xl font-bold text-emerald-900">{totalLapangan}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Pendata & Verifikator Fisik</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[11px] text-blue-700 block font-medium">Status Akun Aktif</span>
              <span className="text-xl font-bold text-blue-900">{totalAktif}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Bisa Login Petugas</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="text-[11px] text-purple-700 block font-medium">Administrator Utama</span>
              <span className="text-xs font-bold text-purple-900 block truncate">Iswady, SE</span>
              <span className="text-[10px] text-purple-600 font-mono block">NIP: 197909202010011002</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan User ID, NIP, Nama Petugas, atau Wilayah Tugas..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="all">Semua Peran ({officers.length})</option>
                <option value="lapangan">Petugas Lapangan ({totalLapangan})</option>
                <option value="admin">Administrator Utama</option>
              </select>
            </div>
          </div>

          {/* Officers Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User ID & NIP</th>
                    <th className="py-3 px-4">Nama Petugas & Gelar</th>
                    <th className="py-3 px-4">Peran & Akses</th>
                    <th className="py-3 px-4">Wilayah Tugas / UPT</th>
                    <th className="py-3 px-4">Kata Sandi</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOfficers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada akun petugas yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOfficers.map((acc) => {
                      const isMainAdmin = acc.isAdmin || acc.nip === '197909202010011002';
                      const isPwdVisible = !!showPasswords[acc.userId];

                      return (
                        <tr 
                          key={acc.userId}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isMainAdmin ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          {/* User ID & NIP */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                {acc.userId}
                              </span>
                              {isMainAdmin && (
                                <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded uppercase">
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 block mt-1">
                              NIP: {acc.nip}
                            </span>
                          </td>

                          {/* Name */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">
                              {acc.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                              {acc.office}
                            </span>
                            {acc.phone && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5 text-slate-400" />
                                {acc.phone}
                              </span>
                            )}
                          </td>

                          {/* Role */}
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isMainAdmin 
                                ? 'bg-purple-100 text-purple-900 border-purple-200' 
                                : acc.role === 'Petugas Lapangan'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                                : 'bg-blue-100 text-blue-900 border-blue-200'
                            }`}>
                              {acc.role}
                            </span>
                          </td>

                          {/* Wilayah Tugas */}
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-1 max-w-xs">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-slate-700 font-medium">
                                {acc.wilayahTugas || 'Wilayah Umum Luwu Utara'}
                              </span>
                            </div>
                          </td>

                          {/* Password */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                                {isPwdVisible ? acc.passwordHash : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleShowPassword(acc.userId)}
                                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                title={isPwdVisible ? 'Sembunyikan password' : 'Lihat password'}
                              >
                                {isPwdVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleStatus(acc)}
                              disabled={isMainAdmin}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                acc.status === 'Aktif'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              } ${isMainAdmin ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                              title={isMainAdmin ? 'Akun Admin selalu aktif' : 'Klik untuk ganti status'}
                            >
                              {acc.status}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(acc)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                                title="Ubah User ID, nama, password, atau penugasan"
                              >
                                <Edit3 className="w-3 h-3 text-amber-600" />
                                <span>Edit</span>
                              </button>

                              {!isMainAdmin && (
                                <button
                                  onClick={() => handleDeleteAccount(acc)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                                  title="Hapus akun petugas ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Notice Info */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">
                Hak Khusus Administrator (Iswady, SE):
              </span>
              <p className="text-[11px] leading-relaxed">
                Setiap penambahan atau perubahan User ID, NIP, maupun kata sandi petugas lapangan akan langsung disimpan ke memori aplikasi (localStorage) dan dapat langsung digunakan oleh petugas lapangan untuk login, menginput data transmigran, dan mengunggah foto.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Total {officers.length} akun terdaftar di Dinas Tenaga Kerja dan Transmigrasi Kab. Luwu Utara
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup Panel
          </button>
        </div>
      </div>

      {/* Nested Add / Edit Officer Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {editingTarget ? 'Edit Akun & User ID Petugas' : 'Tambah Petugas Lapangan Baru'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Otoritas Administrator Utama: Iswady, SE
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    User ID Petugas (Login): *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Contoh: petugas_masamba"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Gunakan huruf kecil tanpa spasi
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    NIP Petugas: *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 199208242018031002"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Lengkap & Gelar Petugas: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rahmat Hidayat, S.P."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Peran / Jabatan: *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as OfficerRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                  >
                    <option value="Petugas Lapangan">Petugas Lapangan (Pendata Lapangan)</option>
                    <option value="Petugas Verifikator">Petugas Verifikator Warkah</option>
                    <option value="Kepala Bidang">Kepala Bidang</option>
                    <option value="Administrator Utama">Administrator Utama (Akses Penuh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Kata Sandi (Password): *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.passwordHash}
                      onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                      placeholder="Masukkan password"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Wilayah Penugasan / UPT:
                </label>
                <input
                  type="text"
                  value={formData.wilayahTugas}
                  onChange={(e) => setFormData({ ...formData, wilayahTugas: e.target.value })}
                  placeholder="Contoh: UPT Lantang Tallang, Sepakat, Buso"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Unit Kerja / Kantor:
                  </label>
                  <input
                    type="text"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    placeholder="Disnakertrans Luwu Utara"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Status Akun:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                  >
                    <option value="Aktif">Aktif (Dapat Login)</option>
                    <option value="Nonaktif">Nonaktif (Dibekukan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nomor Telepon / WhatsApp:
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contoh: 0812-xxxx-xxxx"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingTarget ? 'Simpan Perubahan Akun' : 'Tambahkan Akun Petugas'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
