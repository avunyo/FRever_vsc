import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingDown, Lightbulb, Sun, Moon, Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

// Данные продуктов (если они у тебя хранятся в другом месте, проверь это)
const products = [
  { id: 1, name: "Dinkel Toastbrot", date: "25. April", status: "Abgelaufen", category: "Backwaren", count: "1x", color: "text-red-500" },
  { id: 2, name: "Vollmilch 1,5%", date: "26. April", status: "Läuft bald ab!", category: "Milchprodukte", count: "1x", color: "text-yellow-500" },
  { id: 3, name: "Bio Bananen", date: "27. April", status: "Läuft bald ab!", category: "Obst & Gemüse", count: "6x", color: "text-yellow-500" },
];

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* КОНТЕЙНЕР С ОТСТУПАМИ px-4 (теперь всё будет ровно) */}
      <div className="container mx-auto px-4 pt-6">
        
        {/* 1. КНОПКА ТЕМЫ (аккуратная, справа) */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm"
          >
            {theme === "light" ? <Moon className="h-5 w-5 text-slate-700" /> : <Sun className="h-5 w-5 text-yellow-500" />}
          </button>
        </div>

        {/* 2. ПРИВЕТСТВИЕ В КАРТОЧКЕ */}
        <header className="mb-8 p-6 rounded-3xl bg-card border border-border shadow-sm">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hallo! 👋</h1>
          <p className="text-muted-foreground mb-4">Du hast aktuell 7 Produkte im Blick.</p>
          
          <div className="flex gap-3">
             <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-semibold border border-green-500/20">
               ● 3 Frisch
             </div>
             <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-semibold border border-yellow-500/20">
               ● 4 Bald ablaufend
             </div>
          </div>
        </header>

        {/* 3. ЗАГОЛОВОК И ФИЛЬТРЫ */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Meine Produkte</h2>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">Alle</button>
            <button className="px-5 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground shrink-0">Nach Ablaufdatum</button>
            <button className="px-5 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground shrink-0">Abgelaufen</button>
          </div>
        </div>

        {/* 4. СПИСОК ПРОДУКТОВ (Карточки теперь внутри px-4 и выглядят ровно) */}
        <div className="grid gap-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-card border border-border shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                  <span className={`text-xs font-medium ${product.color}`}>● {product.status}</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{product.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-secondary px-2 py-0.5 rounded-md text-xs">{product.count}</span>
                  <span>{product.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;