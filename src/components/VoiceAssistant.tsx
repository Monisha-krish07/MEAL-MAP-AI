import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Bot, 
  Star, 
  Plus
} from 'lucide-react';
import { processIntent, UserPreferences } from '../utils/nlp';
import { FoodItem } from '../data/foodData';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  preferences: UserPreferences;
  onAddToCart: (item: FoodItem) => void;
  onClose: () => void;
}

interface Message {
  text: string;
  sender: 'ai' | 'user';
  items?: FoodItem[];
}

// ── Compact chat food card ──────────────────────────────────────────────────
const ChatFoodItem: React.FC<{ item: FoodItem; onAdd: (item: FoodItem) => void }> = ({ item, onAdd }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      className="chat-food-card"
      whileHover={{ y: -2, scale: 1.02 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        minWidth: 160,
        maxWidth: 170,
        borderRadius: 24,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: 'var(--shadow)'
      }}
    >
      <div style={{ height: 100, overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary-soft) 0%, rgba(255,200,150,0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '2.5rem', userSelect: 'none' }}>
         <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
         >
           {item.emoji}
         </motion.span>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`} style={{ width: 10, height: 10 }}>
            <div className="veg-dot" style={{ width: 4, height: 4 }} />
          </div>
          <div className="rating-badge" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
            <Star size={10} fill="currentColor" /> {item.rating}
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>{item.name}</p>
        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 8px' }}>₹{item.price}</p>
        <button
          className={`add-button ${added ? 'added' : ''}`}
          onClick={handleAdd}
          style={{ width: '100%', padding: '8px 0', fontSize: '0.7rem', borderRadius: 12 }}
        >
          {added ? 'ADDED' : <><Plus size={12} /> ADD</>}
        </button>
      </div>
    </motion.div>
  );
};

// ── Voice Waveform ──────────────────────────────────────────────────────────
const Waveform = () => (
  <div className="waveform-container">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <motion.div
        key={i}
        className="wave-bar"
        animate={{ 
          height: [10, 40, 20, 60, 10],
          opacity: [0.3, 1, 0.5, 1, 0.3]
        }}
        transition={{ 
          duration: 0.6, 
          repeat: Infinity, 
          delay: i * 0.08,
          ease: "easeInOut"
        }}
        style={{ width: 4, margin: '0 3px' }}
      />
    ))}
  </div>
);

// ── Main Voice Assistant ────────────────────────────────────────────────────
export const VoiceAssistant: React.FC<Props> = ({ preferences, onAddToCart, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'Ready' | 'Listening' | 'Speaking' | 'Blocked' | 'Error'>('Ready');
  const [interimText, setInterimText] = useState('');
  const [inputText, setInputText] = useState('');
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isListeningRef = useRef(false);
  const welcomedRef = useRef(false);
  const [showActiveBanner, setShowActiveBanner] = useState(false);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    
    // Some browsers block speech until a user interaction occurs
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis Error:', event);
      if (event.error === 'not-allowed') {
        setStatus('Blocked');
        setShowActiveBanner(true);
      }
    };

    utterance.onstart = () => setStatus('Speaking');
    utterance.onend = () => {
      setStatus('Ready');
      if (onEnd) onEnd();
    };
    
    synth.speak(utterance);
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    addMessage({ text, sender: 'user' });
    const result = processIntent(text, preferences);
    setTimeout(() => {
      addMessage({ text: result.message, sender: 'ai', items: result.items });
      speak(result.message);
    }, 500);
    setInputText('');
    setInterimText('');
  }, [addMessage, speak, preferences]);

  // Detect if running inside Capacitor (APK) or a browser
  const isCapacitor = () => !!(window as any).Capacitor?.isNativePlatform?.();

  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;

    // ── Native Capacitor (Android APK) ───────────────────────────────────
    if (isCapacitor()) {
      setStatus('Listening');
      try {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');

        // Request mic permission
        const { speechRecognition } = await SpeechRecognition.requestPermissions();
        if (speechRecognition !== 'granted') {
          setStatus('Error');
          addMessage({ text: 'Microphone permission is needed for voice input. Please allow it in Settings.', sender: 'ai' });
          return;
        }

        isListeningRef.current = true;
        setIsListening(true);
        setInterimText('');

        const result = await SpeechRecognition.start({
          language: 'en-IN',
          maxResults: 1,
          prompt: 'Speak your food order...',
          partialResults: false,
          popup: false,
        });

        isListeningRef.current = false;
        setIsListening(false);
        setStatus('Ready');

        const transcript = result?.matches?.[0];
        if (transcript) {
          handleSendMessage(transcript.trim());
        }
      } catch (err) {
        isListeningRef.current = false;
        setIsListening(false);
        setStatus('Error');
        setInterimText('');
        addMessage({ text: "Couldn't start voice input. Please try again or type your order.", sender: 'ai' });
      }
      return;
    }

    // ── Browser Web Speech API (desktop / Chrome) ─────────────────────────
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setStatus('Error');
      addMessage({ text: "Sorry, your browser doesn't support voice input. Try typing instead!", sender: 'ai' });
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setStatus('Listening');
      setInterimText('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (interim) setInterimText(interim);
      if (final) {
        setInterimText('');
        handleSendMessage(final.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      isListeningRef.current = false;
      setIsListening(false);
      setStatus('Error');
      setInterimText('');
      if (event.error === 'not-allowed') {
        addMessage({ text: "Microphone permission was denied. Please unlock it in your browser address bar.", sender: 'ai' });
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      if (status !== 'Error') setStatus('Ready');
      setInterimText('');
    };

    recognition.start();
  }, [addMessage, handleSendMessage]);

  const stopListening = useCallback(() => {
    if (isCapacitor()) {
      // Stop native recognition on Capacitor
      import('@capacitor-community/speech-recognition').then(({ SpeechRecognition }) => {
        SpeechRecognition.stop();
      });
    } else if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
    setInterimText('');
  }, []);

  useEffect(() => {
    if (!welcomedRef.current) {
      const greet = `Hello ${preferences.name}! I'm your Meal Map assistant. What can I get for you today?`;
      addMessage({ text: greet, sender: 'ai' });
      speak(greet);
      welcomedRef.current = true;
    }
  }, [preferences.name, speak, addMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  return (
    <motion.div 
      className="assistant-overlay"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <div className="assistant-modal shadow-lg">
        <header className="va-header border-bottom">
          <div className="va-user-info">
            <div className="va-bot-avatar">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="va-title">Meal Map AI</h2>
              <span className={`va-status ${status === 'Error' || status === 'Blocked' ? 'text-danger' : 'text-success'}`}>
                {status === 'Ready' ? 'Online' : status === 'Speaking' ? 'AI is speaking...' : status === 'Listening' ? 'Listening...' : status === 'Blocked' ? 'Microphone Blocked' : 'Ready'}
              </span>
            </div>
          </div>
          <button className="close-assistant-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="chat-area">
          {showActiveBanner && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }}
               style={{ background: 'var(--primary-soft)', padding: '12px 16px', borderRadius: 16, marginBottom: 12, border: '1px dashed var(--primary)'}}
            >
               <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)'}}>
                 👋 Tap here to activate the assistant's voice! 
               </p>
               <button 
                onClick={() => {
                   setShowActiveBanner(false);
                   speak("Voice activated! I'm ready to help.");
                }}
                style={{ marginTop: 8, padding: '6px 12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700}}
               >
                 ACTIVATE VOICE
               </button>
            </motion.div>
          )}
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <div key={i} className={`bubble ${msg.sender}`}>
                {msg.text}
                {msg.items && msg.items.length > 0 && (
                  <div className="chat-results-container no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 0', marginTop: 8 }}>
                    {msg.items.map(item => (
                      <ChatFoodItem key={item.id} item={item} onAdd={onAddToCart} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <footer className="va-footer border-top">
          {isListening && <Waveform />}
          {interimText && (
            <div style={{ padding: '0 4px 8px', fontSize: '0.8rem', color: 'var(--primary)', fontStyle: 'italic', opacity: 0.85 }}>
              🎤 {interimText}...
            </div>
          )}
          <div className="input-group-container">
            <input 
              type="text" 
              placeholder={isListening ? 'Listening... speak now 🎤' : 'Type your order...'}
              className="va-chat-input"
              value={isListening ? interimText : inputText}
              onChange={(e) => !isListening && setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isListening && handleSendMessage(inputText)}
              readOnly={isListening}
            />
            <div className="va-actions-group">
              <button 
                className={`btn-icon-circular ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                style={{ background: isListening ? '#e63946' : 'var(--primary)' }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                className="btn-icon-circular" 
                onClick={() => handleSendMessage(inputText)} 
                style={{ background: 'var(--text-main)', opacity: isListening ? 0.4 : 1 }}
                disabled={isListening}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};
