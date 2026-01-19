import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Upload, Sparkles, Scale } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentHindi?: string;
  citations?: Citation[];
  statutes?: Statute[];
  timestamp: Date;
}

interface Citation {
  id: string;
  source: string;
  url: string;
  title: string;
}

interface Statute {
  id: string;
  section: string;
  act: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  language: 'en' | 'hi';
}

export const ChatInterface = ({ messages, onSendMessage, isProcessing, language }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const placeholderText = language === 'en' 
    ? 'Ask about IPC, BNS, or any Indian law...'
    : 'IPC, BNS, या किसी भी भारतीय कानून के बारे में पूछें...';

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-6 py-4 relative group ${
                  message.role === 'user'
                    ? 'border-l-4 border-l-secondary bg-transparent pl-4 pr-0 text-right'
                    : 'legal-card text-left'
                }`}
              >
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${language === 'hi' ? 'text-hindi' : ''} ${message.role === 'user' ? 'text-foreground font-serif text-lg' : 'text-foreground/90'}`}>
                  {language === 'hi' && message.contentHindi ? message.contentHindi : message.content}
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-4 border-t border-border/40 pt-3 flex flex-wrap gap-2">
                    {message.citations.map((citation, idx) => (
                      <a
                        key={citation.id}
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip"
                      >
                        <Scale className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[200px]">{citation.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Analyzing legal query...' : 'कानूनी प्रश्न का विश्लेषण...'}
                </span>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6 bg-card/30">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className={`input-legal min-h-[50px] resize-none text-base pr-24 ${
              language === 'hi' ? 'text-hindi' : ''
            }`}
            disabled={isProcessing}
          />
          <div className="absolute right-0 bottom-2 flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
           <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
             <Upload className="h-3 w-3" /> {language === 'en' ? 'Upload Document' : 'दस्तावेज़ अपलोड करें'}
           </button>
           <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
             <Mic className="h-3 w-3" /> {language === 'en' ? 'Voice Input' : 'आवाज़ इनपुट'}
           </button>
        </div>
      </div>
    </div>
  );
};
