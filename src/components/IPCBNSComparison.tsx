import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, AlertTriangle, CheckCircle, MinusCircle, Scale } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface ComparisonItem {
  id: string;
  ipcSection: string;
  ipcTitle: string;
  ipcContent: string;
  bnsSection: string;
  bnsTitle: string;
  bnsContent: string;
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    description: string;
  }>;
  punishmentChange?: {
    old: string;
    new: string;
    increased: boolean;
  };
}

interface IPCBNSComparisonProps {
  comparisons: ComparisonItem[];
  language: 'en' | 'hi';
  selectedSection?: string;
}

const sampleComparisons: ComparisonItem[] = [
  {
    id: '1',
    ipcSection: '302',
    ipcTitle: 'Punishment for murder',
    ipcContent: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    bnsSection: '103',
    bnsTitle: 'Punishment for murder',
    bnsContent: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    changes: [],
    punishmentChange: {
      old: 'Death or life imprisonment + fine',
      new: 'Death or life imprisonment + fine',
      increased: false,
    },
  },
  {
    id: '2',
    ipcSection: '376',
    ipcTitle: 'Punishment for rape',
    ipcContent: 'Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than seven years.',
    bnsSection: '65',
    bnsTitle: 'Punishment for rape',
    bnsContent: 'Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life.',
    changes: [
      { type: 'modified', description: 'Minimum sentence increased from 7 to 10 years' },
      { type: 'added', description: 'Specific provisions for gang rape added' },
    ],
    punishmentChange: {
      old: 'Min 7 years RI',
      new: 'Min 10 years RI to life',
      increased: true,
    },
  },
  {
    id: '3',
    ipcSection: '420',
    ipcTitle: 'Cheating and dishonestly inducing delivery of property',
    ipcContent: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property...',
    bnsSection: '318',
    bnsTitle: 'Cheating and dishonestly inducing delivery of property',
    bnsContent: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, or to make, alter or destroy the whole or any part of a valuable security...',
    changes: [
      { type: 'added', description: 'Digital/electronic fraud explicitly covered' },
      { type: 'modified', description: 'Enhanced provisions for financial crimes' },
    ],
  },
];

export const IPCBNSComparison = ({ comparisons = [], language, selectedSection }: IPCBNSComparisonProps) => {
  const [activeComparison, setActiveComparison] = useState<string | null>(null);

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            {language === 'en' ? 'IPC ↔ BNS Comparison' : 'IPC ↔ BNS तुलना'}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {comparisons.length} {language === 'en' ? 'sections' : 'धाराएं'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          <AnimatePresence>
            {comparisons.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeComparison === item.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setActiveComparison(activeComparison === item.id ? null : item.id)}
              >
                {/* Comparison Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* IPC Badge */}
                    <div className="text-center">
                      <Badge variant="outline" className="mb-1 border-secondary text-secondary">
                        IPC
                      </Badge>
                      <p className="text-lg font-bold text-foreground">§{item.ipcSection}</p>
                    </div>

                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />

                    {/* BNS Badge */}
                    <div className="text-center">
                      <Badge variant="outline" className="mb-1 border-primary text-primary">
                        BNS
                      </Badge>
                      <p className="text-lg font-bold text-foreground">§{item.bnsSection}</p>
                    </div>
                  </div>

                  {/* Change indicator */}
                  {item.changes.length > 0 && (
                    <Badge 
                      variant="default" 
                      className={`${
                        item.punishmentChange?.increased 
                          ? 'bg-destructive/20 text-destructive border-destructive' 
                          : 'bg-accent/20 text-accent border-accent'
                      }`}
                    >
                      {item.changes.length} {language === 'en' ? 'changes' : 'बदलाव'}
                    </Badge>
                  )}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {activeComparison === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border p-4 space-y-4">
                        {/* Side by side comparison */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* IPC */}
                          <div className="rounded-lg bg-secondary/10 p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Scale className="h-4 w-4 text-secondary" />
                              <span className="text-xs font-semibold text-secondary">
                                {language === 'en' ? 'Indian Penal Code' : 'भारतीय दण्ड संहिता'}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-foreground mb-2">{item.ipcTitle}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.ipcContent}</p>
                          </div>

                          {/* BNS */}
                          <div className="rounded-lg bg-primary/10 p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Scale className="h-4 w-4 text-primary" />
                              <span className="text-xs font-semibold text-primary">
                                {language === 'en' ? 'Bhartiya Nyaya Sanhita' : 'भारतीय न्याय संहिता'}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-foreground mb-2">{item.bnsTitle}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.bnsContent}</p>
                          </div>
                        </div>

                        {/* Changes List */}
                        {item.changes.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-semibold text-foreground">
                              {language === 'en' ? 'Key Changes' : 'प्रमुख बदलाव'}
                            </h5>
                            {item.changes.map((change, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                {change.type === 'added' && (
                                  <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                )}
                                {change.type === 'removed' && (
                                  <MinusCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                                )}
                                {change.type === 'modified' && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-chart-4 shrink-0 mt-0.5" />
                                )}
                                <span className="text-muted-foreground">{change.description}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Punishment Change */}
                        {item.punishmentChange && (
                          <div className="rounded-lg bg-muted/30 p-3">
                            <h5 className="text-xs font-semibold text-foreground mb-2">
                              {language === 'en' ? 'Punishment Comparison' : 'दण्ड तुलना'}
                            </h5>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-muted-foreground">{language === 'en' ? 'Old:' : 'पुराना:'}</span>
                                <p className="text-foreground font-medium">{item.punishmentChange.old}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{language === 'en' ? 'New:' : 'नया:'}</span>
                                <p className={`font-medium ${item.punishmentChange.increased ? 'text-destructive' : 'text-accent'}`}>
                                  {item.punishmentChange.new}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};
