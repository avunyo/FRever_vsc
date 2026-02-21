import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Pencil, Trash2, CalendarDays, Milk, Apple, Croissant,
  ChefHat, TrendingUp, AlertTriangle, Target, Plus, X, ArrowRight, Settings2
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type ProductStatus = "fresh" | "expiring" | "expired";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryIcon: typeof Milk;
  expiryDate: string;
  status: ProductStatus;
  quantity: number;
}

const mockProducts: Product[] = [
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

const statusConfig: Record<ProductStatus, { label: string; className: string; dotColor: string }> = {
  fresh: { label: "Frisch", className: "bg-primary/15 text-primary border border-primary/20", dotColor: "bg-primary" },
  expiring: { label: "Läuft bald ab!", className: "bg-warning/15 text-warning border border-warning/20", dotColor: "bg-warning" },
  expired: { label: "Abgelaufen", className: "bg-destructive/15 text-destructive border border-destructive/20", dotColor: "bg-destructive" },
};

const filters = ["Alle", "Nach Ablaufdatum", "Nach Kategorie", "Abgelaufen"];

const Dashboard = () => {
  const [products, setProducts] = useState(mockProducts);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const expiringCount = products.filter((p) => p.status === "expiring" || p.status === "expired").length;
  const freshCount = products.filter((p) => p.status === "fresh").length;
  const savedAmount = 25.4;
  const atRiskAmount = 7.5;
  const goalAmount = 30;
  const goalProgress = Math.round((savedAmount / goalAmount) * 100);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === "Alle") return true;
    if (activeFilter === "Nach Ablaufdatum") return true; // sorted by date
    if (activeFilter === "Nach Kategorie") return true; // sorted by category
    if (activeFilter === "Abgelaufen") return p.status === "expired";
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeFilter === "Nach Kategorie") return a.category.localeCompare(b.category);
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });
  const displayedProducts = activeFilter === "Alle" ? sortedProducts.slice(0, 5) : sortedProducts;

  const markConsumed = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "✅ Verbraucht!", description: `${product?.name} wurde als verbraucht markiert.` });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "🗑️ Gelöscht", description: "Produkt wurde entfernt." });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
    exit: { opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <AppHeader />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 rounded-2xl bg-card border border-border p-6"
        >
          <h1 className="font-heading text-2xl font-bold mb-1">Hallo! 👋</h1>
          <p className="text-muted-foreground">
            Du hast aktuell <span className="font-semibold text-foreground">{products.length}</span> Produkte im Blick.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">{freshCount} Frisch</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 rounded-xl bg-warning/10 px-4 py-2 cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              <span className="text-sm font-medium text-warning">{expiringCount} Bald ablaufend</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2 cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-medium text-destructive">
                {products.filter(p => p.status === "expired").length} Abgelaufen
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
          {/* Products Column */}
          <div className="lg:col-span-2">
            <div className="flex flex-col mb-5">
              {/* Верхний ряд: Заголовок слева, иконка справа */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold whitespace-nowrap">
                  Zuletzt hinzugefügt
                </h2>

                
              </div>

              {/* Выпадающий список кнопок-фильтров */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2">
                      {filters.map((f) => (
                        <motion.button
                          key={f}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${activeFilter === f
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                        >
                          {f}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {displayedProducts.map((product) => {
                  const status = statusConfig[product.status];
                  return (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                      className="flex items-center gap-3 rounded-xl border border-border/60 shadow-sm dark:bg-muted/20 dark:border-white/10 bg-card p-2 group hover:border-primary/30 transition-all duration-200"
                    >
                      {/* Иконка стала меньше (h-9 w-9) */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                        <product.categoryIcon className="h-4 w-4" />
                      </div>

                      {/* Контент в одну строку */}
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate leading-none mb-1">{product.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><CalendarDays className="h-3 w-3" /> {new Date(product.expiryDate).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}</span>
                            <span>{product.quantity}x</span>
                          </div>
                        </div>

                        {/* Маленький статус справа */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.className}`}>
                          <span className={`h-1 w-1 rounded-full ${status.dotColor}`} />
                          {status.label}
                        </div>
                      </div>

                      {/* Кнопки управления (только самые важные) */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => markConsumed(product.id)} className="p-1.5 text-primary"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditingId(product.id)} className="p-1.5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {activeFilter === "Alle" && products.length > 5 && (
                <Link to="/inventory" className="block mt-6">
                  <motion.div
                    whileHover={{ scale: 1.02, backgroundColor: "var(--accent)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 
                               bg-secondary/50 border-2 border-primary/20 rounded-2xl 
                               text-primary font-bold shadow-sm hover:shadow-md 
                               hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <span>Alle {products.length} Produkte im Inventar sehen</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Link>
              )}
              {sortedProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <p className="text-lg">Keine Produkte in dieser Kategorie.</p>
                  <Link to="/scan" className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline">
                    <Plus className="h-4 w-4" /> Produkte hinzufügen
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            {/* Recipe of the Week */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                  <ChefHat className="h-5 w-5 text-primary" />
                </motion.div>
                <h3 className="font-heading font-semibold">Rezept der Woche</h3>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 mb-4">
                <p className="font-medium mb-1">Cremige Tomatensuppe 🍅</p>
                <p className="text-sm text-muted-foreground">
                  Perfekt, um deine Milchprodukte aufzubrauchen!
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/20"
                >
                  Zutaten prüfen
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Zum Rezept
                </motion.button>
              </div>
            </motion.div>

            {/* Savings Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">Dein Spar-Fortschritt</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Diesen Monat gespart</p>
                  <motion.p
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-3xl font-heading font-bold text-primary"
                  >
                    {savedAmount.toFixed(2).replace(".", ",")}€
                  </motion.p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Fortschritt</span>
                    <span>{goalProgress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalProgress}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm rounded-lg bg-warning/10 p-3">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <span className="text-muted-foreground">
                    Droht zu verfallen: <span className="text-warning font-semibold">{atRiskAmount.toFixed(2).replace(".", ",")}€</span>
                  </span>
                </div>
                <Link to="/reports">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent mt-1"
                  >
                    Zum Monatsbericht
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Monthly Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="rounded-2xl bg-primary/10 border border-primary/20 p-6 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-muted-foreground mb-1">Monatsziel</p>
              <p className="font-heading font-bold text-xl">{goalAmount}€ weniger Abfall</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-primary font-semibold mt-2"
              >
                {goalProgress}% erreicht 🎉
              </motion.p>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
