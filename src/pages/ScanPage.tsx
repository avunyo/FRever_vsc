import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, Loader2, Keyboard, Scan, CameraOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchProductInfo } from '@/lib/foodApi';

// --- КОМПОНЕНТ СКАНЕРА ---
function LiveBarcodeScanner({ onBarcodeDetected, isProcessing }) {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const codeReaderRef = useRef(null);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
  try {
    // Явно запрашиваем разрешение перед запуском библиотеки
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const devices = await codeReader.listVideoInputDevices();
    // Фильтруем только видео-входы
    const backCamera = devices.find(d => /back|rear|задн/i.test(d.label)) || devices[0];

    if (!backCamera) {
      alert("Камера не найдена");
      return;
    }

    await codeReader.decodeFromVideoDevice(
      backCamera.deviceId, 
      videoRef.current, 
      (result) => {
        if (result) {
          onBarcodeDetected(result.getText());
          stopScanner();
        }
      }
    );
  } catch (err) {
    console.error("Scanner Error:", err);
    alert("Доступ к камере отклонен или заблокирован браузером.");
    setIsScanning(false);
  }
};

  return (
    <div className="w-full space-y-6">
      <div className="relative bg-white rounded-[32px] border border-[#2F3B39]/10 shadow-sm overflow-hidden p-4">
        <AnimatePresence mode="wait">
          {!isScanning ? (
            <motion.div
              key="start"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="aspect-square flex flex-col items-center justify-center space-y-4 bg-[#2F3B39]/5 rounded-[24px] border-2 border-dashed border-[#2F3B39]/10"
            >
              <div className="p-6 bg-white rounded-full shadow-sm">
                <Scan className="w-12 h-12 text-[#2F3B39]" />
              </div>
              <Button onClick={startScanner} className="bg-[#2F3B39] text-white hover:bg-[#1a2321] rounded-full px-8">
                Kamera starten
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative aspect-square rounded-[24px] overflow-hidden bg-black"
            >
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              <div className="absolute inset-0 pointer-events-none border-[20px] border-black/40" style={{ clipPath: 'polygon(0% 0%, 0% 100%, 10% 100%, 10% 10%, 90% 10%, 90% 90%, 10% 90%, 10% 100%, 100% 100%, 100% 0%)' }} />
              <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] border-2 border-white/30 rounded-[20px] pointer-events-none">
                <motion.div 
                  animate={{ top: ['10%', '90%'] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-[#A3E635] shadow-[0_0_15px_#A3E635]" 
                />
              </div>
              <button onClick={stopScanner} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20">
                <CameraOff className="w-4 h-4" /> Beenden
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Barcode eingeben..."
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="pl-10 h-12 rounded-2xl border-[#2F3B39]/10 bg-white"
          />
        </div>
        <Button
          onClick={() => { if(manualBarcode) { onBarcodeDetected(manualBarcode); setManualBarcode(''); } }}
          className="h-12 w-12 rounded-2xl bg-[#A3E635]/20 text-[#2F3B39] hover:bg-[#A3E635]/40 border border-[#A3E635]/30"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

// --- ГЛАВНАЯ СТРАНИЦА ---
// --- ГЛАВНАЯ СТРАНИЦА (ScanPage) ---
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
        alert("Barcode " + barcode + " nicht gefunden");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    /* Внешний контейнер на весь экран с серым фоном */
    <div className="min-h-screen bg-gray-100 md:py-8"> 
      
      {/* 
         Контейнер-"телефон": 
         max-w-md — ограничивает ширину (ок. 450px)
         mx-auto — центрирует
         bg-[#F8FAF9] — внутренний фон приложения
      */}
      <div className="max-w-md mx-auto bg-[#F8FAF9] min-h-screen md:min-h-[850px] shadow-2xl md:rounded-[40px] overflow-hidden flex flex-col">
        
        {/* Шапка (теперь она внутри ограниченного контейнера) */}
        <div className="bg-white rounded-b-[40px] shadow-sm p-6 mb-8 border-b border-[#2F3B39]/5">
          <h1 className="text-center text-xl font-black italic uppercase text-[#2F3B39] mb-6 tracking-tighter">
            Frever Scanner
          </h1>
          <LiveBarcodeScanner onBarcodeDetected={handleBarcodeDetected} isProcessing={isProcessing} />
        </div>

        {/* Список отсканированного */}
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