import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Search, Plus, MessageSquare, History, Clock, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AuthenticatedDashboardProps {
  language: 'en' | 'hi';
  onStartChat: (message?: string) => void;
}

export const AuthenticatedDashboard = ({ language, onStartChat }: AuthenticatedDashboardProps) => {
  const { user } = useUser();

  const recentChats = [
    { id: '1', title: 'IPC 302 Analysis', date: '2 hours ago' },
    { id: '2', title: 'Property Dispute Query', date: 'Yesterday' },
    { id: '3', title: 'BNS Section 63 Review', date: 'Jan 18' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#faf7f2] dark:bg-[#0f1115]">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
              {language === 'en' ? 'Hello,' : 'नमस्ते,'}
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif font-medium text-primary tracking-tight">
              {user?.firstName || (language === 'en' ? 'Advocate' : 'अधिवक्ता')}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={() => onStartChat()}
              size="lg"
              className="rounded-2xl h-14 px-8 text-lg font-bold shadow-xl hover:shadow-primary/20 transition-all gap-3 bg-primary text-primary-foreground group"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>{language === 'en' ? 'New Chat' : 'नई चैट'}</span>
            </Button>
          </motion.div>
        </div>

        {/* Main Search & History Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Search Wrapper */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative glass-strong rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-white/5">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/60" />
                <Input
                  className="w-full bg-background/50 border-2 border-primary/10 hover:border-primary/30 focus:border-primary rounded-2xl h-16 pl-16 pr-6 text-xl shadow-inner transition-all"
                  placeholder={language === 'en' ? "Search for laws, cases, or chat history..." : "कानून, मामले या चैट इतिहास खोजें..."}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      onStartChat(e.currentTarget.value.trim());
                    }
                  }}
                />
              </div>

              {/* Chat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {recentChats.map((chat, idx) => (
                  <motion.div
                    key={chat.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="relative group cursor-pointer"
                    onClick={() => onStartChat(`Tell me about ${chat.title}`)}
                  >
                    {/* Notebook Style Card */}
                    <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 h-64 flex flex-col">
                      {/* Spiral - The "Sketch" logic */}
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-around py-4 border-r border-slate-200 dark:border-slate-700">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 shadow-inner" />
                        ))}
                      </div>

                      {/* Content Area */}
                      <div className="ml-8 p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{chat.date}</span>
                        </div>
                        <h4 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {chat.title}
                        </h4>
                        
                        {/* Placeholder Lines */}
                        <div className="mt-auto space-y-3">
                          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
                          <div className="h-px bg-slate-100 dark:bg-slate-800 w-3/4" />
                          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Stats / Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Saved Statutes', value: '48+', icon: BookOpen },
              { label: 'Cases Analyzed', value: '12', icon: Clock },
              { label: 'Active Sessions', value: '3', icon: History },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass rounded-2xl p-6 flex items-center gap-4 border border-white/10"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold text-foreground">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
