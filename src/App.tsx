/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  Trophy, 
  RefreshCcw, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { Level, Question, QuizResult } from './types';
import { INITIAL_QUESTIONS } from './data';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [level, setLevel] = useState<Level>('Beginner');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = useCallback((selectedLevel: Level) => {
    const initialQuestions = INITIAL_QUESTIONS[selectedLevel] || [];
    setQuestions(initialQuestions);
    setAnswers([]);
    setCurrentIndex(0);
    setStartTime(Date.now());
    setScreen('quiz');
    setShowExplanation(false);
  }, []);

  const generateAIQuestions = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate 10 high-quality English language test questions for ${level} level. 
      Mix categories: Grammar, Vocabulary, and Reading. 
      Ensure questions are natural and useful for learning.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['Grammar', 'Vocabulary', 'Reading'] }
              },
              required: ['id', 'text', 'options', 'correctAnswer', 'explanation', 'category']
            }
          }
        }
      });

      const newQuestions = JSON.parse(response.text || '[]') as Question[];
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
        setAnswers([]);
        setCurrentIndex(0);
        setStartTime(Date.now());
        setScreen('quiz');
        setShowExplanation(false);
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    
    setAnswers(prev => [...prev, { 
      questionId: currentQuestion.id, 
      selectedIndex, 
      isCorrect 
    }]);

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setScreen('result');
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (answers.length > currentIndex ? 1 : 0)) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-bottom border-slate-200 py-4 px-6 fixed top-0 w-full z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('intro')}>
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={24} />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              EnglishMastery
            </h1>
          </div>
          
          {screen === 'quiz' && (
            <div className="flex-1 max-w-xs mx-8">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary-600"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Progress</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              {level}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-6">
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="mb-12">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-block p-4 bg-primary-50 rounded-3xl mb-6"
                >
                  <BrainCircuit size={64} className="text-primary-600" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tighter">
                  Shaping Your English Future
                </h2>
                <p className="text-primary-600 font-bold mb-2 uppercase tracking-widest text-xs">
                  Ingliz tili bilimingizni sinab ko'ring
                </p>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Test your language skills with our interactive exercises or generate a custom AI quiz based on your level.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {(['Beginner', 'Intermediate', 'Advanced'] as Level[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLevel(l); startQuiz(l); }}
                    className={`glass-card p-8 text-left group transition-all hover:border-primary-400 hover:shadow-md ${level === l ? 'border-primary-500 ring-2 ring-primary-100' : ''}`}
                  >
                    <BookOpen size={24} className="text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-display font-bold mb-2">{l}</h3>
                    <p className="text-slate-500 text-sm">
                      {l === 'Beginner' ? 'Basic grammar and common daily vocabulary.' : 
                       l === 'Intermediate' ? 'Complex structures and nuanced expressions.' : 
                       'Academic writing and advanced idioms.'}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => startQuiz(level)}
                  className="test-button bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2"
                >
                  Start Standard Test <ChevronRight size={18} />
                </button>
                <button 
                  onClick={generateAIQuestions}
                  disabled={isGenerating}
                  className="test-button bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> AI Custom Quiz
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'quiz' && currentQuestion && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-[10px] font-black uppercase tracking-widest">
                    {currentQuestion.category}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 leading-tight">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentIndex]?.selectedIndex === idx;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const hasAnswered = answers.length > currentIndex;

                  let variant = 'default';
                  if (hasAnswered) {
                    if (isCorrect) variant = 'correct';
                    else if (isSelected) variant = 'wrong';
                    else variant = 'dimmed';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-center justify-between group
                        ${variant === 'default' ? 'bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50' : ''}
                        ${variant === 'correct' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : ''}
                        ${variant === 'wrong' ? 'bg-rose-50 border-rose-500 text-rose-900' : ''}
                        ${variant === 'dimmed' ? 'bg-white border-slate-100 opacity-60' : ''}
                      `}
                    >
                      <span className="font-medium text-lg">{option}</span>
                      {variant === 'correct' && <CheckCircle2 className="text-emerald-500" />}
                      {variant === 'wrong' && <XCircle className="text-rose-500" />}
                      {variant === 'default' && <div className="w-6 h-6 border-2 border-slate-200 rounded-full group-hover:border-primary-400 transition-colors" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-8 p-6 bg-slate-100 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Sparkles size={20} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 mb-1">Explanation</p>
                        <p className="text-slate-600 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers.length > currentIndex && (
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="test-button bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 shadow-lg"
                  >
                    {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-card p-12 text-center overflow-hidden relative">
                {/* Decorative background circle */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-1">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                    <Trophy size={40} />
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold mb-2">Well Done!</h2>
                  <p className="text-slate-500 mb-8">You have completed the {level} level quiz.</p>
                  
                  <div className="flex justify-center gap-12 mb-12">
                    <div className="text-center">
                      <p className="text-4xl font-display font-bold text-slate-900">
                        {Math.round((answers.filter(a => a.isCorrect).length / questions.length) * 100)}%
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-display font-bold text-slate-900">
                        {answers.filter(a => a.isCorrect).length} / {questions.length}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Correct Answers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-display font-bold text-slate-900">
                        {Math.floor((Date.now() - startTime) / 1000 / 60)}m {Math.floor(((Date.now() - startTime) / 1000) % 60)}s
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Time Spent</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setScreen('intro')}
                      className="test-button bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={18} /> Try Another Level
                    </button>
                    <button 
                      onClick={() => startQuiz(level)}
                      className="test-button bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                    >
                      Practice Again
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="font-display font-bold text-xl px-2">Review Answers</h3>
                {questions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  return (
                    <div key={q.id} className={`glass-card p-6 flex items-start gap-4 ${userAnswer?.isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
                      <div className={`mt-1 p-1.5 rounded-full ${userAnswer?.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {userAnswer?.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold mb-2 leading-snug">{q.text}</p>
                        <p className="text-sm text-slate-500">
                          Your answer: <span className={userAnswer?.isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>{q.options[userAnswer?.selectedIndex || 0]}</span>
                        </p>
                        {!userAnswer?.isCorrect && (
                          <p className="text-sm text-emerald-700 font-medium mt-1">
                            Correct answer: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm font-medium">© 2026 EnglishMastery Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-primary-600 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-primary-600 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-primary-600 text-sm transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
