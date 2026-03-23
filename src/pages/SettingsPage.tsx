import { AppHeader } from "@/components/AppHeader";
import { AnimatePresence, motion } from "framer-motion";
import { User, Bell, Target, Sliders, Crown, Shield, Info, Sun, Moon, Lock, EyeOff, FileText, Clock, Zap, Minus, Plus, Github, Mail } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { useState } from "react";

const sections = [
  { icon: Crown, label: "Premium", description: "Abo verwalten und upgraden" },
  { icon: User, label: "Mein Konto", description: "E-Mail, Passwort, Name verwalten" },
  { icon: Bell, label: "Benachrichtigungen", description: "Push-Zeiten, Warnungen und Heuristiken einstellen" },
  { icon: Target, label: "Ziele", description: "Monatsziel für weniger Abfall anpassen" },
  { icon: Shield, label: "Datenschutz", description: "Deine Daten und Privatsphäre" },
  { icon: Info, label: "Über FRever", description: "Version, Team und Kontakt" },
];


const SettingsPage = () => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [remindTime, setRemindTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4]);
  const [morningCheck, setMorningCheck] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>("eco");
  const [isConfiguringHeuristics, setIsConfiguringHeuristics] = useState(false);
  const [emailMenu, setEmailMenu] = useState<{ name: string, email: string } | null>(null);

  const [heuristicsData, setHeuristicsData] = useState([
    { id: 'milk', label: "Milchprodukte", icon: "🥛", days: 4, color: "bg-blue-500" },
    { id: 'meat', label: "Frisches Fleisch", icon: "🥩", days: 2, color: "bg-red-500" },
    { id: 'veggies', label: "Obst & Gemüse", icon: "🥦", days: 10, color: "bg-emerald-500" },
    { id: 'bread', label: "Backwaren", icon: "🥐", days: 3, color: "bg-amber-500" }
  ]);

  const updateDays = (id: string, delta: number) => {
    setHeuristicsData(prev => prev.map(item =>
      item.id === id ? { ...item, days: Math.max(1, Math.min(30, item.days + delta)) } : item
    ));
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Вместо alert можно сделать красивый тост, но пока оставим так:
    alert("Email kopiert: " + text);
    setEmailMenu(null);
  };
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <AppHeader />
      <main className="container px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold mb-1">Einstellungen</h1>
          <p className="text-muted-foreground">Personalisiere dein FRever-Erlebnis</p>
        </div>

        {/* ТОЛЬКО ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ - ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ */}
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
          {sections.map((s, i) => {
            const isPremium = s.label === "Premium";
            const isAccount = s.label === "Mein Konto";

            // Общие стили для обоих типов элементов
            const content = (
              <>
                {/* Иконка */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isPremium
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                  <s.icon className={isPremium ? "h-6 w-6" : "h-5 w-5"} />
                </div>

                {/* Текст */}
                <div>
                  <p className={`font-medium ${isPremium ? "text-primary text-lg font-bold" : ""}`}>
                    {s.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>

                {/* Значок PRO */}
                {isPremium && (
                  <span className="ml-auto bg-primary text-[10px] font-black px-2 py-1 rounded-md text-primary-foreground tracking-tighter">
                    PRO
                  </span>
                )}
              </>
            );

            const className = `w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all group relative overflow-hidden ${isPremium
              ? "border-primary/50 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent shadow-[0_0_20px_rgba(var(--primary),0.1)] hover:scale-[1.02] active:scale-[0.98] mb-4"
              : "border-border bg-card hover:bg-accent active:scale-[0.99]"
              }`;

            // Рендерим либо Link для аккаунта, либо кнопку для модалок
            if (isAccount) {
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to="/account" className={className}>
                    {content}
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.button
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveModal(s.label)}
                className={className}
              >
                {content}
              </motion.button>
            );
          })}
        </div>

      </main>
      <div className="mt-20 mb-10 flex flex-col items-center gap-4 border-t border-border pt-12">
        <Link to="/" className="active:scale-95 transition-transform">
          <img
            src={theme === "light" ? logoDark : logoLight}
            alt="FRever Home"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Version 1.0.0  | © 2026 FRever Team
        </p>
      </div>
      <AnimatePresence>
        {showPremiumModal && (
          <>
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
            />

            {/* Сама шторка */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/20 rounded-t-[32px] z-[80] p-6 pb-10 max-w-2xl mx-auto shadow-2xl overflow-y-auto max-h-[90vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8" />

              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-primary/20 rounded-2xl mb-4">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold italic">FRever <span className="text-primary">PRO</span></h2>
                <p className="text-muted-foreground mt-1">Hol dir das volle Erlebnis</p>
              </div>

              {/* Basis vs Premium */}


              {/* Кнопка покупки */}
              <button
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all mb-4"
                onClick={() => alert("Backend Integration kommt bald!")}
              >
                Für 3,99 € / Monat sichern
              </button>

              <p className="text-[10px] text-center text-muted-foreground">
                Jederzeit kündbar. Inkl. 7 Tage kostenloser Testphase.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {showPrivacyModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPrivacyModal(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-[32px] z-[110] p-8 pb-12 max-w-2xl mx-auto shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8" />
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="text-primary" /> Datenschutz
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <Lock className="text-primary shrink-0" />
                <p className="text-sm"><b>Lokal & Sicher:</b> Deine Daten werden primär auf deinem Gerät verarbeitet.</p>
              </div>
              <div className="flex gap-4">
                <EyeOff className="text-primary shrink-0" />
                <p className="text-sm"><b>Kein Tracking:</b> Wir verkaufen keine Daten an Werbenetzwerke.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-4 bg-secondary rounded-2xl font-bold"
            >
              Verstanden
            </button>
          </motion.div>
        </>
      )}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Общий фон для всех модалок */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
            />

            {/* Сама шторка */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/20 rounded-t-[32px] z-[80] p-6 pb-10 max-w-2xl mx-auto shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8" />

              {/* --- КОНТЕНТ МЕНЯЕТСЯ ТУТ --- */}

              {activeModal === "Premium" && (
                <div className="flex flex-col gap-6">
                  {/* Заголовок с короной */}
                  <div className="text-center mb-4">
                    <div className="inline-flex p-4 bg-primary/20 rounded-[24px] mb-4 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                      <Crown className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold italic text-foreground">
                      FRever <span className="text-primary">PRO</span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Hol dir das volle Erlebnis</p>
                  </div>

                  {/* Сетка сравнения Basis vs Premium */}
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    {/* Карточка Basis */}
                    <div className="p-5 rounded-[28px] border border-border bg-muted/20 relative overflow-hidden">
                      <p className="font-bold text-[10px] opacity-40 mb-4 uppercase tracking-widest">Basis</p>
                      <ul className="space-y-3 text-[11px] font-medium leading-tight">
                        <li className="flex items-start gap-2">✅ <span>Einkaufsliste</span></li>
                        <li className="flex items-start gap-2">✅ <span>Barcode-Scanner</span></li>
                        <li className="flex items-start gap-2">✅ <span>Beleg-Scan</span></li>
                        <li className="flex items-start gap-2 text-muted-foreground/50">✅ <span>Rezepte (begrenzt)</span></li>
                      </ul>
                    </div>

                    {/* Карточка Premium */}
                    <div className="p-5 rounded-[28px] border-2 border-primary bg-primary/5 relative overflow-hidden shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                      <div className="absolute -top-px right-4 bg-primary text-[8px] text-primary-foreground px-2 py-0.5 rounded-b-lg font-black uppercase">
                        Empfohlen
                      </div>
                      <p className="font-bold text-[10px] text-primary mb-4 uppercase tracking-widest">Premium</p>
                      <ul className="space-y-3 text-[11px] font-bold leading-tight">
                        <li className="flex items-start gap-2">✨ <span>Smart-Sync Inventar</span></li>
                        <li className="flex items-start gap-2 text-primary">✨ <span>Finanzberichte</span></li>
                        <li className="flex items-start gap-2">✨ <span>Preisvergleich</span></li>
                        <li className="flex items-start gap-2 text-primary">✨ <span>KI-IntelliScan</span></li>
                        <li className="flex items-start gap-2">✨ <span>Alle Rezept-Ideen</span></li>
                      </ul>
                    </div>
                  </div>

                  {/* Кнопка действия */}
                  <div className="space-y-4">
                    <button
                      className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-[20px] shadow-lg shadow-primary/30 active:scale-95 transition-all text-base"
                      onClick={() => alert("Backend Integration kommt bald!")}
                    >
                      Für 3,99 € / Monat sichern
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground font-medium italic">
                      Jederzeit kündbar. Inkl. 7 Tage kostenloser Testphase.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "Benachrichtigungen" && (
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="text-primary" /> Benachrichtigungen
                  </h2>

                  {/* КАРТОЧКА НАСТРОЕК ВРЕМЕНИ */}
                  <div className="bg-card/50 border border-border rounded-[24px] p-5">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">Erinnerung</p>
                          <p className="text-[11px] text-muted-foreground italic">Täglicher Check-up</p>
                        </div>
                      </div>

                      {/* ВМЕСТО ИНПУТА: Красивая кнопка-счетчик */}
                      <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-primary/10">
                        <button
                          onClick={() => setRemindTime(t => (parseInt(t) - 1).toString().padStart(2, '0') + ":00")}
                          className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-lg"
                        > - </button>
                        <span className="px-3 font-black text-primary text-lg min-w-[60px] text-center">{remindTime}</span>
                        <button
                          onClick={() => setRemindTime(t => (parseInt(t) + 1).toString().padStart(2, '0') + ":00")}
                          className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-lg"
                        > + </button>
                      </div>
                    </div>

                    {/* ДНИ НЕДЕЛИ: Теперь точно кликаются */}
                    <div className="flex justify-between items-center gap-1">
                      {['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((day, i) => {
                        const isActive = selectedDays.includes(i);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedDays(prev =>
                                prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]
                              );
                            }}
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all transform active:scale-90
                ${isActive
                                ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-110'
                                : 'bg-muted/30 text-muted-foreground border border-transparent hover:border-primary/20'}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* РЫЧАЖКИ (SWITCHES): Сделал через Framer Motion для плавности */}
                  <div className="space-y-4">
                    {[
                      { id: 'morning', label: "Morgendlicher Check", desc: "Statusbericht am Morgen", state: morningCheck, setter: setMorningCheck },
                      { id: 'weekly', label: "Wochenbericht", desc: "Zusammenfassung am Sonntag", state: weeklyReport, setter: setWeeklyReport }
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => item.setter(!item.state)} // Теперь кликается вся область
                        className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-transparent hover:border-primary/20 transition-all cursor-pointer group mb-3"
                      >
                        <div>
                          <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.label}</p>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                        </div>

                        <div className={`h-6 w-11 rounded-full p-1 transition-colors duration-300 ${item.state ? 'bg-primary' : 'bg-muted'}`}>
                          <motion.div
                            animate={{ x: item.state ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="h-4 w-4 bg-white rounded-full shadow-sm pointer-events-none"
                          />
                        </div>
                      </div>
                    ))}

                    {/* КНОПКА ПОДТВЕРЖДЕНИЯ */}
                    <div className="mt-4 flex-shrink-0">
                      <button
                        onClick={() => setActiveModal(null)}
                        className="w-full py-4 rounded-[20px] bg-primary text-primary-foreground font-black uppercase tracking-widest text-[13px] shadow-[0_10px_20px_rgba(var(--primary),0.2)] hover:shadow-[0_15px_25px_rgba(var(--primary),0.3)] active:scale-95 transition-all"
                      >
                        Speichern
                      </button>
                      <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-60">
                        Deine Einstellungen werden automatisch übernommen
                      </p>
                    </div>
                    </div>
                </div>
              )}
              {activeModal === "Ziele" && (
                <div className="flex flex-col h-full">
                  {!isConfiguringHeuristics ? (
                    // --- ЭТАП 1: ВЫБОР ЦЕЛИ ---
                    <>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Target className="text-primary" /> Deine Mission
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">Wähle dein Ziel für diesen Monat:</p>

                      <div className="space-y-3 mb-8">
                        {[
                          { id: 'starter', l: "Starter", p: "10%", c: "bg-blue-500/10", t: "Einfach mal anfangen" },
                          { id: 'eco', l: "Eco-Warrior", p: "30%", c: "bg-primary/10", t: "Spürbare Veränderung", hot: true },
                          { id: 'zero', l: "Zero Hero", p: "60%", c: "bg-amber-500/10", t: "Maximale Wirkung" }
                        ].map((goal) => {
                          const isSelected = selectedGoal === goal.id;
                          return (
                            <button
                              key={goal.id}
                              onClick={() => setSelectedGoal(goal.id)}
                              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group relative overflow-hidden ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card'
                                }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${isSelected ? 'text-primary' : ''}`}>{goal.l}</span>
                                  {goal.hot && <span className="text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase font-black">Beliebt</span>}
                                </div>
                                <p className="text-xs text-muted-foreground">{goal.t}</p>
                              </div>
                              <div className={`h-10 w-10 rounded-full ${goal.c} flex items-center justify-center font-black text-xs`}>
                                -{goal.p}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setIsConfiguringHeuristics(true)}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                      >
                        Weiter zur Konfiguration 🚀
                      </button>
                    </>
                  ) : (
                    // --- ЭТАП 2: НАСТРОЙКА СРОКОВ (HEURISTIKEN) ---
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Sliders className="text-primary" /> Strategie anpassen
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">Wie optimieren wir deine Haltbarkeit?</p>

                      <div className="space-y-4 mb-8">
                        {heuristicsData.map((cat) => (
                          <div key={cat.id} className="p-4 rounded-2xl border border-border bg-card/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold flex items-center gap-2">{cat.icon} {cat.label}</span>
                              <span className="text-xs font-black text-primary">{cat.days} Tage</span>
                            </div>
                            <input
                              type="range" min="1" max="30" value={cat.days}
                              onChange={(e) => updateDays(cat.id, parseInt(e.target.value) - cat.days)}
                              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setActiveModal(null);
                          setIsConfiguringHeuristics(false);
                        }}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg active:scale-[0.98] transition-all"
                      >
                        Alles bereit!
                      </button>
                      <button
                        onClick={() => setIsConfiguringHeuristics(false)}
                        className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        ← Zurück zu den Zielen
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

            {activeModal === "Datenschutz" && (
  <div className="flex flex-col gap-4 px-1 pb-4 overflow-y-auto max-h-[65vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#DBE6E0] dark:bg-[#1E2423] transition-colors">
    
    {/* Заголовок */}
    <div className="flex items-center justify-between px-2 pt-4 flex-shrink-0">
      <h2 className="text-[24px] font-bold flex items-center gap-2 text-gray-900 dark:text-white">
        <Shield className="text-[#1a9e6e] dark:text-[#2dd498]" /> Datenschutz
      </h2>
      <span className="bg-[#1a9e6e]/10 dark:bg-[#2dd498]/10 text-[#1a9e6e] dark:text-[#2dd498] text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
        GESICHERT
      </span>
    </div>

    {/* Основные карточки */}
    <div className="grid gap-3 flex-shrink-0">
      {[
        { i: Lock, t: "Lokale Speicherung", d: "Deine Bestandsdaten werden nur auf diesem Gerät gespeichert." },
        { i: EyeOff, t: "Kein Tracking", d: "Wir analysieren dein Nutzungsverhalten nicht." },
        { i: FileText, t: "Schulprojekt", d: "Diese App dient nur zu Bildungszwecken." }
      ].map((item, idx) => (
        <div key={idx} className="p-4 rounded-[24px] bg-[#f2f2f2] dark:bg-[#24332f] border-2 border-[#1a9e6e]/20 dark:border-[#2dd498]/20 flex gap-4 items-start shadow-sm">
          <div className="p-2 bg-white dark:bg-[#1E2423] rounded-xl shadow-sm">
            <item.i className="h-5 w-5 text-[#1a9e6e] dark:text-[#2dd498]" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-white">{item.t}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.d}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Юридические детали (Аккордеоны) */}
    <div className="space-y-2 flex-shrink-0">
      <details className="group border-2 border-[#1a9e6e]/10 dark:border-[#2dd498]/10 rounded-[20px] overflow-hidden bg-[#f2f2f2] dark:bg-[#24332f]">
        <summary className="list-none p-4 text-[13px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex justify-between items-center group-open:bg-[#1a9e6e]/5 transition-colors">
          Impressum & Kontakt
          <Plus className="h-4 w-4 transition-transform group-open:rotate-45 text-[#1a9e6e] dark:text-[#2dd498]" />
        </summary>
        <div className="p-4 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed space-y-2 border-t border-[#1a9e6e]/10 dark:border-[#2dd498]/10">
          <p><strong>Verantwortlich:</strong> Jack-Steinberger-Gymnasium, vertreten durch die Schulleitung</p>
          <p>Steinstraße 4, 97688 Bad Kissingen</p>
          <p>E-Mail: eichelsdoerferr@jack-steinberger-gymnasium.de</p>
        </div>
      </details>

      <details className="group border-2 border-[#1a9e6e]/10 dark:border-[#2dd498]/10 rounded-[20px] overflow-hidden bg-[#f2f2f2] dark:bg-[#24332f]">
        <summary className="list-none p-4 text-[13px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex justify-between items-center group-open:bg-[#1a9e6e]/5 transition-colors">
          Rechtliche Hinweise
          <Plus className="h-4 w-4 transition-transform group-open:rotate-45 text-[#1a9e6e] dark:text-[#2dd498]" />
        </summary>
        <div className="p-4 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed space-y-2 border-t border-[#1a9e6e]/10 dark:border-[#2dd498]/10">
          <p>Dies ist ein Schulprojekt und wird für keine kommerziellen Zwecke verwendet.</p>
        </div>
      </details>
    </div>

    {/* ТА САМАЯ КНОПКА (как в Repository) */}
    <div className="mt-2 flex-shrink-0">
      
    </div>
  </div>
)}

              {activeModal === "Über FRever" && (
                <div className="flex flex-col gap-4 px-1 pb-4 overflow-y-auto max-h-[65vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#DBE6E0] dark:bg-[#1E2423] transition-colors" style={{ scrollbarWidth: 'none' }}>
                  {/* Заголовок */}
                  <div className="text-center pt-4 flex-shrink-0">
                    <h2 className="text-[28px] font-bold tracking-tight text-gray-900 dark:text-white">
                      Schulprojekt <span className="text-[#1a9e6e] dark:text-[#2dd498] font-bold">FRever</span>
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a9e6e] dark:text-[#2dd498] font-bold mt-0 opacity-80">
                      Sustainability First
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Секция: Team & Mitwirkende */}
                    <div className="space-y-3 flex-shrink-0">
                      <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">Unser Team</p>

                      <div className="rounded-[24px] bg-[#f2f2f2] dark:bg-[#24332f] border-2 border-[#1a9e6e]/20 dark:border-[#2dd498]/20 overflow-hidden shadow-sm transition-all">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a9e6e]/15 dark:border-[#2dd498]/10 bg-[#1a9e6e]/8 dark:bg-[#2dd498]/5">
                          <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-gray-900 dark:text-white">Polina Tymchyshyna</span>
                            <span className="text-[9px] font-bold text-[#1a9e6e] dark:text-[#2dd498] uppercase tracking-tighter">Zuständig für die App</span>
                          </div>

                          <div className="flex gap-2">

                            <button
                              onClick={() => setEmailMenu({ name: "Polina Tymchyshyna", email: "polina.tymchyshyna@jack-steinberger-gymnasium.de" })}
                              className="h-8 w-11 rounded-xl bg-gray-100 dark:bg-[#374151] flex items-center justify-center border border-gray-200 dark:border-white/5 shadow-sm hover:bg-gray-200 dark:hover:bg-[#4b5563] transition-all active:scale-90"
                            >
                              <Mail className="h-3.5 w-3.5 text-gray-600 dark:text-gray-200" />
                            </button>

                            <a
                              href="https://github.com/avunyo"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 w-11 rounded-xl bg-gray-100 dark:bg-[#374151] flex items-center justify-center border border-gray-200 dark:border-white/5 shadow-sm hover:bg-gray-200 dark:hover:bg-[#4b5563] transition-all active:scale-90"
                            >
                              <Github className="h-3.5 w-3.5 text-gray-600 dark:text-gray-200" />
                            </a>
                          </div>
                        </div>
                        <div className="bg-transparent">
                          {["Lead Dev", "Lead UI/UX Design", "Lead Backend/Frontend"].map((role, i) => (
                            <div key={i} className="px-5 py-3 border-b last:border-0 border-gray-100 dark:border-[#2dd498]/5 flex items-center gap-3">
                              <div className="h-1 w-1 rounded-full bg-[#1a9e6e] dark:bg-[#2dd498] shadow-[0_0_5px_#1a9e6e] dark:shadow-[0_0_5px_#2dd498]" />
                              <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-[#f2f2f2] dark:bg-[#24332f] border-2 border-[#1a9e6e]/20 dark:border-[#2dd498]/20 overflow-hidden shadow-sm transition-all">
                      <div className="divide-y divide-gray-100 dark:divide-[#2dd498]/5">
                        {[
                          { n: "Maryam Akraa", e: "maryam.akraa@jack-steinberger-gymnasium.de" },
                          { n: "Jakob Seufert", e: "jakob.seufert@jack-steinberger-gymnasium.de" },
                          { n: "Hanna Herrmann", e: "hanna.herrmann@jack-steinberger-gymnasium.de" }
                        ].map((member, idx) => (
                          <div key={idx} className="flex items-center justify-between px-5 py-4">
                            <span className="text-[14px] font-semibold text-gray-900 dark:text-white">{member.n}</span>

                            <button
                              onClick={() => setEmailMenu({ name: member.n, email: member.e })}
                              className="h-7 w-10 rounded-lg bg-gray-100 dark:bg-[#374151]/50 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#4b5563] transition-all active:scale-90 border border-gray-200 dark:border-transparent"
                            >
                              <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#1a9e6e]/8 dark:bg-[#2dd498]/5 p-4 border-t border-[#1a9e6e]/15 dark:border-[#2dd498]/10">
                        <p className="text-[13px] font-bold text-[#1a9e6e] dark:text-[#2dd498]">* Die besten Ratschlaggeber und Helfer!</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                          Du willst mit uns in Kontakt kommen? Dann klicke auf die Symbole rechts!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Секция репозитория */}
                  <div className="flex flex-col gap-2 mt-2 flex-shrink-0">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">Source Code</p>

                    <a
                      href="https://github.com/avunyo/FRever_vsc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-4 rounded-[16px] bg-[#1a9e6e] dark:bg-[#2dd498] text-white dark:text-[#1a2421] font-extrabold uppercase tracking-widest text-[13px] shadow-[0_5px_15px_rgba(26,158,110,0.25)] dark:shadow-[0_5px_15px_rgba(45,212,152,0.2)] active:scale-95 transition-all text-center"
                    >
                      repository
                    </a>
                  </div>
                </div>
              )}

              {["Datenschutz", "Über FRever", "Mein Konto", "Heuristiken"].includes(activeModal || "") && (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setIsConfiguringHeuristics(false); // Сбрасываем шаг, чтобы при следующем открытии снова были "Цели"
                  }}
                  className="w-full py-4 rounded-[16px] bg-[#24332f] border border-white/5 text-white text-[14px] font-bold active:bg-white/10 transition-all"
                >
                  Verstanden
                </button>
              )}
              {/* МЕНЮ ВЫБОРА (Вставить сюда) */}
              {emailMenu && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 rounded-[24px]">
                  <div className="bg-white dark:bg-[#24332f] w-full max-w-[260px] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2dd498]/30 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-[#2dd498]/10 text-center">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{emailMenu.name}</p>
                    </div>
                    <div className="flex flex-col">

                      <button
                        onClick={() => copyToClipboard(emailMenu.email)}
                        className="flex items-center justify-center py-4 text-[13px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2dd498]/10 transition-colors border-t border-gray-100 dark:border-[#2dd498]/5"
                      >
                        Email kopieren
                      </button>
                      <button
                        onClick={() => setEmailMenu(null)}
                        className="flex items-center justify-center py-4 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-gray-100 dark:border-[#2dd498]/5"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
