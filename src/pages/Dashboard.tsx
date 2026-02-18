import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Pencil, Trash2, CalendarDays, Filter, Milk, Apple, Croissant, ChefHat, TrendingUp, AlertTriangle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "@/hooks/use-toast";

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
  { id: "1", name: "Vollmilch 1,5%", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2024-04-26", status: "expiring", quantity: 1 },
  { id: "2", name: "Bio Joghurt Erdbeer", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2024-04-28", status: "expiring", quantity: 1 },
  { id: "3", name: "Dinkel Toastbrot", category: "Backwaren", categoryIcon: Croissant, expiryDate: "2024-04-25", status: "expired", quantity: 1 },
  { id: "4", name: "Bio Bananen", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2024-04-27", status: "expiring", quantity: 6 },
  { id: "5", name: "Cheddar Scheiben", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2024-05-10", status: "fresh", quantity: 1 },
  { id: "6", name: "Butter", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2024-05-15", status: "fresh", quantity: 1 },
  { id: "7", name: "Äpfel Braeburn", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2024-05-02", status: "fresh", quantity: 4 },
];

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  fresh: { label: "Frisch", className: "bg-primary/10 text-primary" },
  expiring: { label: "Läuft bald ab!", className: "bg-warning/10 text-warning" },
  expired: { label: "Abgelaufen", className: "bg-destructive/10 text-destructive animate-pulse-soft" },
};

const filters = ["Alle", "Läuft bald ab", "Frisch", "Abgelaufen"];

const Dashboard = () => {
  const [products, setProducts] = useState(mockProducts);
  const [activeFilter, setActiveFilter] = useState("Alle");

  const expiringCount = products.filter((p) => p.status === "expiring" || p.status === "expired").length;

  const filteredProducts = products.filter((p) => {
    if (activeFilter === "Alle") return true;
    if (activeFilter === "Läuft bald ab") return p.status === "expiring";
    if (activeFilter === "Frisch") return p.status === "fresh";
    if (activeFilter === "Abgelaufen") return p.status === "expired";
    return true;
  });

  const markConsumed = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Verbraucht!", description: `${product?.name} wurde als verbraucht markiert.` });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Gelöscht", description: "Produkt wurde entfernt." });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <AppHeader />
      <main className="container px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-2xl font-bold mb-1">Hallo Max! 👋</h1>
          <p className="text-muted-foreground">
            Du hast aktuell <span className="font-semibold text-foreground">{products.length}</span> Produkte im Blick.
            {expiringCount > 0 && (
              <span className="text-warning font-medium"> {expiringCount} laufen bald ab!</span>
            )}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">Meine Produkte</h2>
              <div className="flex gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeFilter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredProducts.map((product, i) => {
                const status = statusConfig[product.status];
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <product.categoryIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{product.name}</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(product.expiryDate).toLocaleDateString("de-DE", { day: "numeric", month: "long" })}
                        </span>
                        <span>{product.quantity}x</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => markConsumed(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
                        title="Verbraucht"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Keine Produkte in dieser Kategorie.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar widgets */}
          <div className="space-y-6">
            {/* Recipe suggestion */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">Rezept der Woche</h3>
              </div>
              <div className="rounded-xl bg-muted p-4 mb-4">
                <p className="font-medium mb-1">Cremige Tomatensuppe 🍅</p>
                <p className="text-sm text-muted-foreground">
                  Perfekt, um deine Milchprodukte aufzubrauchen!
                </p>
              </div>
              <button className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                Alle Zutaten prüfen
              </button>
            </motion.div>

            {/* Savings widget */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">Dein Spar-Fortschritt</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Diesen Monat gespart</p>
                  <p className="text-2xl font-heading font-bold text-primary">25,40€</p>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">Droht zu verfallen: <span className="text-warning font-medium">7,50€</span></span>
                </div>
              </div>
            </motion.div>

            {/* Goal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-1">Monatsziel</p>
              <p className="font-heading font-bold text-lg">30€ weniger Abfall</p>
              <p className="text-sm text-primary font-medium mt-1">84% erreicht 🎉</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
