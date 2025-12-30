import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { Apple, Moon, Activity, Heart, BookOpen, ArrowRight } from 'lucide-react';
import type { Course } from '@shared/schema';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: Record<string, any> = {
  apple: Apple,
  moon: Moon,
  activity: Activity,
  heart: Heart,
};

import { courseTranslations } from '@/lib/courseTranslations';

export default function Courses() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-6 px-2 md:px-4 md:py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-2 md:px-4 md:py-12">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">{t.courses.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.courses.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => {
            // ... inside the component ...
            const Icon = iconMap[course.icon as string] || BookOpen;

            // Category translation
            const category = course.category ? ((t.course_categories as any)[course.category] || course.category) : "";
            const title = course.title;
            const description = course.description;

            return (
              <Card
                key={course.id}
                className="glass-card border-0 hover-elevate cursor-pointer group bg-white/40 hover:bg-white/60 transition-all"
                onClick={() => setLocation(`/courses/${course.id}`)}
                data-testid={`card-course-${course.id}`}
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-3 rounded-lg bg-primary/10 flex-shrink-0`}>
                        <Icon className={`h-8 w-8 ${course.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors break-words">
                          {title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {category}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1 flex-shrink-0 sm:mt-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base break-words">
                    {description}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 flex-shrink-0" />
                    <span>10 {t.courses.lessons_count}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {courses.length === 0 && (
          <Card className="glass-card border-0 text-center p-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t.courses.no_courses_available}</h3>
            <p className="text-muted-foreground">{t.courses.check_back_soon}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
