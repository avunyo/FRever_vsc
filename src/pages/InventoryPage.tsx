import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Box, ShoppingCart, Plus, CalendarDays, Check, Trash2, Camera, Milk, Apple, Croissant } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Link } from "react-router-dom";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const mockProducts = [
  { id: "1", name: "Vollmilch 1,5%", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-20", status: "expiring", quantity: 2 },
  { id: "2", name: "Bio Joghurt Erdbeer", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-28", status: "fresh", quantity: 1 },
  { id: "3", name: "Dinkel Toastbrot", category: "Backwaren", categoryIcon: Croissant, expiryDate: "2026-05-25", status: "expiring", quantity: 1 },
  { id: "4", name: "Bio Bananen", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-27", status: "fresh", quantity: 6 },
  { id: "5", name: "Cheddar Scheiben", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-10", status: "fresh", quantity: 3 },
  { id: "6", name: "Butter", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-15", status: "fresh", quantity: 1 },
  { id: "7", name: "Äpfel Braeburn", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-02", status: "fresh", quantity: 6 },
  { id: "8", name: "Magerquark", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-20", status: "expiring", quantity: 4 },
  { id: "9", name: "Karotten", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "fresh", quantity: 1 },
  { id: "10", name: "Protein Brötchen", category: "Backwaren", categoryIcon: Croissant, expiryDate: "2026-05-20", status: "expiring", quantity: 4 },
  { id: "11", name: "mango", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "expired", quantity: 2 },
  { id: "12", name: "Kiwi", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "fresh", quantity: 3 },
  { id: "13", name: "Süßkartoffel", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "fresh", quantity: 2 },
  { id: "14", name: "Frischkäse", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-20", status: "expired", quantity: 2 },
];

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<"products" | "shopping">("products");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const groupedProducts = mockProducts.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, typeof mockProducts>);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

 // Логика появления/исчезновения кнопки
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Если проскроллили больше 50px и идем ВНИЗ — скрываем
    if (latest > previous && latest > 50) {
      setIsVisible(false);
    } 
    // Если скроллим ВВЕРХ — показываем
    else if (latest < previous) {
      setIsVisible(true);
    }
  });

  // Чтобы кнопка была видна СРАЗУ при заходе на страницу:
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <AppHeader />
      <main className="container max-w-2xl mx-auto px-4 py-8">

        {/* ЗАГОЛОВОК */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-heading">Mein Inventar</h1>
          
        </div>


        {/* ПЕРЕКЛЮЧАТЕЛЬ (TABS) */}
        <div className="flex p-1 bg-muted rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "products" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
          >
            <Box className="h-4 w-4" />
            Meine Produkte
          </button>
          <button
            onClick={() => setActiveTab("shopping")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "shopping" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Einkaufsliste
          </button>
        </div>

        {/* КОНТЕНТ */}
        <AnimatePresence mode="wait">
          {activeTab === "products" ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Сюда позже перенесем твой маппинг продуктов из Dashboard */}

              {Object.entries(groupedProducts).map(([category, items]) => {
                const isExpanded = expandedCategory === category;
                const CategoryIcon = items[0].categoryIcon;

                return (
                  <div key={category} className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-sm mb-3">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className={`w-full flex items-center justify-between p-4 transition-colors ${isExpanded ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-sm">{category}</h3>
                          <p className="text-[10px] text-muted-foreground">{items.length} Produkte</p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 45 : 0 }}>
                        <Plus className={`h-5 w-5 ${isExpanded ? "text-primary" : "text-muted-foreground"}`} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="px-4 pb-4 space-y-2">
                            <div className="h-[1px] bg-border/50 mb-2" />
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                                <div className="flex flex-col text-left">
                                  <span className="text-sm font-medium">{item.name}</span>
                                  <span className="text-[10px] text-muted-foreground">Bis: {item.expiryDate}</span>
                                </div>
                                <span className="text-xs font-bold bg-muted px-2 py-1 rounded-lg">
                                  {item.quantity}x
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-center text-muted-foreground py-10">Deine Einkaufsliste ist noch leer.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[60] md:bottom-10 md:right-10"
          >
            <Link to="/scan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40"
              >
                <Camera className="h-8 w-8" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryPage;