import { AppHeader } from "@/components/AppHeader";
import { AnimatePresence, motion } from "framer-motion";
import { User, Bell, Target, Sliders, Crown, Shield, Info, Sun, Moon, Lock, EyeOff, FileText, Clock, Zap, Minus, Plus } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { useState } from "react";

const sections = [
  { icon: Crown, label: "Premium", description: "Abo verwalten und upgraden" },
  { icon: User, label: "Mein Konto", description: "E-Mail, Passwort, Name verwalten" },
  { icon: Bell, label: "Benachrichtigungen", description: "Push-Zeiten und Warnungen einstellen" },
  { icon: Target, label: "Ziele", description: "Monatsziel für weniger Abfall anpassen" },
  { icon: Sliders, label: "Heuristiken", description: "Haltbarkeiten für deine Produkte anpassen" },
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
                  </div>
                </div>
              )}
              {activeModal === "Ziele" && (
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Target className="text-primary" /> Deine Ziele
                  </h2>
                  <p className="text-muted-foreground text-sm mb-8">Wähle deine Mission für diesen Monat:</p>

                  <div className="space-y-3">
                    {[
                      { l: "Starter", p: "10%", c: "bg-blue-500/10", t: "Einfach mal anfangen" },
                      { l: "Eco-Warrior", p: "30%", c: "bg-primary/10", t: "Spürbare Veränderung", hot: true },
                      { l: "Zero Hero", p: "60%", c: "bg-amber-500/10", t: "Maximale Wirkung" }
                    ].map((goal) => (
                      <button key={goal.l} className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${goal.hot ? 'border-primary shadow-sm' : 'border-border hover:border-primary/50'}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{goal.l}</span>
                            {goal.hot && <span className="text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase">Beliebt</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{goal.t}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full ${goal.c} flex items-center justify-center font-black text-sm`}>
                          -{goal.p}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === "Datenschutz" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Shield className="text-primary" /> Datenschutz
                    </h2>
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                      LIVE SCHUTZ AKTIV
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { i: Lock, t: "Ende-zu-Ende", d: "Deine Bestandsdaten sind nur lokal verschlüsselt." },
                      { i: EyeOff, t: "Kein Tracking", d: "Wir nutzen keine Werbe-IDs oder Analyse-Tracker." },
                      { i: FileText, t: "Transparenz", d: "Deine Daten werden niemals an Dritte verkauft." }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex gap-4 items-start">
                        <div className="p-2 bg-background rounded-lg shadow-sm">
                          <item.i className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.t}</p>
                          <p className="text-xs text-muted-foreground">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* --- КОНТЕНТ ДЛЯ HEURISTIKEN --- */}
              {activeModal === "Heuristiken" && (
  <div className="flex flex-col gap-2">
    <div className="mb-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Sliders className="text-primary" /> Heuristiken
      </h2>
      <p className="text-muted-foreground text-xs italic">Intelligente Haltbarkeits-Logik</p>
    </div>

    {heuristicsData.map((cat) => (
      <div key={cat.id} className="p-4 rounded-[22px] border border-border bg-card/50 mb-4 transition-all hover:border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cat.icon}</span>
            <p className="font-bold text-sm">{cat.label}</p>
          </div>

          <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => updateDays(cat.id, -1)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-primary font-black min-w-[65px] text-center text-xs">
              {cat.days} Tage
            </span>
            <button
              onClick={() => updateDays(cat.id, 1)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min="1"
            max="30"
            value={cat.days}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setHeuristicsData(prev => prev.map(item => item.id === cat.id ? { ...item, days: val } : item));
            }}
            className="absolute w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary z-10"
          />
          <div
            className={`absolute h-1.5 rounded-full transition-all pointer-events-none ${cat.color}`}
            style={{ width: `${(cat.days / 30) * 100}%`, boxShadow: `0 0 10px ${cat.color}44` }}
          />
        </div>
      </div>
    ))}
  </div>
)}
              {/* Кнопка закрытия для всех, кроме премиума (там обычно своя кнопка оплаты) */}
              {/* Кнопка закрытия только для простых модалок */}
              {["Datenschutz", "Über FRever", "Mein Konto", "Heuristiken"].includes(activeModal || "") && (
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-8 py-4 bg-secondary rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  Verstanden
                </button>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;