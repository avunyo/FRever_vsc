import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { ChefHat, Clock, Users, Check, Lock } from "lucide-react";

const recipes = [
  { id: 1, name: "Cremige Tomatensuppe", time: "25 Min", servings: 4, hasAll: true, image: "🍅" },
  { id: 2, name: "Bananen-Pancakes", time: "15 Min", servings: 2, hasAll: true, image: "🥞" },
  { id: 3, name: "Käse-Toast Deluxe", time: "10 Min", servings: 1, hasAll: true, image: "🧀" },
  { id: 4, name: "Spaghetti Carbonara", time: "20 Min", servings: 2, hasAll: false, missing: 2, image: "🍝" },
  { id: 5, name: "Gemüse-Curry", time: "30 Min", servings: 3, hasAll: false, missing: 3, image: "🍛" },
  { id: 6, name: "Apfelkuchen", time: "45 Min", servings: 8, hasAll: false, missing: 4, image: "🍰" },
];

const RecipesPage = () => (
  <div className="min-h-screen bg-background pt-20
   pb-24 md:pb-8">
    <AppHeader />
    <main className="container px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold mb-2">Rezeptvorschläge</h1>
        <p className="text-muted-foreground">Basierend auf deinen vorhandenen Zutaten</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["Alle", "Du hast alles", "Schnell", "Vegetarisch"].map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="text-4xl mb-4">{recipe.image}</div>
            <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">{recipe.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{recipe.time}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{recipe.servings} Port.</span>
            </div>
            {recipe.hasAll ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
                <Check className="h-3 w-3" /> Du hast alle Zutaten!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 rounded-full px-2.5 py-1">
                Fehlende Zutaten: {recipe.missing}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Premium banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center"
      >
        <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="font-heading text-lg font-bold mb-2">Unbegrenzte Rezepte mit Premium</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          Erhalte personalisierte Rezepte, smarte Einkaufslisten und exklusive KI-Vorschläge.
        </p>
        <button className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25">
          Premium entdecken
        </button>
      </motion.div>
    </main>
  </div>
);

export default RecipesPage;
