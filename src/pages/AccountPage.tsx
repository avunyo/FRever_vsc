import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, LogOut, Camera, Award, Leaf, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <AppHeader />
      <main className="container px-4 py-8 max-w-2xl mx-auto">
        
        {/* ЗАГОЛОВОК */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} // Возвращает на предыдущую страницу
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors active:scale-90"
            >
              <ArrowLeft className="h-6 w-6 text-primary" />
            </button>
            <div>
              <h1 className="text-3xl font-black italic">Mein <span className="text-primary">Profil</span></h1>
              <p className="text-muted-foreground text-sm">Verwalte deine Identität</p>
            </div>
          </div>
          
          <button className="p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95">
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* ГЛАВНАЯ КАРТОЧКА ПРОФИЛЯ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 mb-8 shadow-2xl shadow-primary/5"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <User className="h-32 w-32" />
          </div>

          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 relative z-10">
            <div className="relative group">
              <div className="h-24 w-24 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 overflow-hidden">
                <span className="text-3xl font-black text-primary-foreground">PT</span>
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-background border border-border rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="h-4 w-4 text-primary" />
              </button>
            </div>

            <div className="text-center sm:text-left pt-2">
              <h2 className="text-xl font-bold">Polina Tymchyshyna</h2>
              <p className="text-muted-foreground text-sm">Eco-Warrior seit 2026!</p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm">Pro Member</span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-black rounded-full uppercase tracking-tighter">Level 7</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* БЫСТРАЯ СТАТИСТИКА (Креативный блок) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Leaf, val: "60€", label: "Gespart", color: "text-emerald-500" },
            { icon: Zap, val: "52", label: "Streak", color: "text-amber-500" },
            { icon: Award, val: "3", label: "Badges", color: "text-blue-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/30 transition-colors"
            >
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg font-black">{stat.val}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* НАСТРОЙКИ ПОЛЕЙ */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Persönliche Infos</p>
          
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-border/50 group hover:bg-muted/30 transition-colors cursor-pointer">
              <User className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Name</p>
                <p className="font-medium">Polina Tymchyshyna</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4 border-b border-border/50 group hover:bg-muted/30 transition-colors cursor-pointer">
              <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">E-Mail Adresse</p>
                <p className="font-medium">polina.tymchyshyna@example.com</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4 group hover:bg-muted/30 transition-colors cursor-pointer">
              <Lock className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Passwort</p>
                <p className="font-medium">••••••••••••</p>
              </div>
            </div>
          </div>
        </div>

        {/* КНОПКА СОХРАНЕНИЯ */}
        <button className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
          Änderungen speichern
        </button>
      </main>
    </div>
  );
};

export default AccountPage;
