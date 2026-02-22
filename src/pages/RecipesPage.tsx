import { AppHeader } from "@/components/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, Users, Check, Lock, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

// 1. Списки продуктов (чтобы рецепты видели, что у нас есть)
const mockProducts = [
  { id: "1", name: "Vollmilch 1,5%", category: "Milchprodukte" },
  { id: "4", name: "Bio Bananen", category: "Obst & Gemüse" },
  { id: "5", name: "Cheddar Scheiben", category: "Milchprodukte" },
  { id: "6", name: "Butter", category: "Milchprodukte" },
  { id: "7", name: "Äpfel Braeburn", category: "Obst & Gemüse" },
];

// 2. База рецептов
const recipes = [
  { id: 1, name: "Cremige Tomatensuppe", time: "25 Min", servings: 4, image: "🍅", ingredients: ["Tomaten", "Sahne"] },
  { id: 2, name: "Bananen-Pancakes", time: "15 Min", servings: 2, image: "🥞", ingredients: ["Bio Bananen", "Eier"] },
  { id: 3, name: "Käse-Toast Deluxe", time: "10 Min", servings: 1, image: "🧀", ingredients: ["Dinkel Toastbrot", "Cheddar Scheiben"] },
  { id: 4, name: "Spaghetti Carbonara", time: "20 Min", servings: 2, image: "🍝", ingredients: ["Spaghetti", "Eier", "Speck"] },
  { id: 5, name: "Gemüse-Curry", time: "30 Min", servings: 3, image: "🍛", ingredients: ["Reis", "Kokosmilch", "Karotten"] },
  { id: 6, name: "Apfelkuchen", time: "45 Min", servings: 8, image: "🍰", ingredients: ["Äpfel Braeburn", "Butter", "Mehl", "Zucker"] },
];

const RecipesPage = ({ onAddProduct }: { onAddProduct: (name: string) => void }) => {
  const [addedItems, setAddedItems] = useState<string[]>([]); 

  const hasIngredient = (ingName: string) => {
    return mockProducts.some(p => p.name.toLowerCase().includes(ingName.toLowerCase()));
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <AppHeader />
      <main className="container px-4 py-8 max-w-5xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="font-heading text-3xl font-bold mb-2">Rezeptvorschläge</h1>
          <p className="text-muted-foreground">Basierend auf deinen vorhandenen Zutaten</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                {recipe.image}
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {recipe.name}
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
  <AnimatePresence mode="popLayout">
    {recipe.ingredients.map((ing) => {
      const isMissing = !hasIngredient(ing);
      const isAdded = addedItems.includes(ing);

      // Если мы уже нажали "добавить", этот элемент анимированно исчезает
      if (isAdded) return null;

      return (
        <motion.button
          key={ing}
          layout
          initial={{ opacity: 1, scale: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.5, 
            y: -10,
            transition: { duration: 0.3 } 
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isMissing) {
              onAddProduct(ing); // Теперь это вызовет addToShoppingList из App.tsx
              setAddedItems((prev) => [...prev, ing]);
              toast({
                description: `${ing} wurde hinzugefügt`,
                duration: 2000,
              });
            }
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all ${
            !isMissing
              ? "bg-primary/10 text-primary border-primary/20 cursor-default"
              : "bg-muted text-muted-foreground border-transparent hover:bg-primary/20 hover:text-primary cursor-pointer"
          }`}
        >
          {!isMissing ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {ing}
        </motion.button>
      );
    })}
  </AnimatePresence>

  {/* Отдельно рендерим те, что УЖЕ есть в инвентаре, чтобы они не пропадали */}
  {recipe.ingredients
    .filter((ing) => hasIngredient(ing))
    .map((ing) => (
      <div
        key={`${ing}-owned`}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border bg-primary/10 text-primary border-primary/20 cursor-default"
      >
        <Check className="h-3 w-3" />
        {ing}
      </div>
    ))}
</div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecipesPage;