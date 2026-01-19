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
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'glass border border-border'
                }`}
              >
                <p className={`text-sm leading-relaxed ${language === 'hi' ? 'text-hindi' : ''}`}>
                  {language === 'hi' && message.contentHindi ? message.contentHindi : message.content}
                </p>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 border-t border-border/30 pt-3">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      {language === 'en' ? 'Citations' : 'उद्धरण'}
                    </p>
                    <div className="space-y-1">
                      {message.citations.map((citation, idx) => (
                        <a
                          key={citation.id}
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-primary hover:underline"
                        >
                          [{idx + 1}] {citation.title}
                        </a>
                      ))}
                    </div>
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
      <div className="border-t border-border p-4">
        <div className="glass-strong rounded-2xl p-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className={`min-h-[60px] resize-none border-0 bg-transparent focus-visible:ring-0 ${
              language === 'hi' ? 'text-hindi' : ''
            }`}
            disabled={isProcessing}
          />
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="h-10 rounded-xl px-6 glow-primary"
            >
              <Send className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Send' : 'भेजें'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
