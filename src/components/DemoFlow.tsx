import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipForward,
    RotateCcw,
    ChevronRight,
    CheckCircle2,
    Sparkles,
    Brain,
    Scale,
    Gavel,
    FileText,
    MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface DemoStep {
    id: number;
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    icon: React.ElementType;
    duration: number; // seconds
    highlight: string;
}

interface DemoFlowProps {
    language: 'en' | 'hi';
    onComplete?: () => void;
    onStepChange?: (step: number) => void;
}

const demoSteps: DemoStep[] = [
    {
        id: 1,
        title: 'User Asks Legal Question',
        titleHi: 'उपयोगकर्ता कानूनी प्रश्न पूछता है',
        description: 'User types a legal query in English or Hindi about IPC Section 302 (Murder)',
        descriptionHi: 'उपयोगकर्ता IPC धारा 302 (हत्या) के बारे में अंग्रेजी या हिंदी में प्रश्न टाइप करता है',
        icon: MessageSquare,
        duration: 3,
        highlight: 'chat-input'
    },
    {
        id: 2,
        title: 'Query Understanding',
        titleHi: 'प्रश्न समझ',
        description: 'AI detects language (English), domain (Criminal Law), and entities (Section 302)',
        descriptionHi: 'AI भाषा (अंग्रेजी), क्षेत्र (आपराधिक कानून), और संस्थाओं (धारा 302) का पता लगाता है',
        icon: Brain,
        duration: 2,
        highlight: 'agent-query'
    },
    {
        id: 3,
        title: 'Statute Retrieval',
        titleHi: 'विधि पुनर्प्राप्ति',
        description: 'Retrieves IPC Section 302 and automatically maps to BNS Section 103',
        descriptionHi: 'IPC धारा 302 पुनर्प्राप्त करता है और स्वचालित रूप से BNS धारा 103 से मैप करता है',
        icon: Scale,
        duration: 3,
        highlight: 'statutes-panel'
    },
    {
        id: 4,
        title: 'Case Law Intelligence',
        titleHi: 'केस कानून इंटेलिजेंस',
        description: 'Finds landmark case: Bachan Singh v. State of Punjab (1980) - "Rarest of Rare" doctrine',
        descriptionHi: 'ऐतिहासिक मामला खोजता है: बचन सिंह बनाम पंजाब राज्य (1980)',
        icon: Gavel,
        duration: 3,
        highlight: 'cases-panel'
    },
    {
        id: 5,
        title: 'Citation Generation',
        titleHi: 'उद्धरण उत्पादन',
        description: 'Creates verified citations linking to official Government Gazette and IndianKanoon',
        descriptionHi: 'आधिकारिक सरकारी राजपत्र और IndianKanoon से जुड़े सत्यापित उद्धरण बनाता है',
        icon: FileText,
        duration: 2,
        highlight: 'citations-panel'
    },
    {
        id: 6,
        title: 'Response Synthesis',
        titleHi: 'प्रतिक्रिया संश्लेषण',
        description: 'Generates comprehensive bilingual response with legal disclaimer',
        descriptionHi: 'कानूनी अस्वीकरण के साथ व्यापक द्विभाषी प्रतिक्रिया उत्पन्न करता है',
        icon: Sparkles,
        duration: 3,
        highlight: 'chat-response'
    }
];

export const DemoFlow = ({ language, onComplete, onStepChange }: DemoFlowProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const totalDuration = demoSteps.reduce((acc, step) => acc + step.duration, 0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && currentStep < demoSteps.length) {
            const stepDuration = demoSteps[currentStep].duration;
            const increment = 100 / (stepDuration * 10); // 100ms intervals

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        // Move to next step
                        setCompletedSteps(c => [...c, currentStep]);
                        if (currentStep < demoSteps.length - 1) {
                            setCurrentStep(s => s + 1);
                            onStepChange?.(currentStep + 1);
                            return 0;
                        } else {
                            setIsPlaying(false);
                            onComplete?.();
                            return 100;
                        }
                    }
                    return prev + increment;
                });
            }, 100);
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, onComplete, onStepChange]);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleSkip = () => {
        if (currentStep < demoSteps.length - 1) {
            setCompletedSteps(c => [...c, currentStep]);
            setCurrentStep(s => s + 1);
            setProgress(0);
            onStepChange?.(currentStep + 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setProgress(0);
        setIsPlaying(false);
        setCompletedSteps([]);
        onStepChange?.(0);
    };

    const currentStepData = demoSteps[currentStep];
    const overallProgress = ((currentStep / demoSteps.length) * 100) + (progress / demoSteps.length);

    return (
        <div className="glass-strong rounded-2xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Play className="h-5 w-5 text-primary" />
                        {language === 'en' ? 'Demo Walkthrough' : 'डेमो वॉकथ्रू'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {language === 'en'
                            ? 'See how NyayGuru AI processes your legal query'
                            : 'देखें कि NyayGuru AI आपके कानूनी प्रश्न को कैसे संसाधित करता है'}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {isPlaying ? (
                        <Button variant="outline" size="icon" onClick={handlePause}>
                            <Pause className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="outline" size="icon" onClick={handlePlay}>
                            <Play className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={handleSkip}>
                        <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Step {currentStep + 1} of {demoSteps.length}</span>
                    <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
            </div>

            {/* Current Step Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/20">
                            <currentStepData.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-semibold text-foreground mb-2">
                                {language === 'hi' ? currentStepData.titleHi : currentStepData.title}
                            </h4>
                            <p className="text-muted-foreground">
                                {language === 'hi' ? currentStepData.descriptionHi : currentStepData.description}
                            </p>

                            {/* Step Progress */}
                            <div className="mt-4">
                                <Progress value={progress} className="h-1" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Steps Timeline */}
            <div className="space-y-2">
                {demoSteps.map((step, idx) => {
                    const isCompleted = completedSteps.includes(idx);
                    const isCurrent = currentStep === idx;
                    const StepIcon = step.icon;

                    return (
                        <motion.div
                            key={step.id}
                            initial={false}
                            animate={{
                                opacity: isCurrent ? 1 : isCompleted ? 0.7 : 0.4,
                                scale: isCurrent ? 1.02 : 1
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrent ? 'bg-primary/10 border border-primary/30' :
                                    isCompleted ? 'bg-accent/5' : ''
                                }`}
                        >
                            {/* Status Icon */}
                            <div className={`p-1.5 rounded-lg ${isCompleted ? 'bg-green-500/20 text-green-400' :
                                    isCurrent ? 'bg-primary/20 text-primary' :
                                        'bg-muted text-muted-foreground'
                                }`}>
                                {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <StepIcon className="h-4 w-4" />
                                )}
                            </div>

                            {/* Step Info */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isCurrent ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                    {language === 'hi' ? step.titleHi : step.title}
                                </p>
                            </div>

                            {/* Duration */}
                            <span className="text-xs text-muted-foreground">
                                {step.duration}s
                            </span>

                            {/* Arrow */}
                            {idx < demoSteps.length - 1 && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Completion Message */}
            <AnimatePresence>
                {completedSteps.length === demoSteps.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center p-6 rounded-xl bg-green-500/10 border border-green-500/30"
                    >
                        <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-green-400 mb-2">
                            {language === 'en' ? 'Demo Complete!' : 'डेमो पूर्ण!'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {language === 'en'
                                ? 'The multi-agent AI pipeline processed the query in seconds'
                                : 'मल्टी-एजेंट AI पाइपलाइन ने सेकंड में प्रश्न संसाधित किया'}
                        </p>
                        <Button onClick={handleReset} variant="outline" className="mt-4">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            {language === 'en' ? 'Watch Again' : 'फिर से देखें'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DemoFlow;
