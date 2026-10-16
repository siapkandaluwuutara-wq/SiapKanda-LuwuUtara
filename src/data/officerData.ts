import { OfficerAccount } from '../types';

export const INITIAL_OFFICER_ACCOUNTS: OfficerAccount[] = [
  {
    userId: 'iswady_admin',
    nip: '197909202010011002',
    name: 'Iswady, SE',
    role: 'Administrator Utama',
    office: 'Disnakertrans Kab. Luwu Utara (Administrator Sistem & Pembina Teknis)',
    passwordHash: '15w4dhy',
    status: 'Aktif',
    wilayahTugas: 'Seluruh Kawasan Luwu Utara (Hak Akses Penuh)',
    phone: '0812-4211-9890',
    isAdmin: true,
    createdAt: '2026-01-01'
  },
  {
    userId: 'petugas_lapangan',
    nip: '199208242018031002',
    name: 'Rahmat Hidayat, S.P.',
    role: 'Petugas Lapangan',
    office: 'Koordinator Lapangan Kawasan Masamba & Baebunta',
    passwordHash: 'seko2026',
    status: 'Aktif',
    wilayahTugas: 'UPT Lantang Tallang, UPT Sepakat & UPT Buso',
    phone: '0821-9876-1234',
    isAdmin: false,
    createdAt: '2026-02-15'
  },
  {
    userId: 'petugas_sukamaju',
    nip: '199503152021021003',
    name: 'Andi Baso Tenri, S.ST.',
    role: 'Petugas Lapangan',
    office: 'Petugas Lapangan Wilayah Sukamaju & Bone-Bone',
    passwordHash: 'lapangan2026',
    status: 'Aktif',
    wilayahTugas: 'UPT Pongkase & UPT Bantimurung',
    phone: '0853-4412-8877',
    isAdmin: false,
    createdAt: '2026-03-01'
  },
  {
    userId: 'petugas_seko',
    nip: '199011042019031005',
    name: 'Hasanuddin, S.Hut.',
    role: 'Petugas Lapangan',
    office: 'Petugas Lapangan Kawasan Seko (Wilayah Terisolir)',
    passwordHash: 'seko123',
    status: 'Aktif',
    wilayahTugas: 'UPT Eno & UPT Lodang (Kawasan Seko)',
    phone: '0813-5599-2233',
    isAdmin: false,
    createdAt: '2026-01-20'
  },
  {
    userId: 'petugas_disnakertrans',
    nip: '198507142010011008',
    name: 'Ir. A. Mappanyukki, S.T.',
    role: 'Petugas Verifikator',
    office: 'Seksi Penataan Persebaran & Sertifikasi Disnakertrans Luwu Utara',
    passwordHash: 'masamba2026',
    status: 'Aktif',
    wilayahTugas: 'Verifikasi Berkas Warkah & SHM',
    phone: '0811-4455-6677',
    isAdmin: false,
    createdAt: '2026-01-10'
  }
];

const STORAGE_KEY = 'siapkanda_officer_accounts_v2';

export function getStoredOfficers(): OfficerAccount[] {
  if (typeof window === 'undefined') return INITIAL_OFFICER_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OFFICER_ACCOUNTS));
      return INITIAL_OFFICER_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OFFICER_ACCOUNTS));
      return INITIAL_OFFICER_ACCOUNTS;
    }

    // Ensure Iswady, SE is always present and updated to user's specification
    const hasIswady = parsed.find(
      (acc: OfficerAccount) => acc.nip === '197909202010011002' || acc.userId === 'iswady_admin'
    );
    if (!hasIswady) {
      const merged = [INITIAL_OFFICER_ACCOUNTS[0], ...parsed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } else {
      // Keep Iswady's official requested data updated
      hasIswady.name = 'Iswady, SE';
      hasIswady.nip = '197909202010011002';
      hasIswady.passwordHash = '15w4dhy';
      hasIswady.role = 'Administrator Utama';
      hasIswady.isAdmin = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    }
  } catch {
    return INITIAL_OFFICER_ACCOUNTS;
  }
}

export function saveStoredOfficers(accounts: OfficerAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save officer accounts:', err);
  }
}
