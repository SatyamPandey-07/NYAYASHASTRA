import { motion } from 'framer-motion';
import { Scale, Globe, Moon, Sun, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onMenuClick?: () => void;
}

export const Header = ({ language, onLanguageChange, onMenuClick }: HeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-strong border-b border-border sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Scale className="h-8 w-8 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/30 blur-lg rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold gradient-text">NyayGuru AI</h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {language === 'en' ? "India's Legal Intelligence" : 'भारत की कानूनी बुद्धिमत्ता'}
              </p>
            </div>
          </motion.div>

          <Badge variant="secondary" className="hidden md:inline-flex text-xs bg-secondary/20 border-secondary/30">
            Pro
          </Badge>
        </div>

        {/* Center - Status */}
        <div className="hidden md:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {language === 'en' ? 'Connected to Legal Database' : 'कानूनी डेटाबेस से जुड़ा'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 glass rounded-full p-1">
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 rounded-full text-xs"
              onClick={() => onLanguageChange('en')}
            >
              <Globe className="h-3 w-3 mr-1" />
              EN
            </Button>
            <Button
              variant={language === 'hi' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 rounded-full text-xs text-hindi"
              onClick={() => onLanguageChange('hi')}
            >
              हि
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
