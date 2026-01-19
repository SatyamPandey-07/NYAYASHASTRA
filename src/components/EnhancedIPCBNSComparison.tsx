import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scale,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Minus,
    FileText,
    Gavel
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Change {
    type: 'added' | 'removed' | 'modified';
    description: string;
}

interface PunishmentChange {
    old: string;
    new: string;
    increased: boolean;
}

interface ComparisonItem {
    id: string;
    ipcSection: string;
    ipcTitle: string;
    ipcContent: string;
    bnsSection: string;
    bnsTitle: string;
    bnsContent: string;
    changes: Change[];
    punishmentChange?: PunishmentChange;
}

interface EnhancedIPCBNSComparisonProps {
    comparisons?: ComparisonItem[];
    language: 'en' | 'hi';
}

// Sample data
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
            increased: false
        }
    },
    {
        id: '2',
        ipcSection: '376',
        ipcTitle: 'Punishment for rape',
        ipcContent: 'Whoever, except in the cases provided for in sub-section (2), commits rape, shall be punished with rigorous imprisonment of either description for a term which shall not be less than seven years, but which may extend to imprisonment for life, and shall also be liable to fine.',
        bnsSection: '65',
        bnsTitle: 'Punishment for rape',
        bnsContent: 'Whoever, except in the cases provided for in sub-section (2), commits rape, shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.',
        changes: [
            { type: 'modified', description: 'Minimum sentence increased from 7 to 10 years' },
            { type: 'added', description: 'Specific provisions for gang rape added' },
            { type: 'added', description: 'Enhanced punishment for repeat offenders' }
        ],
        punishmentChange: {
            old: 'Min 7 years RI to life + fine',
            new: 'Min 10 years RI to life + fine',
            increased: true
        }
    },
    {
        id: '3',
        ipcSection: '420',
        ipcTitle: 'Cheating and dishonestly inducing delivery of property',
        ipcContent: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
        bnsSection: '318',
        bnsTitle: 'Cheating and dishonestly inducing delivery of property',
        bnsContent: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine. This includes digital and electronic fraud.',
        changes: [
            { type: 'added', description: 'Digital/electronic fraud explicitly covered' },
            { type: 'modified', description: 'Enhanced provisions for financial crimes' }
        ]
    }
];

// Highlight differences in text
const highlightDifferences = (oldText: string, newText: string): { oldHighlighted: JSX.Element; newHighlighted: JSX.Element } => {
    const oldWords = oldText.split(' ');
    const newWords = newText.split(' ');

    // Find words that are different
    const oldHighlighted = (
        <span>
            {oldWords.map((word, idx) => {
                const isRemoved = !newWords.includes(word) ||
                    (word.match(/\d+/) && !newText.includes(word));
                return (
                    <span key={idx} className={isRemoved ? 'bg-red-500/30 text-red-300 px-0.5 rounded' : ''}>
                        {word}{' '}
                    </span>
                );
            })}
        </span>
    );

    const newHighlighted = (
        <span>
            {newWords.map((word, idx) => {
                const isAdded = !oldWords.includes(word) ||
                    (word.match(/\d+/) && !oldText.includes(word));
                return (
                    <span key={idx} className={isAdded ? 'bg-green-500/30 text-green-300 px-0.5 rounded' : ''}>
                        {word}{' '}
                    </span>
                );
            })}
        </span>
    );

    return { oldHighlighted, newHighlighted };
};

export const EnhancedIPCBNSComparison = ({
    comparisons = [],
    language
}: EnhancedIPCBNSComparisonProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showHighlights, setShowHighlights] = useState(true);

    const getChangeIcon = (type: string) => {
        switch (type) {
            case 'added': return <span className="text-green-400">+</span>;
            case 'removed': return <span className="text-red-400">−</span>;
            case 'modified': return <span className="text-yellow-400">~</span>;
            default: return null;
        }
    };

    const getChangeColor = (type: string) => {
        switch (type) {
            case 'added': return 'bg-green-500/20 border-green-500/30 text-green-300';
            case 'removed': return 'bg-red-500/20 border-red-500/30 text-red-300';
            case 'modified': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
            default: return 'bg-muted';
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'IPC ↔ BNS Comparison' : 'IPC ↔ BNS तुलना'}
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHighlights(!showHighlights)}
                    className="text-xs"
                >
                    {showHighlights ? 'Hide' : 'Show'} Changes
                </Button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500/30" />
                    <span className="text-muted-foreground">Added</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500/30" />
                    <span className="text-muted-foreground">Removed</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500/30" />
                    <span className="text-muted-foreground">Modified</span>
                </div>
            </div>

            {/* Comparisons List */}
            <ScrollArea className="h-[400px]">
                <div className="space-y-3 pr-2">
                    {comparisons.map((item) => {
                        const isExpanded = expandedId === item.id;
                        const { oldHighlighted, newHighlighted } = highlightDifferences(
                            item.ipcContent,
                            item.bnsContent
                        );
                        const hasChanges = item.changes.length > 0;

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                className="glass rounded-xl overflow-hidden"
                            >
                                {/* Header */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-accent/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Section Numbers */}
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-chart-1/20 text-chart-1 border-chart-1/30">
                                                IPC §{item.ipcSection}
                                            </Badge>
                                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                            <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                                                BNS §{item.bnsSection}
                                            </Badge>
                                        </div>

                                        {/* Change Indicator */}
                                        {hasChanges && (
                                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                {item.changes.length} change{item.changes.length > 1 ? 's' : ''}
                                            </Badge>
                                        )}

                                        {/* Punishment Change */}
                                        {item.punishmentChange && (
                                            <div className="flex items-center gap-1">
                                                {item.punishmentChange.increased ? (
                                                    <TrendingUp className="h-3 w-3 text-red-400" />
                                                ) : item.punishmentChange.old !== item.punishmentChange.new ? (
                                                    <TrendingDown className="h-3 w-3 text-green-400" />
                                                ) : (
                                                    <Minus className="h-3 w-3 text-muted-foreground" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {isExpanded ? (
                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </button>

                                {/* Title */}
                                <div className="px-4 pb-2">
                                    <p className="text-sm font-medium text-foreground line-clamp-1">
                                        {item.ipcTitle}
                                    </p>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-4 pb-4 space-y-4">
                                                {/* Side-by-Side Comparison */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* IPC Content */}
                                                    <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FileText className="h-4 w-4 text-chart-1" />
                                                            <span className="text-xs font-semibold text-chart-1">
                                                                IPC Section {item.ipcSection}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {showHighlights ? oldHighlighted : item.ipcContent}
                                                        </p>
                                                    </div>

                                                    {/* BNS Content */}
                                                    <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Gavel className="h-4 w-4 text-chart-2" />
                                                            <span className="text-xs font-semibold text-chart-2">
                                                                BNS Section {item.bnsSection}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {showHighlights ? newHighlighted : item.bnsContent}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Changes List */}
                                                {item.changes.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-semibold text-foreground">
                                                            {language === 'en' ? 'Key Changes:' : 'मुख्य परिवर्तन:'}
                                                        </h4>
                                                        <div className="space-y-1">
                                                            {item.changes.map((change, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`text-xs p-2 rounded border ${getChangeColor(change.type)}`}
                                                                >
                                                                    <span className="font-mono mr-2">{getChangeIcon(change.type)}</span>
                                                                    {change.description}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Punishment Comparison */}
                                                {item.punishmentChange && (
                                                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                                                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            <Scale className="h-3 w-3" />
                                                            {language === 'en' ? 'Punishment Comparison' : 'सजा तुलना'}
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <span className="text-muted-foreground">Old (IPC):</span>
                                                                <p className="font-medium text-chart-1">{item.punishmentChange.old}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">New (BNS):</span>
                                                                <p className="font-medium text-chart-2">{item.punishmentChange.new}</p>
                                                            </div>
                                                        </div>
                                                        {item.punishmentChange.increased && (
                                                            <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
                                                                <TrendingUp className="h-3 w-3" />
                                                                Punishment increased under BNS
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* No data state */}
            {comparisons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Scale className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                        {language === 'en'
                            ? 'No comparisons available yet'
                            : 'अभी तक कोई तुलना उपलब्ध नहीं है'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default EnhancedIPCBNSComparison;
