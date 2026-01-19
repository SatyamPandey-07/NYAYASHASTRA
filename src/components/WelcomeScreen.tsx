import { motion } from 'framer-motion';
import { 
  Brain, 
  Database, 
  Shield, 
  Zap, 
  Globe,
  Scale,
  FileText,
  Link2,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  language: 'en' | 'hi';
  onStartChat: (query?: string) => void;
}

const features = [
  {
    icon: Brain,
    title: 'Multi-Agent Intelligence',
    titleHindi: 'मल्टी-एजेंट बुद्धिमत्ता',
    description: '7 specialized AI agents working in orchestration',
    descriptionHindi: '7 विशेष AI एजेंट एक साथ काम करते हैं',
    color: 'text-primary',
  },
  {
    icon: Scale,
    title: 'IPC ↔ BNS Mapping',
    titleHindi: 'IPC ↔ BNS मैपिंग',
    description: 'Automatic cross-referencing between old and new laws',
    descriptionHindi: 'पुराने और नए कानूनों के बीच स्वचालित क्रॉस-रेफरेंसिंग',
    color: 'text-secondary',
  },
  {
    icon: Globe,
    title: 'Bilingual Support',
    titleHindi: 'द्विभाषी समर्थन',
    description: 'Full English and Hindi language support',
    descriptionHindi: 'पूर्ण अंग्रेजी और हिंदी भाषा समर्थन',
    color: 'text-accent',
  },
  {
    icon: Link2,
    title: 'Verified Citations',
    titleHindi: 'सत्यापित उद्धरण',
    description: 'Links to official government gazettes only',
    descriptionHindi: 'केवल आधिकारिक सरकारी राजपत्रों के लिंक',
    color: 'text-chart-5',
  },
  {
    icon: FileText,
    title: 'Document Analysis',
    titleHindi: 'दस्तावेज़ विश्लेषण',
    description: 'Upload and summarize court orders & judgments',
    descriptionHindi: 'अदालती आदेश और निर्णयों का सारांश',
    color: 'text-chart-4',
  },
  {
    icon: Database,
    title: 'Comprehensive Database',
    titleHindi: 'व्यापक डेटाबेस',
    description: 'IPC, BNS, CrPC, IT Act, and more',
    descriptionHindi: 'IPC, BNS, CrPC, IT अधिनियम और अधिक',
    color: 'text-chart-3',
  },
];

const sampleQueries = [
  {
    query: 'What is the punishment for theft under IPC and BNS?',
    queryHindi: 'IPC और BNS के तहत चोरी के लिए क्या सजा है?',
  },
  {
    query: 'Explain Section 498A of IPC and its BNS equivalent',
    queryHindi: 'IPC की धारा 498A और इसके BNS समकक्ष की व्याख्या करें',
  },
  {
    query: 'What are the bail provisions for cybercrime under IT Act?',
    queryHindi: 'IT अधिनियम के तहत साइबर अपराध के लिए जमानत प्रावधान क्या हैं?',
  },
];

export const WelcomeScreen = ({ language, onStartChat }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative inline-block mb-6"
        >
          <Scale className="h-20 w-20 text-primary" />
          <motion.div
            className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">NyayGuru AI Pro</span>
        </h1>
        <p className={`text-lg text-muted-foreground mb-2 ${language === 'hi' ? 'text-hindi' : ''}`}>
          {language === 'en' 
            ? "India's Most Advanced Legal AI Assistant"
            : "भारत का सबसे उन्नत कानूनी AI सहायक"}
        </p>
        <p className={`text-sm text-muted-foreground ${language === 'hi' ? 'text-hindi' : ''}`}>
          {language === 'en'
            ? 'Powered by Multi-Agent RAG with IPC, BNS, and Indian regulatory statutes'
            : 'IPC, BNS, और भारतीय नियामक विधियों के साथ मल्टी-एजेंट RAG द्वारा संचालित'}
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mb-12"
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="glass rounded-xl p-4 text-center hover:glow-primary transition-all duration-300"
            >
              <Icon className={`h-8 w-8 mx-auto mb-2 ${feature.color}`} />
              <h3 className={`text-sm font-semibold text-foreground mb-1 ${language === 'hi' ? 'text-hindi' : ''}`}>
                {language === 'hi' ? feature.titleHindi : feature.title}
              </h3>
              <p className={`text-xs text-muted-foreground ${language === 'hi' ? 'text-hindi' : ''}`}>
                {language === 'hi' ? feature.descriptionHindi : feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Sample Queries */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <p className={`text-sm text-center text-muted-foreground mb-4 ${language === 'hi' ? 'text-hindi' : ''}`}>
          {language === 'en' ? 'Try asking:' : 'पूछकर देखें:'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {sampleQueries.map((sample, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onStartChat(language === 'hi' ? sample.queryHindi : sample.query)}
              className={`text-xs hover:border-primary hover:text-primary transition-colors ${language === 'hi' ? 'text-hindi' : ''}`}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {language === 'hi' ? sample.queryHindi : sample.query}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className={`text-xs text-muted-foreground ${language === 'hi' ? 'text-hindi' : ''}`}>
          ⚖️ {language === 'en' 
            ? 'Disclaimer: NyayGuru AI is for informational purposes only and does not constitute legal advice.'
            : 'अस्वीकरण: न्यायगुरु AI केवल सूचनात्मक उद्देश्यों के लिए है और कानूनी सलाह नहीं देता।'}
        </p>
      </motion.div>
    </div>
  );
};
