import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, ArrowLeft, Plus, X, Pencil, Trash2, CalendarDays } from "lucide-react";
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
    <div className="min-h-screen bg-background">
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
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all ${
              isDragging
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
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold">Erkannte Produkte überprüfen</h2>
                <span className="text-sm text-muted-foreground">{products.length} Produkte</span>
              </div>

              <p className="text-sm text-muted-foreground">
                Das Ablaufdatum wird basierend auf typischen Haltbarkeiten geschätzt. Bitte prüfe es kurz!
              </p>

              <div className="space-y-3">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{product.category}</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(product.expiryDate).toLocaleDateString("de-DE")}
                        </span>
                        <span>{product.quantity}x</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowReview(false); setProducts([]); }}
                  className="flex-1 rounded-xl border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-accent"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmProducts}
                  className="flex-1 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl"
                >
                  Alle hinzufügen
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
