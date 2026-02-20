import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingDown, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
// Импортируем оба варианта логотипа
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

    return (
        <div className="min-h-screen bg-background">
            {/* Шапка Landing Page — Кнопку темы отсюда тоже убрали, так как она есть в AppHeader */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                {/* Увеличили высоту контейнера до h-20 */}
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <img
                            /* Логика темы остается */
                            src={theme === "light" ? logoDark : logoLight}
                            alt="FRever"
                            /* УВЕЛИЧЕННЫЙ РАЗМЕР: h-12 на мобильных, h-14 на компах */
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </div>
                </div>
            </header>

            <main className="pt-24 md:pt-10">
                <section className="relative overflow-hidden">
                    {/* МОБИЛЬНУЮ КНОПКУ ОТСЮДА УДАЛИЛИ */}

                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
                    </div>

                    {/* --- ЗАМЕНИТЬ ОТСЮДА --- */}
                    <div className="container flex flex-col items-center -mt-5 md:pt-0 px-4 text-center">
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

                            {/* Кнопки — теперь они будут всегда ровные */}
                            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center items-stretch sm:items-center px-4">
                                <Link to="/scan" className="flex-1">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-16 inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Produkte hinzufügen
                                        <ArrowRight className="h-5 w-5" />
                                    </motion.button>
                                </Link>

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
                                    y: [0, 10, 0] // Прыжок вниз на 10px
                                }}
                                transition={{
                                    opacity: { delay: 0.5, duration: 0.8 },
                                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                }}
                                className="mt-4 mb-10 flex flex-col items-center gap-3 cursor-pointer text-muted-foreground hover:text-primary transition-colors group"
                                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Mehr erfahren</span>
                                <div className="p-4 rounded-full border border-border bg-card shadow-sm group-hover:border-primary transition-colors">
                                    {/* Увеличили иконку до h-6 w-6 как в нижней кнопке */}
                                    <ArrowRight className="h-6 w-6 rotate-90" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* --- ДО СЮДА --- */}
                </section>

                {/* Features */}
                {/* Секция преимуществ */}
                <section className="py-24 border-t border-border">
                    <div className="container px-4 flex flex-col items-center"> {/* Центрируем всё содержимое */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-20 w-full"
                        >
                            {/* Заголовок выше, центрирован */}
                            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                                Warum FRever?
                            </h2>

                            {/* Текст в одну строку, центрирован */}
                            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
                                Drei einfache Gründe, warum du FRever lieben wirst.
                            </p>
                        </motion.div>

                        {/* Сетка карточек — исправляем "лесенку" */}
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
                                    {/* Увеличенные иконки, чтобы их было видно */}
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
                                // Анимация прыжка:
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-all group"
                            >
                                <div className="p-4 rounded-full border border-border bg-card group-hover:border-primary transition-colors shadow-sm">
                                    {/* Иконка смотрит вверх (-rotate-90) */}
                                    <ArrowRight className="h-6 w-6 -rotate-90" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Zum Anfang</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;
