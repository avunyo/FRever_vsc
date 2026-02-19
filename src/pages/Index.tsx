import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
// ... остальные импорты (продукты, компоненты и т.д.)

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-6">
        
        {/* МОБИЛЬНАЯ КНОПКА: ТЕПЕРЬ ОНА ТУТ, НАД ПРИВЕТСТВИЕМ */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-slate-700" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-500" />
            )}
          </button>
        </div>

        {/* БЛОК ПРИВЕТСТВИЯ */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Hallo Max! 👋</h1>
          <p className="text-muted-foreground">Du hast aktuell 7 Produkte im Blick.</p>
          
          <div className="mt-4 flex gap-3">
             <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20">
               ● 3 Frisch
             </div>
             <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-sm font-medium border border-yellow-500/20">
               ● 4 Bald ablaufend
             </div>
          </div>
        </header>

        {/* ЗАГОЛОВОК СПИСКА */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Meine Produkte</h2>
          {/* Тут могут быть фильтры */}
        </div>

        {/* СПИСОК КАРТОЧЕК: ТЕПЕРЬ ОНИ БУДУТ РОВНЫМИ */}
        <div className="grid gap-4">
          {/* Твой маппинг продуктов. Главное — этот контейнер теперь внутри px-4 (через container) */}
          {/* Пример карточки: */}
          <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
             {/* Контент карточки (Dinkel Toastbrot и т.д.) */}
          </div>
          
          <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
             {/* Контент карточки (Vollmilch) */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;