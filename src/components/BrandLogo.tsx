import React, { useState } from 'react';
import { X, ZoomIn, ExternalLink } from 'lucide-react';

interface BrandLogoProps {
  src?: string;
  alt?: string;
  className?: string;
  allowZoom?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  src = '/Luwu_Utara_Logo_(North_Luwu).png',
  alt = 'Lambang Daerah Kabupaten Luwu Utara',
  className = 'h-14 sm:h-16 w-auto object-contain shrink-0',
  allowZoom = false
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      <div className="relative group inline-flex items-center">
        <img
          src={src}
          alt={alt}
          className={`${className} transition-transform group-hover:scale-105`}
          style={{
            // Memastikan proporsi warna dan bentuk asli tidak berubah
            objectFit: 'contain',
            aspectRatio: '400 / 483',
            filter: 'none'
          }}
          onError={(e) => {
            // Fallback jika path memerlukan relative asset
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('src/assets')) {
              target.src = '/src/assets/images/Luwu_Utara_Logo_(North_Luwu).png';
            }
          }}
        />
        {allowZoom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(true);
            }}
            title="Lihat Logo dengan Ukuran Aslinya (400 x 483 px)"
            className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 hover:bg-slate-900 text-white p-1 rounded-full text-[9px] shadow-sm cursor-pointer z-10"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Modal Tampilan Ukuran Asli 400 x 483 Pixel */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Logo Resmi Kabupaten Luwu Utara
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Dimensi Ukuran Asli File: 400 × 483 piksel (Rasio 1:1.20)
                </p>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 overflow-auto max-h-[60vh]">
              {/* Render dengan dimensi ukuran aslinya 400 x 483 */}
              <img
                src={src}
                alt={alt}
                width={400}
                height={483}
                style={{
                  width: '400px',
                  maxWidth: '100%',
                  aspectRatio: '400 / 483',
                  objectFit: 'contain'
                }}
                className="drop-shadow-md select-none"
              />
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900">
              <strong>Keterangan:</strong> Logo ditampilkan dengan proporsi warna asli dan tanpa modifikasi bentuk, sesuai dengan lambang resmi Pemerintah Kabupaten Luwu Utara.
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup Tampilan Asli
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
