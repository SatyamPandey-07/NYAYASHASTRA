import { useState } from 'react';
import { Header } from '@/components/Header';
import { EnhancedIPCBNSComparison } from '@/components/EnhancedIPCBNSComparison';
import { motion } from 'framer-motion';

export const Comparison = () => {
    const [language, setLanguage] = useState<'en' | 'hi'>('en');

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header
                language={language}
                onLanguageChange={setLanguage}
            />
            <main className="flex-1 container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                            {language === 'en' ? 'IPC ↔ BNS Comparison' : 'IPC ↔ BNS तुलना'}
                        </h1>
                        <p className="text-muted-foreground italic">
                            {language === 'en' 
                                ? 'Cross-reference Indian Penal Code (1860) with Bhartiya Nyaya Sanhita (2023)' 
                                : 'भारतीय दंड संहिता (1860) की भारतीय न्याय संहिता (2023) के साथ तुलना करें'}
                        </p>
                    </div>
                    
                    <div className="glass-strong rounded-[2rem] p-8 shadow-2xl">
                        <EnhancedIPCBNSComparison language={language} />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Comparison;
