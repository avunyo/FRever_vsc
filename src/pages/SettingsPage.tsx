import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { User, Bell, Target, Sliders, Crown, Shield, Info, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const sections = [
  { icon: User, label: "Mein Konto", description: "E-Mail, Passwort, Name verwalten" },
  { icon: Bell, label: "Benachrichtigungen", description: "Push-Zeiten und Warnungen einstellen" },
  { icon: Target, label: "Ziele", description: "Monatsziel für weniger Abfall anpassen" },
  { icon: Sliders, label: "Heuristiken", description: "Haltbarkeiten für deine Produkte anpassen" },
  { icon: Crown, label: "Premium", description: "Abo verwalten und upgraden" },
  { icon: Shield, label: "Datenschutz", description: "Deine Daten und Privatsphäre" },
  { icon: Info, label: "Über FRever", description: "Version, Team und Kontakt" },
];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <AppHeader />
      <main className="container px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold mb-1">Einstellungen</h1>
          <p className="text-muted-foreground">Personalisiere dein FRever-Erlebnis</p>
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (Только для мобильных) */}
        <div className="md:hidden mb-6">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </div>
              <p className="font-medium">Dunkelmodus</p>
            </div>
            <div className={`h-6 w-11 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        {/* ОСТАЛЬНЫЕ НАСТРОЙКИ */}
        <div className="space-y-2">
          {sections.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{s.label}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;