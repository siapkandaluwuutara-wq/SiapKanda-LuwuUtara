export type KawasanName = 'Kawasan Masamba' | 'Kawasan Seko';

export type KawasanInfo = {
  id: string;
  name: KawasanName;
  uptCount: number;
  description: string;
  totalKK: number;
  totalAreaHa: number;
  primaryCommodities: string[];
};

export type OfficerRole = 'Administrator Utama' | 'Petugas Verifikator' | 'Kepala Bidang' | 'Petugas Lapangan';

export type OfficerUser = {
  userId: string;
  nip: string;
  name: string;
  role: OfficerRole | string;
  office: string;
  loginTime?: string;
  isAdmin?: boolean;
};

export type OfficerAccount = OfficerUser & {
  passwordHash: string;
  status: 'Aktif' | 'Nonaktif';
  wilayahTugas?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PortalImages = {
  heroBanner: string;
  commodityKakao: string;
  infrastructure: string;
  logoUrl?: string;
  uptImages: Record<string, string>;
};

export type UPTRegion = {
  id: string;
  name: string;
  kawasan: KawasanName;
  district: string; // Kecamatan di Luwu Utara
  yearEstablished: number;
  totalKK: number;
  totalSouls: number;
  totalAreaHa: number; // Hektar
  tpaCount: number; // Transmigran Penduduk Asal (luar Sulawesi)
  tpsCount: number; // Transmigran Penduduk Setempat (lokal Luwu Utara)
  originProvinces: string[];
  primaryCommodity: string;
  secondaryCommodity: string;
  shmCompletedPercentage: number;
  roadCondition: 'Baik' | 'Sedang' | 'Perlu Perbaikan';
  waterAccessPercentage: number;
  electricityPercentage: number;
  coordinates: { x: number; y: number; lat: number; lng: number }; // X, Y for custom vector map + geo coordinates
  healthFacility: string;
  educationFacility: string;
  description: string;
  fotoKawasanUrl?: string;
};

export type TransmigrantKK = {
  id: string;
  registrationNumber: string;
  nikKepalaKeluarga: string;
  namaKepalaKeluarga: string;
  namaPasangan?: string;
  jumlahAnggota: number;
  kawasan: KawasanName;
  uptId: string;
  uptName: string;
  blokNomor: string;
  tahunPenempatan: number;
  asalKategori: 'TPA' | 'TPS';
  provinsiAsal: string;
  kabupatenAsal: string;
  statusSertifikat: 'SHM Terbit' | 'Proses BPN' | 'Verifikasi HPL' | 'Kendala Batas';
  nomorSHM?: string;
  luasLahanPekaranganHa: number; // LP
  luasLahanUsaha1Ha: number;     // LU I
  luasLahanUsaha2Ha: number;     // LU II
  komoditasDikelola: string[];
  kelompokTani: string;
  bantuanSaprotanTerima: string[];
  fotoLahanUrl?: string;
  fotoRumahUrl?: string;
  tanggalUpdateTerakhir?: string;
  petugasPengubah?: string;
};

export type CommodityStat = {
  id: string;
  name: string;
  category: 'Perkebunan' | 'Pangan' | 'Hortikultura';
  kawasanFocus: string;
  totalAreaHa: number;
  annualProductionTon: number;
  avgYieldPerHaTon: number;
  localPricePerKg: number;
  activePoktanCount: number;
  processingCenters: string[];
  leadSubdistricts: string[];
  trendPercentage: number;
  fotoUrl?: string;
};

export type InfrastructureItem = {
  id: string;
  uptId: string;
  uptName: string;
  kawasan: KawasanName;
  category: 'Jalan & Jembatan' | 'Air Bersih' | 'Listrik & Penerangan' | 'Pemukiman' | 'Fasilitas Sosial';
  name: string;
  spec: string;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat' | 'Perlu Perbaikan';
  completionRate: number; // 0 - 100%
  targetYear: number;
  fundedBy: 'APBN' | 'APBD Prov' | 'APBD Luwu Utara' | 'Dana Desa / Swadaya';
  lastInspected: string;
  fotoUrl?: string;
};

export type PublicFeedbackTicket = {
  id: string;
  ticketNumber: string;
  namaPelapor: string;
  nikPelapor: string;
  kontak: string;
  kawasan: KawasanName;
  uptTerkait: string;
  kategori: 'Sengketa Batas Tanah' | 'Keterlambatan SHM' | 'Jalan Rusak' | 'Sarana Air Bersih' | 'Bantuan Saprotan' | 'Lainnya';
  judul: string;
  deskripsi: string;
  tanggalLapor: string;
  status: 'Diterima' | 'Verifikasi Lapangan' | 'Dalam Penanganan' | 'Selesai';
  catatanPetugas?: string;
  petugasPenindak?: string;
  tanggalUpdate?: string;
};
