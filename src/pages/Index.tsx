import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, TrendingDown, Lightbulb, Shield, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const features = [
    {
        icon: ShieldCheck,
        title: "Überblick behalten",
        description: "Alle Lebensmittel im Blick, automatisch sortiert nach Ablaufdatum.",
    },
    {
        icon: TrendingDown,
        title: "Geld sparen",
        description: "Sieh genau, was du sparst, wenn du weniger wegwirfst.",
    },
    {
        icon: Lightbulb,
        title: "Smarte Rezepte",
        description: "Rezeptvorschläge basierend auf dem, was du zuhause hast.",
    },
];

const LandingPage = () => {
    const { theme } = useTheme();
    const [showWelcome, setShowWelcome] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem("frever_consent");
        if (!hasAccepted) {
            setShowWelcome(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("frever_consent", "true");
        setShowWelcome(false);
    };

    return (
        <div className="relative min-h-[100dvh] bg-background flex flex-col overflow-x-hidden">
            <AnimatePresence>
                {showWelcome && (
                    <>
                        {/* Размытый фон */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-xl"
                        />

                        {/* Контент модалки */}
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-card border border-border p-8 rounded-[32px] max-w-sm w-full shadow-2xl text-center"
                            >
                                <div className="inline-flex p-4 bg-primary/10 rounded-2xl text-primary mb-6">
                                    <Shield className="h-8 w-8" />
                                </div>

                                <h2 className="text-2xl font-bold mb-3 font-heading text-foreground">Datenschutz</h2>
                                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                    Willkommen bei <span className="text-primary font-bold">FRever</span>. Wir nutzen Cookies, um dein Erlebnis zu verbessern. Mit der Nutzung stimmst du unseren Richtlinien zu.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                    >
                                        Akzeptieren & Starten
                                    </button>
                                    <button
                                        onClick={() => setShowWelcome(false)}
                                        className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl font-medium text-sm hover:bg-muted transition-colors"
                                    >
                                        Nur Notwendige
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">

                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <img
                            /* Логика темы */
                            src={theme === "light" ? logoDark : logoLight}
                            alt="FRever"

                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </div>
                </div>
            </header>

            <main className="pt-20 md:pt-20">
                <section className="relative overflow-hidden">


                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
                    </div>


                    <div className="container flex flex-col items-center mt-5 md:pt-0 px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="w-full max-w-4xl flex flex-col items-center justify-center text-center mx-auto"
                        >
                            {/* Бейджик */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm text-muted-foreground shadow-sm">
                                🌿 Weniger verschwenden, mehr genießen
                            </div>

                            {/* Заголовок */}
                            <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl font-extrabold leading-[1.1] mb-6 tracking-tighter">
                                Keine Lebensmittel mehr <br />
                                <span className="text-primary">verschwenden.</span> <br />
                                <span className="mt-1 block">Einfach.</span>
                            </h1>

                            {/* Параграф с фиксированной шириной и центрированием */}
                            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                                FRever hilft dir, den Überblick zu behalten, <br className="hidden sm:block" />
                                Geld zu sparen und bewusster zu leben.
                            </p>

                            {/* Кнопки */}
                            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center items-stretch sm:items-center px-4">

                                <motion.button
                                    onClick={() => setShowCameraModal(true)} // Теперь открываем модалку
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-16 inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
                                >
                                    Produkte hinzufügen
                                    <ArrowRight className="h-5 w-5" />
                                </motion.button>


                                <Link to="/dashboard" className="flex-1">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-16 inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-card px-8 text-lg font-bold text-foreground transition-all hover:bg-accent"
                                    >
                                        Dashboard
                                    </motion.button>
                                </Link>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, 10, 0]
                                }}
                                transition={{
                                    opacity: { delay: 0.5, duration: 0.8 },
                                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                }}
                                className="mt-2 mb-10 flex flex-col items-center gap-3 cursor-pointer text-muted-foreground hover:text-primary transition-colors group"
                                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Mehr erfahren</span>
                                <div className="p-4 rounded-full border border-border bg-card shadow-sm group-hover:border-primary transition-colors">

                                    <ArrowRight className="h-6 w-6 rotate-90" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </section>



                <section className="py-24 border-t border-border">
                    <div className="container px-4 flex flex-col items-center">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-20 w-full"
                        >

                            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                                Warum FRever?
                            </h2>


                            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
                                Drei einfache Gründe, warum du FRever lieben wirst.
                            </p>
                        </motion.div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    className="flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors"
                                >

                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                                        <feature.icon className="h-8 w-8 stroke-[2px]" />
                                    </div>
                                    <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            className="py-16 flex justify-center w-full"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <motion.button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}

                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-all group"
                            >
                                <div className="p-4 rounded-full border border-border bg-card group-hover:border-primary transition-colors shadow-sm">

                                    <ArrowRight className="h-6 w-6 -rotate-90" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Zum Anfang</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </section>
                {/* Модалка разрешения камеры */}
      <AnimatePresence>
        {showCameraModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCameraModal(false)}
              className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[130] bg-card border-t border-border rounded-t-[32px] p-8 pb-12 max-w-2xl mx-auto shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8" />

              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-6">
                  <Camera className="h-10 w-10" />
                </div>

                <h2 className="text-2xl font-bold mb-3">Kamera-Zugriff</h2>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-xs">
                  Um Barcodes zu scannen und Produkte automatisch hinzuzufügen, benötigen wir Zugriff auf deine Kamera.
                </p>

                <div className="flex flex-col w-full gap-3">
                  <Link to="/scan" className="w-full">
                    <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20">
                      Kamera aktivieren
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowCameraModal(false)}
                    className="w-full py-4 bg-muted text-muted-foreground rounded-2xl font-medium text-sm hover:bg-accent transition-colors"
                  >
                    Vielleicht später
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
            </main>
        </div>
    );
};

export default LandingPage;
