/**
 * Data Geospasial SIPUKAT Transmigrasi Kabupaten Luwu Utara
 * Sesuai standar Sistem Informasi Perencanaan Kawasan Transmigrasi Terpadu (SIPUKAT)
 * Sumber rujukan: https://sipukat.transmigrasi.go.id/petaterpadu.php?v=2021
 */

export interface BasemapOption {
  id: string;
  name: string;
  category: 'satellite' | 'street' | 'topo' | 'dark';
  url: string;
  attribution: string;
  maxZoom: number;
  previewColor: string;
}

export const BASEMAP_OPTIONS: BasemapOption[] = [
  {
    id: 'satellite',
    name: 'Citra Satelit Realistis (Esri HD)',
    category: 'satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, IGP, GIS User Community',
    maxZoom: 19,
    previewColor: '#1e3a1e'
  },
  {
    id: 'topo',
    name: 'Topografi & Kontur Medan (Esri Topo)',
    category: 'topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey',
    maxZoom: 18,
    previewColor: '#8a7d58'
  },
  {
    id: 'osm',
    name: 'Peta Jalan Standar (Kemendesa/OSM)',
    category: 'street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    previewColor: '#589178'
  },
  {
    id: 'dark',
    name: 'Geospasial Modern Dark GIS',
    category: 'dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
    maxZoom: 19,
    previewColor: '#0f172a'
  }
];

// Koordinat Batas Wilayah Luwu Utara
export const LUWU_UTARA_CENTER: [number, number] = [-2.4200, 120.1500];
export const MASAMBA_CENTER: [number, number] = [-2.5050, 120.3500];
export const SEKO_CENTER: [number, number] = [-2.3095, 119.9108];

// Batas Deliniasi Poligon Kawasan Masamba (Kecamatan Masamba, Baebunta, Sukamaju, Bone-Bone)
export const KAWASAN_MASAMBA_POLYGON: [number, number][] = [
  [-2.4500, 120.2100],
  [-2.4500, 120.5300],
  [-2.5700, 120.5300],
  [-2.5700, 120.2100]
];

// Batas Deliniasi Poligon Kawasan Seko (Dataran Tinggi Seko Padang & Lodang/Hoyane)
export const KAWASAN_SEKO_POLYGON: [number, number][] = [
  [-2.2300, 119.8500],
  [-2.2300, 119.9700],
  [-2.3800, 119.9700],
  [-2.3800, 119.8500]
];

// Deliniasi Poligon HPL Transmigrasi (Hak Pengelolaan Lahan) per UPT disesuaikan koordinat presisi
export const UPT_HPL_POLYGONS: Record<string, { name: string; polygon: [number, number][]; areaHa: number; skNumber: string }> = {
  'upt-lantang-tallang': {
    name: 'Deliniasi HPL UPT Lantang Tallang',
    skNumber: 'SK.HPL/BPN-LUTRA/1993-018',
    areaHa: 2750,
    polygon: [
      [-2.4720, 120.3380],
      [-2.4730, 120.3660],
      [-2.4960, 120.3660],
      [-2.4960, 120.3380]
    ]
  },
  'upt-sepakat': {
    name: 'Deliniasi HPL UPT Sepakat',
    skNumber: 'SK.HPL/BPN-LUTRA/1997-024',
    areaHa: 2460,
    polygon: [
      [-2.4820, 120.3600],
      [-2.4830, 120.3890],
      [-2.5070, 120.3890],
      [-2.5070, 120.3600]
    ]
  },
  'upt-maipi': {
    name: 'Deliniasi HPL UPT Maipi',
    skNumber: 'SK.HPL/BPN-LUTRA/1999-031',
    areaHa: 2180,
    polygon: [
      [-2.4700, 120.2850],
      [-2.4710, 120.3140],
      [-2.4940, 120.3140],
      [-2.4940, 120.2850]
    ]
  },
  'upt-buso': {
    name: 'Deliniasi HPL UPT Buso',
    skNumber: 'SK.HPL/BPN-LUTRA/2002-042',
    areaHa: 2050,
    polygon: [
      [-2.5210, 120.2250],
      [-2.5220, 120.2540],
      [-2.5450, 120.2540],
      [-2.5450, 120.2250]
    ]
  },
  'upt-pongkase': {
    name: 'Deliniasi HPL UPT Pongkase',
    skNumber: 'SK.HPL/BPN-LUTRA/2005-055',
    areaHa: 2280,
    polygon: [
      [-2.5270, 120.4230],
      [-2.5280, 120.4520],
      [-2.5510, 120.4520],
      [-2.5510, 120.4230]
    ]
  },
  'upt-bantimurung': {
    name: 'Deliniasi HPL UPT Bantimurung',
    skNumber: 'SK.HPL/BPN-LUTRA/2007-063',
    areaHa: 2200,
    polygon: [
      [-2.5280, 120.4870],
      [-2.5290, 120.5160],
      [-2.5530, 120.5160],
      [-2.5530, 120.4870]
    ]
  },
  'upt-seko-padang': {
    name: 'Deliniasi HPL UPT Seko Padang (Sentral)',
    skNumber: 'SK.HPL/BPN-LUTRA/2012-088',
    areaHa: 2580,
    polygon: [
      [-2.2600, 119.8730],
      [-2.2610, 119.9020],
      [-2.2900, 119.9020],
      [-2.2890, 119.8730]
    ]
  },
  'upt-seko-hoyane': {
    name: 'Deliniasi HPL UPT Lodang / Hoyane',
    skNumber: 'SK.HPL/BPN-LUTRA/2016-104',
    areaHa: 1950,
    polygon: [
      [-2.3300, 119.9190],
      [-2.3310, 119.9480],
      [-2.3580, 119.9480],
      [-2.3580, 119.9190]
    ]
  }
};

// Jalur Poros Transportasi Utama (Jalan Nasional & Jalur Penghubung Lembah-Dataran Tinggi)
export const ROAD_NETWORKS = [
  {
    name: 'Jalan Poros Trans Sulawesi (Palopo - Masamba - Bone-Bone - Malili)',
    category: 'nasional',
    color: '#38bdf8',
    weight: 3.5,
    dashArray: '2, 0',
    coordinates: [
      [-2.5800, 120.1900],
      [-2.5500, 120.2200],
      [-2.5330, 120.2396], // Buso
      [-2.5050, 120.3300], // Masamba
      [-2.4947, 120.3748], // Sepakat
      [-2.5392, 120.4376], // Pongkase
      [-2.5406, 120.5017], // Bantimurung
      [-2.5600, 120.6000]  // Ke Luwu Timur
    ] as [number, number][]
  },
  {
    name: 'Poros Strategis Rute Perintisan Lembah ke Dataran Tinggi Seko (Sabbang - Rongkong - Seko)',
    category: 'strategis',
    color: '#fbbf24',
    weight: 3,
    dashArray: '6, 6',
    coordinates: [
      [-2.5050, 120.3300], // Masamba
      [-2.4821, 120.2996], // Maipi
      [-2.4300, 120.2000], // Rongkong
      [-2.3800, 120.1000], // Lembah Rongkong Atas
      [-2.3440, 119.9337], // Lodang
      [-2.2749, 119.8879]  // Seko Padang
    ] as [number, number][]
  }
];

// Jaringan Aliran Sungai (Sungai Masamba & Sungai Rongkong)
export const RIVER_NETWORKS = [
  {
    name: 'Daerah Aliran Sungai (DAS) Masamba',
    color: '#0284c7',
    weight: 2.2,
    coordinates: [
      [-2.4200, 120.3100],
      [-2.4700, 120.3200],
      [-2.5320, 120.3210],
      [-2.5580, 120.3350],
      [-2.6200, 120.3600],
      [-2.6900, 120.3900]
    ] as [number, number][]
  },
  {
    name: 'Aliran Sungai Rongkong & Seko',
    color: '#0369a1',
    weight: 2.5,
    coordinates: [
      [-2.1600, 119.9400],
      [-2.2500, 119.9900],
      [-2.3500, 120.0700],
      [-2.4500, 120.1500],
      [-2.5300, 120.2100],
      [-2.6300, 120.2600]
    ] as [number, number][]
  }
];

// Titik Fasilitas Penting di Kawasan
export const IMPORTANT_LANDMARKS = [
  {
    id: 'kantor-bupati',
    name: 'Kantor Bupati & Pemda Luwu Utara',
    category: 'pemerintahan',
    lat: -2.5601,
    lng: 120.3255
  },
  {
    id: 'disnakertrans',
    name: 'Disnakertrans Kab. Luwu Utara',
    category: 'dinas',
    lat: -2.5620,
    lng: 120.3290
  },
  {
    id: 'bandara-andi-djemma',
    name: 'Bandara Domestik Andi Djemma Masamba',
    category: 'transportasi',
    lat: -2.5562,
    lng: 120.3278
  },
  {
    id: 'bandara-seko',
    name: 'Bandar Udara Perintis Seko (Seko Padang)',
    category: 'transportasi',
    lat: -2.1705,
    lng: 119.9675
  }
];
