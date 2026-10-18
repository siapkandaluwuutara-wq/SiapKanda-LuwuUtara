import React, { useState, useEffect } from 'react';
import { 
  UPT_DATA, 
  KAWASAN_SUMMARY,
  MOCK_TRANSMIGRANT_KK, 
  COMMODITY_DATA, 
  INFRASTRUCTURE_DATA, 
  MOCK_FEEDBACK_TICKETS 
} from './data/mockData';
import { UPTRegion, TransmigrantKK, PublicFeedbackTicket, OfficerUser, OfficerAccount, PortalImages, KawasanInfo, CommodityStat, InfrastructureItem } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardOverview } from './components/DashboardOverview';
import { InteractiveMap } from './components/InteractiveMap';
import { LandAdministration } from './components/LandAdministration';
import { CommodityEconomy } from './components/CommodityEconomy';
import { InfrastructureMonitor } from './components/InfrastructureMonitor';
import { PublicFeedback } from './components/PublicFeedback';
import { PublicVerificationModal } from './components/PublicVerificationModal';
import { TransmigrantDetailModal } from './components/TransmigrantDetailModal';
import { AdminModal } from './components/AdminModal';
import { EditKKModal } from './components/EditKKModal';
import { EditCommodityModal } from './components/EditCommodityModal';
import { EditInfrastructureModal } from './components/EditInfrastructureModal';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { OfficerLoginModal } from './components/OfficerLoginModal';
import { OfficerManagementModal } from './components/OfficerManagementModal';
import { KawasanUptManagementModal } from './components/KawasanUptManagementModal';
import { getStoredOfficers, saveStoredOfficers } from './data/officerData';
import { DEFAULT_PORTAL_IMAGES, sanitizePortalImages } from './data/portalImages';
import { Plus, Image as ImageIcon, ShieldCheck, UserCheck, LogOut, Users, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  
  // App data state (persisted in localStorage with safe try-catch)
  const [uptList, setUptList] = useState<UPTRegion[]>(() => {
    try {
      const saved = localStorage.getItem('siapkanda_upt_data');
      if (saved) {
        const parsed: UPTRegion[] = JSON.parse(saved);
        // Synchronize coordinates with exact updated GIS coordinates
        return parsed.map((item) => {
          const defaultUPT = UPT_DATA.find((u) => u.id === item.id);
          if (defaultUPT) {
            return {
              ...item,
              coordinates: defaultUPT.coordinates
            };
          }
          return item;
        });
      }
    } catch (e) {
      console.warn('Storage read failed for UPT data:', e);
    }
    return UPT_DATA;
  });

  const [kawasanList, setKawasanList] = useState<KawasanInfo[]>(() => {
    try {
      const saved = localStorage.getItem('siapkanda_kawasan_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read failed for kawasan data:', e);
    }
    return KAWASAN_SUMMARY;
  });

  const [kkList, setKkList] = useState<TransmigrantKK[]>(() => {
    try {
      const saved = localStorage.getItem('siapkanda_kk_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read failed for KK data:', e);
    }
    return MOCK_TRANSMIGRANT_KK;
  });

  const [commodities, setCommodities] = useState<CommodityStat[]>(() => {
    try {
      const saved = localStorage.getItem('siapkanda_commodity_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read failed for commodity data:', e);
    }
    return COMMODITY_DATA;
  });

  const [infrastructureList, setInfrastructureList] = useState<InfrastructureItem[]>(() => {
    try {
      const saved = localStorage.getItem('siapkanda_infrastructure_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read failed for infrastructure data:', e);
    }
    return INFRASTRUCTURE_DATA;
  });

  const [feedbackTickets, setFeedbackTickets] = useState<PublicFeedbackTicket[]>(MOCK_FEEDBACK_TICKETS);

  // Portal Images State (persisted in localStorage with GitHub Pages path sanitization)
  const [portalImages, setPortalImages] = useState<PortalImages>(() => {
    try {
      return sanitizePortalImages(localStorage.getItem('siapkanda_portal_images'));
    } catch {
      return DEFAULT_PORTAL_IMAGES;
    }
  });

  // Officer Authentication State (persisted in localStorage)
  const [officersList, setOfficersList] = useState<OfficerAccount[]>(() => {
    try {
      return getStoredOfficers();
    } catch {
      return [];
    }
  });
  const [currentOfficer, setCurrentOfficer] = useState<OfficerUser | null>(() => {
    try {
      const saved = localStorage.getItem('siapkanda_current_officer');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read failed for current officer:', e);
    }
    return null;
  });

  // Modal Controllers
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isOfficerManageModalOpen, setIsOfficerManageModalOpen] = useState(false);
  const [isKawasanUptModalOpen, setIsKawasanUptModalOpen] = useState(false);
  const [kawasanUptModalTab, setKawasanUptModalTab] = useState<'kawasan' | 'upt'>('kawasan');
  const [selectedKawasanForEdit, setSelectedKawasanForEdit] = useState<string | undefined>(undefined);
  const [selectedUPTForEdit, setSelectedUPTForEdit] = useState<string | undefined>(undefined);
  const [detailModalKK, setDetailModalKK] = useState<TransmigrantKK | null>(null);
  const [editingKK, setEditingKK] = useState<TransmigrantKK | null>(null);
  const [isEditKKModalOpen, setIsEditKKModalOpen] = useState(false);
  
  // Commodity & Infrastructure Edit Modals
  const [isEditCommodityModalOpen, setIsEditCommodityModalOpen] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState<CommodityStat | null>(null);
  const [isEditInfraModalOpen, setIsEditInfraModalOpen] = useState(false);
  const [editingInfra, setEditingInfra] = useState<InfrastructureItem | null>(null);

  const [selectedUPT, setSelectedUPT] = useState<UPTRegion | null>(null);
  const [feedbackDefaultCategory, setFeedbackDefaultCategory] = useState<string>('Keterlambatan SHM');

  const handleUpdateOfficers = (newList: OfficerAccount[]) => {
    setOfficersList(newList);
    saveStoredOfficers(newList);
    // If currentOfficer was modified or deleted, keep in sync
    if (currentOfficer) {
      const updatedSelf = newList.find(o => o.userId.toLowerCase() === currentOfficer.userId.toLowerCase() || o.nip === currentOfficer.nip);
      if (updatedSelf) {
        setCurrentOfficer({
          ...currentOfficer,
          name: updatedSelf.name,
          nip: updatedSelf.nip,
          role: updatedSelf.role,
          office: updatedSelf.office,
          isAdmin: updatedSelf.isAdmin || updatedSelf.nip === '197909202010011002'
        });
      }
    }
  };

  // Sync state to LocalStorage with safe try-catch
  useEffect(() => {
    try {
      localStorage.setItem('siapkanda_kk_data', JSON.stringify(kkList));
    } catch (e) {
      console.warn('Storage write skipped for kk_data:', e);
    }
  }, [kkList]);

  useEffect(() => {
    try {
      localStorage.setItem('siapkanda_portal_images', JSON.stringify(portalImages));
    } catch (e) {
      console.warn('Storage write skipped for portal_images:', e);
    }
  }, [portalImages]);

  useEffect(() => {
    try {
      localStorage.setItem('siapkanda_commodity_data', JSON.stringify(commodities));
    } catch (e) {
      console.warn('Storage write skipped for commodity_data:', e);
    }
  }, [commodities]);

  useEffect(() => {
    try {
      localStorage.setItem('siapkanda_infrastructure_data', JSON.stringify(infrastructureList));
    } catch (e) {
      console.warn('Storage write skipped for infrastructure_data:', e);
    }
  }, [infrastructureList]);

  useEffect(() => {
    try {
      if (currentOfficer) {
        localStorage.setItem('siapkanda_current_officer', JSON.stringify(currentOfficer));
      } else {
        localStorage.removeItem('siapkanda_current_officer');
      }
    } catch (e) {
      console.warn('Storage write skipped for current_officer:', e);
    }
  }, [currentOfficer]);

  // Auth Handlers
  const handleLoginSuccess = (officer: OfficerUser) => {
    setCurrentOfficer(officer);
  };

  const handleLogout = () => {
    setCurrentOfficer(null);
  };

  // Data Manipulation Handlers
  const handleSaveUPT = (updatedUPT: UPTRegion) => {
    setUptList(prev => {
      const next = prev.map(u => u.id === updatedUPT.id ? updatedUPT : u);
      try {
        localStorage.setItem('siapkanda_upt_data', JSON.stringify(next));
      } catch (e) {
        console.warn('Storage write skipped for upt_data:', e);
      }
      return next;
    });
    if (selectedUPT && selectedUPT.id === updatedUPT.id) {
      setSelectedUPT(updatedUPT);
    }
  };

  const handleSaveKawasan = (updatedKawasan: KawasanInfo) => {
    setKawasanList(prev => {
      const next = prev.map(k => k.id === updatedKawasan.id ? updatedKawasan : k);
      try {
        localStorage.setItem('siapkanda_kawasan_data', JSON.stringify(next));
      } catch (e) {
        console.warn('Storage write skipped for kawasan_data:', e);
      }
      return next;
    });
  };

  const handleResetKawasanUptToDefault = () => {
    setUptList(UPT_DATA);
    setKawasanList(KAWASAN_SUMMARY);
    try {
      localStorage.removeItem('siapkanda_upt_data');
      localStorage.removeItem('siapkanda_kawasan_data');
    } catch (e) {
      console.warn('Storage removal failed:', e);
    }
  };

  const handleEditKawasan = (kawasan: KawasanInfo) => {
    setSelectedKawasanForEdit(kawasan.id);
    setSelectedUPTForEdit(undefined);
    setKawasanUptModalTab('kawasan');
    setIsKawasanUptModalOpen(true);
  };

  const handleEditUPT = (upt: UPTRegion) => {
    setSelectedUPTForEdit(upt.id);
    setSelectedKawasanForEdit(undefined);
    setKawasanUptModalTab('upt');
    setIsKawasanUptModalOpen(true);
  };

  const handleOpenKawasanUptModal = () => {
    setSelectedKawasanForEdit(undefined);
    setSelectedUPTForEdit(undefined);
    setKawasanUptModalTab('kawasan');
    setIsKawasanUptModalOpen(true);
  };

  const handleAddKK = (newKK: TransmigrantKK) => {
    setKkList(prev => [newKK, ...prev]);
  };

  const handleSaveEditedKK = (updatedKK: TransmigrantKK) => {
    setKkList(prev => prev.map(k => k.id === updatedKK.id ? updatedKK : k));
    if (detailModalKK && detailModalKK.id === updatedKK.id) {
      setDetailModalKK(updatedKK);
    }
  };

  const handleUpdateImages = (newImages: PortalImages) => {
    setPortalImages(newImages);
  };

  const handleSelectUPTFromDashboard = (upt: UPTRegion) => {
    setSelectedUPT(upt);
    setActiveTab('peta');
  };

  const handleAddTicket = (newTicket: PublicFeedbackTicket) => {
    setFeedbackTickets(prev => [newTicket, ...prev]);
  };

  const handleOpenReportFromInfrastructure = (category?: string) => {
    if (category) setFeedbackDefaultCategory(category);
    setActiveTab('layanan');
  };

  const handleReportIssueFromKK = (kk: TransmigrantKK) => {
    setDetailModalKK(null);
    setFeedbackDefaultCategory('Sengketa Batas Tanah');
    setActiveTab('layanan');
  };

  // Commodity Handlers for Admin
  const handleSaveCommodity = (savedCommodity: CommodityStat) => {
    setCommodities(prev => {
      const exists = prev.some(c => c.id === savedCommodity.id);
      if (exists) {
        return prev.map(c => c.id === savedCommodity.id ? savedCommodity : c);
      }
      return [savedCommodity, ...prev];
    });
  };

  const handleDeleteCommodity = (id: string) => {
    setCommodities(prev => prev.filter(c => c.id !== id));
  };

  const handleResetCommodities = () => {
    if (window.confirm('Kembalikan semua data komoditas ke pengaturan default awal?')) {
      setCommodities(COMMODITY_DATA);
      try {
        localStorage.removeItem('siapkanda_commodity_data');
      } catch (e) {
        console.warn('Storage removal failed for commodity data:', e);
      }
    }
  };

  const handleOpenEditCommodity = (commodity: CommodityStat) => {
    setEditingCommodity(commodity);
    setIsEditCommodityModalOpen(true);
  };

  const handleOpenAddCommodity = () => {
    setEditingCommodity(null);
    setIsEditCommodityModalOpen(true);
  };

  // Infrastructure Handlers for Admin
  const handleSaveInfrastructure = (savedItem: InfrastructureItem) => {
    setInfrastructureList(prev => {
      const exists = prev.some(i => i.id === savedItem.id);
      if (exists) {
        return prev.map(i => i.id === savedItem.id ? savedItem : i);
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteInfrastructure = (id: string) => {
    setInfrastructureList(prev => prev.filter(i => i.id !== id));
  };

  const handleResetInfrastructure = () => {
    if (window.confirm('Kembalikan semua data sarpras infrastruktur ke pengaturan default awal?')) {
      setInfrastructureList(INFRASTRUCTURE_DATA);
      try {
        localStorage.removeItem('siapkanda_infrastructure_data');
      } catch (e) {
        console.warn('Storage removal failed for infrastructure data:', e);
      }
    }
  };

  const handleOpenEditInfrastructure = (item: InfrastructureItem) => {
    setEditingInfra(item);
    setIsEditInfraModalOpen(true);
  };

  const handleOpenAddInfrastructure = () => {
    setEditingInfra(null);
    setIsEditInfraModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Officer Top Status Notification Bar when Logged In */}
      {currentOfficer && (() => {
        const isMainAdmin = currentOfficer.isAdmin || currentOfficer.nip === '197909202010011002';
        return (
          <div className={`${isMainAdmin ? 'bg-amber-700' : 'bg-emerald-800'} text-white text-xs px-4 py-2 font-medium flex items-center justify-between shadow-xs transition-colors`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between max-w-7xl mx-auto w-full gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0" />
                <span>
                  <strong>{isMainAdmin ? 'Hak Akses Penuh (Administrator Utama):' : 'Sesi Petugas Aktif:'}</strong> {currentOfficer.name} (NIP: {currentOfficer.nip} &middot; {currentOfficer.role}).
                  {isMainAdmin 
                    ? ' Hak akses penuh aktif: edit data 2 kawasan & 8 UPT, input/edit data transmigran, manajemen foto portal, serta kelola User ID petugas.'
                    : ' Akses menambah data transmigran, mengedit warkah/sertifikat, dan mengelola seluruh foto portal diaktifkan.'}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                {isMainAdmin && (
                  <>
                    <button
                      onClick={handleOpenKawasanUptModal}
                      className="bg-amber-900 hover:bg-black/40 text-amber-100 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm border border-amber-400/40"
                      title="Buka panel edit seluruh data Kawasan dan UPT"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>Edit Kawasan & UPT</span>
                    </button>
                    <button
                      onClick={() => setIsOfficerManageModalOpen(true)}
                      className="bg-purple-900 hover:bg-purple-950 text-purple-100 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm border border-purple-400/40"
                      title="Buka panel kelola, tambah, dan rubah User ID petugas lapangan"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Kelola Petugas Lapangan</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="bg-amber-900 hover:bg-black/40 text-white px-2.5 py-1 rounded text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Input Transmigran</span>
                </button>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="bg-amber-900 hover:bg-black/40 text-white px-2.5 py-1 rounded text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Ganti Foto Portal</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-slate-950 hover:bg-slate-900 text-amber-200 hover:text-white px-2.5 py-1 rounded text-xs font-medium cursor-pointer whitespace-nowrap flex items-center gap-1"
                  title="Keluar dari akun petugas"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header Bar with Official Logo & Officer Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckModal={() => setIsCheckModalOpen(true)}
        currentOfficer={currentOfficer}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddModal={() => setIsAdminModalOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
        onOpenOfficerManageModal={() => setIsOfficerManageModalOpen(true)}
        onOpenKawasanUptModal={handleOpenKawasanUptModal}
        logoUrl={portalImages.logoUrl}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'beranda' && (
          <DashboardOverview
            uptList={uptList}
            commodities={commodities}
            onSelectUPT={handleSelectUPTFromDashboard}
            onNavigateTab={setActiveTab}
            onOpenCheckModal={() => setIsCheckModalOpen(true)}
            images={portalImages}
            currentOfficer={currentOfficer}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            kawasanList={kawasanList}
            onEditKawasan={handleEditKawasan}
            onEditUPT={handleEditUPT}
            onOpenKawasanUptModal={handleOpenKawasanUptModal}
          />
        )}

        {activeTab === 'peta' && (
          <InteractiveMap
            uptList={uptList}
            selectedUPT={selectedUPT}
            onSelectUPT={setSelectedUPT}
            onNavigateTab={setActiveTab}
            currentOfficer={currentOfficer}
            onEditUPT={handleEditUPT}
          />
        )}

        {activeTab === 'pertanahan' && (
          <LandAdministration
            kkList={kkList}
            uptList={uptList}
            onOpenCheckModal={() => setIsCheckModalOpen(true)}
            onSelectDetailKK={(kk) => setDetailModalKK(kk)}
            currentOfficer={currentOfficer}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onEditKK={(kk) => {
              setEditingKK(kk);
              setIsEditKKModalOpen(true);
            }}
            onOpenAddModal={() => setIsAdminModalOpen(true)}
            onOpenOfficerManageModal={() => setIsOfficerManageModalOpen(true)}
            onOpenKawasanUptModal={handleOpenKawasanUptModal}
          />
        )}

        {activeTab === 'komoditas' && (
          <CommodityEconomy
            commodities={commodities}
            uptList={uptList}
            currentOfficer={currentOfficer}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onEditCommodity={handleOpenEditCommodity}
            onAddCommodity={handleOpenAddCommodity}
            onDeleteCommodity={handleDeleteCommodity}
            onResetCommodities={handleResetCommodities}
          />
        )}

        {activeTab === 'infrastruktur' && (
          <InfrastructureMonitor
            infrastructureList={infrastructureList}
            uptList={uptList}
            onOpenReportModal={handleOpenReportFromInfrastructure}
            images={portalImages}
            currentOfficer={currentOfficer}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onEditInfrastructure={handleOpenEditInfrastructure}
            onAddInfrastructure={handleOpenAddInfrastructure}
            onDeleteInfrastructure={handleDeleteInfrastructure}
            onResetInfrastructure={handleResetInfrastructure}
          />
        )}

        {activeTab === 'layanan' && (
          <PublicFeedback
            tickets={feedbackTickets}
            uptList={uptList}
            onAddTicket={handleAddTicket}
            defaultCategory={feedbackDefaultCategory}
          />
        )}
      </main>

      {/* Footer with Brand Logo */}
      <Footer onNavigate={setActiveTab} logoUrl={portalImages.logoUrl} />

      {/* Modals & Dialogs */}
      <PublicVerificationModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        kkList={kkList}
      />

      <TransmigrantDetailModal
        kk={detailModalKK}
        onClose={() => setDetailModalKK(null)}
        onReportIssue={handleReportIssueFromKK}
        currentOfficer={currentOfficer}
        onEditKK={(kk) => {
          setDetailModalKK(null);
          setEditingKK(kk);
          setIsEditKKModalOpen(true);
        }}
      />

      {/* Officer Modals */}
      <OfficerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        officersList={officersList}
      />

      <OfficerManagementModal
        isOpen={isOfficerManageModalOpen}
        onClose={() => setIsOfficerManageModalOpen(false)}
        currentOfficer={currentOfficer}
        officers={officersList}
        onUpdateOfficers={handleUpdateOfficers}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        uptList={uptList}
        onAddKK={handleAddKK}
        currentOfficer={currentOfficer}
      />

      <EditKKModal
        isOpen={isEditKKModalOpen}
        onClose={() => {
          setIsEditKKModalOpen(false);
          setEditingKK(null);
        }}
        kk={editingKK}
        uptList={uptList}
        currentOfficer={currentOfficer}
        onSaveKK={handleSaveEditedKK}
      />

      <PhotoManagerModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        images={portalImages}
        onUpdateImages={handleUpdateImages}
        uptList={uptList}
        currentOfficer={currentOfficer}
      />

      <KawasanUptManagementModal
        isOpen={isKawasanUptModalOpen}
        onClose={() => setIsKawasanUptModalOpen(false)}
        uptList={uptList}
        kawasanList={kawasanList}
        onSaveUPT={handleSaveUPT}
        onSaveKawasan={handleSaveKawasan}
        onResetToDefault={handleResetKawasanUptToDefault}
        initialTab={kawasanUptModalTab}
        initialSelectedUPTId={selectedUPTForEdit}
        initialSelectedKawasanId={selectedKawasanForEdit}
        currentOfficer={currentOfficer}
      />

      {/* Admin Edit Commodity Modal */}
      <EditCommodityModal
        isOpen={isEditCommodityModalOpen}
        onClose={() => {
          setIsEditCommodityModalOpen(false);
          setEditingCommodity(null);
        }}
        commodity={editingCommodity}
        currentOfficer={currentOfficer}
        onSaveCommodity={handleSaveCommodity}
        onDeleteCommodity={handleDeleteCommodity}
      />

      {/* Admin Edit Infrastructure Modal */}
      <EditInfrastructureModal
        isOpen={isEditInfraModalOpen}
        onClose={() => {
          setIsEditInfraModalOpen(false);
          setEditingInfra(null);
        }}
        item={editingInfra}
        uptList={uptList}
        currentOfficer={currentOfficer}
        onSaveItem={handleSaveInfrastructure}
        onDeleteItem={handleDeleteInfrastructure}
      />
    </div>
  );
}
