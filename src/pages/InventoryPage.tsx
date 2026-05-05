import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Box, ShoppingCart, Plus, Check, Trash2, Camera,
  Milk, Apple, Croissant, Pencil, Search, CheckCheck,
  Utensils, X, Barcode, ImageUp, ChevronLeft,
  Sparkles, PackageCheck, ReceiptText
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ScannedItem = {
  id: string;
  name: string;
  quantity: number;
  emoji: string;
  selected: boolean;
};

// ─── Mock data ─────────────────────────────────────────────────────────────────
const mockProducts = [
  { id: "1",  name: "Vollmilch 1,5%",       category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-04-15", status: "expiring", quantity: 2 },
  { id: "2",  name: "Bio Joghurt Erdbeer",   category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-05-16", status: "fresh",    quantity: 1 },
  { id: "3",  name: "Dinkel Toastbrot",      category: "Backwaren",      categoryIcon: Croissant, expiryDate: "2026-04-15", status: "expiring", quantity: 1 },
  { id: "4",  name: "Bio Bananen",           category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-22", status: "fresh",    quantity: 6 },
  { id: "5",  name: "Cheddar Scheiben",      category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-06-24", status: "fresh",    quantity: 3 },
  { id: "6",  name: "Butter",                category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-06-26", status: "fresh",    quantity: 1 },
  { id: "7",  name: "Äpfel Braeburn",        category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-22", status: "fresh",    quantity: 6 },
  { id: "8",  name: "Magerquark",            category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-04-16", status: "expiring", quantity: 4 },
  { id: "9",  name: "Karotten",              category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-24", status: "fresh",    quantity: 1 },
  { id: "10", name: "Protein Brötchen",      category: "Backwaren",      categoryIcon: Croissant, expiryDate: "2026-04-16", status: "expiring", quantity: 4 },
  { id: "11", name: "Mango",                 category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-10", status: "expired",  quantity: 2 },
  { id: "12", name: "Kiwi",                  category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-26", status: "fresh",    quantity: 3 },
  { id: "13", name: "Süßkartoffel",          category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-28", status: "fresh",    quantity: 2 },
  { id: "14", name: "Frischkäse",            category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-04-09", status: "expired",  quantity: 2 },
];

const MOCK_SCANNED: ScannedItem[] = [
  { id: "s1", name: "Vollmilch 3,5%",   quantity: 1, emoji: "🥛", selected: true },
  { id: "s2", name: "Butter 250g",      quantity: 2, emoji: "🧈", selected: true },
  { id: "s3", name: "Bio Eier 10 Stk",  quantity: 1, emoji: "🥚", selected: true },
  { id: "s4", name: "Gouda Scheiben",   quantity: 1, emoji: "🧀", selected: true },
  { id: "s5", name: "Haferflocken",     quantity: 3, emoji: "🌾", selected: true },
  { id: "s6", name: "Orangensaft 1L",   quantity: 2, emoji: "🍊", selected: false },
];

// ─── Receipt Page (sub-screen) ─────────────────────────────────────────────────
function ReceiptPage({
  onBack,
  onImport,
  onScanBarcode,
}: {
  onBack: () => void;
  onImport: (items: ScannedItem[]) => void;
  onScanBarcode: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "list">("intro");
  const [items, setItems] = useState<ScannedItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Phase 1: after 1.6s switch to list phase
  useEffect(() => {
    if (phase !== "intro") return;
    const t = setTimeout(() => setPhase("list"), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 2: when list phase starts, reveal items one by one
  useEffect(() => {
    if (phase !== "list") return;
    setItems([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= MOCK_SCANNED.length) { clearInterval(interval); return; }
      const item = MOCK_SCANNED[i];
      setItems(prev => [...prev, item]);
      i++;
    }, 130);
    return () => clearInterval(interval);
  }, [phase]);

  const toggle = (id: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));

  const selectedCount = items.filter(i => i.selected).length;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-40 bg-background flex flex-col"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 border-b border-border/50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </motion.button>
        <div>
          <h1 className="font-black text-base text-foreground tracking-tight">Kassenbon</h1>
          <p className="text-[10px] text-muted-foreground">Produkte hinzufügen</p>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-5 pt-4 pb-3 grid grid-cols-2 gap-3">
        {/* Barcode scannen */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onScanBarcode}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary transition-all hover:bg-primary/15"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Barcode className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold tracking-tight">Barcode scannen</span>
        </motion.button>

        {/* Foto hochladen */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-muted/60 border border-border text-foreground transition-all hover:bg-muted"
        >
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <ImageUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-xs font-bold tracking-tight text-muted-foreground">Foto hochladen</span>
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            if (!e.target.files?.length) return;
            e.target.value = "";
            setItems([]);
            setPhase("intro");
            toast({ description: "Foto wird analysiert..." });
          }}
        />
      </div>

      {/* ── Divider with label ── */}
      <div className="flex items-center gap-3 px-5 mb-3">
        <div className="flex-1 h-[1px] bg-border/60" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Erkannte Produkte
        </span>
        <div className="flex-1 h-[1px] bg-border/60" />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            /* ── Intro animation ── */
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-6"
            >
              {/* Pulsing receipt icon */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-primary"
                  style={{ margin: "-16px" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center"
                >
                  <ReceiptText className="h-8 w-8 text-primary" />
                </motion.div>
              </div>

              {/* Animated dots */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground font-medium">Bon wird analysiert...</p>
            </motion.div>
          ) : (
            /* ── Product list ── */
            <motion.div key="list" className="space-y-2">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => toggle(item.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all select-none ${
                      item.selected
                        ? "bg-primary/8 border-primary/40 dark:bg-primary/10"
                        : "bg-muted/30 border-transparent opacity-50"
                    }`}
                  >
                    {/* Emoji */}
                    <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-xl flex-shrink-0 border border-border/40">
                      {item.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${item.selected ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.quantity}x</p>
                    </div>

                    {/* Checkmark */}
                    <motion.div
                      initial={false}
                      animate={{ scale: item.selected ? 1 : 0.7, opacity: item.selected ? 1 : 0.3 }}
                      className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.selected ? "bg-primary" : "bg-muted border border-border"
                      }`}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Sparkle note */}
              {items.length === MOCK_SCANNED.length && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40 border border-border/40 mt-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground">
                    Tippe auf ein Produkt um die Auswahl zu ändern
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ── */}
      <AnimatePresence>
        {phase === "list" && selectedCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-background/90 backdrop-blur-xl border-t border-border/40"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { onImport(items.filter(i => i.selected)); onBack(); }}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            >
              <PackageCheck className="h-5 w-5" />
              {selectedCount} Produkte ins Inventar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main InventoryPage ────────────────────────────────────────────────────────
const InventoryPage = ({ shoppingItems: initialShoppingItems = [] }: { shoppingItems?: any[] }) => {
  const [products, setProducts] = useState(mockProducts);
  const [shoppingItems, setShoppingItems] = useState(initialShoppingItems || []);
  const [activeTab, setActiveTab] = useState<"products" | "shopping">("products");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceiptPage, setShowReceiptPage] = useState(false);
  const navigate = useNavigate();

  const markAsBought = (item: any) => {
    setProducts(prev => [...prev, { ...item, id: Date.now().toString(), status: "fresh" }]);
    setShoppingItems(prev => prev.filter(i => i.id !== item.id));
    toast({ title: "Gekauft! ✅", description: `${item.name} im Inventar` });
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      const firstMatch = products.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (firstMatch) setExpandedCategory(firstMatch.category);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const firstMatch = products.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (firstMatch)
        document.getElementById(`prod-${firstMatch.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery, products]);

  const stats = {
    fresh:    products.filter(p => p.status === "fresh").length,
    expiring: products.filter(p => p.status === "expiring").length,
    expired:  products.filter(p => p.status === "expired").length,
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 50) setIsVisible(false);
    else if (latest < previous) setIsVisible(true);
  });

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ description: "Das Produkt wurde entsorgt" });
  };
  const deleteProductSilently = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleImport = (items: ScannedItem[]) => {
    const newProds = items.map((item, i) => ({
      id: `imported-${Date.now()}-${i}`,
      name: item.name,
      category: "Milchprodukte" as const,
      categoryIcon: Milk,
      expiryDate: "2026-06-01",
      status: "fresh" as const,
      quantity: item.quantity,
    }));
    setProducts(prev => [...prev, ...newProds]);
    toast({ title: `${items.length} Produkte importiert ✅` });
  };

  return (
    <>
      <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
        <AppHeader />
        <main className="container max-w-2xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold font-heading text-foreground">Mein Inventar</h1>
              <div className="flex gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold">{stats.fresh}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/10">
                  <span className="w-1 h-1 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-bold">{stats.expiring}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-600 border border-red-500/10">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold">{stats.expired}</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-muted rounded-xl mb-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${activeTab === "products" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              <Box className="h-4 w-4" /> Produkte
            </button>
            <button
              onClick={() => setActiveTab("shopping")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${activeTab === "shopping" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              <ShoppingCart className="h-4 w-4" /> Einkaufsliste
            </button>
          </div>

          {activeTab === "shopping" && shoppingItems.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setProducts(prev => [...prev, ...shoppingItems.map((item: any) => ({ ...item, id: Math.random().toString(), status: "fresh" }))]);
                setShoppingItems([]);
                toast({ title: "Alles eingekauft! ✅", description: "Alle Produkte wurden ins Inventar verschoben." });
              }}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-semibold text-sm hover:bg-primary/20 transition-colors"
            >
              <CheckCheck className="h-4 w-4" /> Alles als gekauft markieren
            </motion.button>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "products" ? (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                {Object.entries(groupedProducts)
                  .sort(([a], [b]) => {
                    const order = ["Milchprodukte", "Backwaren", "Obst & Gemüse"];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map(([category, items]) => {
                    const isExpanded = expandedCategory === category;
                    const CategoryIcon = items[0].categoryIcon;
                    return (
                      <div key={category} className="rounded-2xl border border-border/60 shadow-sm bg-[#EAF0ED] dark:bg-[#212A28] dark:border-white/10 overflow-hidden transition-all h-fit mb-3">
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : category)}
                          className={`w-full flex items-center justify-between p-4 transition-colors ${isExpanded ? "bg-primary/5" : "hover:bg-muted/50"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? "bg-primary text-white" : "bg-muted/100 text-muted-foreground"}`}>
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
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                              <div className="px-4 pb-4 space-y-2">
                                <div className="h-[1px] bg-border/50 mb-2" />
                                <AnimatePresence mode="popLayout">
                                  {items
                                    .sort((a, b) => {
                                      const priority = { expired: 1, expiring: 2, fresh: 3 };
                                      return (priority[a.status as keyof typeof priority] || 4) - (priority[b.status as keyof typeof priority] || 4);
                                    })
                                    .map(item => {
                                      const isMatch = searchQuery.length > 1 && item.name.toLowerCase().includes(searchQuery.toLowerCase());
                                      return (
                                        <motion.div
                                          key={item.id}
                                          layout
                                          initial={{ opacity: 0, scale: 0.96 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                          id={`prod-${item.id}`}
                                          className="relative overflow-hidden rounded-xl mb-2"
                                        >
                                          <div className="absolute inset-0 bg-destructive/10 dark:bg-red-900/20 flex items-center justify-end px-6 rounded-xl">
                                            <Trash2 className="h-5 w-5 text-destructive dark:text-red-400 opacity-40" />
                                          </div>
                                          <motion.div
                                            drag="x"
                                            dragConstraints={{ left: -70, right: 0 }}
                                            dragSnapToOrigin
                                            onDragEnd={(_, info) => { if (info.offset.x < -40) deleteProduct(item.id); }}
                                            className={`relative z-10 flex items-center justify-between p-3 border-[3px] transition-colors duration-200 rounded-xl ${
                                              isMatch ? "bg-card border-primary shadow-lg"
                                              : item.status === "expiring" ? "bg-[#F6F6F6] dark:bg-[#202D2B] border-orange-500/40"
                                              : item.status === "expired"  ? "bg-[#F6F6F6] dark:bg-[#202D2B] border-red-600/40"
                                              : "bg-[#F6F6F6] dark:bg-[#202D2B] border-[#F6F6F6] dark:border-[#202D2B] shadow-sm"
                                            }`}
                                          >
                                            <div className="flex flex-col">
                                              <span className={`text-sm font-semibold ${isMatch ? "text-primary" : "text-foreground"}`}>{item.name}</span>
                                              <span className="text-[10px] text-muted-foreground">{item.quantity}x • {item.expiryDate}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                                onClick={e => { e.stopPropagation(); toast({ description: "Das Produkt wurde geöffnet" }); }}>
                                                <Utensils className="h-4 w-4" />
                                              </motion.button>
                                              <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                onClick={e => { e.stopPropagation(); toast({ description: "Das Produkt wurde verwendet" }); setTimeout(() => deleteProductSilently(item.id), 100); }}>
                                                <Check className="h-4 w-4" />
                                              </motion.button>
                                              <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                                onClick={e => { e.stopPropagation(); toast({ description: "Das Ablaufdatum wurde geändert" }); }}>
                                                <Pencil className="h-4 w-4" />
                                              </motion.button>
                                            </div>
                                          </motion.div>
                                        </motion.div>
                                      );
                                    })}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </motion.div>
            ) : (
              <motion.div key="shopping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                {shoppingItems.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {shoppingItems.map((item: any) => (
                      <motion.div key={item.id} id={`shop-${item.id}`} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-end px-6 rounded-xl">
                          <Trash2 className="h-5 w-5 text-destructive opacity-40" />
                        </div>
                        <motion.div drag="x" dragConstraints={{ left: -70, right: 0 }} dragSnapToOrigin
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -40) {
                              const el = document.getElementById(`shop-${item.id}`);
                              if (el) el.style.display = "none";
                              toast({ description: `${item.name} gelöscht` });
                            }
                          }}
                          className="relative z-10 flex items-center justify-between p-3 bg-white dark:bg-[#1A1F1E] border border-border shadow-sm rounded-xl"
                        >
                          <div className="flex flex-col relative">
                            <div className="absolute -left-3 -top-1 h-3 w-3 bg-orange-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#1A1F1E] z-10">
                              <span className="text-[8px] text-white font-bold">!</span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground">{item.quantity}x • {item.expiryDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" onClick={() => markAsBought(item)}>
                              <Check className="h-4 w-4" />
                            </motion.button>
                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Pencil className="h-4 w-4" /></button>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <p className="text-center text-muted-foreground py-10">Deine Einkaufsliste ist noch leer.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Floating Buttons ── */}
        <AnimatePresence>
          {isVisible && activeTab === "products" && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-[60] md:bottom-10 md:right-10"
            >
              <div className="relative w-16 h-16">
                {/* Secondary: receipt page */}
                <motion.button
                  onClick={() => setShowReceiptPage(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-4 -right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border-[2.5px] border-background"
                  title="Kassenbon scannen"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9V5a2 2 0 0 1 2-2h4" />
                    <path d="M21 9V5a2 2 0 0 0-2-2h-4" />
                    <path d="M3 15v4a2 2 0 0 0 2 2h4" />
                    <path d="M21 15v4a2 2 0 0 1-2 2h-4" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                  </svg>
                </motion.button>

                {/* Main: camera → /scan */}
                <motion.button
                  onClick={() => navigate("/scan")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40"
                  title="Barcode scannen"
                >
                  <Camera className="h-7 w-7" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {isVisible && activeTab === "shopping" && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-[60] md:bottom-10 md:right-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast({ description: "Neues Item hinzufügen" })}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40"
              >
                <Plus className="h-8 w-8" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Receipt Sub-Page (slides in over everything) ── */}
      <AnimatePresence>
        {showReceiptPage && (
          <ReceiptPage
            onBack={() => setShowReceiptPage(false)}
            onImport={handleImport}
            onScanBarcode={() => { setShowReceiptPage(false); navigate("/scan"); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InventoryPage;