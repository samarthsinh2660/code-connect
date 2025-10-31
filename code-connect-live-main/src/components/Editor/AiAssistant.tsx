"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ChevronRight, Copy, Check, Loader2, SendIcon, BotOffIcon, BotIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

const messageAnimations = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative my-2 rounded-lg overflow-hidden bg-gray-900 border border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-xs text-gray-400">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyCode}
          className="h-8 px-2 hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    </div>
  );
};

interface MessagePart {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

const formatMessage = (content: string): MessagePart[] => {
  const parts: MessagePart[] = [];
  let currentText = '';
  let inCodeBlock = false;
  let currentCode = '';
  let language = '';

  // Handle null or undefined content
  if (!content) {
    return [{ type: 'text', content: '' }];
  }

  // Fix malformed markdown bullet points and asterisks
  let fixedContent = content;

  // Fix incomplete or malformed markdown patterns
  // Handle asterisks that might be used for bold/italic but aren't properly paired
  const asteriskRegex = /\*\*(?!\s*\*\*)(.*?)(?<!\s*\*\*)\*\*/g;
  fixedContent = fixedContent.replace(asteriskRegex, '<strong>$1</strong>');

  // Handle single asterisks for italic
  const italicRegex = /\*(?!\s*\*)(.*?)(?<!\s*\*)\*/g;
  fixedContent = fixedContent.replace(italicRegex, '<em>$1</em>');

  // Fix bullet points that might be malformed
  fixedContent = fixedContent.replace(/^\s*\*\s+/gm, '• ');

  const lines = fixedContent.split('\n');

  for (const line of lines) {
    // Check for code block markers
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        parts.push({ type: 'code', content: currentCode.trim(), language });
        currentCode = '';
        language = '';
        inCodeBlock = false;
      } else {
        // Start of code block
        if (currentText) {
          parts.push({ type: 'text', content: currentText.trim() });
          currentText = '';
        }
        language = line.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCode += line + '\n';
    } else {
      currentText += line + '\n';
    }
  }

  // Handle unclosed code blocks
  if (inCodeBlock && currentCode) {
    parts.push({ type: 'code', content: currentCode.trim(), language });
  }

  // Add remaining text
  if (currentText) {
    parts.push({ type: 'text', content: currentText.trim() });
  }

  return parts;
};

export const MessageContent = ({ content }: { content: string }) => {
  const parts = formatMessage(content);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <CodeBlock
                code={part.content}
                language={part.language ?? 'text'}
              />
            </motion.div>
          );
        }

        // Process regular text with improved styling and animations
        const paragraphs = part.content.split('\n\n');

        return (
          <React.Fragment key={index}>
            {paragraphs.map((paragraph, pIndex) => (
              <motion.p
                key={`${index}-${pIndex}`}
                className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: (index * 0.1) + (pIndex * 0.05),
                  ease: "easeOut"
                }}
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    // Replace asterisk bullet points with proper bullet points
                    .replace(/^\s*\*\s+/gm, '• ')
                    // Ensure any remaining HTML tags are properly escaped
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    // Then un-escape our specifically added HTML tags
                    .replace(/&lt;strong&gt;/g, '<strong>')
                    .replace(/&lt;\/strong&gt;/g, '</strong>')
                    .replace(/&lt;em&gt;/g, '<em>')
                    .replace(/&lt;\/em&gt;/g, '</em>')
                }}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MessageContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{}>>(
  ({ children }, ref) => (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6" ref={ref}>
        {children}
      </div>
    </ScrollArea>
  )
);

MessageContainer.displayName = 'MessageContainer';

const EmptyState = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center  h-full py-48 px-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500 flex items-center justify-center relative overflow-hidden shadow-xl"
        animate={{
          scale: [1, 1.05, 0.98, 1.05, 1],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
      />
      <h3 className="text-xl  text-white mt-2 tracking-wide drop-shadow-sm transition-all duration-300 hover:scale-105">Ask anything</h3>
      <div className="text-gray-400 text-sm max-w-xs mt-2 space-y-2">
        <p>I can help with coding questions, explain concepts, assist in bugs and errors.</p>
        <div className="bg-gray-800/50 rounded-lg p-3 mt-3">
          <p className="text-blue-400 font-medium text-xs mb-1">💡 Pro tip: Use @mycode</p>
          <p className="text-xs text-gray-300">Type "@" to reference your current code in questions!</p>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* <SuggestionChip text="How to use React hooks?" />
        <SuggestionChip text="Explain async/await" />
        <SuggestionChip text="Best coding practices" />
        <SuggestionChip text="CSS Grid vs Flexbox" /> */}
      </motion.div>
    </motion.div>
  );
};

interface AiAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  code?: string; // Add code context prop
  language?: string; // Add language context prop
}

const AiAssistant = ({ isOpen, onToggle, code, language }: AiAssistantProps) => {
  interface Message {
    type: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // @mycode feature state
  const [showMyCodeDropdown, setShowMyCodeDropdown] = useState(false);
  const [atMentionPosition, setAtMentionPosition] = useState<number | null>(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const askAI = async (question: any) => {
    try {
      setIsLoading(true);

      // Use backend API endpoint instead of direct Gemini calls
      const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: question.toLowerCase().includes('@mycode') && code ? { code, language } : undefined,
          history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data?.message) {
        return result.data.message;
      }

      throw new Error('Invalid response format from AI service');
    } catch (error) {
      console.error('AI request error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Replace your handleSubmit function in the AiAssistant component with this version:

  const scrollToBottom = () => {
    try {
      // Try finding the ScrollArea viewport directly
      const scrollAreaViewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollAreaViewport) {
        scrollAreaViewport.scrollTop = scrollAreaViewport.scrollHeight;
        return;
      }

      // Fallback: try using the ref directly
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error scrolling to bottom:", error);
    }
  };

  useEffect(() => {
    // Delay to ensure rendering is complete
    setTimeout(scrollToBottom, 100);
  }, [messages, isLoading]);

  const handleSubmit = useCallback(async (e: any) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput(''); // Move this to the top to clear input immediately

    const userMessage: Message = {
      type: 'user' as const,
      content: currentInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      setIsLoading(true);
      const aiResponse = await askAI(currentInput);

      const aiMessage: Message = {
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in AI response:', error);

      const errorMessage: Message = {
        type: 'assistant',
        content: "I apologize, but I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    setTimeout(scrollToBottom, 100);
  }, [input, isLoading]);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleInputSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    // This will be called by PlaceholdersAndVanishInput
    // We need to prevent it from causing render issues
    e.preventDefault();
    e.stopPropagation();

    // Use setTimeout to defer the actual submission to next tick
    setTimeout(() => {
      handleSubmit(e);
    }, 0);
  }, [handleSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Detect @ mentions for @mycode feature
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === value.length - 1) {
      // @ is at the end, show dropdown
      setShowMyCodeDropdown(true);
      setAtMentionPosition(atIndex);
    } else {
      // Hide dropdown if @ is not at the end
      setShowMyCodeDropdown(false);
      setAtMentionPosition(null);
    }
  }, []);

  const handleMyCodeSelect = useCallback(() => {
    if (atMentionPosition !== null) {
      const beforeAt = input.substring(0, atMentionPosition);
      const newInput = beforeAt + '@mycode ';
      setInput(newInput);
      setShowMyCodeDropdown(false);
      setAtMentionPosition(null);
    }
  }, [input, atMentionPosition]);



  // Add this SuggestionChip component right after the EmptyState component

const SuggestionChip = ({ text }: { text: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-gray-700/50 backdrop-blur-sm rounded-full px-3 py-2 text-xs text-gray-300 cursor-pointer border border-gray-700"
      whileHover={{
        scale: 1.03,
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderColor: "rgba(59, 130, 246, 0.3)"
      }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.span
        animate={{ color: isHovered ? "rgb(147, 197, 253)" : "rgb(209, 213, 219)" }}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};


  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Add this effect to detect manual scrolling
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (scrollRef.current) {
  //       const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') || scrollRef.current;
  //       const isScrolledToBottom =
  //         Math.abs(scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop) < 50;

  //       setUserHasScrolled(!isScrolledToBottom);
  //     }
  //   };

  //   const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') || scrollRef.current;
  //   if (scrollElement) {
  //     scrollElement.addEventListener('scroll', handleScroll);
  //     return () => scrollElement.removeEventListener('scroll', handleScroll);
  //   }
  // }, []);

  // // Modify your scroll effect to respect user scrolling
  // useEffect(() => {
  //   if (scrollRef.current && (!userHasScrolled || messages[messages.length - 1]?.type === 'user')) {
  //     // Only auto-scroll if user hasn't scrolled up OR if the latest message is from the user
  //     setTimeout(() => {
  //       const scrollContainer = scrollRef.current;
  //       if (scrollContainer) {
  //         const scrollElement = scrollContainer.querySelector('[data-radix-scroll-area-viewport]') || scrollContainer;
  //         scrollElement.scrollTop = scrollElement.scrollHeight;
  //       }
  //     }, 100);
  //   }
  // }, [messages, isLoading, userHasScrolled]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full border-l border-gray-700 bg-gray-800/95 backdrop-blur-sm flex flex-col fixed right-0 top-0 bottom-0 w-80 z-50"
        >
          <motion.div
            className="p-4 border-b border-gray-700 flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1]
                }}
              >
                <Bot className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="font-semibold text-white">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hover:bg-gray-700"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </motion.div>

          <MessageContainer>
            <AnimatePresence>
              {messages.length > 0 ? (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      variants={messageAnimations}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div
                        className={`max-w-[90%] rounded-2xl p-4 ${message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700/70 backdrop-blur-sm text-gray-100'
                          }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <MessageContent content={message.content} />
                        <motion.span
                          className="text-xs opacity-50 mt-2 block"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          transition={{ delay: 0.5 }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  ))}
                  {/* Add this div for scrolling to the bottom */}
                  <div ref={endOfMessagesRef} />
                </>
              ) : (
                <EmptyState />
              )}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start mt-4"
              >
                <div className="bg-gray-700/70 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-300">AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </MessageContainer>

          <motion.div
            className="p-4 border-t border-gray-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* @mycode dropdown */}
            <AnimatePresence>
              {showMyCodeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-2 p-2 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <motion.div
                    className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer"
                    onClick={handleMyCodeSelect}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">@</span>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">my code</div>
                      <div className="text-xs text-gray-400">Reference your current code</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleInputChange}
              onSubmit={handleInputSubmit}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiAssistant;

