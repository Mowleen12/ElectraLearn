import { useState } from 'react';
import { BookOpen, MessageSquare, Award, BookA } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { ChatInterface } from './components/ChatInterface';
import { Quiz } from './components/Quiz';
import { Glossary } from './components/Glossary';
import './App.css';

const tabs = [
  { id: 'learn', label: 'Learn', icon: BookOpen, desc: 'Election Timeline' },
  { id: 'ask', label: 'Ask AI', icon: MessageSquare, desc: 'Gemma 4 Powered' },
  { id: 'quiz', label: 'Quiz', icon: Award, desc: 'Test Your Knowledge' },
  { id: 'glossary', label: 'Glossary', icon: BookA, desc: 'Key Terms' },
];

function App() {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <>
      <div className="indian-flag-bg" />
      <div className="ashoka-chakra-bg" />
      <div className="app-container max-w-4xl mx-auto p-4 md:p-8 relative z-10">
        <header className="app-header mb-8 animate-fade-in bg-white/70 p-8 rounded-2xl border border-white/60 shadow-xl text-center">
          <div className="max-w-3xl mx-auto">
            <h1
              className="app-title text-4xl md:text-6xl font-extrabold mb-4"
              style={{
                background: 'linear-gradient(135deg, #FF8C00 0%, #FF9933 35%, #138808 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',

                /* 🔥 THIS makes it sharp & visible */
                textShadow: '0 1px 2px rgba(0,0,0,0.02)',

                /* fallback for better rendering */
                color: '#FF8C00',

              }}
            >
              Electra Learn
            </h1>
            <p className="app-subtitle text-lg md:text-xl font-medium text-gray-800 leading-relaxed">Your interactive AI-powered guide to India's democratic election process. Explore timelines, test your knowledge, and ask questions.</p>
          </div>
        </header>

        <nav
          className="tabs-container mb-8 animate-fade-in"
          aria-label="Primary navigation"
          role="tablist"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                aria-selected={isActive}
                role="tab"
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
              >
                <Icon size={18} strokeWidth={2.2} />
                <span className="sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <main
          className="tab-content animate-fade-in"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'learn' && <Timeline />}
          {activeTab === 'ask' && <ChatInterface />}
          {activeTab === 'quiz' && <Quiz />}
          {activeTab === 'glossary' && <Glossary />}
        </main>
      </div>
    </>
  );
}


export default App;
