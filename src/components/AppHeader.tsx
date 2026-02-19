import { Link, useLocation } from "react-router-dom";
import { Home, Camera, ChefHat, BarChart3, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

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
        {/* ЛОГОТИП */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="FRever"
            className="h-7 md:h-8 object-contain dark:[filter:brightness(0)_invert(0.85)_sepia(0.3)_hue-rotate(100deg)_saturate(0.5)]"
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
                {/* Анимированный фон-овал для активного пункта */}
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

        {/* КНОПКА СМЕНЫ ТЕМЫ */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          aria-label="Theme wechseln"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      {/* НИЖНЕЕ МЕНЮ ДЛЯ ТЕЛЕФОНА */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg pb-safe">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center gap-1 px-2 py-1 text-[10px] transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {/* Маленький индикатор сверху иконки для мобилок */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator-mobile"
                    className="absolute -top-2 h-1 w-8 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="h-5 w-5" />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};