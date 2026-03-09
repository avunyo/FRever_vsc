import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ScanPage from "./pages/ScanPage";
import InventoryPage from "./pages/InventoryPage";
import RecipesPage from "./pages/RecipesPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import AccountPage from "./pages/AccountPage";

const queryClient = new QueryClient();

const App = () => {
  const [shoppingList, setShoppingList] = useState<any[]>([]);

  const addToShoppingList = (productName: string) => {
  // Здесь мы можем добавить логику для определения категории продукта, например, через словарь или API
  const categoryMap: Record<string, string> = {
    "Tomaten": "Obst & Gemüse",
    "Bio Bananen": "Obst & Gemüse",
    "Äpfel Braeburn": "Obst & Gemüse",
    "Karotten": "Obst & Gemüse",
    "Vollmilch 1,5%": "Milchprodukte",
    "Sahne": "Milchprodukte",
    "Cheddar Scheiben": "Milchprodukte",
    "Butter": "Milchprodukte",
    "Dinkel Toastbrot": "Backwaren",
    "Protein Brötchen": "Backwaren"
  };
// В реальном приложении, конечно, лучше использовать более надежный способ генерации ID и определения категории продукта
  const newItem = {
    id: Date.now().toString(),
    name: productName,
    category: categoryMap[productName] || "Alle" 
  };

  setShoppingList((prev) => [...prev, newItem]);
};

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner duration={2000} /> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/inventory" element={<InventoryPage shoppingItems={shoppingList} />} />
            <Route path="/recipes" element={<RecipesPage onAddProduct={addToShoppingList} />} /> 
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
    );
};

export default App;
