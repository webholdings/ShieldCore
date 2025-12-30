import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Question = {
    id: number;
    text: string;
    weight: number; // Importance of the question (1-10)
    yesScore: number; // Score to add if Yes (0-100 normalized later)
};

const questions: Question[] = [
    { id: 1, text: "Do you use a unique password for every account?", weight: 10, yesScore: 100 },
    { id: 2, text: "Do you use a Password Manager (e.g., 1Password, Bitwarden)?", weight: 9, yesScore: 100 },
    { id: 3, text: "Is Two-Factor Authentication (2FA) enabled on your email?", weight: 10, yesScore: 100 },
    { id: 4, text: "Do you update your software/OS immediately when prompted?", weight: 7, yesScore: 100 },
    { id: 5, text: "Do you check sender email addresses before clicking links?", weight: 8, yesScore: 100 },
];

export default function SecurityCheckup() {
    const [, setLocation] = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<number, boolean>>({});

    const handleAnswer = (isYes: boolean) => {
        setResponses((prev) => ({ ...prev, [questions[currentStep].id]: isYes }));

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            finishQuiz({ ...responses, [questions[currentStep].id]: isYes });
        }
    };

    const finishQuiz = (finalResponses: Record<number, boolean>) => {
        // Calculate Score
        let totalWeight = 0;
        let weightedScore = 0;

        questions.forEach((q) => {
            totalWeight += q.weight;
            if (finalResponses[q.id]) {
                weightedScore += (q.yesScore * q.weight);
            }
        });

        const finalScore = Math.round(weightedScore / totalWeight);

        // Save to local storage (mock backend)
        localStorage.setItem("shieldcore_score", finalScore.toString());

        // Redirect to dashboard
        setLocation("/dashboard");
    };

    const progress = ((currentStep + 1) / questions.length) * 100;
    const currentQuestion = questions[currentStep];

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <Card className="w-full max-w-lg border-primary/20 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                            Question {currentStep + 1} of {questions.length}
                        </span>
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            SECURITY CHECKUP
                        </span>
                    </div>
                    <Progress value={progress} className="h-2 mb-4" />
                    <CardTitle className="text-2xl">{currentQuestion.text}</CardTitle>
                    <CardDescription>
                        Answer honestly to get an accurate security score.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-32 flex flex-col gap-2 hover:border-green-500 hover:bg-green-500/5 transition-all text-lg"
                            onClick={() => handleAnswer(true)}
                        >
                            <Check className="h-8 w-8 text-green-500" />
                            Yes
                        </Button>
                        <Button
                            variant="outline"
                            className="h-32 flex flex-col gap-2 hover:border-red-500 hover:bg-red-500/5 transition-all text-lg"
                            onClick={() => handleAnswer(false)}
                        >
                            <X className="h-8 w-8 text-red-500" />
                            No
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-muted-foreground">
                        Skip for now
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
