import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SIAP KANDA ErrorBoundary caught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem('siapkanda_upt_data');
      localStorage.removeItem('siapkanda_kawasan_data');
      localStorage.removeItem('siapkanda_kk_data');
      localStorage.removeItem('siapkanda_portal_images');
      localStorage.removeItem('siapkanda_current_officer');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Unable to clear storage:', e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                SIAP KANDA &middot; Portal Transmigrasi Luwu Utara
              </span>
              <h2 className="text-xl font-bold text-white">
                Terjadi Kendala Memuat Aplikasi
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Aplikasi mengalami kendala teknis saat memuat data di peramban Anda. Anda dapat mencoba memuat ulang atau mereset data cache lokal.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-left text-[11px] font-mono text-rose-300 max-h-32 overflow-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-amber-400" />
                <span>Reset Cache & Muat</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-700">
              Disnakertrans Kabupaten Luwu Utara &middot; Sistem Informasi Kawasan Transmigrasi
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
