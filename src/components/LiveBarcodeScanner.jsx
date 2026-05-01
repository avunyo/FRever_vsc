import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Scan, Keyboard, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from "framer-motion";

export default function LiveBarcodeScanner({ onBarcodeDetected, isProcessing }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    try {
      setIsScanning(true);

      // 1. Настройка форматов (Hints)
      const hints = new Map();
      const formats = [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.CODE_128,
        BarcodeFormat.QR_CODE,
        BarcodeFormat.UPC_A
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      // Добавляем TRY_HARDER для более тщательного анализа кадра
      hints.set(DecodeHintType.TRY_HARDER, true);

      const codeReader = new BrowserMultiFormatReader(hints);
      codeReaderRef.current = codeReader;

      // 2. Настройка разрешения видео (Constraints)
      // Это заставит телефон использовать HD разрешение для четкости линий штрих-кода
      const videoConstraints = {
        video: {
          facingMode: "environment",
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { ideal: 30 }
        }
      };

      const devices = await codeReader.listVideoInputDevices();
      const backCamera = devices.find(d => /back|rear|задн/i.test(d.label)) || devices[0];

      if (!backCamera) {
        throw new Error("Kamera не найдена");
      }

      // 3. Запуск с параметрами видео
      await codeReader.decodeFromConstraints(
        videoConstraints,
        videoRef.current,
        (result, err) => {
          if (result) {
            if (navigator.vibrate) navigator.vibrate(100);
            onBarcodeDetected(result.getText());
            stopScanner();
          }
          if (err && !(err.name === 'NotFoundException')) {
            console.error("Scanner Error:", err);
          }
        }
      );
    } catch (err) {
      console.error("Scanner Start Error:", err);
      alert("Ошибка камеры. Убедитесь, что дали разрешение и используете HTTPS.");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

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
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                playsInline 
                muted 
              />
              {/* Улучшенная визуальная рамка */}
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                 <div className="w-full h-full border-2 border-[#A3E635] rounded-xl shadow-[0_0_20px_rgba(163,230,53,0.3)]" />
              </div>
              
              <motion.div 
                animate={{ top: ['25%', '75%'] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[15%] right-[15%] h-[2px] bg-red-500 shadow-[0_0_10px_red] z-10" 
              />

              <button 
                onClick={stopScanner} 
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg"
              >
                Abbrechen
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
            placeholder="Barcode manuell..."
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="pl-10 h-12 rounded-2xl border-[#2F3B39]/10 bg-white"
          />
        </div>
        <Button
          onClick={() => { if(manualBarcode) { onBarcodeDetected(manualBarcode); setManualBarcode(''); } }}
          className="h-12 w-12 rounded-2xl bg-[#A3E635] text-[#2F3B39] hover:bg-[#92cf2f]"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}