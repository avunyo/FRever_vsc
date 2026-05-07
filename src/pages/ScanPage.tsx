import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Trash2, Loader2, Keyboard, Scan, CameraOff,
  Search, AlertCircle, HelpCircle, X, ChevronLeft, PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchProductInfo } from '@/lib/foodApi';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Live barcode scanner ─────────────────────────────────────────────────────
function LiveBarcodeScanner({ onBarcodeDetected }) {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const readerRef = useRef(null);
  const detectedRef = useRef(false);

  useEffect(() => { return () => stopScanner(); }, []);

  const stopScanner = () => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch (e) {}
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
    }).catch(err => { alert('Kamera Fehler: ' + err?.message); setIsScanning(false); });
    return () => { try { reader.reset(); } catch (e) {} };
  }, [isScanning]);

  return (
    <div className="w-full space-y-4">
      {/* Camera box */}
      <div className="relative bg-card/50 rounded-3xl border border-border/40 shadow-sm p-4">
        {!isScanning && (
          <div className="py-10 flex flex-col items-center justify-center gap-5 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
            <div className="p-5 bg-card rounded-3xl border border-border/60 shadow-sm">
              <Scan className="w-10 h-10 text-primary" />
            </div>
            <Button
              onClick={() => setIsScanning(true)}
              className="rounded-2xl px-8 h-12 bg-primary text-primary-foreground font-bold text-sm"
            >
              Kamera starten
            </Button>
          </div>
        )}

        <div
          style={{
            display: isScanning ? 'block' : 'none',
            position: 'relative', width: '100%', aspectRatio: '1',
            borderRadius: '24px', overflow: 'hidden', background: '#000'
          }}
          className="ring-1 ring-white/10"
        >
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted playsInline />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 72% 38% at 50% 50%, transparent 98%, rgba(0,0,0,0.55) 100%)',
          }} />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative" style={{ width: '72%', height: '38%' }}>
                <div className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-[#4ade80] rounded-tl-md" />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-[#4ade80] rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-[#4ade80] rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-[#4ade80] rounded-br-md" />
                <motion.div
                  animate={{ top: ['2%', '98%', '2%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: '#4ade80', boxShadow: '0 0 10px 2px rgba(74,222,128,0.7)',
                  }}
                />
              </div>
            </div>
          )}
          <button
            onClick={stopScanner}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/80 text-white border border-white/20 rounded-full px-6 py-2 text-xs font-bold flex items-center gap-2 backdrop-blur-xl"
          >
            <CameraOff className="w-4 h-4" /> Beenden
          </button>
        </div>
      </div>

      {/* Manual input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            type="number"
            placeholder="Barcode eingeben..."
            value={manualBarcode}
            onChange={e => setManualBarcode(e.target.value)}
            className="pl-11 h-14 rounded-2xl bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button
          onClick={() => { if (manualBarcode) { onBarcodeDetected(manualBarcode); setManualBarcode(''); } }}
          className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 shadow-md"
        >
          <Search className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

// ─── Not-found modal ──────────────────────────────────────────────────────────
function NotFoundInfo({ barcode, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="bg-card border border-border rounded-[32px] p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-destructive/10 rounded-2xl"><AlertCircle className="w-6 h-6 text-destructive" /></div>
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
        <Button onClick={onClose} className="w-full rounded-2xl">Verstanden</Button>
      </div>
    </motion.div>
  );
}

// ─── ScanPage ─────────────────────────────────────────────────────────────────
export default function ScanPage() {
  const [products, setProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [infoBarcode, setInfoBarcode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const returnToAddProducts = location.state?.returnToAddProducts === true;

  // ── Back arrow: always goes back in history ────────────────────────────────
  const handleBack = () => navigate(-1);

  // ── "X Produkte ins Inventar" CTA: navigates to /inventory ────────────────
  // If came from AddProductsPage (returnToAddProducts=true) → reopen that sheet
  // Otherwise → go to inventory normally
  const handleAddToInventory = () => {
    navigate('/inventory', {
      state: returnToAddProducts ? { reopenAddProducts: true } : undefined,
    });
  };

  const handleBarcodeDetected = async (barcode) => {
    if (!barcode || isProcessing) return;
    setIsProcessing(true);
    try {
      const productData = await fetchProductInfo(barcode);
      if (productData) {
        setProducts(prev => [productData, ...prev]);
      } else {
        setProducts(prev => [{
          id: barcode + Date.now(),
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

  const foundProducts = products.filter(p => !p.notFound);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/40 sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-md mx-auto px-5 pt-4 pb-2 md:pt-2 md:pb-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.88 }} onClick={handleBack}
            className="h-9 w-9 rounded-2xl bg-muted/80 flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-lg font-black italic uppercase tracking-tight leading-none">
              <span className="text-foreground">Frever</span>{" "}
              <span className="text-primary">Scanner</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Barcode scannen oder eingeben</p>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <div className="flex-1 pb-28">
        <div className="max-w-md mx-auto">

          {/* Scanner section — no harsh border, just padding */}
          <div className="px-5 pt-5 pb-2">
            <LiveBarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
          </div>

          {/* Scanned list */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Erkannte Produkte</p>
                <h2 className="text-xl font-black text-foreground tracking-tight">Gescannt</h2>
              </div>
              {products.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setProducts([])}
                  className="text-destructive text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Löschen
                </Button>
              )}
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground italic text-sm">
                <Loader2 className="animate-spin w-4 h-4" /> Wird gesucht...
              </div>
            )}

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {products.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-14 border-2 border-dashed border-border/50 rounded-3xl bg-card/30"
                  >
                    <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-muted-foreground text-xs font-medium">Noch keine Produkte</p>
                  </motion.div>
                ) : products.map((item, index) => (
                  <motion.div
                    key={item.id + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border p-4 rounded-3xl shadow-sm flex items-center gap-4 ${
                      item.notFound
                        ? 'bg-destructive/5 border-destructive/30'
                        : 'bg-card border-border/60 hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border ${
                      item.notFound ? 'bg-destructive/10 border-destructive/20' : 'bg-muted/40 border-border/40'
                    }`}>
                      {item.image
                        ? <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                        : item.notFound
                          ? <AlertCircle className="text-destructive/50 w-5 h-5" />
                          : <Package className="text-muted-foreground/30 w-5 h-5" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate text-sm leading-tight ${item.notFound ? 'text-destructive' : 'text-foreground'}`}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{item.brand}</p>
                    </div>
                    {item.notFound ? (
                      <button
                        onClick={() => setInfoBarcode(item.id)}
                        className="flex-shrink-0 w-8 h-8 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-destructive/70" />
                      </button>
                    ) : (
                      <div className="text-[9px] font-mono text-muted-foreground/20 rotate-90 flex-shrink-0">{item.id}</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* ── Fixed CTA at bottom ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {foundProducts.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-20 px-5 pt-3 pb-10 bg-background/95 backdrop-blur-xl border-t border-border/30"
          >
            <div className="max-w-md mx-auto">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToInventory}
                className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                <PackageCheck className="w-5 h-5" />
                {foundProducts.length} Produkte ins Inventar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {infoBarcode && <NotFoundInfo barcode={infoBarcode} onClose={() => setInfoBarcode(null)} />}
      </AnimatePresence>
    </div>
  );
}