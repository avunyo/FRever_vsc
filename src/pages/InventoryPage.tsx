import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Box, ShoppingCart, Plus, Check, Trash2, Camera,
  Milk, Apple, Croissant, Pencil, Search, CheckCheck,
  Utensils, ChevronLeft, PackageCheck,
  ReceiptText, Barcode, UserSearch, Sparkles
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type ScannedItem = {
  id: string;
  name: string;
  quantity: number;
  emoji: string;
  selected: boolean;
};

const mockProducts = [
  { id: "1",  name: "Vollmilch 1,5%",      category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-04-15", status: "expiring", quantity: 2 },
  { id: "2",  name: "Bio Joghurt Erdbeer",  category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-05-16", status: "fresh",    quantity: 1 },
  { id: "3",  name: "Dinkel Toastbrot",     category: "Backwaren",      categoryIcon: Croissant, expiryDate: "2026-04-15", status: "expiring", quantity: 1 },
  { id: "4",  name: "Bio Bananen",          category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-22", status: "fresh",    quantity: 6 },
  { id: "5",  name: "Cheddar Scheiben",     category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-06-24", status: "fresh",    quantity: 3 },
  { id: "6",  name: "Butter",               category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-06-26", status: "fresh",    quantity: 1 },
  { id: "7",  name: "Äpfel Braeburn",       category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-22", status: "fresh",    quantity: 6 },
  { id: "8",  name: "Magerquark",           category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-04-16", status: "expiring", quantity: 4 },
  { id: "9",  name: "Karotten",             category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-24", status: "fresh",    quantity: 1 },
  { id: "10", name: "Protein Brötchen",     category: "Backwaren",      categoryIcon: Croissant, expiryDate: "2026-04-16", status: "expiring", quantity: 4 },
  { id: "11", name: "Mango",                category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-10", status: "expired",  quantity: 2 },
  { id: "12", name: "Kiwi",                 category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-26", status: "fresh",    quantity: 3 },
  { id: "13", name: "Süßkartoffel",         category: "Obst & Gemüse",  categoryIcon: Apple,     expiryDate: "2026-04-28", status: "fresh",    quantity: 2 },
  { id: "14", name: "Frischkäse",           category: "Milchprodukte",  categoryIcon: Milk,      expiryDate: "2026-04-09", status: "expired",  quantity: 2 },
];

const MOCK_SCANNED_BASE = [
  { name: "Vollmilch 3,5%",   quantity: 1, emoji: "🥛", selected: true },
  { name: "Butter 250g",      quantity: 2, emoji: "🧈", selected: true },
  { name: "Bio Eier 10 Stk",  quantity: 1, emoji: "🥚", selected: true },
  { name: "Gouda Scheiben",   quantity: 1, emoji: "🧀", selected: true },
  { name: "Haferflocken",     quantity: 3, emoji: "🌾", selected: true },
  { name: "Orangensaft 1L",   quantity: 2, emoji: "🍊", selected: false },
];

function generateScannedItems(): ScannedItem[] {
  const ts = Date.now();
  return MOCK_SCANNED_BASE.map((item, idx) => ({ ...item, id: `scan-${ts}-${idx}` }));
}

// ─── Add Products Sub-Page ────────────────────────────────────────────────────
function AddProductsPage({
  onBack,
  onImport,
  onGoBarcode,
}: {
  onBack: () => void;
  onImport: (items: ScannedItem[]) => void;
  onGoBarcode: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "loading" | "list">("idle");
  const [items, setItems] = useState<ScannedItem[]>([]);
  const scanSessionRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const startScan = () => {
    scanSessionRef.current += 1;
    setItems([]);
    setPhase("loading");
  };

  useEffect(() => {
    if (phase !== "loading") return;
    const session = scanSessionRef.current;
    const t = setTimeout(() => { if (scanSessionRef.current === session) setPhase("list"); }, 1800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "list") return;
    const session = scanSessionRef.current;
    const freshItems = generateScannedItems();
    setItems([]);
    let i = 0;
    const iv = setInterval(() => {
      if (scanSessionRef.current !== session) { clearInterval(iv); return; }
      if (i >= freshItems.length) { clearInterval(iv); return; }
      setItems(prev => [...prev, freshItems[i++]]);
    }, 140);
    return () => clearInterval(iv);
  }, [phase]);

  const toggle = (id: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  const removeItem = (id: string) =>
    setItems(prev => prev.filter(it => it.id !== id));
  const selected = items.filter(it => it.selected);

  const actions = [
    {
      icon: <Barcode className="h-4 w-4" />,
      label: "Barcode\nscannen",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      iconBg: "bg-primary/15",
      onClick: onGoBarcode,
    },
    {
      icon: <Camera className="h-4 w-4" />,
      label: "Foto\nhochladen",
      color: "text-sky-500",
      bg: "bg-sky-500/10 border-sky-500/20",
      iconBg: "bg-sky-500/15",
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: <UserSearch className="h-4 w-4" />,
      label: "KI\nerkennen",
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
      iconBg: "bg-violet-500/15",
      onClick: startScan,
    },
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Manuell\nhinzufügen",
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
      iconBg: "bg-orange-500/15",
      onClick: () => toast({ description: "Kommt bald! 🚀" }),
    },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 310 }}
      className="fixed inset-0 z-40 bg-background flex flex-col overflow-hidden"
    >
      {/* ── 1. Header — compact, moved up ─────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-2.5 px-4 mt-16 pt-5 pb-3 border-b border-border/40 bg-background/95 backdrop-blur-sm">
  <motion.button 
    whileTap={{ scale: 0.88 }} 
    onClick={onBack}
    className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
  >
    <ChevronLeft className="h-4 w-4 text-foreground" />
  </motion.button>
  
  <div className="flex-1 min-w-0">
    <h1 className="font-black text-base tracking-tight text-foreground leading-none">
      Produkte hinzufügen
    </h1>
    <p className="text-[10px] text-muted-foreground mt-0.5">
      Wähle eine Methode
    </p>
  </div>
</div>

      {/* ── 2. Action buttons — smaller, closer to header ─────────────────── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-3 grid grid-cols-4 gap-1.5">
        {actions.map((action, idx) => (
          <motion.button key={idx} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border transition-all ${action.bg}`}
          >
            {/* Smaller icon container */}
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${action.iconBg} ${action.color}`}>
              {action.icon}
            </div>
            <span className={`text-[8px] font-bold text-center leading-tight ${action.color}`} style={{ whiteSpace: "pre-line" }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => {
          if (!e.target.files?.length) return;
          e.target.value = "";
          startScan();
          toast({ description: "Foto wird analysiert..." });
        }}
      />

      {/* ── 3. Divider ────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 mb-2">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Erkannte Produkte</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* ── 4. Scrollable list ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center">
                <PackageCheck className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Wähle oben eine Methode<br />um Produkte zu scannen
              </p>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="relative">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute rounded-full bg-primary" style={{ inset: -16 }}
                />
                <motion.div animate={{ scale: [1, 1.07, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center"
                >
                  <ReceiptText className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.16 }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-medium">Wird analysiert...</p>
            </motion.div>
          )}

          {phase === "list" && (
            <motion.div key="list" className="space-y-1.5 pt-0.5">
              <AnimatePresence initial={false}>
                {items.map(item => (
                  <motion.div key={item.id} layout
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.2 }}
                    className={`relative overflow-hidden rounded-xl border-2 transition-colors ${
                      item.selected ? "bg-card border-primary/30" : "bg-muted/20 border-transparent opacity-50"
                    }`}
                  >
                    <div className="absolute inset-0 bg-destructive/10 dark:bg-red-900/20 flex items-center justify-end px-4 rounded-xl">
                      <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                    </div>
                    <motion.div drag="x" dragConstraints={{ left: -70, right: 0 }} dragSnapToOrigin
                      onDragEnd={(_, info) => { if (info.offset.x < -40) removeItem(item.id); }}
                      className="relative z-10 flex items-center gap-2.5 p-2.5 bg-background dark:bg-card rounded-xl"
                      style={{ touchAction: "pan-y" }}
                    >
                      {/* Smaller emoji box */}
                      <div className="h-9 w-9 rounded-lg bg-muted/60 border border-border/30 flex items-center justify-center text-lg flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => toggle(item.id)}>
                        <p className={`text-xs font-bold truncate ${item.selected ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{item.quantity}x</p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => toast({ description: `${item.name} bearbeiten` })}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => toggle(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.selected ? "hover:bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground opacity-40"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {items.length > 0 && items.length === MOCK_SCANNED_BASE.length && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 border border-border/30 mt-1"
                >
                  <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                  <p className="text-[9px] text-muted-foreground">Tippe, um auszuwählen · Wische nach links zum Löschen</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 5. CTA button — slightly smaller, pushed a bit lower ─────────── */}
      <AnimatePresence>
        {phase === "list" && selected.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            // pb-24 pushes button a bit lower (more breathing room above tab bar)
            className="flex-shrink-0 px-4 pt-2 pb-24 bg-background/95 backdrop-blur-xl border-t border-border/30"
          >
            <div className="flex justify-between items-center mb-2 px-0.5">
              <span className="text-[10px] text-muted-foreground">{selected.length} / {items.length} ausgewählt</span>
              <button
                onClick={() => {
                  const allSel = items.every(it => it.selected);
                  setItems(prev => prev.map(it => ({ ...it, selected: !allSel })));
                }}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {items.every(it => it.selected) ? "Alle abwählen" : "Alle auswählen"}
              </button>
            </div>
            {/* Slightly smaller button: h-12 instead of h-14 */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
              onClick={() => { onImport(selected); onBack(); }}
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              <PackageCheck className="h-4 w-4" />
              {selected.length} Produkt(e) ins Inventar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main InventoryPage ───────────────────────────────────────────────────────
const InventoryPage = ({ shoppingItems: initialShoppingItems = [] }: { shoppingItems?: any[] }) => {
  const [products, setProducts] = useState(mockProducts);
  const [shoppingItems, setShoppingItems] = useState(initialShoppingItems || []);
  const [activeTab, setActiveTab] = useState<"products" | "shopping">("products");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.reopenAddProducts) {
      setShowAddPage(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const markAsBought = (item: any) => {
    setProducts(prev => [...prev, { ...item, id: Date.now().toString(), status: "fresh" }]);
    setShoppingItems((prev: any[]) => prev.filter(i => i.id !== item.id));
    toast({ title: "Gekauft! ✅", description: `${item.name} im Inventar` });
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      const match = products.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (match) setExpandedCategory(match.category);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const match = products.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (match) document.getElementById(`prod-${match.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery, products]);

  const stats = {
    fresh:    products.filter(p => p.status === "fresh").length,
    expiring: products.filter(p => p.status === "expiring").length,
    expired:  products.filter(p => p.status === "expired").length,
  };

  const groupedProducts = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, typeof products>);

  const [fabVisible, setFabVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", latest => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 50) setFabVisible(false);
    else if (latest < prev) setFabVisible(true);
  });

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ description: "Das Produkt wurde entsorgt" });
  };
  const deleteProductSilently = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

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

  const ORDER = ["Milchprodukte", "Backwaren", "Obst & Gemüse"];
  const showFab = fabVisible && !showAddPage;

  return (
    <>
      <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
        <AppHeader />
        <main className="container max-w-2xl mx-auto px-4 py-8">

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold font-heading text-foreground">Mein Inventar</h1>
              <div className="flex gap-1.5">
                {[
                  { n: stats.fresh,    dot: "bg-emerald-500", pill: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
                  { n: stats.expiring, dot: "bg-orange-500",  pill: "bg-orange-500/10 text-orange-600 border-orange-500/10" },
                  { n: stats.expired,  dot: "bg-red-500",     pill: "bg-red-500/10 text-red-600 border-red-500/10" },
                ].map(({ n, dot, pill }) => (
                  <div key={dot} className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${pill}`}>
                    <span className={`w-1 h-1 rounded-full ${dot}`} />
                    <span className="text-[10px] font-bold">{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Suchen..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex p-1 bg-muted rounded-xl mb-4">
            {(["products", "shopping"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {tab === "products" ? <><Box className="h-4 w-4" /> Produkte</> : <><ShoppingCart className="h-4 w-4" /> Einkaufsliste</>}
              </button>
            ))}
          </div>

          {activeTab === "shopping" && shoppingItems.length > 0 && (
            <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setProducts(prev => [...prev, ...shoppingItems.map((item: any) => ({ ...item, id: Math.random().toString(), status: "fresh" }))]);
                setShoppingItems([]);
                toast({ title: "Alles eingekauft! ✅" });
              }}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-semibold text-sm"
            >
              <CheckCheck className="h-4 w-4" /> Alles als gekauft markieren
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "products" ? (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {Object.entries(groupedProducts)
                  .sort(([a], [b]) => ORDER.indexOf(a) - ORDER.indexOf(b))
                  .map(([category, items]) => {
                    const isExpanded = expandedCategory === category;
                    const CategoryIcon = items[0].categoryIcon;
                    return (
                      <div key={category} className="rounded-2xl border border-border/60 shadow-sm bg-[#EAF0ED] dark:bg-[#212A28] dark:border-white/10 overflow-hidden mb-3">
                        <button onClick={() => setExpandedCategory(isExpanded ? null : category)}
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
                              <div className="px-4 pb-4">
                                <div className="h-px bg-border/50 mb-3" />
                                <AnimatePresence mode="popLayout">
                                  {[...items]
                                    .sort((a, b) => ({ expired: 1, expiring: 2, fresh: 3 }[a.status]! - { expired: 1, expiring: 2, fresh: 3 }[b.status]!))
                                    .map(item => {
                                      const isMatch = searchQuery.length > 1 && item.name.toLowerCase().includes(searchQuery.toLowerCase());
                                      return (
                                        <motion.div key={item.id} layout
                                          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                          id={`prod-${item.id}`} className="relative overflow-hidden rounded-xl mb-2"
                                        >
                                          <div className="absolute inset-0 bg-destructive/10 dark:bg-red-900/20 flex items-center justify-end px-6 rounded-xl">
                                            <Trash2 className="h-5 w-5 text-destructive opacity-40" />
                                          </div>
                                          <motion.div drag="x" dragConstraints={{ left: -70, right: 0 }} dragSnapToOrigin
                                            onDragEnd={(_, info) => { if (info.offset.x < -40) deleteProduct(item.id); }}
                                            className={`relative z-10 flex items-center justify-between p-3 border-[3px] rounded-xl transition-colors ${
                                              isMatch ? "bg-card border-primary shadow-lg"
                                              : item.status === "expiring" ? "bg-[#F6F6F6] dark:bg-[#202D2B] border-orange-500/40"
                                              : item.status === "expired"  ? "bg-[#F6F6F6] dark:bg-[#202D2B] border-red-600/40"
                                              : "bg-[#F6F6F6] dark:bg-[#202D2B] border-[#F6F6F6] dark:border-[#202D2B]"
                                            }`}
                                          >
                                            <div>
                                              <span className={`text-sm font-semibold ${isMatch ? "text-primary" : "text-foreground"}`}>{item.name}</span>
                                              <p className="text-[10px] text-muted-foreground">{item.quantity}x • {item.expiryDate}</p>
                                            </div>
                                            <div className="flex gap-1">
                                              <motion.button whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); toast({ description: "Das Produkt wurde geöffnet" }); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Utensils className="h-4 w-4" />
                                              </motion.button>
                                              <motion.button whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); toast({ description: "Das Produkt wurde verwendet" }); setTimeout(() => deleteProductSilently(item.id), 100); }} className="p-2 rounded-lg hover:bg-primary/10 text-primary">
                                                <Check className="h-4 w-4" />
                                              </motion.button>
                                              <motion.button whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); toast({ description: "Ablaufdatum geändert" }); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
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
              <motion.div key="shopping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {shoppingItems.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {shoppingItems.map((item: any) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative overflow-hidden rounded-xl mb-2">
                        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-end px-6 rounded-xl">
                          <Trash2 className="h-5 w-5 text-destructive opacity-40" />
                        </div>
                        <motion.div drag="x" dragConstraints={{ left: -70, right: 0 }} dragSnapToOrigin
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -40) {
                              setShoppingItems((prev: any[]) => prev.filter((i: any) => i.id !== item.id));
                              toast({ description: `${item.name} gelöscht` });
                            }
                          }}
                          className="relative z-10 flex items-center justify-between p-3 bg-white dark:bg-[#1A1F1E] border border-border shadow-sm rounded-xl"
                        >
                          <div className="relative pl-2">
                            <div className="absolute -left-1 -top-1 h-3 w-3 bg-orange-500 rounded-full ring-2 ring-white dark:ring-[#1A1F1E] flex items-center justify-center">
                              <span className="text-[8px] text-white font-bold">!</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.quantity}x • {item.expiryDate}</p>
                          </div>
                          <div className="flex gap-1">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => markAsBought(item)} className="p-2 rounded-lg hover:bg-primary/10 text-primary">
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

        <AnimatePresence>
          {showFab && activeTab === "products" && (
            <motion.div initial={{ scale: 0, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0, opacity: 0, y: 20 }}
              className="fixed bottom-24 right-6 z-[60] md:bottom-10 md:right-10"
            >
              <div className="relative w-16 h-16">
                <motion.button onClick={() => navigate("/scan")} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                  className="absolute -top-4 -right-4 z-10 h-9 w-9 rounded-full bg-card border-2 border-primary/30 text-primary shadow-md flex items-center justify-center"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9V5a2 2 0 0 1 2-2h4" /><path d="M21 9V5a2 2 0 0 0-2-2h-4" />
                    <path d="M3 15v4a2 2 0 0 0 2 2h4" /><path d="M21 15v4a2 2 0 0 1-2 2h-4" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                  </svg>
                </motion.button>
                <motion.button onClick={() => setShowAddPage(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center"
                >
                  <Camera className="h-7 w-7" />
                </motion.button>
              </div>
            </motion.div>
          )}
          {showFab && activeTab === "shopping" && (
            <motion.div initial={{ scale: 0, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0, opacity: 0, y: 20 }}
              className="fixed bottom-24 right-6 z-[60] md:bottom-10 md:right-10"
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => toast({ description: "Neues Item hinzufügen" })}
                className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center"
              >
                <Plus className="h-8 w-8" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddPage && (
          <AddProductsPage
            onBack={() => setShowAddPage(false)}
            onImport={handleImport}
            onGoBarcode={() => {
              setShowAddPage(false);
              navigate("/scan", { state: { returnToAddProducts: true } });
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InventoryPage;