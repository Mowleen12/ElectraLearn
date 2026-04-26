import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy, Flame, AlertTriangle, Sparkles } from 'lucide-react';
import './Quiz.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

const SYSTEM_PROMPT = `You are an expert on the Indian democratic election process.
Generate exactly 5 random, unique, and educational multiple-choice questions about Indian elections, the Election Commission of India, voting rights, EVMs, VVPATs, the Model Code of Conduct, Lok Sabha, etc.
Vary the difficulty.
Respond ONLY with a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json.
Each object MUST have this exact structure:
[
  {
    "id": 1,
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "A 1-2 sentence detailed explanation."
  }
]`;

const LETTERS = ['A', 'B', 'C', 'D'];

export function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    if (!GROQ_API_KEY) {
      setError('API key not set. Please configure VITE_GEMMA4_API_KEY in your .env file.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
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
            {
              role: 'user',
              content: 'Generate 5 new random quiz questions about Indian elections. Return ONLY a valid JSON array.'
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }
      console.log("API KEY:", import.meta.env.VITE_GROQ_API_KEY);

      const data = await response.json();
      let text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from Groq API');

      // Remove markdown fences and any surrounding text, then extract the first JSON array
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

      // Handle cases where there might be extra text before or after JSON
      if (!cleanText.startsWith('[')) {
        // Look for JSON array pattern
        const match = cleanText.match(/\[[\s\S]*\]/);
        if (match) {
          cleanText = match[0];
        }
      }

      // If still not starting with [, try to find any JSON object/array
      if (!cleanText.startsWith('[') && !cleanText.startsWith('{')) {
        const arrayMatch = cleanText.match(/\[[\s\S]*\]/);
        const objectMatch = cleanText.match(/\{[\s\S]*\}/);
        if (arrayMatch) {
          cleanText = arrayMatch[0];
        } else if (objectMatch) {
          cleanText = objectMatch[0];
        }
      }

      const parsedQuestions = JSON.parse(cleanText) as Question[];
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('Invalid format returned by Groq API');
      }

      setQuestions(parsedQuestions);
      setCurrentQ(0);
      setScore(0);
      setSelectedOption(null);
      setShowResult(false);
    } catch (err: any) {
      console.error('Failed to fetch questions:', err);
      setError(`Error: ${err.message || 'Unknown error'}. Please check your connection and API key.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const isCompleted = questions.length > 0 && currentQ >= questions.length;
  const question = !isCompleted && questions.length > 0 ? questions[currentQ] : null;

  if (isLoading) {
    return (
      <div className="card p-8 animate-fade-in quiz-wrapper flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <Sparkles size={48} className="text-orange-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Quiz...</h2>
          <p className="text-gray-500">Google's Gemma model is crafting unique questions about Indian elections!</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="card p-8 animate-fade-in quiz-wrapper flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-600 text-center max-w-md mb-6">{error || "Could not load questions."}</p>
        <button className="btn btn-primary" onClick={fetchQuestions} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 2px 8px rgba(249,115,22,0.45)' }}>
          <RefreshCw size={17} /> Try Again
        </button>
      </div>
    );
  }


  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === questions[currentQ].correctAnswer) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentQ(q => q + 1);
  };

  const handleRestart = () => {
    fetchQuestions();
  };

  if (isCompleted) {
    const perfect = score === questions.length;
    return (
      <div className="card p-8 animate-fade-in quiz-wrapper">
        <div className="score-screen">
          <div className="score-circle">
            <span className="score-text">{score}/{questions.length}</span>
          </div>
          <h2 className="score-title">{perfect ? '🏆 Perfect Score!' : '🎉 Quiz Complete!'}</h2>
          <p className="score-subtitle">
            {perfect
              ? "Waah! You're a true Chunav (Election) expert! Jai Hind! 🇮🇳"
              : `You scored ${score} out of ${questions.length}. Keep learning about India's democracy!`}
          </p>
          <button className="btn btn-primary mx-auto" onClick={handleRestart} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 2px 8px rgba(249,115,22,0.45)' }}>
            <RefreshCw size={17} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8 animate-fade-in quiz-wrapper">
      {/* Header */}
      <div className="quiz-progress-header">
        <span className="quiz-question-label">
          <Flame size={13} style={{ display: 'inline', marginRight: 4 }} />
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="quiz-score-badge">⭐ {score} pts</span>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-track">
        <div className="quiz-progress-fill" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>

      <p className="quiz-question-text">{question!.question}</p>

      <div className="flex flex-col gap-2">
        {question!.options.map((opt, idx) => {
          let cls = 'quiz-option';
          let Icon: typeof CheckCircle2 | null = null;

          if (showResult) {
            if (idx === question!.correctAnswer) { cls += ' correct'; Icon = CheckCircle2; }
            else if (idx === selectedOption) { cls += ' incorrect'; Icon = XCircle; }
            else { cls += ' disabled'; }
          }

          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={showResult}>
              <span className="option-letter">{LETTERS[idx]}</span>
              <span>{opt}</span>
              {Icon && <Icon size={20} className="ml-auto" />}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="explanation-box animate-fade-in">
          <p className="explanation-label">💡 Explanation</p>
          <p className="explanation-text">{question!.explanation}</p>
        </div>
      )}

      {showResult && (
        <div className="flex justify-end mt-4 animate-fade-in">
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 2px 8px rgba(249,115,22,0.45)' }}
          >
            {currentQ === questions.length - 1 ? <><Trophy size={17} /> See Results</> : <>Next Question </>}
          </button>
        </div>
      )}
    </div>
  );

}
