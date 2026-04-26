import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import './ChatInterface.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// ── Groq client (reads key from .env) ──────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

const ai = !!GROQ_API_KEY;

// System prompt — keeps the model focused on Indian elections
const SYSTEM_PROMPT = `You are ElectraLearn's AI assistant, an expert on India's democratic election process.
You help students, first-time voters, and curious citizens understand how Indian elections work.
Your knowledge covers: the Election Commission of India (ECI), Lok Sabha & Rajya Sabha, EVMs, VVPAT,
Model Code of Conduct, voter registration (EPIC/Form 6), Representation of the People Act 1951,
NOTA, indelible ink, Delimitation Commission, and all aspects of the Indian electoral system.
Be friendly, accurate, concise (2–4 sentences), and always relate answers to the Indian context.
If a question is unrelated to Indian elections or civics, politely redirect the conversation.`;

// ─────────────────────────────────────────────────────────────────────────────

const suggestedQuestions = [
  "How do I register to vote in India?",
  "What is an EVM and VVPAT?",
  "What is the Model Code of Conduct?",
  "How many Lok Sabha seats are there?",
  "Who is eligible to vote in India?",
  "What is NOTA?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "नमस्ते! I'm your ElectraLearn AI assistant, powered by Gemma 4. Ask me anything about India's election process — from voter registration to government formation!",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if the API key is configured
  const keyMissing = !ai;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!GROQ_API_KEY || GROQ_API_KEY === 'your_api_key_here') {
        // API key not set — show helpful message
        throw new Error('API_KEY_MISSING');
      }

      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== '1')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: text }
          ],
          temperature: 0.7,
          max_tokens: 1024
        }),
      });
      console.log("API KEY:", import.meta.env.VITE_GROQ_API_KEY);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const botText = data?.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response. Please try again.';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const isMissing = err instanceof Error && err.message === 'API_KEY_MISSING';
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: isMissing
          ? '⚠️ API key not set. Open the .env file in your project root and replace "your_api_key_here" with your Groq key from https://console.groq.com/keys, then restart the dev server.'
          : `❌ Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}. Please check your Groq API key and try again.`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card chat-container animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="chat-header-title">AI Election Assistant</p>
          <span className="chat-header-subtitle">
            <span className={`status-dot ${keyMissing ? 'status-dot--offline' : ''}`} />
            {keyMissing ? 'API key not configured' : 'Powered by Groq · Indian Elections'}
          </span>
        </div>
        {keyMissing
          ? <AlertTriangle size={16} style={{ marginLeft: 'auto', color: 'var(--orange-500)' }} />
          : <Zap size={16} style={{ marginLeft: 'auto', color: 'var(--green-500)' }} />
        }
      </div>

      {/* Key-missing banner */}
      {keyMissing && (
        <div className="api-key-banner">
          <strong>⚠️ Groq API key missing.</strong> Open <code>.env</code> in your project root and set{' '}
          <code>VITE_GROQ_API_KEY</code>, then restart the dev server. Get a free key at{' '}
          <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
            console.groq.com
          </a>
          .
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender === 'user' ? 'user' : ''}`}>
            <div className={`avatar ${msg.sender === 'user' ? 'avatar-user' : 'avatar-bot'}`}>
              {msg.sender === 'user' ? <User size={17} /> : <Bot size={17} />}
            </div>
            <div className={`message-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper">
            <div className="avatar avatar-bot">
              <Bot size={17} />
            </div>
            <div className="message-bubble bubble-bot">
              <div className="typing-dots">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="chat-suggestions">
        <div className="suggestions-marquee">
          <div className="suggestions-track">
            {[...suggestedQuestions, ...suggestedQuestions].map((q, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(q)}
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask Groq anything about Indian elections…"
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button
          className="send-btn"
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
