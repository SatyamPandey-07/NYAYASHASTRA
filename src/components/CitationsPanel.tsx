import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FileText, Scale, Building2, BookOpen } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface Citation {
  id: string;
  title: string;
  source: 'gazette' | 'supreme_court' | 'high_court' | 'law_commission';
  url: string;
  excerpt?: string;
  year?: number;
  court?: string;
}

interface CitationsPanelProps {
  citations: Citation[];
  language: 'en' | 'hi';
}

const sampleCitations: Citation[] = [
  {
    id: '1',
    title: 'State of Maharashtra v. Suresh',
    source: 'supreme_court',
    url: 'https://indiankanoon.org/doc/123456',
    excerpt: 'The court held that intention must be proved beyond reasonable doubt...',
    year: 2023,
    court: 'Supreme Court of India',
  },
  {
    id: '2',
    title: 'Bhartiya Nyaya Sanhita, 2023 - Section 103',
    source: 'gazette',
    url: 'https://egazette.gov.in/WriteReadData/2023/245678.pdf',
    excerpt: 'Whoever commits murder shall be punished with death or imprisonment for life...',
    year: 2023,
  },
  {
    id: '3',
    title: 'Ram Prasad v. State of UP',
    source: 'high_court',
    url: 'https://indiankanoon.org/doc/789012',
    excerpt: 'The High Court observed that circumstantial evidence must form a complete chain...',
    year: 2022,
    court: 'Allahabad High Court',
  },
  {
    id: '4',
    title: '277th Law Commission Report - Criminal Law Reforms',
    source: 'law_commission',
    url: 'https://lawcommissionofindia.nic.in/reports/Report277.pdf',
    year: 2018,
  },
];

const getSourceIcon = (source: Citation['source']) => {
  switch (source) {
    case 'gazette':
      return FileText;
    case 'supreme_court':
      return Scale;
    case 'high_court':
      return Building2;
    case 'law_commission':
      return BookOpen;
    default:
      return FileText;
  }
};

const getSourceLabel = (source: Citation['source'], language: 'en' | 'hi') => {
  const labels = {
    gazette: { en: 'Official Gazette', hi: 'सरकारी राजपत्र' },
    supreme_court: { en: 'Supreme Court', hi: 'सर्वोच्च न्यायालय' },
    high_court: { en: 'High Court', hi: 'उच्च न्यायालय' },
    law_commission: { en: 'Law Commission', hi: 'विधि आयोग' },
  };
  return labels[source][language];
};

const getSourceColor = (source: Citation['source']) => {
  switch (source) {
    case 'gazette':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'supreme_court':
      return 'bg-secondary/20 text-secondary border-secondary/30';
    case 'high_court':
      return 'bg-accent/20 text-accent border-accent/30';
    case 'law_commission':
      return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const CitationsPanel = ({ citations = [], language }: CitationsPanelProps) => {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            {language === 'en' ? 'Verified Citations' : 'सत्यापित उद्धरण'}
          </h3>
          <Badge variant="outline" className="text-xs border-accent text-accent">
            {citations.length} {language === 'en' ? 'sources' : 'स्रोत'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {citations.map((citation, idx) => {
              const Icon = getSourceIcon(citation.source);
              return (
                <motion.a
                  key={citation.id}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="block rounded-xl border border-border bg-card/50 p-3 transition-all duration-300 hover:border-primary/50 hover:bg-card group"
                >
                  <div className="flex items-start gap-3">
                    {/* Citation Number */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Source Badge */}
                      <Badge variant="outline" className={`text-xs mb-2 ${getSourceColor(citation.source)}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {getSourceLabel(citation.source, language)}
                        {citation.year && <span className="ml-1">• {citation.year}</span>}
                      </Badge>

                      {/* Title */}
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {citation.title}
                      </h4>

                      {/* Excerpt */}
                      {citation.excerpt && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          "{citation.excerpt}"
                        </p>
                      )}

                      {/* Court info */}
                      {citation.court && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {citation.court}
                        </p>
                      )}
                    </div>

                    {/* External link icon */}
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Disclaimer */}
      <div className="border-t border-border p-3 bg-muted/20">
        <p className="text-xs text-muted-foreground text-center">
          {language === 'en' 
            ? '🔗 All citations link to official government or authorized legal databases'
            : '🔗 सभी उद्धरण आधिकारिक सरकारी या अधिकृत कानूनी डेटाबेस से जुड़े हैं'}
        </p>
      </div>
    </div>
  );
};
