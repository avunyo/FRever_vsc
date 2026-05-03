import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, Loader2, Keyboard, Scan, CameraOff, Search, AlertCircle, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchProductInfo } from '@/lib/foodApi';

function LiveBarcodeScanner({ onBarcodeDetected }) {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const readerRef = useRef(null);
  const detectedRef = useRef(false);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const stopScanner = () => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch (e) { }
      readerRef.current = null;
    }
    detectedRef.current = false;
    setIsScanning(false);
  };

  useEffect(() => {
    if (!isScanning) return;
    detectedRef.current = false;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13, BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
      if (result && !detectedRef.current) {
        detectedRef.current = true;
        if (navigator.vibrate) navigator.vibrate(100);
        onBarcodeDetected(result.getText());
        stopScanner();
      }
    }).catch(err => {
      alert('Kamera Fehler: ' + err?.message);
      setIsScanning(false);
    });

    return () => { try { reader.reset(); } catch (e) { } };
  }, [isScanning]);

  return (
    <div className="w-full space-y-6">
      {/* КРАСНОЕ: Основной контейнер камеры (сделали темнее и убрали лишнюю серость) */}
      <div className="relative bg-card rounded-[32px] dark:bg-[#2B3836]  border border-border/50 shadow-lg p-6 transition-all">
        {!isScanning && (
          <div className="aspect-square flex flex-col items-center justify-center space-y-6 bg-muted/30 rounded-[24px] border-2 border-dashed border-border">
            <div className="p-6 bg-background rounded-3xl border border-border shadow-sm">
              <Scan className="w-12 h-12 text-primary" />
            </div>
            <Button
              onClick={() => setIsScanning(true)}
              className="rounded-full px-8 h-12 bg-primary text-primary-foreground font-bold"
            >
              Kamera starten
            </Button>
          </div>
        )}

        {/* Состояние: Камера ВКЛ */}
        <div style={{
          display: isScanning ? 'block' : 'none',
          position: 'relative', width: '100%', aspectRatio: '1',
          borderRadius: '24px', overflow: 'hidden', background: '#000',
        }} className="ring-1 ring-white/10">
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted playsInline />

          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          <div className="absolute top-[35%] left-[5%] right-[5%] height-[30%] pointer-events-none z-10">
            <div className="absolute top-0 left-0 width-[24px] height-[24px] border-t-4 border-l-4 border-primary rounded-tl-lg shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <div className="absolute top-0 right-0 width-[24px] height-[24px] border-t-4 border-r-4 border-primary rounded-tr-lg shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <div className="absolute bottom-0 left-0 width-[24px] height-[24px] border-b-4 border-l-4 border-primary rounded-bl-lg shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <div className="absolute bottom-0 right-0 width-[24px] height-[24px] border-b-4 border-r-4 border-primary rounded-br-lg shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

            {isScanning && (
              <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
              />
            )}
          </div>

          <button onClick={stopScanner} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/80 text-white border border-white/20 rounded-full px-6 py-2 text-xs font-bold flex items-center gap-2 backdrop-blur-xl">
            <CameraOff className="w-4 h-4" /> Beenden
          </button>
        </div>
      </div>

      {/* КРАСНОЕ: Поле ввода (сделали темным и стильным) */}
      {/* Секция ввода: теперь адаптивная */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            type="number"
            placeholder="Barcode eingeben..."
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            // Убрали bg-black/30, добавили системные цвета
            className="pl-11 h-14 rounded-2xl bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button
          onClick={() => { if (manualBarcode) { onBarcodeDetected(manualBarcode); setManualBarcode(''); } }}
          // Используем variant="secondary" или настраиваем цвета через переменные
          className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md"
        >
          <Search className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

function NotFoundInfo({ barcode, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="bg-card border border-border rounded-[32px] p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-destructive/10 rounded-2xl">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <h3 className="font-black text-foreground text-lg mb-2">Produkt nicht gefunden</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Der Barcode <span className="font-mono font-bold text-primary">{barcode}</span> ist nicht in der Open Food Facts Datenbank.
        </p>

        <div className="bg-muted/30 rounded-2xl p-4 space-y-2 mb-4">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider">Was kannst du tun?</p>
          <p className="text-sm text-muted-foreground">• Versuche den Barcode manuell auf <span className="font-bold">openfoodfacts.org</span> zu suchen</p>
          <p className="text-sm text-muted-foreground">• Das Produkt existiert möglicherweise nur regional</p>
        </div>

        <Button onClick={onClose} className="w-full rounded-2xl">
          Verstanden
        </Button>
      </div>
    </motion.div>
  );
}

export default function ScanPage() {
  const [products, setProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [infoBarcode, setInfoBarcode] = useState(null);

  const handleBarcodeDetected = async (barcode) => {
    if (!barcode || isProcessing) return;
    setIsProcessing(true);
    try {
      const productData = await fetchProductInfo(barcode);
      if (productData) {
        setProducts(prev => [productData, ...prev]);
      } else {
        setProducts(prev => [{
          id: barcode,
          name: 'Produkt nicht gefunden',
          image: '',
          brand: 'EAN: ' + barcode,
          notFound: true,
        }, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background md:py-8">
      <div className="max-w-md mx-auto bg-background min-h-screen md:min-h-[850px] shadow-2xl md:rounded-[40px] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-card rounded-b-[40px] shadow-sm p-6 mb-8 border-b border-border">
          <h1 className="text-center text-xl font-black italic uppercase text-primary mb-6 tracking-tighter">
            Frever Scanner
          </h1>
          <LiveBarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
        </div>

        {/* Produktliste */}
        <div className="flex-1 px-6 pb-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">Gescannt</h2>
            {products.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setProducts([])}
                className="text-destructive text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/10">
                <Trash2 className="w-3 h-3 mr-1" /> Löschen
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground italic text-sm">
              <Loader2 className="animate-spin w-4 h-4" /> Wird gesucht...
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {products.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-12 border-2 border-dashed border-border rounded-[32px] bg-card/50">
                  <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs font-medium">Noch keine Produkte</p>
                </motion.div>
              ) : (
                products.map((item, index) => (
                  <motion.div
                    key={item.id + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border p-4 rounded-[24px] shadow-sm flex items-center gap-4 transition-all duration-300 ${item.notFound
                      ? 'bg-destructive/5 border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                      : 'bg-card border-border hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary),0.05)]'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border ${item.notFound
                      ? 'bg-destructive/10 border-destructive/20'
                      : 'bg-muted/30 border-border'
                      }`}>
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                      ) : item.notFound ? (
                        <AlertCircle className="text-destructive/50 w-6 h-6" />
                      ) : (
                        <Package className="text-muted-foreground/30 w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate text-sm leading-tight ${item.notFound ? 'text-destructive' : 'text-foreground'
                        }`}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        {item.brand}
                      </p>
                    </div>

                    {item.notFound && (
                      <button
                        onClick={() => setInfoBarcode(item.id)}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-destructive/70" />
                      </button>
                    )}

                    {!item.notFound && (
                      <div className="text-[9px] font-mono text-muted-foreground/30 rotate-90 flex-shrink-0">
                        {item.id}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {infoBarcode && (
          <NotFoundInfo barcode={infoBarcode} onClose={() => setInfoBarcode(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}