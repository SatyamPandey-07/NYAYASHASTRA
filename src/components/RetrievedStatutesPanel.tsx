import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { BookOpen, Scale, ExternalLink } from 'lucide-react';

interface StatuteSection {
  id: string;
  section: string;
  act: 'IPC' | 'BNS' | 'CrPC' | 'BSA' | 'IT Act' | 'Constitution';
  title: string;
  content: string;
  relevanceScore: number;
}

interface RetrievedStatutesPanelProps {
  statutes: StatuteSection[];
  language: 'en' | 'hi';
}

const sampleStatutes: StatuteSection[] = [
  {
    id: '1',
    section: '302',
    act: 'IPC',
    title: 'Punishment for murder',
    content: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    relevanceScore: 0.95,
  },
  {
    id: '2',
    section: '103',
    act: 'BNS',
    title: 'Punishment for murder',
    content: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    relevanceScore: 0.93,
  },
  {
    id: '3',
    section: '300',
    act: 'IPC',
    title: 'Murder',
    content: 'Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death...',
    relevanceScore: 0.88,
  },
  {
    id: '4',
    section: '101',
    act: 'BNS',
    title: 'Culpable homicide',
    content: 'Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death...',
    relevanceScore: 0.85,
  },
];

const getActColor = (act: StatuteSection['act']) => {
  switch (act) {
    case 'IPC':
      return 'bg-secondary/20 text-secondary border-secondary/30';
    case 'BNS':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'CrPC':
    case 'BSA':
      return 'bg-accent/20 text-accent border-accent/30';
    case 'Constitution':
      return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const RetrievedStatutesPanel = ({ statutes = [], language }: RetrievedStatutesPanelProps) => {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            {language === 'en' ? 'Retrieved Statutes' : 'प्राप्त विधियाँ'}
          </h3>
          <Badge variant="outline" className="text-xs">
            {statutes.length} {language === 'en' ? 'found' : 'मिले'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[280px]">
        <div className="p-4 space-y-3">
          {statutes.map((statute, idx) => (
            <motion.div
              key={statute.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl border border-border bg-card/50 p-3 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Act Badge & Section */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`text-xs ${getActColor(statute.act)}`}>
                      {statute.act}
                    </Badge>
                    <span className="text-sm font-bold text-foreground">§{statute.section}</span>
                    {/* Relevance Score */}
                    <div className="ml-auto flex items-center gap-1">
                      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${statute.relevanceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(statute.relevanceScore * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                    {statute.title}
                  </h4>

                  {/* Content Preview */}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {statute.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
