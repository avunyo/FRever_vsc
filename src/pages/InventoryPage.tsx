import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Box, ShoppingCart, Plus, CalendarDays, Check, Trash2, Camera, Milk, Apple, Croissant, Pencil, Settings2, Search, CheckCheck, Filter } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  { id: "11", name: "Mango", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "expired", quantity: 2 },
  { id: "12", name: "Kiwi", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "fresh", quantity: 3 },
  { id: "13", name: "Süßkartoffel", category: "Obst & Gemüse", categoryIcon: Apple, expiryDate: "2026-05-20", status: "fresh", quantity: 2 },
  { id: "14", name: "Frischkäse", category: "Milchprodukte", categoryIcon: Milk, expiryDate: "2026-05-20", status: "expired", quantity: 2 },

];

const InventoryPage = ({ shoppingItems }: { shoppingItems: any[] }) => {
  const [products, setProducts] = useState(mockProducts); // Теперь данные живут в стейте
  const [activeTab, setActiveTab] = useState<"products" | "shopping">("products");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);


  // Авто-раскрытие категории при поиске
  useEffect(() => {
    if (searchQuery.length > 1) {
      const firstMatch = products.find(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (firstMatch) setExpandedCategory(firstMatch.category);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Авто-скролл к найденному продукту
  useEffect(() => {
    if (searchQuery.length > 1) {
      const firstMatch = products.find(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (firstMatch) {
        const element = document.getElementById(`prod-${firstMatch.id}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [searchQuery, products]);
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, typeof products>);
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
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));

    toast({
      title: "Gelöscht🗑️ ",
      description: "Produkte wurde von deinem Inventar entfernt.",

    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <AppHeader />
      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Заголовок и поиск в одну колонну */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading mb-4 text-foreground">Mein Inventar</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* КОНТЕЙНЕР ДЛЯ ТАБОВ И КНОПКИ ФИЛЬТРА */}
        {/* ТАБЫ (теперь на всю ширину) */}
        <div className="flex p-1 bg-muted rounded-xl mb-4">
          <button
            onClick={() => { setActiveTab("products"); setShowFilters(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${activeTab === "products" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
          >
            <Box className="h-4 w-4" /> Produkte
          </button>
          <button
            onClick={() => setActiveTab("shopping")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${activeTab === "shopping" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
          >
            <ShoppingCart className="h-4 w-4" /> Einkaufsliste
          </button>
        </div>

        {/* ПЛАВАЮЩАЯ КНОПКА ФИЛЬТРА (Появляется ниже табов справа) */}


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
                  <div key={category} className="rounded-2xl border border-border/60 shadow-sm dark:bg-muted/20 dark:border-white/10 bg-card overflow-hidden transition-all shadow-sm mb-3">
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
                          {/* Контейнер для списка продуктов */}
                          <div className="px-4 pb-4 space-y-2">
                            <div className="h-[1px] bg-border/50 mb-2" />

                            {/* 1. Оборачиваем маппинг в AnimatePresence с mode="popLayout" */}
                            <AnimatePresence mode="popLayout">
                              {items.map((item) => {
                                const isMatch = searchQuery.length > 1 &&
                                  item.name.toLowerCase().includes(searchQuery.toLowerCase());

                                return (
                                  <motion.div
                                    key={item.id}
                                    layout // 2. Важно! Этот атрибут заставит соседей плавно съезжаться
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    id={`prod-${item.id}`}
                                    className="relative overflow-hidden rounded-xl mb-2"
                                  >
                                    {/* Фон с корзиной (розовая подложка) */}
                                    <div className="absolute inset-0 bg-destructive/10 dark:bg-red-900/20 flex items-center justify-end px-6 rounded-xl">
                                      <Trash2 className="h-5 w-5 text-destructive dark:text-red-400 opacity-40" />
                                    </div>

                                    {/* Сама карточка (белая/темная часть) */}
                                    <motion.div
                                      drag="x"
                                      dragConstraints={{ left: -70, right: 0 }}
                                      dragSnapToOrigin
                                      onDragEnd={(_, info) => {
                                        if (info.offset.x < -40) deleteProduct(item.id);
                                      }}
                                      className={`relative z-10 flex items-center justify-between p-3 border-2 transition-colors duration-200 rounded-xl ${isMatch
                                        ? "bg-card ring-2 ring-primary/20 shadow-lg border-primary"
                                        : "bg-white dark:bg-[#1A1F1E] shadow-sm border-transparent"
                                        }`}
                                    >
                                      <div className="flex flex-col">
                                        <span className={`text-sm font-semibold ${isMatch ? "text-primary" : "text-foreground"}`}>
                                          {item.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {item.quantity}x • {item.expiryDate}
                                        </span>
                                      </div>

                                      {/* Кнопки управления (Галочка и Карандаш) */}
                                      <div className="flex items-center gap-1">
                                        <motion.button
                                          whileTap={{ scale: 0.9 }}
                                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Check className="h-4 w-4" />
                                        </motion.button>

                                        <motion.button
                                          whileTap={{ scale: 0.9 }}
                                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                        >
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
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}

              className="space-y-3"
            >
              <div className="flex gap-2 mb-4 relative" ref={filterRef}>
                <button
                  onClick={() => {
                    // 1. Показываем уведомление
                    toast({
                      title: "Geräumt! ✅",
                      description: "Alle Produkte wurden als gekauft markiert und in den Inventar verschoben."
                    });

                    // 2. Находим все элементы списка покупок и скрываем их
                    shoppingItems.forEach(item => {
                      const el = document.getElementById(`shop-${item.id}`);
                      if (el) {
                        el.style.display = 'none';
                      }
                    });

                    // Если у тебя есть локальный стейт для списка покупок, 
                    // здесь можно вызвать функцию его очистки, например: setShoppingItems([]);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-card border border-border rounded-xl text-[11px] font-semibold hover:bg-accent transition-colors"
                >
                  <CheckCheck className="h-4 w-4 text-primary" />
                  Alles als gekauft markieren
                </button>

                {/* Выпадающее меню */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 top-12 w-48 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-[100]"
                    >
                      {["Alle", "Obst & Gemüse", "Milchprodukte", "Backwaren"].map((f) => (
                        <button
                          key={f}
                          onClick={() => { setActiveFilter(f); setShowFilters(false); }}
                          className={`w-full text-left px-4 py-3 text-xs transition-colors hover:bg-muted ${activeFilter === f ? "text-primary font-bold bg-primary/5" : "text-foreground"
                            }`}
                        >
                          {f}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col gap-2">
                {shoppingItems.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <AnimatePresence mode="popLayout">
                      {shoppingItems.map((item) => (
                        <motion.div
                          key={item.id}
                          id={`shop-${item.id}`} // Добавили ID для управления
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative overflow-hidden rounded-xl"
                        >
                          {/* Розовый фон при свайпе */}
                          <div className="absolute inset-0 bg-destructive/10 flex items-center justify-end px-6 rounded-xl">
                            <Trash2 className="h-5 w-5 text-destructive opacity-40" />
                          </div>

                          {/* Карточка продукта */}
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: -70, right: 0 }}
                            dragSnapToOrigin
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -40) {
                                const el = document.getElementById(`shop-${item.id}`);
                                if (el) el.style.display = 'none';
                                toast({ description: `${item.name} gelöscht` });
                              }
                            }}
                            className="relative z-10 flex items-center justify-between p-3 bg-white dark:bg-[#1A1F1E] border border-border shadow-sm rounded-xl"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">{item.name}</span>
                              <span className="text-[10px] text-muted-foreground">Einkaufsliste</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Кнопка "Куплено" — она скрывает товар */}
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                onClick={() => {
                                  const el = document.getElementById(`shop-${item.id}`);
                                  if (el) el.style.display = 'none';
                                  toast({ title: "Gekauft! ✅", description: `${item.name} im Inventar` });
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </motion.button>

                              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-10">Deine Einkaufsliste ist noch leer.</p>
                )}
              </div>
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