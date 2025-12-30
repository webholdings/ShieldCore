import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Trophy, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDateShort } from '@/lib/dateUtils'; // Added this import
import type { IQQuestion, IQTestSession, IQTestAnswer } from '@shared/schema';
import { iqQuestionTranslationsDe, iqQuestionTranslationsFr, iqQuestionTranslationsPt } from '@/lib/iqQuestionTranslations';

interface QuestionWithUserAnswer extends IQQuestion {
  userAnswer?: string;
  isCorrect?: boolean;
}

export default function IQTest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionWithUserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const { data: history = [] } = useQuery<IQTestSession[]>({
    queryKey: ['/api/iq-test/history'],
    enabled: !!user && !testStarted,
  });

  const { data: sessionAnswers = [] } = useQuery<IQTestAnswer[]>({
    queryKey: ['/api/iq-test/answers', sessionId],
    enabled: !!sessionId && testCompleted,
  });

  const { data: currentSession } = useQuery<IQTestSession>({
    queryKey: ['/api/iq-test/session', sessionId],
    enabled: !!sessionId && testCompleted,
  });

  // ... inside the component ...
  const startTestMutation = useMutation({
    mutationFn: async (): Promise<IQQuestion[]> => {
      const res = await apiRequest('GET', '/api/iq-test/questions?count=20');
      return await res.json();
    },
    onSuccess: (data: IQQuestion[]) => {
      // Apply translations if language is German
      // Apply translations based on language
      const translatedData = data.map(q => {
        let translation;
        if (language === 'de') {
          translation = iqQuestionTranslationsDe[q.id];
        } else if (language === 'fr') {
          translation = iqQuestionTranslationsFr[q.id];
        } else if (language === 'pt') {
          translation = iqQuestionTranslationsPt[q.id];
        }

        if (translation) {
          return {
            ...q,
            question: translation.question,
            options: JSON.stringify(translation.options)
          };
        }
        return q;
      });

      setQuestions(translatedData);
      setTestStarted(true);
      setCurrentQuestionIndex(0);
      setTestCompleted(false);
    }
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      return { questionId, answer };
    },
    onSuccess: ({ questionId, answer }) => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        userAnswer: answer
      };
      setQuestions(updatedQuestions);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        completeTest(updatedQuestions);
      }
    }
  });

  const completeTest = async (answeredQuestions: QuestionWithUserAnswer[]) => {
    try {
      const answers = answeredQuestions.map(q => ({
        questionId: q.id,
        userAnswer: q.userAnswer || ''
      }));

      const sessionRes = await apiRequest('POST', '/api/iq-test/submit', { answers });
      const session = await sessionRes.json() as IQTestSession;

      setSessionId(session.id);
      setTestCompleted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/iq-test/history'] });

      toast({
        title: t.iq_test.toast_complete_title,
        description: (t.iq_test?.toast_complete_desc || "Score: {score}. Correct: {correct}/{total}")
          .replace('{score}', session.score.toString())
          .replace('{correct}', session.correctAnswers.toString())
          .replace('{total}', session.totalQuestions.toString()),
      });
    } catch (error) {
      console.error('Error saving test results:', error);
      toast({
        title: t.iq_test.toast_error_title,
        description: t.iq_test.toast_error_desc,
        variant: 'destructive'
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answer: selectedAnswer
    });
  };

  const handleStartNewTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setSessionId('');
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-primary/10 ring-4 ring-primary/5 shadow-xl backdrop-blur-sm">
                <Brain className="h-20 w-20 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground drop-shadow-sm">{t.iq_test.title}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              {t.iq_test.subtitle}
            </p>
          </div>

          <div className="glass-card-lg p-8 md:p-12 space-y-8">
            <div className="text-left space-y-4">
              <h2 className="text-3xl font-heading font-semibold">{t.iq_test.about_test}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.iq_test.test_description}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 py-8">
              <div className="glass-card p-6 space-y-4 hover-elevate">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t.iq_test.pattern_recognition}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.iq_test.pattern_desc}</p>
                </div>
              </div>
              <div className="glass-card p-6 space-y-4 hover-elevate">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t.iq_test.logical_reasoning}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.iq_test.logical_desc}</p>
                </div>
              </div>
              <div className="glass-card p-6 space-y-4 hover-elevate">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t.iq_test.mathematical_skills}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.iq_test.math_desc}</p>
                </div>
              </div>
              <div className="glass-card p-6 space-y-4 hover-elevate">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t.iq_test.verbal_reasoning}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.iq_test.verbal_desc}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={() => startTestMutation.mutate()}
                disabled={startTestMutation.isPending}
                size="lg"
                className="h-16 px-12 text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-primary text-primary-foreground"
                data-testid="button-start-test"
              >
                <Brain className="h-6 w-6 mr-3" />
                {startTestMutation.isPending ? t.iq_test.loading_questions : t.iq_test.start_test}
              </Button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-semibold">{t.iq_test.test_history}</h3>
              </div>
              <div className="space-y-4">
                {history.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/20 shadow-sm"
                    data-testid={`history-${session.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">IQ Score: {session.score}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.correctAnswers}/{session.totalQuestions} {t.iq_test.correct}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {formatDateShort(session.completedAt!)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (testCompleted && currentSession) {
    const score = currentSession.correctAnswers;
    const total = currentSession.totalQuestions;
    const percentage = (score / total) * 100;
    const iqScore = currentSession.score;

    return (
      <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="glass-card-lg p-8 md:p-12 space-y-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-8 rounded-full bg-primary/10 ring-8 ring-primary/5 shadow-2xl animate-in zoom-in duration-500">
                  <Trophy className="h-24 w-24 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{t.iq_test.test_complete}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t.iq_test.test_complete_desc}
                </p>
              </div>
            </div>

            <div className="py-8">
              <div className="inline-block p-8 rounded-3xl bg-white/50 backdrop-blur-md shadow-xl border border-white/40">
                <p className="text-7xl md:text-8xl font-bold text-primary tracking-tight mb-2">{iqScore}</p>
                <p className="text-2xl font-medium text-muted-foreground">{t.iq_test.your_iq_score}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
              <div className="glass-card p-6 flex flex-col items-center justify-center space-y-2">
                <p className="text-4xl font-bold text-foreground">{score}/{total}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.iq_test.questions_correct}</p>
              </div>
              <div className="glass-card p-6 flex flex-col items-center justify-center space-y-2">
                <p className="text-4xl font-bold text-foreground">{percentage.toFixed(0)}%</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.iq_test.accuracy}</p>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-border/50">
              <h3 className="font-heading font-semibold text-2xl text-left">{t.iq_test.question_breakdown}</h3>
              <div className="grid gap-3 text-left">
                {sessionAnswers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div
                      key={answer.questionId}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        {answer.isCorrect ? (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <XCircle className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold block">{t.iq_test.question} {index + 1}</span>
                          {question && <Badge variant="secondary" className="mt-1 text-xs">{question.questionType}</Badge>}
                        </div>
                      </div>
                      <Badge variant={answer.isCorrect ? "default" : "destructive"} className="capitalize px-3 py-1">
                        {answer.isCorrect ? t.iq_test.correct : t.iq_test.incorrect}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8">
              <Button
                onClick={handleStartNewTest}
                size="lg"
                className="h-14 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                data-testid="button-new-test"
              >
                {t.iq_test.take_another_test}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    if (questions.length === 0 && testStarted) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
          <div className="glass-card p-8 max-w-md space-y-6">
            <div className="p-4 rounded-full bg-muted inline-block">
              <Brain className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-semibold">No Questions Available</h2>
            <p className="text-muted-foreground">We couldn't load any IQ test questions at the moment. Please try again later.</p>
            <Button onClick={handleStartNewTest} variant="outline" className="w-full">
              {t.common?.back || "Back"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  const options = typeof currentQuestion.options === 'string'
    ? JSON.parse(currentQuestion.options)
    : currentQuestion.options;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-base px-4 py-2 bg-white/50 backdrop-blur-sm border-primary/20">
            {t.iq_test.question} {currentQuestionIndex + 1} <span className="text-muted-foreground mx-1">/</span> {questions.length}
          </Badge>
          <Badge variant="secondary" className="text-base px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Brain className="h-4 w-4 mr-2" />
            {currentQuestion.questionType}
          </Badge>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-3 rounded-full bg-white/50" />
          <p className="text-sm font-medium text-muted-foreground text-right">
            {progress.toFixed(0)}% {t.iq_test.completed}
          </p>
        </div>

        <div className="glass-card-lg p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {options.map((option: string, index: number) => (
              <button
                key={index}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                  ${selectedAnswer === option
                    ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                    : 'border-transparent bg-white/50 hover:bg-white/80 hover:border-primary/30 hover:shadow-sm'
                  }`}
                onClick={() => handleAnswerSelect(option)}
                data-testid={`answer-option-${index}`}
              >
                <span className={`text-lg ${selectedAnswer === option ? 'font-medium text-primary' : 'text-foreground'}`}>
                  {option}
                </span>
                {selectedAnswer === option && (
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-in zoom-in duration-200">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || submitAnswerMutation.isPending}
              className="w-full h-16 text-xl rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
              data-testid="button-submit-answer"
            >
              {submitAnswerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.common.loading}</span>
                </div>
              ) : (
                currentQuestionIndex < questions.length - 1 ? t.iq_test.next_question : t.iq_test.finish_test
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
