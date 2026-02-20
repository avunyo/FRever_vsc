import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingDown, TrendingUp, Trash2, Lightbulb } from "lucide-react";

const lineData = [
  { week: "W1", saved: 8, wasted: 3 },
  { week: "W2", saved: 12, wasted: 1 },
  { week: "W3", saved: 6, wasted: 4 },
  { week: "W4", saved: 10, wasted: 2 },
];

const pieData = [
  { name: "Milchprodukte", value: 40 },
  { name: "Gemüse", value: 30 },
  { name: "Backwaren", value: 20 },
  { name: "Sonstiges", value: 10 },
];

const COLORS = ["hsl(122, 39%, 49%)", "hsl(37, 91%, 55%)", "hsl(0, 72%, 51%)", "hsl(215, 14%, 46%)"];

const tips = [
  "Du wirfst oft Milchprodukte weg. Versuche kleinere Packungen zu kaufen!",
  "Dein Gemüse verschimmelt schnell. Überprüfe die Lagerung im Kühlschrank!",
  "Nutze diese Woche das Rezept für Cremige Tomatensuppe, um deine Joghurts zu verbrauchen.",
];

const ReportsPage = () => (
  <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
    <AppHeader />
    <main className="container px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold mb-1">Monatsbericht</h1>
        <p className="text-muted-foreground">März 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Gespart", value: "25,40€", icon: TrendingUp, color: "text-primary" },
          { label: "Weggeworfen", value: "5,10€", icon: TrendingDown, color: "text-destructive" },
          { label: "Weggeworfene Artikel", value: "3", icon: Trash2, color: "text-warning" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
            </div>
            <p className={`text-3xl font-heading font-bold ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Line chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Gespart vs. Verschwendet (€)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="saved" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="wasted" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Verschwendung nach Kategorie</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-warning" />
          <h3 className="font-heading font-semibold">Verbesserungstipps</h3>
        </div>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  </div>
);

export default ReportsPage;
