import { motion } from 'framer-motion';
import { BookOpen, Scale, Gavel, Shield, Building2, Landmark, FileText, Briefcase } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  labelHindi: string;
  icon: React.ComponentType<{ className?: string }>;
  query: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'ipc-bns',
    label: 'IPC to BNS Mapping',
    labelHindi: 'IPC से BNS मैपिंग',
    icon: Scale,
    query: 'Show me the mapping between IPC Section 302 and corresponding BNS section',
    color: 'from-primary to-secondary',
  },
  {
    id: 'criminal',
    label: 'Criminal Law',
    labelHindi: 'आपराधिक कानून',
    icon: Gavel,
    query: 'What are the key differences between IPC and BNS for criminal offenses?',
    color: 'from-secondary to-chart-5',
  },
  {
    id: 'cyber',
    label: 'IT & Cyber Law',
    labelHindi: 'IT और साइबर कानून',
    icon: Shield,
    query: 'Explain the IT Act 2000 provisions for cybercrime in India',
    color: 'from-accent to-chart-3',
  },
  {
    id: 'corporate',
    label: 'Corporate Law',
    labelHindi: 'कॉर्पोरेट कानून',
    icon: Building2,
    query: 'What are the key provisions of Companies Act 2013?',
    color: 'from-chart-4 to-chart-5',
  },
  {
    id: 'constitutional',
    label: 'Constitutional Law',
    labelHindi: 'संवैधानिक कानून',
    icon: Landmark,
    query: 'Explain fundamental rights under the Indian Constitution',
    color: 'from-chart-1 to-primary',
  },
  {
    id: 'labour',
    label: 'Labour Law',
    labelHindi: 'श्रम कानून',
    icon: Briefcase,
    query: 'What are the key provisions of the new Labour Codes 2020?',
    color: 'from-chart-3 to-accent',
  },
];

interface QuickActionsProps {
  language: 'en' | 'hi';
  onActionClick: (query: string) => void;
}

export const QuickActions = ({ language, onActionClick }: QuickActionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        {language === 'en' ? 'Quick Legal Queries' : 'त्वरित कानूनी प्रश्न'}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActionClick(action.query)}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} bg-opacity-20`}>
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                </div>
                <p className={`text-sm font-medium text-foreground group-hover:text-primary transition-colors ${language === 'hi' ? 'text-hindi' : ''}`}>
                  {language === 'hi' ? action.labelHindi : action.label}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
