import { motion } from 'framer-motion';
import { Scale, Globe, Moon, Sun, Menu, MessageSquare, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserButton, SignedIn } from "@clerk/clerk-react";
import { Link, useLocation } from 'react-router-dom';


interface HeaderProps {
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
}

export const Header = ({ language, onLanguageChange, onMenuClick, onLogoClick }: HeaderProps) => {
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
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onClick={() => onLogoClick?.()}
            >
              <div className="relative">
                <img 
                  src="/national-emblem.png" 
                  alt="NYAYASHASTRA Logo" 
                  className="h-10 w-10 object-contain"
                />
                <motion.div
                  className="absolute inset-0 bg-primary/20 blur-lg rounded-full -z-10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden sm:block text-left">
                <h1 className="text-xl font-serif font-bold tracking-wide text-primary">NYAYASHASTRA</h1>
                <p className="text-xs text-muted-foreground -mt-1 font-serif italic">
                  {language === 'en' ? "India's Legal Intelligence" : 'भारत की कानूनी बुद्धिमत्ता'}
                </p>
              </div>
            </Link>
          </motion.div>


        </div>

        {/* Center - Navigation */}
        <SignedIn>
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/comparison" className="group flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-medium hover:text-primary transition-colors">
                {language === 'en' ? 'IPC vs BNS' : 'IPC बनाम BNS'}
              </span>
            </Link>
            <Link to="/documents" className="group flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-medium hover:text-primary transition-colors">
                {language === 'en' ? 'Document Analysis' : 'दस्तावेज़ विश्लेषण'}
              </span>
            </Link>
            <Link to="/" className="group flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-medium hover:text-primary transition-colors">
                {language === 'en' ? 'Legal Chat' : 'कानूनी चैट'}
              </span>
            </Link>
          </nav>
        </SignedIn>

        {/* Actions */}
        <div className="flex items-center gap-4">
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

          <div className="border-l border-border pl-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

      </div>
    </motion.header>
  );
};
