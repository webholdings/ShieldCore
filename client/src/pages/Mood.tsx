import { MoodTracker } from '@/components/MoodTracker';

export default function Mood() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 md:py-16">
      <div className="glass-card-lg max-w-5xl mx-auto p-6 md:p-12 rounded-3xl">
        <MoodTracker />
      </div>
    </div>
  );
}