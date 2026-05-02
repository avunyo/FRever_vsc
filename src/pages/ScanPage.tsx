import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, Loader2, Keyboard, Scan, CameraOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchProductInfo } from '@/lib/foodApi';

function LiveBarcodeScanner({ onBarcodeDetected }) {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const readerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const stopScanner = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (!isScanning) return;
    if (!videoRef.current) return;

    let active = true;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        // Video direkt setzen ohne auf React zu warten
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.muted = true;

        await new Promise((resolve) => {
          video.onloadedmetadata = () => resolve(null);
        });
        await video.play();

        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.UPC_A,
        ]);
        hints.set(DecodeHintType.TRY_HARDER, true);

        const reader = new BrowserMultiFormatReader(hints);
        readerRef.current = reader;

        const scan = async () => {
          if (!active || !videoRef.current) return;
          try {
            const result = await reader.decodeFromVideoElement(videoRef.current);
            if (result && active) {
              if (navigator.vibrate) navigator.vibrate(100);
              onBarcodeDetected(result.getText());
              stopScanner();
              return;
            }
          } catch (e) {}
          if (active) requestAnimationFrame(scan);
        };

        scan();

      } catch (err) {
        alert('Fehler: ' + err?.message);
        setIsScanning(false);
      }
    };

    start();
    return () => { active = false; };
  }, [isScanning]);

  return (
    <div className="w-full space-y-6">
      <div className="relative bg-white rounded-[32px] border border-[#2F3B39]/10 shadow-sm p-4">

        {/* Kamera AUS */}
        {!isScanning && (
          <div className="aspect-square flex flex-col items-center justify-center space-y-4 bg-[#2F3B39]/5 rounded-[24px] border-2 border-dashed border-[#2F3B39]/10">
            <div className="p-6 bg-white rounded-full shadow-sm">
              <Scan className="w-12 h-12 text-[#2F3B39]" />
            </div>
            <Button
              onClick={() => setIsScanning(true)}
              className="bg-[#2F3B39] text-white hover:bg-[#1a2321] rounded-full px-8"
            >
              Kamera starten
            </Button>
          </div>
        )}

        {/* Kamera AN — kein overflow-hidden, kein AnimatePresence */}
        {isScanning && (
          <div className="relative aspect-square rounded-[24px] bg-black" style={{ overflow: 'hidden' }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              autoPlay
              muted
              playsInline
            />

            {/* Scan-Linie */}
            <motion.div
              animate={{ top: ['10%', '90%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                height: '2px',
                background: '#A3E635',
                boxShadow: '0 0 15px #A3E635',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />

            <button
              onClick={stopScanner}
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <CameraOff style={{ width: 16, height: 16 }} /> Beenden
            </button>
          </div>
        )}
      </div>

      {/* Manuelle Eingabe */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Barcode eingeben..."
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && manualBarcode) {
                onBarcodeDetected(manualBarcode);
                setManualBarcode('');
              }
            }}
            className="pl-10 h-12 rounded-2xl border-[#2F3B39]/10 bg-white"
          />
        </div>
        <Button
          onClick={() => {
            if (manualBarcode) {
              onBarcodeDetected(manualBarcode);
              setManualBarcode('');
            }
          }}
          className="h-12 w-12 rounded-2xl bg-[#A3E635]/20 text-[#2F3B39] hover:bg-[#A3E635]/40 border border-[#A3E635]/30"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default function ScanPage() {
  const [products, setProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBarcodeDetected = async (barcode) => {
    if (!barcode || isProcessing) return;
    setIsProcessing(true);
    try {
      const productData = await fetchProductInfo(barcode);
      if (productData) {
        setProducts(prev => [productData, ...prev]);
      } else {
        alert('Barcode ' + barcode + ' nicht gefunden');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 md:py-8">
      <div className="max-w-md mx-auto bg-[#F8FAF9] min-h-screen md:min-h-[850px] shadow-2xl md:rounded-[40px] overflow-hidden flex flex-col">

        <div className="bg-white rounded-b-[40px] shadow-sm p-6 mb-8 border-b border-[#2F3B39]/5">
          <h1 className="text-center text-xl font-black italic uppercase text-[#2F3B39] mb-6 tracking-tighter">
            Frever Scanner
          </h1>
          <LiveBarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
        </div>

        <div className="flex-1 px-6 pb-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black text-[#2F3B39] tracking-tight uppercase">Gescannt</h2>
            {products.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProducts([])}
                className="text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Löschen
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center py-4 gap-2 text-[#2F3B39]/40 italic text-sm">
              <Loader2 className="animate-spin w-4 h-4" /> Wird gesucht...
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[32px] bg-white/50"
                >
                  <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs font-medium">Noch keine Produkte</p>
                </motion.div>
              ) : (
                products.map((item, index) => (
                  <motion.div
                    key={item.id + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#2F3B39]/5 p-4 rounded-[24px] shadow-sm flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Package className="text-gray-200 w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#2F3B39] truncate text-sm leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {item.brand || 'Unbekannte Marke'}
                      </p>
                    </div>
                    <div className="text-[9px] font-mono text-gray-200 rotate-90 flex-shrink-0">
                      {item.id}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}