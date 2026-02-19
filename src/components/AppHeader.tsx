import { Link, useLocation } from "react-router-dom";
import { Home, Camera, ChefHat, BarChart3, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
// Импортируем оба варианта логотипа
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/scan", icon: Camera, label: "Scannen" },
  { to: "/recipes", icon: ChefHat, label: "Rezepte" },
  { to: "/reports", icon: BarChart3, label: "Berichte" },
  { to: "/settings", icon: Settings, label: "Einstellungen" },
];

export const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* ЛОГОТИП — ТЕПЕРЬ БУДЕТ МЕНЯТЬСЯ ПРАВИЛЬНО */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={theme === "light" ? logoDark : logoLight}
            alt="FRever"
            className="h-7 md:h-8 object-contain"
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