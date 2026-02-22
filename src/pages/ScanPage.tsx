import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, ArrowLeft, Plus, X, Pencil, Trash2, CalendarDays, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "@/hooks/use-toast";

interface ScannedProduct {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
}

const mockProducts: ScannedProduct[] = [
  { id: "1", name: "Bio Joghurt Erdbeer", category: "Milchprodukte", expiryDate: "2024-04-28", quantity: 1 },
  { id: "2", name: "Vollmilch 1,5%", category: "Milchprodukte", expiryDate: "2024-04-26", quantity: 1 },
  { id: "3", name: "Cheddar Scheiben", category: "Milchprodukte", expiryDate: "2024-05-10", quantity: 1 },
  { id: "4", name: "Dinkel Toastbrot", category: "Backwaren", expiryDate: "2024-04-25", quantity: 1 },
  { id: "5", name: "Bio Bananen", category: "Obst & Gemüse", expiryDate: "2024-04-27", quantity: 6 },
];

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const [showList, setShowList] = useState(true);

  const handleUpload = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setProducts([...mockProducts]);
      setShowReview(true);
    }, 3000);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload();
  }, [handleUpload]);

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const confirmProducts = () => {
    setShowReview(false);
    toast({ title: "Produkte erfolgreich hinzugefügt!", description: `${products.length} Produkte wurden gespeichert.` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <AppHeader />
      <main className="container px-4 py-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold mb-2">Produkte hinzufügen</h1>
          <p className="text-muted-foreground">
            Scanne deinen Kassenbon, um Produkte automatisch zu erkennen.
          </p>
        </div>

        {/* Dropzone */}
        {!isScanning && !showReview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={handleUpload}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all ${isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Camera className="h-8 w-8" />
              </div>
              <div>
                <p className="font-heading font-semibold text-lg mb-1">Kassenbon scannen</p>
                <p className="text-sm text-muted-foreground">
                  Klicke hier oder ziehe ein Bild deines Kassenbons per Drag & Drop
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Upload className="h-3 w-3" />
                JPG, PNG, PDF
              </div>
            </div>
          </motion.div>
        )}

        {/* Scanning animation */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-heading font-semibold mb-1">Kassenbon wird analysiert...</p>
              <p className="text-sm text-muted-foreground">Das dauert nur einen Moment</p>
            </div>
            <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </motion.div>
        )}

        {/* Review modal */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Заголовок с кнопкой Скрыть/Показать */}
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-lg font-bold">Erkannte Produkte</h2>
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {products.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowList(!showList)}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  {showList ? "Verstecken" : "Anzeigen"}
                </button>
              </div>

              <AnimatePresence>
                {showList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                      Ablaufdaten wurden geschätzt. Bitte kurz prüfen.
                    </p>

                    <div className="space-y-2 mt-4">
                      {products.map((product) => (
    <motion.div
      key={product.id}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative overflow-hidden rounded-xl mb-2" // Убрали внешние границы
    >
      {/* 1. ПОДЛОЖКА: Тот самый пастельный красно-коричневый из инвентаря */}
      <div 
        className="absolute inset-0 flex items-center justify-end px-6"
        style={{ backgroundColor: '#2D1B1B' }} // Цвет один-в-один как на скрине
      >
        <div className="flex flex-col items-center gap-1">
          <Trash2 className="h-5 w-5 text-red-500/80" />
          <span className="text-[9px] font-bold text-red-500/80 uppercase tracking-wider">Löschen</span>
        </div>
      </div>

      {/* 2. КАРТОЧКА: Темная, без светлой обводки */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) removeProduct(product.id);
        }}
        // bg-[#1A1F1E] — это глубокий темно-зеленый/серый фон со скрина
        // border-white/5 — делаем обводку почти невидимой, чтобы не "резало" глаз
        className="relative z-10 flex items-center justify-between p-4 bg-[#1A1F1E] border border-white/5 shadow-sm rounded-xl"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-white/90">
            {product.name}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <span>{product.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span>{product.expiryDate}</span>
            </div>
            <span>•</span>
            <span>{product.quantity}x</span>
          </div>
        </div>

        {/* 3. КНОПКА ПРАВКИ: Тонкая и неяркая */}
        <div className="flex items-center">
          <button 
            className="p-2 text-white/20 hover:text-white/60 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Кнопки действий снизу */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setShowReview(false); setProducts([]); }}
                  className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmProducts}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all"
                >
                  Alle ({products.length})
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual entry link */}
        {!isScanning && !showReview && (
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Produkte lieber{" "}
            <button className="text-primary font-medium hover:underline">manuell hinzufügen</button>?
          </p>
        )}
      </main>
    </div>
  );
};

export default ScanPage;
