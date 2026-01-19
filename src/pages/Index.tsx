import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { AgentStatusPanel } from '@/components/AgentStatusPanel';
import { AgentOrchestration3D } from '@/components/AgentOrchestration3D';
import { IPCBNSComparison } from '@/components/IPCBNSComparison';
import { EnhancedIPCBNSComparison } from '@/components/EnhancedIPCBNSComparison';
import { CitationsPanel } from '@/components/CitationsPanel';
import { DocumentUpload } from '@/components/DocumentUpload';
import { RetrievedStatutesPanel } from '@/components/RetrievedStatutesPanel';
import { CaseLawsPanel } from '@/components/CaseLawsPanel';
import { QuickActions } from '@/components/QuickActions';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LandingPage } from '@/components/LandingPage';
import { DemoFlow } from '@/components/DemoFlow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useApi';
import {
  BookOpen,
  Scale,
  Link2,
  FileText,
  Brain,
  Maximize2,
  Minimize2,
  Gavel,
  PlayCircle
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentHindi?: string;
  citations?: Array<{ id: string; source: string; url: string; title: string }>;
  statutes?: Array<{ id: string; section: string; act: string; content: string }>;
  timestamp: Date;
}

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showSidebar, setShowSidebar] = useState(false);
  const [show3DView, setShow3DView] = useState(false);
  const [useBackendAPI, setUseBackendAPI] = useState(false);

  // Try to use the API hook, fallback to local state if backend not available
  const {
    messages: apiMessages,
    isProcessing,
    activeAgent,
    completedAgents,
    processingAgents,
    currentStatutes,
    currentCitations,
    currentMappings,
    error: apiError,
    sendMessage: sendApiMessage,
  } = useChat({ language, useStreaming: false });

  // Local state for fallback mode
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  const [localActiveAgent, setLocalActiveAgent] = useState<string | null>(null);
  const [localCompletedAgents, setLocalCompletedAgents] = useState<string[]>([]);
  const [localProcessingAgents, setLocalProcessingAgents] = useState<string[]>([]);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setUseBackendAPI(true);
          console.log('✅ Backend connected');
        }
      } catch {
        console.log('⚠️ Backend not available, using demo mode');
        setUseBackendAPI(false);
      }
    };
    checkBackend();
  }, []);

  const simulateAgentProcessing = useCallback(() => {
    const agents = ['query', 'statute', 'case', 'regulatory', 'citation', 'summary', 'response'];
    let currentIndex = 0;

    setLocalCompletedAgents([]);
    setLocalProcessingAgents([]);

    const processNextAgent = () => {
      if (currentIndex < agents.length) {
        const agent = agents[currentIndex];
        setLocalActiveAgent(agent);
        setLocalProcessingAgents([agent]);

        setTimeout(() => {
          setLocalCompletedAgents((prev) => [...prev, agent]);
          setLocalProcessingAgents([]);
          currentIndex++;
          processNextAgent();
        }, 400 + Math.random() * 400);
      } else {
        setLocalActiveAgent(null);
        setLocalIsProcessing(false);
      }
    };

    processNextAgent();
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (useBackendAPI) {
      try {
        await sendApiMessage(content);
      } catch (err) {
        console.error('API Error:', err);
        // Fallback to local mode
        handleLocalMessage(content);
      }
    } else {
      handleLocalMessage(content);
    }
  }, [useBackendAPI, sendApiMessage]);

  const handleLocalMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, userMessage]);
    setLocalIsProcessing(true);
    simulateAgentProcessing();

    // Simulate AI response after agents complete
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateSampleResponse(content, 'en'),
        contentHindi: generateSampleResponse(content, 'hi'),
        citations: [
          { id: '1', source: 'gazette', url: 'https://egazette.gov.in', title: 'Bhartiya Nyaya Sanhita, 2023 - Section 103' },
          { id: '2', source: 'supreme_court', url: 'https://indiankanoon.org', title: 'State of Maharashtra v. Suresh (2023)' },
        ],
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, assistantMessage]);
    }, 3500);
  }, [simulateAgentProcessing]);

  const handleStartChat = (query?: string) => {
    if (query) {
      handleSendMessage(query);
    }
  };

  // Determine which state to use
  const messages = useBackendAPI ? apiMessages : localMessages;
  const processing = useBackendAPI ? isProcessing : localIsProcessing;
  const currentActiveAgent = useBackendAPI ? activeAgent : localActiveAgent;
  const currentCompletedAgents = useBackendAPI ? completedAgents : localCompletedAgents;
  const currentProcessingAgents = useBackendAPI ? processingAgents : localProcessingAgents;

  const hasMessages = messages.length > 0;

  // Map API messages to component format
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    contentHindi: msg.contentHindi,
    citations: msg.citations?.map(c => ({
      id: c.id,
      source: c.source,
      url: c.url,
      title: c.title
    })),
    timestamp: msg.timestamp
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onMenuClick={() => setShowSidebar(true)}
      />

      {/* API Status Indicator */}
      <div className="absolute top-20 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${useBackendAPI
          ? 'bg-accent/20 text-accent border border-accent/30'
          : 'bg-chart-4/20 text-chart-4 border border-chart-4/30'
          }`}>
          <div className={`w-2 h-2 rounded-full ${useBackendAPI ? 'bg-accent' : 'bg-chart-4'} animate-pulse`} />
          {useBackendAPI ? 'API Connected' : 'Demo Mode'}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hasMessages ? (
            <div className="flex-1 overflow-y-auto">
              <WelcomeScreen language={language} onStartChat={handleStartChat} />
              <div className="container mx-auto px-4 pb-8">
                <QuickActions language={language} onActionClick={handleSendMessage} />
              </div>
            </div>
          ) : (
            <ChatInterface
              messages={formattedMessages}
              onSendMessage={handleSendMessage}
              isProcessing={processing}
              language={language}
            />
          )}
        </div>

        {/* Right Sidebar - Desktop */}
        <AnimatePresence>
          {hasMessages && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block border-l border-border bg-background overflow-hidden"
            >
              <div className="h-full overflow-y-auto p-4 space-y-4">
                {/* 3D Visualization Toggle */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Agent Orchestration' : 'एजेंट ऑर्केस्ट्रेशन'}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShow3DView(!show3DView)}
                    className="text-xs"
                  >
                    {show3DView ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </Button>
                </div>

                {/* 3D View or Agent Status */}
                <AnimatePresence mode="wait">
                  {show3DView ? (
                    <motion.div
                      key="3d"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 300 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-strong rounded-2xl overflow-hidden"
                    >
                      <AgentOrchestration3D
                        activeAgent={currentActiveAgent}
                        processingAgents={currentProcessingAgents}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AgentStatusPanel
                        activeAgent={currentActiveAgent}
                        completedAgents={currentCompletedAgents}
                        processingAgents={currentProcessingAgents}
                        language={language}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tabs for different panels */}
                <Tabs defaultValue="statutes" className="w-full">
                  <TabsList className="w-full grid grid-cols-6 glass">
                    <TabsTrigger value="statutes" className="text-xs">
                      <BookOpen className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="cases" className="text-xs">
                      <Gavel className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="text-xs">
                      <Scale className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="citations" className="text-xs">
                      <Link2 className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="text-xs">
                      <FileText className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="demo" className="text-xs">
                      <PlayCircle className="h-3 w-3" />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="statutes" className="mt-4">
                    <RetrievedStatutesPanel
                      statutes={currentStatutes?.map(s => ({
                        id: String(s.id),
                        section: s.sectionNumber,
                        act: s.actCode as 'IPC' | 'BNS' | 'CrPC' | 'BSA' | 'IT Act' | 'Constitution',
                        title: s.titleEn,
                        content: s.contentEn,
                        relevanceScore: 0.9
                      })) || []}
                      language={language}
                    />
                  </TabsContent>

                  <TabsContent value="cases" className="mt-4">
                    <CaseLawsPanel language={language} />
                  </TabsContent>

                  <TabsContent value="comparison" className="mt-4">
                    <EnhancedIPCBNSComparison language={language} />
                  </TabsContent>

                  <TabsContent value="citations" className="mt-4">
                    <CitationsPanel
                      citations={currentCitations?.map(c => ({
                        id: c.id,
                        title: c.title,
                        source: c.source as any,
                        url: c.url,
                        excerpt: c.excerpt,
                        year: c.year,
                        court: c.court
                      })) || []}
                      language={language}
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="mt-4">
                    <DocumentUpload language={language} />
                  </TabsContent>

                  <TabsContent value="demo" className="mt-4">
                    <DemoFlow language={language} />
                  </TabsContent>
                </Tabs>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
          <SheetContent side="right" className="w-[90vw] sm:w-[400px] p-0">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              <AgentStatusPanel
                activeAgent={currentActiveAgent}
                completedAgents={currentCompletedAgents}
                processingAgents={currentProcessingAgents}
                language={language}
              />
              <RetrievedStatutesPanel statutes={[]} language={language} />
              <IPCBNSComparison comparisons={[]} language={language} />
              <CitationsPanel citations={[]} language={language} />
              <DocumentUpload language={language} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile sidebar toggle */}
        {hasMessages && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-20 right-4 lg:hidden z-40 h-12 w-12 rounded-full glow-primary"
            onClick={() => setShowSidebar(true)}
          >
            <Brain className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Sample response generator (for demo mode)
function generateSampleResponse(query: string, lang: string): string {
  const isHindi = lang === 'hi';
  const queryLower = query.toLowerCase();

  if (queryLower.includes('murder') || queryLower.includes('302') || queryLower.includes('हत्या')) {
    return isHindi
      ? `**IPC धारा 302 - हत्या के लिए सजा**

भारतीय दंड संहिता की धारा 302 के तहत हत्या की सजा:

"जो कोई हत्या करेगा, उसे मृत्युदंड या आजीवन कारावास की सजा दी जाएगी, और वह जुर्माने का भी भागी होगा।"

**संबंधित BNS धारा 103:**
भारतीय न्याय संहिता, 2023 के तहत, समकक्ष प्रावधान धारा 103 है।

**मुख्य बिंदु:**
1. हत्या को IPC की धारा 300 (BNS धारा 101) के तहत परिभाषित किया गया है
2. सजा या तो मृत्युदंड या आजीवन कारावास हो सकती है
3. मुख्य सजा के अतिरिक्त जुर्माना भी लगाया जा सकता है

**ऐतिहासिक निर्णय:**
*बचन सिंह बनाम पंजाब राज्य* (1980) में सर्वोच्च न्यायालय ने "दुर्लभतम में दुर्लभ" सिद्धांत स्थापित किया।

⚖️ *यह जानकारी शैक्षिक उद्देश्यों के लिए है। विशिष्ट कानूनी सलाह के लिए कृपया किसी योग्य कानूनी पेशेवर से परामर्श करें।*`
      : `**IPC Section 302 - Punishment for Murder**

The punishment for murder under Section 302 of the Indian Penal Code provides:

"Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine."

**Corresponding BNS Section 103:**
Under the Bhartiya Nyaya Sanhita, 2023, the equivalent provision is Section 103, which maintains similar punishment provisions.

**Key Points:**
1. Murder is defined under Section 300 IPC (Section 101 BNS)
2. The punishment can be either death penalty or life imprisonment
3. Fine may also be imposed in addition to the main punishment
4. Courts have discretion in choosing between death and life imprisonment

**Landmark Case Law:**
The Supreme Court in *Bachan Singh v. State of Punjab* (1980) established the "rarest of rare" doctrine for imposing death penalty.

⚖️ *This information is for educational purposes. Please consult a qualified legal professional for specific legal advice.*`;
  }

  if (queryLower.includes('theft') || queryLower.includes('चोरी') || queryLower.includes('379')) {
    return isHindi
      ? `**IPC धारा 379 - चोरी के लिए सजा**

"जो कोई चोरी करेगा उसे तीन वर्ष तक के कारावास, या जुर्माना, या दोनों से दंडित किया जाएगा।"

**BNS समकक्ष: धारा 303**
भारतीय न्याय संहिता में चोरी का प्रावधान समान रखा गया है।

⚖️ *अस्वीकरण: यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है।*`
      : `**IPC Section 379 - Punishment for Theft**

"Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both."

**BNS Equivalent: Section 303**
The Bhartiya Nyaya Sanhita maintains similar provisions for theft.

**Key Elements of Theft (Section 378 IPC / Section 302 BNS):**
1. Dishonest intention to take property
2. Property must be movable
3. Taking must be without the consent of the owner
4. Moving of property out of possession

⚖️ *Disclaimer: This information is for educational purposes only.*`;
  }

  // Default response
  return isHindi
    ? `आपके कानूनी प्रश्न के लिए धन्यवाद: "${query}"

IPC, BNS और संबंधित केस कानून सहित भारतीय कानून डेटाबेस के विश्लेषण के आधार पर:

**कानूनी ढांचा:**
आपका प्रश्न भारतीय कानून के संबंधित वैधानिक प्रावधानों के अंतर्गत आता है।

**मुख्य विचार:**
1. लागू अधिनियम और धाराएं
2. प्रासंगिक सर्वोच्च न्यायालय और उच्च न्यायालय के मिसाल
3. भारतीय न्याय संहिता, 2023 के तहत हाल के संशोधन

⚖️ *अस्वीकरण: यह प्रतिक्रिया केवल सूचनात्मक उद्देश्यों के लिए है और कानूनी सलाह नहीं है।*`
    : `Thank you for your legal query regarding: "${query}"

Based on analysis of Indian law databases including IPC, BNS, and relevant case law:

**Legal Framework:**
Your query falls under the relevant statutory provisions of Indian law. The applicable laws and their interpretations depend on the specific facts and circumstances of your situation.

**Key Considerations:**
1. The applicable statute(s) and section(s)
2. Relevant Supreme Court and High Court precedents
3. Recent amendments under Bhartiya Nyaya Sanhita, 2023

**Recommendation:**
For a detailed legal opinion tailored to your specific situation, I recommend consulting with a qualified legal professional who can review all relevant documents and facts.

📚 *Sources: Indian Penal Code, Bhartiya Nyaya Sanhita, Supreme Court of India database*

⚖️ *Disclaimer: This response is for informational purposes only and does not constitute legal advice.*`;
}

export default Index;
