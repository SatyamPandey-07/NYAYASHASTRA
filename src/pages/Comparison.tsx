import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EnhancedIPCBNSComparison } from '@/components/EnhancedIPCBNSComparison';
import { motion } from 'framer-motion';
import { getIPCBNSComparisons, IPCBNSMapping } from '@/services/api';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ComparisonItem {
    id: string;
    ipcSection: string;
    ipcTitle: string;
    ipcContent: string;
    bnsSection: string;
    bnsTitle: string;
    bnsContent: string;
    changes: Array<{ type: 'added' | 'removed' | 'modified'; description: string }>;
    punishmentChange?: {
        old: string;
        new: string;
        increased: boolean;
    };
}

// Transform API data to component format
const transformMapping = (mapping: IPCBNSMapping): ComparisonItem => ({
    id: mapping.id,
    ipcSection: mapping.ipcSection,
    ipcTitle: mapping.ipcTitle,
    ipcContent: mapping.ipcContent,
    bnsSection: mapping.bnsSection,
    bnsTitle: mapping.bnsTitle,
    bnsContent: mapping.bnsContent,
    changes: mapping.changes.map(c => ({
        type: c.type as 'added' | 'removed' | 'modified',
        description: c.description
    })),
    punishmentChange: mapping.punishmentChange
});

export const Comparison = () => {
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    // Fetch comparisons from API with retry for Neon cold start
    useEffect(() => {
        const fetchComparisons = async (retries = 3) => {
            try {
                setLoading(true);
                setError(null);
                const data = await getIPCBNSComparisons(undefined, undefined, searchQuery || undefined);
                setComparisons(data.comparisons.map(transformMapping));
                setTotalCount(data.total);
            } catch (err) {
                console.error('Failed to fetch comparisons:', err);
                if (retries > 0) {
                    console.log(`Retrying... (${retries} attempts left)`);
                    setTimeout(() => fetchComparisons(retries - 1), 2000);
                    return;
                }
                setError('Database is waking up. Please refresh the page in a few seconds.');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(fetchComparisons, searchQuery ? 300 : 0);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

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
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                                    {language === 'en' ? 'IPC ↔ BNS Comparison' : 'IPC ↔ BNS तुलना'}
                                </h1>
                                <p className="text-muted-foreground italic">
                                    {language === 'en' 
                                        ? 'Cross-reference Indian Penal Code (1860) with Bhartiya Nyaya Sanhita (2023)' 
                                        : 'भारतीय दंड संहिता (1860) की भारतीय न्याय संहिता (2023) के साथ तुलना करें'}
                                </p>
                            </div>
                            {!loading && !error && (
                                <Badge variant="outline" className="text-sm">
                                    {totalCount} {language === 'en' ? 'Mappings Found' : 'मैपिंग मिली'}
                                </Badge>
                            )}
                        </div>
                        
                        {/* Search Bar */}
                        <div className="mt-6 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={language === 'en' 
                                    ? "Search by section number or title (e.g., '302', 'Murder', 'Theft')..." 
                                    : "खंड संख्या या शीर्षक द्वारा खोजें (जैसे, '302', 'हत्या', 'चोरी')..."}
                                className="pl-12 h-12 text-lg rounded-2xl border-primary/20 focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="glass-strong rounded-[2rem] p-8 shadow-2xl">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                                <p className="text-foreground font-medium mb-2">
                                    {language === 'en' ? 'Loading comparisons...' : 'तुलना लोड हो रही है...'}
                                </p>
                                <p className="text-sm text-muted-foreground text-center max-w-md">
                                    {language === 'en' 
                                        ? 'First load may take 30-60 seconds while the database wakes up. Subsequent loads will be instant.'
                                        : 'पहला लोड 30-60 सेकंड ले सकता है जब डेटाबेस जाग रहा हो। बाद के लोड तुरंत होंगे।'}
                                </p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 text-red-500">
                                <AlertCircle className="h-10 w-10 mb-4" />
                                <p className="text-center">{error}</p>
                            </div>
                        ) : (
                            <EnhancedIPCBNSComparison 
                                comparisons={comparisons} 
                                language={language} 
                            />
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Comparison;
