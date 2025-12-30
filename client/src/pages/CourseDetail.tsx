import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLocation, useRoute } from 'wouter';
import { Apple, Moon, Activity, Heart, BookOpen, ChevronLeft, CheckCircle2, Circle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Course, Lesson, UserLessonProgress } from '@shared/schema';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { courseTranslations, lessonTranslations } from '@/lib/courseTranslations';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const iconMap: Record<string, any> = {
  apple: Apple,
  moon: Moon,
  activity: Activity,
  heart: Heart,
};

export default function CourseDetail() {
  const [, params] = useRoute('/courses/:id');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const courseId = params?.id || '';
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // ... inside the component ...
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
  });

  const { data: rawLessons = [], isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['/api/courses', courseId, 'lessons'],
    enabled: !!courseId,
  });

  const { data: progress = [] } = useQuery<UserLessonProgress[]>({
    queryKey: ['/api/courses', courseId, 'progress'],
    enabled: !!courseId,
  });

  // Lessons are already in the correct language from the database
  const lessons = rawLessons;

  const completeLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      return await apiRequest('POST', `/api/lessons/${lessonId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'progress'] });
      toast({
        title: 'Lesson completed!',
        description: 'Great job! Keep up the excellent work.',
      });
    },
  });

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-6">The course you are looking for does not exist or has been removed.</p>
          <Button onClick={() => setLocation('/courses')} variant="outline">
            {t.courses.back_to_courses}
          </Button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[course.icon as string] || BookOpen;
  const completedLessonIds = new Set(
    progress.filter(p => p.completed).map(p => p.lessonId)
  );
  const completedCount = completedLessonIds.size;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleComplete = () => {
    if (selectedLesson) {
      completeLessonMutation.mutate(selectedLesson.id);
    }
  };

  const currentLesson = selectedLesson || lessons[0];
  const isCurrentLessonComplete = currentLesson && completedLessonIds.has(currentLesson.id);

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/courses')}
            className="mb-6 -ml-2 hover:bg-primary/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t.courses.back_to_courses}
          </Button>

          <div className="glass-card-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
                  {React.createElement(iconMap[course?.icon || 'book'] || BookOpen, {
                    className: "h-10 w-10 text-primary",
                  })}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-primary/20">
                    {(course.category && (t.course_categories as any)[course.category]) || course.category}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 text-foreground break-words">
                  {course.title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6 break-words">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-8 p-4 rounded-xl bg-white/40 border border-white/20">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">{t.courses.progress}</span>
                <span className="text-primary">{completedCount} / {totalLessons}</span>
              </div>
              <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden ring-1 ring-black/5">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson List Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 custom-scrollbar">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-1">
                  {t.courses.all_lessons}
                </h3>
                {lessons.map((lesson, index) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  const isSelected = currentLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group
                            ${isSelected
                          ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm'
                          : 'hover:bg-white/40 text-muted-foreground hover:text-foreground'
                        }`}
                      onClick={() => handleLessonClick(lesson)}
                      data-testid={`button-lesson-${lesson.id}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-green-500'}`} />
                        ) : (
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-medium
                                ${isSelected ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground/50'}`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium leading-snug break-words ${isSelected ? 'font-semibold' : ''}`}>
                          {lesson.title}
                        </div>
                        <div className="text-xs opacity-70 mt-0.5">
                          {Math.ceil(lesson.content.length / 500)} {t.courses.min_read}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div className="glass-card-lg p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-primary/20 px-3 py-1">
                      {t.courses.lesson} {lessons.findIndex(l => l.id === currentLesson.id) + 1}
                    </Badge>
                    {isCurrentLessonComplete && (
                      <Badge variant="default" className="gap-1.5 bg-green-500 hover:bg-green-600 border-green-600 text-white px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t.courses.completed}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight text-foreground break-words">
                    {currentLesson.title}
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-li:text-muted-foreground prose-ul:my-4 prose-ol:my-4 break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-4" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 my-4" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                      a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                    }}
                  >
                    {currentLesson.content}
                  </ReactMarkdown>
                </div>

                {currentLesson.videoUrl && (
                  <div className="mt-8 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
                    <YouTubeEmbed url={currentLesson.videoUrl} />
                  </div>
                )}

                <Separator className="my-10 bg-border/50" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <div className="text-sm text-muted-foreground max-w-md">
                    {isCurrentLessonComplete
                      ? t.courses.lesson_completed
                      : t.courses.mark_complete_hint}
                  </div>
                  <Button
                    size="lg"
                    onClick={handleComplete}
                    disabled={isCurrentLessonComplete || completeLessonMutation.isPending}
                    data-testid="button-mark-complete"
                    className={`sm:flex-shrink-0 w-full sm:w-auto h-14 px-8 text-lg rounded-xl shadow-md transition-all duration-300
                      ${isCurrentLessonComplete
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-lg'}`}
                  >
                    {isCurrentLessonComplete ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        {t.courses.completed}
                      </>
                    ) : (
                      t.courses.mark_as_complete
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center text-muted-foreground">
                <BookOpen className="h-20 w-20 mb-6 opacity-20" />
                <h3 className="text-xl font-semibold mb-2">{t.courses.select_lesson}</h3>
                <p>{t.courses.choose_lesson}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
