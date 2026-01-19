import { motion } from 'framer-motion';
import {
    Scale,
    Brain,
    Globe,
    FileText,
    Shield,
    Sparkles,
    ArrowRight,
    Users,
    Building2,
    Gavel,
    BookOpen,
    CheckCircle2,
    Quote,
    ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
    language: 'en' | 'hi';
    onStartChat: (query?: string) => void;
}

const stats = [
    { value: '500+', label: 'IPC Sections', labelHi: 'IPC धाराएं' },
    { value: '350+', label: 'BNS Sections', labelHi: 'BNS धाराएं' },
    { value: '100+', label: 'Landmark Cases', labelHi: 'ऐतिहासिक मामले' },
    { value: '2', label: 'Languages', labelHi: 'भाषाएं' }
];

const features = [
    {
        icon: Brain,
        title: 'Multi-Agent AI',
        titleHi: 'मल्टी-एजेंट AI',
        description: '7 specialized AI agents working in orchestration',
        descriptionHi: '7 विशेषज्ञ AI एजेंट समन्वय में काम कर रहे हैं'
    },
    {
        icon: Scale,
        title: 'IPC ↔ BNS Mapping',
        titleHi: 'IPC ↔ BNS मैपिंग',
        description: 'Automatic cross-referencing between old and new laws',
        descriptionHi: 'पुराने और नए कानूनों के बीच स्वचालित क्रॉस-रेफ़रेंसिंग'
    },
    {
        icon: Globe,
        title: 'Bilingual Support',
        titleHi: 'द्विभाषी समर्थन',
        description: 'Full English and Hindi language support',
        descriptionHi: 'पूर्ण अंग्रेजी और हिंदी भाषा समर्थन'
    },
    {
        icon: Shield,
        title: 'Verified Citations',
        titleHi: 'सत्यापित उद्धरण',
        description: 'Links only to official government sources',
        descriptionHi: 'केवल आधिकारिक सरकारी स्रोतों के लिंक'
    },
    {
        icon: FileText,
        title: 'Document Analysis',
        titleHi: 'दस्तावेज़ विश्लेषण',
        description: 'Upload and summarize court orders & judgments',
        descriptionHi: 'कोर्ट आदेश और निर्णय अपलोड और सारांशित करें'
    },
    {
        icon: Gavel,
        title: 'Case Intelligence',
        titleHi: 'केस इंटेलिजेंस',
        description: 'Supreme Court and High Court judgment retrieval',
        descriptionHi: 'सुप्रीम कोर्ट और हाई कोर्ट के निर्णय'
    }
];

const socialImpact = [
    {
        icon: Users,
        title: 'Access to Justice',
        titleHi: 'न्याय तक पहुंच',
        description: 'Democratizing legal knowledge for 1.4 billion Indians',
        descriptionHi: '1.4 अरब भारतीयों के लिए कानूनी ज्ञान का लोकतंत्रीकरण'
    },
    {
        icon: Building2,
        title: 'Rural Empowerment',
        titleHi: 'ग्रामीण सशक्तिकरण',
        description: 'Bridging the legal knowledge gap in rural India',
        descriptionHi: 'ग्रामीण भारत में कानूनी ज्ञान की खाई को पाटना'
    },
    {
        icon: BookOpen,
        title: 'Legal Literacy',
        titleHi: 'कानूनी साक्षरता',
        description: 'Making complex laws understandable for everyone',
        descriptionHi: 'जटिल कानूनों को सभी के लिए समझने योग्य बनाना'
    }
];

const sampleQueries = [
    'What is Section 302 IPC and its BNS equivalent?',
    'Explain the Vishaka Guidelines',
    'What are the punishments for cheating under Section 420?',
    'धारा 376 में बलात्कार की सजा क्या है?'
];

export const LandingPage = ({ language, onStartChat }: LandingPageProps) => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                                {language === 'en' ? "India's First AI Legal Assistant" : "भारत का पहला AI कानूनी सहायक"}
                            </span>
                        </motion.div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="text-gradient">NyayGuru</span>
                            <span className="text-foreground"> AI Pro</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
                            {language === 'en'
                                ? 'AI-Powered Legal Helper for India'
                                : 'भारत के लिए AI-संचालित कानूनी सहायक'}
                        </p>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {language === 'en'
                                ? 'Get instant, accurate, and bilingual answers about IPC, BNS, and Indian law with verified citations.'
                                : 'IPC, BNS और भारतीय कानून के बारे में सत्यापित उद्धरणों के साथ तत्काल, सटीक और द्विभाषी उत्तर प्राप्त करें।'}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                size="lg"
                                className="glow-primary text-lg px-8 py-6"
                                onClick={() => onStartChat()}
                            >
                                {language === 'en' ? 'Start Legal Query' : 'कानूनी प्रश्न शुरू करें'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6"
                            >
                                {language === 'en' ? 'Watch Demo' : 'डेमो देखें'}
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="glass rounded-xl p-4 text-center"
                                >
                                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {language === 'hi' ? stat.labelHi : stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'en' ? 'Powerful Features' : 'शक्तिशाली विशेषताएं'}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'en'
                                ? 'Built with cutting-edge AI technology for accurate legal assistance'
                                : 'सटीक कानूनी सहायता के लिए अत्याधुनिक AI तकनीक के साथ निर्मित'}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
                            >
                                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {language === 'hi' ? feature.titleHi : feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {language === 'hi' ? feature.descriptionHi : feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Impact Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">
                                {language === 'en' ? 'Social Impact' : 'सामाजिक प्रभाव'}
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'en'
                                ? 'Democratizing access to legal knowledge across India'
                                : 'पूरे भारत में कानूनी ज्ञान तक पहुंच का लोकतंत्रीकरण'}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {socialImpact.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="text-center p-8 rounded-2xl glass-strong"
                            >
                                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 w-fit mx-auto mb-4">
                                    <item.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {language === 'hi' ? item.titleHi : item.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {language === 'hi' ? item.descriptionHi : item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Impact Quote */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-strong rounded-2xl p-8 text-center max-w-3xl mx-auto"
                    >
                        <Quote className="h-8 w-8 text-primary mx-auto mb-4" />
                        <blockquote className="text-lg md:text-xl italic text-foreground mb-4">
                            {language === 'en'
                                ? '"Justice delayed is justice denied. NyayGuru AI Pro brings instant legal clarity to every Indian citizen."'
                                : '"न्याय में देरी न्याय से वंचित करना है। NyayGuru AI Pro हर भारतीय नागरिक के लिए तत्काल कानूनी स्पष्टता लाता है।"'}
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            {/* Try It Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'en' ? 'Try It Now' : 'अभी प्रयास करें'}
                        </h2>
                        <p className="text-muted-foreground">
                            {language === 'en'
                                ? 'Click on any question to get started'
                                : 'शुरू करने के लिए किसी भी प्रश्न पर क्लिक करें'}
                        </p>
                    </motion.div>

                    <div className="grid gap-3">
                        {sampleQueries.map((query, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => onStartChat(query)}
                                className="w-full text-left p-4 glass rounded-xl hover:border-primary/50 transition-all duration-300 group flex items-center justify-between"
                            >
                                <span className="text-foreground group-hover:text-primary transition-colors">
                                    {query}
                                </span>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-border">
                <div className="container mx-auto max-w-6xl text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                        {language === 'en'
                            ? '⚖️ This tool is for informational purposes only and does not constitute legal advice.'
                            : '⚖️ यह उपकरण केवल सूचनात्मक उद्देश्यों के लिए है और कानूनी सलाह नहीं है।'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        © 2024 NyayGuru AI Pro. {language === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
