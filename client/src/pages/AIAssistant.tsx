import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Strip markdown-like formatting for cleaner display
const cleanMarkdown = (text: string): string => {
    return text
        .replace(/###\s+/g, '') // Remove ### headings
        .replace(/##\s+/g, '')  // Remove ## headings
        .replace(/#\s+/g, '')   // Remove # headings
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.+?)\*/g, '$1')     // Remove italic *text*
        .replace(/_(.+?)_/g, '$1')       // Remove italic _text_
        .replace(/`(.+?)`/g, '$1')       // Remove inline `code`
        .trim();
};

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIAssistant() {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const isInitialMount = useRef(true);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Initialize welcome message when language changes or on mount
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { role: 'assistant', content: t.ai_assistant.welcome_message }
            ]);
        }
    }, [t.ai_assistant.welcome_message]);

    const chatMutation = useMutation({
        mutationFn: async (message: string) => {
            const res = await apiRequest('POST', '/api/chat', { message, language });
            return res.json();
        },
        onSuccess: (data) => {
            // Clean markdown formatting from response
            const cleanedResponse = cleanMarkdown(data.response);
            setMessages(prev => [...prev, { role: 'assistant', content: cleanedResponse }]);
        },
        onError: (error: Error) => {
            toast({
                title: t.ai_assistant.error_title,
                description: error.message,
                variant: "destructive"
            });
        }
    });

    // Only scroll to bottom after user sends a message (not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            // Skip first render and welcome message
            if (messages.length <= 1) {
                isInitialMount.current = false;
                return;
            }
        }

        // Scroll when new messages are added after user interaction
        if (scrollRef.current && messages.length > 1) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, chatMutation.isPending]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        chatMutation.mutate(userMessage);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl min-h-[calc(100vh-4rem)] pb-20 md:pb-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Bot className="w-8 h-8 text-primary" />
                    {t.ai_assistant.title}
                </h1>
                <p className="text-muted-foreground">
                    {t.ai_assistant.subtitle}
                </p>
            </div>

            <Card className="border-2">
                {/* Messages area - natural height based on content */}
                <div className="p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {msg.content}
                                </p>
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-primary-foreground" />
                                </div>
                            )}
                        </div>
                    ))}

                    {chatMutation.isPending && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-muted rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>

                {/* Input area - directly below messages */}
                <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.ai_assistant.placeholder}
                            disabled={chatMutation.isPending}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={chatMutation.isPending || !input.trim()}
                            size="icon"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        {t.ai_assistant.limit_message}
                    </p>
                </div>
            </Card>
        </div>
    );
}
