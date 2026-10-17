import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UPTRegion, KawasanName, OfficerUser } from '../types';
import { 
  BASEMAP_OPTIONS, 
  KAWASAN_MASAMBA_POLYGON, 
  KAWASAN_SEKO_POLYGON, 
  UPT_HPL_POLYGONS, 
  ROAD_NETWORKS, 
  RIVER_NETWORKS, 
  IMPORTANT_LANDMARKS,
  LUWU_UTARA_CENTER,
  MASAMBA_CENTER,
  SEKO_CENTER
} from '../data/geospatialData';
import { 
  MapPin, 
  Layers, 
  Search, 
  Info, 
  CheckCircle2, 
  Droplets, 
  Zap, 
  School, 
  Activity, 
  Compass, 
  X, 
  ExternalLink, 
  ChevronRight, 
  Mountain, 
  Building2,
  Edit3,
  Maximize2,
  Minimize2,
  Eye,
  Ruler,
  Navigation,
  Globe2,
  Sparkles,
  FileText,
  Map as MapIcon,
  HelpCircle
} from 'lucide-react';

interface InteractiveMapProps {
  uptList: UPTRegion[];
  selectedUPT: UPTRegion | null;
  onSelectUPT: (upt: UPTRegion | null) => void;
  onNavigateTab: (tab: string) => void;
  currentOfficer?: OfficerUser | null;
  onEditUPT?: (upt: UPTRegion) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  uptList,
  selectedUPT,
  onSelectUPT,
  onNavigateTab,
  currentOfficer,
  onEditUPT
}) => {
  const isMainAdmin = Boolean(
    currentOfficer?.isAdmin || 
    currentOfficer?.nip === '197909202010011002' || 
    currentOfficer?.role === 'Administrator Utama'
  );

  // Filter States
  const [filterKawasan, setFilterKawasan] = useState<'all' | KawasanName>('all');
  const [filterCommodity, setFilterCommodity] = useState<string>('all');
  const [filterSHM, setFilterSHM] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThematicMode, setActiveThematicMode] = useState<'kawasan' | 'shm' | 'jalan'>('kawasan');

  // GIS Controls
  const [activeBasemap, setActiveBasemap] = useState<string>('satellite');
  const [showKawasanPolygons, setShowKawasanPolygons] = useState<boolean>(true);
  const [showHPLPolygons, setShowHPLPolygons] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'gis' | 'vector'>('gis');
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Leaflet map container & instances ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const basemapLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonsGroupRef = useRef<L.LayerGroup | null>(null);
  const roadsGroupRef = useRef<L.LayerGroup | null>(null);
  const measureGroupRef = useRef<L.LayerGroup | null>(null);

  // Filtered UPTs
  const filteredUPTs = uptList.filter((upt) => {
    const matchesKawasan = filterKawasan === 'all' || upt.kawasan === filterKawasan;
    const matchesSearch =
      upt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upt.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upt.kawasan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCommodity =
      filterCommodity === 'all' ||
      upt.primaryCommodity.toLowerCase().includes(filterCommodity.toLowerCase()) ||
      upt.secondaryCommodity.toLowerCase().includes(filterCommodity.toLowerCase());

    const matchesSHM =
      filterSHM === 'all' ||
      (filterSHM === 'high' && upt.shmCompletedPercentage >= 90) ||
      (filterSHM === 'medium' && upt.shmCompletedPercentage >= 70 && upt.shmCompletedPercentage < 90) ||
      (filterSHM === 'low' && upt.shmCompletedPercentage < 70);

    return matchesKawasan && matchesSearch && matchesCommodity && matchesSHM;
  });

  // Calculate Haversine distance in km
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (viewMode !== 'gis' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: LUWU_UTARA_CENTER,
        zoom: 9,
        minZoom: 8,
        maxZoom: 18,
        zoomControl: false // custom position
      });

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Track cursor position
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords({
          lat: Math.round(e.latlng.lat * 10000) / 10000,
          lng: Math.round(e.latlng.lng * 10000) / 10000
        });
      });

      map.on('mouseout', () => {
        setCursorCoords(null);
      });

      // Map click handler for measurement
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (!isMeasuring) return;
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMeasurePoints(prev => {
          const updated = [...prev, newPoint];
          if (updated.length >= 2) {
            const p1 = updated[updated.length - 2];
            const p2 = updated[updated.length - 1];
            const dist = calculateDistanceKm(p1[0], p1[1], p2[0], p2[1]);
            setDistanceInfo(`Jarak Titik Ukur: ${dist} km`);
          }
          return updated;
        });
      });

      // Layer groups
      markersGroupRef.current = L.layerGroup().addTo(map);
      polygonsGroupRef.current = L.layerGroup().addTo(map);
      roadsGroupRef.current = L.layerGroup().addTo(map);
      measureGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    // Update Basemap tile layer
    const currentBasemapCfg = BASEMAP_OPTIONS.find(b => b.id === activeBasemap) || BASEMAP_OPTIONS[0];
    if (basemapLayerRef.current) {
      mapInstanceRef.current?.removeLayer(basemapLayerRef.current);
    }
    const tileLayer = L.tileLayer(currentBasemapCfg.url, {
      attribution: currentBasemapCfg.attribution,
      maxZoom: currentBasemapCfg.maxZoom
    });
    tileLayer.addTo(mapInstanceRef.current!);
    basemapLayerRef.current = tileLayer;

    // Invalidate map size after render
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

  }, [viewMode, activeBasemap]);

  // 2. Render Polygons, Roads, and Rivers
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonsGroupRef.current || !roadsGroupRef.current) return;

    polygonsGroupRef.current.clearLayers();
    roadsGroupRef.current.clearLayers();

    // A. Deliniasi Kawasan Masamba
    if (showKawasanPolygons && (filterKawasan === 'all' || filterKawasan === 'Kawasan Masamba')) {
      const masambaPoly = L.polygon(KAWASAN_MASAMBA_POLYGON, {
        color: '#10b981',
        weight: 2.5,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.15
      });
      masambaPoly.bindTooltip('<b>ZONASI KAWASAN MASAMBA</b><br/>6 UPT Agribisnis Terpadu Lembah', {
        permanent: false,
        direction: 'center',
        className: 'gis-poly-tooltip'
      });
      polygonsGroupRef.current.addLayer(masambaPoly);
    }

    // B. Deliniasi Kawasan Seko
    if (showKawasanPolygons && (filterKawasan === 'all' || filterKawasan === 'Kawasan Seko')) {
      const sekoPoly = L.polygon(KAWASAN_SEKO_POLYGON, {
        color: '#f59e0b',
        weight: 2.5,
        dashArray: '6, 6',
        fillColor: '#f59e0b',
        fillOpacity: 0.15
      });
      sekoPoly.bindTooltip('<b>ZONASI KAWASAN SEKO</b><br/>2 UPT Dataran Tinggi & Kopi Organik', {
        permanent: false,
        direction: 'center',
        className: 'gis-poly-tooltip'
      });
      polygonsGroupRef.current.addLayer(sekoPoly);
    }

    // C. Deliniasi HPL Per UPT
    if (showHPLPolygons) {
      filteredUPTs.forEach(upt => {
        const hpl = UPT_HPL_POLYGONS[upt.id];
        if (hpl) {
          const isSelected = selectedUPT?.id === upt.id;
          const isMasamba = upt.kawasan === 'Kawasan Masamba';
          const hplColor = isSelected ? '#38bdf8' : isMasamba ? '#059669' : '#d97706';

          const hplPoly = L.polygon(hpl.polygon, {
            color: hplColor,
            weight: isSelected ? 3 : 1.8,
            dashArray: '4, 4',
            fillColor: hplColor,
            fillOpacity: isSelected ? 0.35 : 0.18
          });

          hplPoly.on('click', () => {
            onSelectUPT(upt);
          });

          hplPoly.bindTooltip(`<b>${hpl.name}</b><br/>SK: ${hpl.skNumber}<br/>Luas: ${hpl.areaHa} Ha &middot; SHM: ${upt.shmCompletedPercentage}%`, {
            sticky: true,
            className: 'gis-poly-tooltip'
          });

          polygonsGroupRef.current?.addLayer(hplPoly);
        }
      });
    }

    // D. Jaringan Jalan Poros
    if (showRoads) {
      ROAD_NETWORKS.forEach(road => {
        const roadLine = L.polyline(road.coordinates, {
          color: road.color,
          weight: road.weight,
          dashArray: road.dashArray,
          opacity: 0.85
        });
        roadLine.bindTooltip(`<b>${road.name}</b>`, { sticky: true });
        roadsGroupRef.current?.addLayer(roadLine);
      });
    }

    // E. Aliran Sungai
    if (showRivers) {
      RIVER_NETWORKS.forEach(river => {
        const riverLine = L.polyline(river.coordinates, {
          color: river.color,
          weight: river.weight,
          opacity: 0.75
        });
        riverLine.bindTooltip(`<b>${river.name}</b>`, { sticky: true });
        roadsGroupRef.current?.addLayer(riverLine);
      });
    }

    // F. Landmark Penting
    if (showLandmarks) {
      IMPORTANT_LANDMARKS.forEach(lm => {
        const iconHtml = `
          <div style="background-color: #0f172a; border: 2px solid #38bdf8; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: white; font-size: 10px;">
            ★
          </div>
        `;
        const landmarkIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-landmark-icon',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon });
        marker.bindTooltip(`<b>${lm.name}</b><br/><span style="color:#38bdf8;font-size:10px;">Fasilitas Wilayah Luwu Utara</span>`, {
          direction: 'top'
        });
        roadsGroupRef.current?.addLayer(marker);
      });
    }

  }, [
    showKawasanPolygons, 
    showHPLPolygons, 
    showRoads, 
    showRivers, 
    showLandmarks, 
    filteredUPTs, 
    selectedUPT, 
    filterKawasan
  ]);

  // 3. Render UPT Thematic Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredUPTs.forEach(upt => {
      const isSelected = selectedUPT?.id === upt.id;
      const isMasamba = upt.kawasan === 'Kawasan Masamba';

      // Determine marker accent color based on thematic mode
      let markerColor = isMasamba ? '#10b981' : '#f59e0b';
      let statusBadge = upt.kawasan === 'Kawasan Masamba' ? 'Masamba' : 'Seko';

      if (activeThematicMode === 'shm') {
        if (upt.shmCompletedPercentage >= 90) {
          markerColor = '#10b981'; // Green
          statusBadge = `${upt.shmCompletedPercentage}% SHM`;
        } else if (upt.shmCompletedPercentage >= 75) {
          markerColor = '#0284c7'; // Blue
          statusBadge = `${upt.shmCompletedPercentage}% SHM`;
        } else {
          markerColor = '#f59e0b'; // Amber
          statusBadge = `${upt.shmCompletedPercentage}% SHM`;
        }
      } else if (activeThematicMode === 'jalan') {
        if (upt.roadCondition === 'Baik') {
          markerColor = '#10b981';
          statusBadge = 'Poros Baik';
        } else if (upt.roadCondition === 'Sedang') {
          markerColor = '#f59e0b';
          statusBadge = 'Poros Sedang';
        } else {
          markerColor = '#ef4444';
          statusBadge = 'Perlu Perbaikan';
        }
      }

      // Modern SVG Pin Marker HTML
      const pinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          ${isSelected ? `
            <div style="position: absolute; top: -6px; width: 44px; height: 44px; border-radius: 9999px; background: ${markerColor}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          ` : ''}
          <div style="
            background: linear-gradient(135deg, ${markerColor}, #0f172a);
            border: 2px solid ${isSelected ? '#ffffff' : markerColor};
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: ${isSelected ? '12px' : '10px'};
            transition: transform 0.2s;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          ">
            ${isMasamba ? 'M' : 'S'}
          </div>
          <div style="
            margin-top: 3px;
            background: rgba(15, 23, 42, 0.88);
            backdrop-filter: blur(4px);
            border: 1px solid ${isSelected ? '#38bdf8' : '#334155'};
            color: ${isSelected ? '#ffffff' : '#e2e8f0'};
            padding: 2px 7px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          ">
            ${upt.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-gis-upt-pin',
        iconSize: [80, 56],
        iconAnchor: [40, 20]
      });

      const marker = L.marker([upt.coordinates.lat, upt.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 500
      });

      // Marker click selects UPT
      marker.on('click', () => {
        onSelectUPT(upt);
      });

      // Rich SIPUKAT Styled Popup
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.4; color: #0f172a; min-width: 230px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${isMasamba ? '#ecfdf5' : '#fffbeb'}; color: ${isMasamba ? '#065f46' : '#92400e'}; border: 1px solid ${isMasamba ? '#a7f3d0' : '#fde68a'}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${upt.kawasan}
            </span>
            <span style="font-size: 10px; color: #64748b;">${statusBadge}</span>
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
            ${upt.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${upt.district} &middot; Penempatan ${upt.yearEstablished}
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Luas Wilayah HPL:</span>
              <span style="font-weight: 700; color: #0f172a;">${upt.totalAreaHa.toLocaleString('id-ID')} Ha</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Jumlah KK:</span>
              <span style="font-weight: 700; color: #0f172a;">${upt.totalKK} KK (${upt.totalSouls} Jiwa)</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Sertifikasi SHM:</span>
              <span style="font-weight: 800; color: #059669;">${upt.shmCompletedPercentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Komoditas:</span>
              <span style="font-weight: 600; color: #0f172a; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${upt.primaryCommodity}
              </span>
            </div>
          </div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px; background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            📍 Lat: ${upt.coordinates.lat} &middot; Lng: ${upt.coordinates.lng}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -16],
        className: 'custom-sipukat-popup'
      });

      markersGroupRef.current?.addLayer(marker);
    });

  }, [filteredUPTs, selectedUPT, activeThematicMode]);

  // 4. Center map when selectedUPT changes or filterKawasan changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedUPT) {
      mapInstanceRef.current.flyTo(
        [selectedUPT.coordinates.lat, selectedUPT.coordinates.lng],
        12,
        { duration: 1.2 }
      );
    }
  }, [selectedUPT]);

  // Fit bounds preset handlers
  const handleFitLuwuUtara = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(LUWU_UTARA_CENTER, 9, { duration: 1 });
  };

  const handleFitMasamba = () => {
    if (!mapInstanceRef.current) return;
    setFilterKawasan('Kawasan Masamba');
    mapInstanceRef.current.flyTo(MASAMBA_CENTER, 11, { duration: 1.2 });
  };

  const handleFitSeko = () => {
    if (!mapInstanceRef.current) return;
    setFilterKawasan('Kawasan Seko');
    mapInstanceRef.current.flyTo(SEKO_CENTER, 11, { duration: 1.2 });
  };

  // Measure distance from selected UPT to Masamba Center
  const handleMeasureToCapital = () => {
    if (!selectedUPT) return;
    const dist = calculateDistanceKm(
      selectedUPT.coordinates.lat,
      selectedUPT.coordinates.lng,
      MASAMBA_CENTER[0],
      MASAMBA_CENTER[1]
    );
    setDistanceInfo(`Jarak lurus ${selectedUPT.name} ke Pusat Masamba: ${dist} km`);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 overflow-y-auto' : ''}`}>
      {/* 1. Header Toolbar Bergaya SIPUKAT Terpadu */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Globe2 className="w-3.5 h-3.5" />
                SIPUKAT Transmigrasi WebGIS
              </span>
              <a
                href="https://sipukat.transmigrasi.go.id/petaterpadu.php?v=2021"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold transition-colors cursor-pointer"
                title="Buka portal peta terpadu resmi Kementerian Transmigrasi RI"
              >
                <span>sipukat.transmigrasi.go.id</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Peta Geospasial Kawasan Transmigrasi Terpadu Kab. Luwu Utara
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Visualisasi geospasial real-time deliniasi batas Kawasan, Hak Pengelolaan Lahan (HPL), serta sarana prasarana 6 UPT di Kawasan Masamba dan 2 UPT di Kawasan Seko sesuai standar Sistem Informasi Perencanaan Kawasan Transmigrasi (SIPUKAT).
            </p>
          </div>

          {/* Quick Actions & View Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('gis')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'gis'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>WebGIS SIPUKAT</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('vector')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'vector'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Peta Skematis</span>
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh Peta'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
            </button>
          </div>
        </div>

        {/* Kawasan Quick Switcher & Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-semibold mr-1">Filter Kawasan:</span>
            <button
              type="button"
              onClick={() => setFilterKawasan('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterKawasan === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Kawasan (8 UPT)
            </button>
            <button
              type="button"
              onClick={() => setFilterKawasan('Kawasan Masamba')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterKawasan === 'Kawasan Masamba'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Kawasan Masamba (6 UPT)
            </button>
            <button
              type="button"
              onClick={() => setFilterKawasan('Kawasan Seko')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterKawasan === 'Kawasan Seko'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Kawasan Seko (2 UPT)
            </button>
          </div>

          {/* Quick Zoom Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium hidden md:inline">Navigasi Fokus:</span>
            <button
              type="button"
              onClick={handleFitLuwuUtara}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-xs cursor-pointer"
            >
              🌐 Luwu Utara
            </button>
            <button
              type="button"
              onClick={handleFitMasamba}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md font-medium text-xs cursor-pointer"
            >
              📍 Masamba
            </button>
            <button
              type="button"
              onClick={handleFitSeko}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md font-medium text-xs cursor-pointer"
            >
              🏔️ Seko
            </button>
          </div>
        </div>

        {/* Search, Commodity, and Thematic Layer Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama UPT, kecamatan, atau komoditas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            />
          </div>

          {/* Commodity filter */}
          <div className="sm:col-span-4">
            <select
              value={filterCommodity}
              onChange={(e) => setFilterCommodity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
            >
              <option value="all">Semua Komoditas Unggulan</option>
              <option value="kakao">Kakao (Cacao Fermentasi)</option>
              <option value="sawit">Kelapa Sawit Rakyat</option>
              <option value="padi">Padi Sawah Irigasi</option>
              <option value="kopi">Kopi Arabika Seko Specialty</option>
              <option value="nilam">Minyak Atsiri Nilam</option>
            </select>
          </div>

          {/* Thematic Mode */}
          <div className="sm:col-span-3 flex items-center p-1 bg-slate-100 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveThematicMode('kawasan')}
              className={`flex-1 py-1 rounded-md font-medium text-center transition-colors cursor-pointer ${
                activeThematicMode === 'kawasan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Kawasan
            </button>
            <button
              type="button"
              onClick={() => setActiveThematicMode('shm')}
              className={`flex-1 py-1 rounded-md font-medium text-center transition-colors cursor-pointer ${
                activeThematicMode === 'shm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              SHM %
            </button>
            <button
              type="button"
              onClick={() => setActiveThematicMode('jalan')}
              className={`flex-1 py-1 rounded-md font-medium text-center transition-colors cursor-pointer ${
                activeThematicMode === 'jalan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Poros
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Map Viewport & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Map Container */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md min-h-[580px] h-[620px] flex flex-col justify-between">
            {/* GIS Map View */}
            {viewMode === 'gis' ? (
              <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />
            ) : (
              /* Vector SVG Schematic Map Fallback */
              <div className="absolute inset-0 z-0 p-4 flex items-center justify-center bg-slate-950 text-white">
                <svg
                  viewBox="0 0 1000 700"
                  className="w-full h-full max-h-[580px] select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="luwuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                    </linearGradient>
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
                    </pattern>
                  </defs>

                  <rect width="1000" height="700" fill="url(#gridPattern)" />

                  {/* Kabupaten Outline */}
                  <path
                    d="M 180 80 Q 260 40, 360 90 T 520 120 Q 680 140, 840 220 Q 920 280, 890 380 Q 860 440, 780 480 Q 660 520, 580 580 Q 460 620, 380 580 Q 280 540, 220 440 Q 150 340, 140 200 Z"
                    fill="url(#luwuGradient)"
                    stroke="#334155"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  {/* Zonasi Masamba */}
                  <rect
                    x="360"
                    y="260"
                    width="430"
                    height="150"
                    rx="20"
                    fill="#10b981"
                    fillOpacity={filterKawasan === 'Kawasan Masamba' ? '0.18' : '0.08'}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <text x="375" y="285" fill="#34d399" fontSize="12" fontWeight="700">
                    ZONA KAWASAN MASAMBA (Baebunta, Masamba, Sukamaju, Bone-Bone)
                  </text>

                  {/* Zonasi Seko */}
                  <rect
                    x="200"
                    y="110"
                    width="140"
                    height="130"
                    rx="20"
                    fill="#f59e0b"
                    fillOpacity={filterKawasan === 'Kawasan Seko' ? '0.18' : '0.08'}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <text x="210" y="132" fill="#fbbf24" fontSize="11" fontWeight="700">
                    ZONA KAWASAN SEKO
                  </text>

                  {/* Rivers */}
                  <path
                    d="M 320 100 Q 380 260, 480 340 T 570 540"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeOpacity="0.5"
                  />

                  {/* UPT Markers in Vector Map */}
                  {filteredUPTs.map((upt) => {
                    const cx = (upt.coordinates.x / 100) * 1000;
                    const cy = (upt.coordinates.y / 100) * 700;
                    const isSelected = selectedUPT?.id === upt.id;
                    const color = upt.kawasan === 'Kawasan Masamba' ? '#10b981' : '#f59e0b';

                    return (
                      <g
                        key={upt.id}
                        onClick={() => onSelectUPT(upt)}
                        className="cursor-pointer group"
                        transform={`translate(${cx}, ${cy})`}
                      >
                        {isSelected && (
                          <circle r="22" fill={color} fillOpacity="0.3" className="animate-ping" />
                        )}
                        <circle r={isSelected ? "16" : "12"} fill="#0f172a" stroke={color} strokeWidth={isSelected ? "3" : "2"} />
                        <circle r={isSelected ? "8" : "5.5"} fill={color} />
                        <text
                          y={isSelected ? "-22" : "-16"}
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : "#cbd5e1"}
                          fontSize={isSelected ? "13" : "11"}
                          fontWeight={isSelected ? "700" : "500"}
                        >
                          {upt.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Floating Top Bar (Over Map) */}
            <div className="z-10 m-3 sm:m-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>WebGIS SIPUKAT Kab. Luwu Utara</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">v.2021/2026</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {filteredUPTs.length} Titik UPT &middot; 2 Deliniasi Kawasan
                  </div>
                </div>
              </div>

              {/* Basemap Switcher Palette */}
              {viewMode === 'gis' && (
                <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto flex items-center gap-1">
                  {BASEMAP_OPTIONS.map(bm => (
                    <button
                      key={bm.id}
                      type="button"
                      onClick={() => setActiveBasemap(bm.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeBasemap === bm.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title={bm.name}
                    >
                      <span>{bm.category === 'satellite' ? '🛰️' : bm.category === 'topo' ? '⛰️' : bm.category === 'street' ? '🗺️' : '🌑'}</span>
                      <span className="hidden sm:inline">
                        {bm.category === 'satellite' ? 'Satelit' : bm.category === 'topo' ? 'Topografi' : bm.category === 'street' ? 'Jalan' : 'Dark'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Floating Bottom Left: Layer Manager & Measurement Tools */}
            <div className="z-10 m-3 sm:m-4 flex flex-col gap-2 self-start pointer-events-none">
              {/* Distance Measure Alert Banner */}
              {distanceInfo && (
                <div className="bg-blue-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-600 text-white text-xs font-semibold shadow-lg pointer-events-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-300" />
                    <span>{distanceInfo}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDistanceInfo(null);
                      setMeasurePoints([]);
                      setIsMeasuring(false);
                    }}
                    className="text-blue-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Layer Controls Pill */}
              <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="text-slate-400 font-bold px-1 uppercase tracking-wider text-[10px]">
                  Layer GIS:
                </span>
                <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={showKawasanPolygons}
                    onChange={(e) => setShowKawasanPolygons(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Batas Kawasan</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={showHPLPolygons}
                    onChange={(e) => setShowHPLPolygons(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Deliniasi HPL</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={showRoads}
                    onChange={(e) => setShowRoads(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Poros Jalan</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={showRivers}
                    onChange={(e) => setShowRivers(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Sungai</span>
                </label>
              </div>

              {/* Cursor Real-Time Coordinate Readout HUD */}
              <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 pointer-events-auto flex items-center gap-2">
                <Navigation className="w-3 h-3 text-emerald-400" />
                {cursorCoords ? (
                  <span>
                    Lat: <strong className="text-white">{cursorCoords.lat}°</strong> &middot; Lng: <strong className="text-white">{cursorCoords.lng}°</strong> &middot; Luwu Utara
                  </span>
                ) : (
                  <span>Arahkan kursor ke peta untuk koordinat GPS real-time</span>
                )}
              </div>
            </div>
          </div>

          {/* Map Legend Banner SIPUKAT */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-slate-600">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                Legenda Tematik:
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
                Kawasan Masamba (6 UPT Lembah)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" />
                Kawasan Seko (2 UPT Dataran Tinggi)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-sky-400 border border-sky-500" />
                Poros Trans Sulawesi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t border-dashed border-amber-400" />
                Jalur Rute Seko (Perintisan)
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Sinkronisasi Geospasial PPKTrans Kemendesa RI
            </div>
          </div>
        </div>

        {/* Right Column: SIPUKAT Geospatial Attribute Inspector */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[620px]">
          {selectedUPT ? (
            <div className="space-y-4">
              {/* Header UPT */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                    <span className={`px-2 py-0.5 rounded font-mono ${
                      selectedUPT.kawasan === 'Kawasan Masamba'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedUPT.kawasan}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedUPT.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedUPT.district} &middot; Penempatan Thn {selectedUPT.yearEstablished}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isMainAdmin && onEditUPT && (
                    <button
                      type="button"
                      onClick={() => onEditUPT(selectedUPT)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      title={`Edit data ${selectedUPT.name}`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit UPT</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectUPT(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title="Tutup detail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Geospatial GPS Coordinate Card */}
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>ATRIBUT GEOSPASIAL SIPUKAT</span>
                  <span className="text-emerald-400 font-bold">TERVERIFIKASI</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lintang (Lat):</span>
                    <span className="text-white font-bold">{selectedUPT.coordinates.lat}° S</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bujur (Lng):</span>
                    <span className="text-white font-bold">{selectedUPT.coordinates.lng}° E</span>
                  </div>
                </div>
                {UPT_HPL_POLYGONS[selectedUPT.id] && (
                  <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-300">
                    No. SK HPL: <span className="text-emerald-300 font-bold">{UPT_HPL_POLYGONS[selectedUPT.id].skNumber}</span>
                  </div>
                )}
              </div>

              {/* Deskripsi Singkat */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedUPT.description}
              </p>

              {/* Grid Metrik Utama */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Kependudukan</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedUPT.totalKK} KK
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {selectedUPT.totalSouls} Jiwa (TPA {selectedUPT.tpaCount} / TPS {selectedUPT.tpsCount})
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Luas Wilayah</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedUPT.totalAreaHa.toLocaleString('id-ID')} Ha
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Batas HPL Terpetakan
                  </span>
                </div>

                <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500 block">Sertifikat SHM</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {selectedUPT.shmCompletedPercentage}%
                  </span>
                  <span className="text-[10px] text-emerald-800 block">
                    {Math.round((selectedUPT.totalKK * selectedUPT.shmCompletedPercentage) / 100)} Bidang Terbit
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Kondisi Jalan Poros</span>
                  <span className={`font-semibold text-xs ${
                    selectedUPT.roadCondition === 'Baik' ? 'text-emerald-700' :
                    selectedUPT.roadCondition === 'Sedang' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {selectedUPT.roadCondition}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Air: {selectedUPT.waterAccessPercentage}% &middot; Listrik: {selectedUPT.electricityPercentage}%
                  </span>
                </div>
              </div>

              {/* Komoditas Sentra */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-500 font-medium">Komoditas Sentra Unggulan:</span>
                <div className="flex flex-wrap items-center gap-1.5 text-slate-700">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-semibold border border-emerald-200">
                    {selectedUPT.primaryCommodity}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {selectedUPT.secondaryCommodity}
                  </span>
                </div>
              </div>

              {/* Fasilitas Sosial */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2 text-slate-600">
                  <Activity className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <span>{selectedUPT.healthFacility}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <School className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span>{selectedUPT.educationFacility}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleMeasureToCapital}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-slate-600" />
                  <span>Ukur Jarak ke Ibukota Masamba</span>
                </button>

                {isMainAdmin && onEditUPT && (
                  <button
                    type="button"
                    onClick={() => onEditUPT(selectedUPT)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Data Lengkap UPT Ini</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onNavigateTab('pertanahan')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <span>Lihat Buku Tanah & SHM {selectedUPT.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  Pilih UPT di Peta Geospasial
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Klik titik marker atau deliniasi poligon HPL salah satu UPT (Kawasan Masamba atau Kawasan Seko) untuk membuka informasi atribut geospasial, legalitas HPL, dan sertifikasi tanah SHM.
                </p>
              </div>

              <div className="w-full text-left space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pilihan Pintas Kawasan:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleFitMasamba}
                    className="p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 text-slate-700 font-semibold text-left transition-all cursor-pointer"
                  >
                    <span className="block text-emerald-700 font-bold">Kawasan Masamba</span>
                    <span className="text-[10px] text-slate-500">6 UPT Lembah</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFitSeko}
                    className="p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-500 text-slate-700 font-semibold text-left transition-all cursor-pointer"
                  >
                    <span className="block text-amber-700 font-bold">Kawasan Seko</span>
                    <span className="text-[10px] text-slate-500">2 UPT Dataran Tinggi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <span>Standar Geospasial SIPUKAT Ditjen PPKTrans</span>
          </div>
        </div>
      </div>
    </div>
  );
};
