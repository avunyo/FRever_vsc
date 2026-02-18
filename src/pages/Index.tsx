import { motion } from "framer-motion";
import { Leaf, ArrowRight, ShieldCheck, TrendingDown, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">FRever</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Theme wechseln"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                Weniger verschwenden, mehr genießen
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Keine Lebensmittel mehr{" "}
                <span className="text-primary">verschwenden.</span>
                <br />
                Einfach.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
                FRever hilft dir, den Überblick zu behalten, Geld zu sparen und bewusster zu leben.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/scan">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
                  >
                    Produkte hinzufügen
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    Dashboard ansehen
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 border-t border-border">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-3xl font-bold mb-4">Warum FRever?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Drei einfache Gründe, warum du FRever lieben wirst.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
