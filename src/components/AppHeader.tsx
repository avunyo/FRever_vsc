import { Link, useLocation } from "react-router-dom";
import { Home, Refrigerator, ChefHat, BarChart3, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
// Импортируем оба варианта логотипа
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/inventory", icon: Refrigerator, label: "Inventar" },
  { to: "/recipes", icon: ChefHat, label: "Rezepte" },
  { to: "/reports", icon: BarChart3, label: "Berichte" },
  { to: "/settings", icon: Settings, label: "Einstellungen" },
];

export const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

// Если мы НЕ на главной странице
// Если мы НЕ на главной странице (режим приложения)
if (!isLandingPage) {
  return (
    <>
      {/* ЕДИНЫЙ ХЕДЕР ДЛЯ ВСЕХ УСТРОЙСТВ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl transition-all">
        <div className="container flex h-20 items-center justify-between px-4">
          
          {/* Логотип */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src={theme === "light" ? logoDark : logoLight}
              alt="FRever"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Навигация для ПК (скрыта на мобилках) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator-desktop"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Кнопка переключения темы (видна всем) */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 text-muted-foreground hover:bg-accent transition-all active:scale-95"
            aria-label="Theme wechseln"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-500" />}
          </button>
        </div>
      </header>

      {/* МОБИЛЬНАЯ НИЖНЯЯ ПАНЕЛЬ (показывается только внутри приложения) */}
      {!isLandingPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex flex-col items-center justify-center min-w-[64px] h-12 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator-mobile"
                      className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                    />
                  )}
                  <item.icon className={`h-5 w-5 mb-0.5 ${isActive ? "text-primary" : ""}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* ЛОГОТИП — ТЕПЕРЬ БУДЕТ МЕНЯТЬСЯ ПРАВИЛЬНО */}
        <Link to="/" className="flex items-center" style={{ height: '100%' }}>
  <img
    src={theme === "light" ? logoDark : logoLight}
    alt="FRever"
    className="w-auto object-contain"
    style={{ 
      height: '56px',      // Это намного больше стандартного (было около 30px)
      minHeight: '56px',   // Гарантируем, что не сожмется
      display: 'block' 
    }}
  />
</Link>

        {/* МЕНЮ ДЛЯ КОМПЬЮТЕРА */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator-desktop"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* КНОПКА СМЕНЫ ТЕМЫ — СКРЫТА НА ТЕЛЕФОНАХ (hidden), видна на ПК (md:flex) */}
    

        <button
          onClick={toggleTheme}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
          aria-label="Theme wechseln"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-500" />}
        </button>

        {/* КНОПКА СМЕНЫ ТЕМЫ ДЛЯ ПК (уже есть у вас) */}
        <button
          onClick={toggleTheme}
          className="hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          aria-label="Theme wechseln"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      {/* НИЖНЕЕ МЕНЮ (без изменений) */}
     <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg pb-safe">
       <div className="flex items-center justify-around h-16 px-2">
         {navItems.map((item) => {
           const isActive = location.pathname === item.to;
           return (
             <Link
               key={item.to}
               to={item.to}
               className={`relative flex flex-col items-center justify-center min-w-[64px] h-12 transition-colors ${
                 isActive ? "text-primary-foreground" : "text-muted-foreground"
               }`}
             >
               {/* ФОНОВАЯ КАПСУЛА (появляется только если isActive) */}
               {isActive && (
                 <motion.div
                   layoutId="nav-indicator-mobile"
                   className="absolute inset-0 bg-primary rounded-xl -z-10"
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                 />
               )}
     
               <item.icon className={`h-5 w-5 mb-0.5`} />
               <span className="text-[10px] font-medium">{item.label}</span>
             </Link>
           );
         })}
       </div>
     </nav>
    </header>
  );
};