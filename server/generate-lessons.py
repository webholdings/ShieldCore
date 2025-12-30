#!/usr/bin/env python3
"""
Generate course lesson content for CreativeWaves
Creates 5 lessons per course with rich content and YouTube links
"""

import json
import os
from pathlib import Path

# Course lesson outlines
LESSONS = {
    "cognitive_fitness": [
        {
            "title": "Introduction to Neuroplasticity",
            "youtube": "https://www.youtube.com/watch?v=TkgEYw7vMdU",
            "youtube_title": "How Neuroplasticity Works - Dr. Andrew Huberman",
            "duration": "10:23"
        },
        {
            "title": "Memory Enhancement Techniques",
            "youtube": "https://www.youtube.com/watch?v=szqPAPKE5tQ",
            "youtube_title": "How to Triple Your Memory - Jim Kwik",
            "duration": "15:42"
        },
        {
            "title": "Focus and Attention Mastery",
            "youtube": "https://www.youtube.com/watch?v=7oKjW1OIjuw",
            "youtube_title": "The Science of Attention - Dr. Amishi Jha",
            "duration": "14:20"
        },
        {
            "title": "Brain Nutrition and Supplements",
            "youtube": "https://www.youtube.com/watch?v=E7W4OQfJWdw",
            "youtube_title": "Foods for Brain Health -Dr. Rhonda Patrick",
            "duration": "18:35"
        },
        {
            "title": "Sleep Optimization for Cognitive Performance",
            "youtube": "https://www.youtube.com/watch?v=nm1TxQj9IsQ",
            "youtube_title": "Master Your Sleep - Dr. Matthew Walker",
            "duration": "22:15"
        }
    ],
    "mindfulness_meditation": [
        {
            "title": "Understanding Mindfulness",
            "youtube": "https://www.youtube.com/watch?v=6p_yaNFSYao",
            "youtube_title": "What is Mindfulness? - Jon Kabat-Zinn",
            "duration": "9:45"
        },
        {
            "title": "Breath Awareness Practice",
            "youtube": "https://www.youtube.com/watch?v=YRgRYLS4bOA",
            "youtube_title": "Box Breathing Technique4 - Navy SEALs",
            "duration": "6:30"
        },
        {
            "title": "Body Scan Meditation",
            "youtube": "https://www.youtube.com/watch?v=15q-N-_kkrU",
            "youtube_title": "Guided Body Scan - UCLA Mindful",
            "duration": "12:00"
        },
        {
            "title": "Managing Difficult Emotions",
            "youtube": "https://www.youtube.com/watch?v=VIEVHjHUJBc",
            "youtube_title": "Emotional Regulation - Tara Brach",
            "duration": "16:45"
        },
        {
            "title": "Mindfulness in Daily Life",
            "youtube": "https://www.youtube.com/watch?v=3nw gYqFl-7s",
            "youtube_title": "Everyday Mindfulness - Thich Nhat Hanh",
            "duration": "11:20"
        }
    ],
    "addiction_recovery": [
        {
            "title": "Understanding the Neuroscience of Addiction",
            "youtube": "https://www.youtube.com/watch?v=7oL6zpv0B60",
            "youtube_title": "The Brain and Addiction - Dr. Nora Volkow",
            "duration": "13:25"
        },
        {
            "title": "Identifying Personal Triggers",
            "youtube": "https://www.youtube.com/watch?v=xdkJDuggdJE",
            "youtube_title": "Managing Triggers - Russell Brand",
            "duration": "10:15"
        },
        {
            "title": "Building Healthy Coping Mechanisms",
            "youtube": "https://www.youtube.com/watch?v=nRCf_5VUhSo",
            "youtube_title": "Coping Strategies That Work",
            "duration": "14:30"
        },
        {
            "title": "Creating a Support Network",
            "youtube": "https://www.youtube.com/watch?v=6_-okhG2Stk",
            "youtube_title": "The Power of Connection in Recovery",
            "duration": "12:40"
        },
        {
            "title": "Relapse Prevention Strategies",
            "youtube": "https://www.youtube.com/watch?v=kgJXdK9nJO0",
            "youtube_title": "Preventing Relapse - Dr. Gabor Maté",
            "duration": "17:50"
        }
    ],
    "emotional_intelligence": [
         {
            "title": "The Five Components of EQ",
            "youtube": "https://www.youtube.com/watch?v=Y7m9eNoB3NU",
            "youtube_title": "Emotional Intelligence Explained - Daniel Goleman",
            "duration": "11:30"
        },
        {
            "title": "Developing Self-Awareness",
            "youtube": "https://www.youtube.com/watch?v=tGdsOXZpyWE",
            "youtube_title": "The Power of Self-Awareness",
            "duration": "9:20"
        },
        {
            "title": "Empathy and Perspective-Taking",
            "youtube": "https://www.youtube.com/watch?v=1Evwgu369Jw",
            "youtube_title": "The Power of Empathy - Brené Brown",
            "duration": "13:15"
        },
        {
            "title": "Effective Communication Skills",
            "youtube": "https://www.youtube.com/watch?v=9SiQAVMLOPk",
            "youtube_title": "Nonviolent Communication - Marshall Rosenberg",
            "duration": "16:40"
        },
        {
            "title": "Conflict Resolution and Relationship Management",
            "youtube": "https://www.youtube.com/watch?v=rkkASI8C8A4",
            "youtube_title": "Resolving Conflicts - William Ury",
            "duration": "14:55"
        }
    ],
    "productivity_focus": [
        {
            "title": "Deep Work Principles",
            "youtube": "https://www.youtube.com/watch?v=gTaJhjQHcf8",
            "youtube_title": "Deep Work - Cal Newport",
            "duration": "15:20"
        },
        {
            "title": "Time Blocking and Priority Management",
            "youtube": "https://www.youtube.com/watch?v=IlU-zDU6aQ0",
            "youtube_title": "Time Management Strategies",
            "duration": "12:30"
        },
        {
            "title": "Digital Minimalism",
            "youtube": "https://www.youtube.com/watch?v=F7i-jJ28hE8",
            "youtube_title": "Digital Minimalism - Cal Newport",
            "duration": "13:45"
        },
        {
            "title": "Energy Management Over Time Management",
            "youtube": "https://www.youtube.com/watch?v=BKF_H2jMp0I",
            "youtube_title": "Managing Energy, Not Time",
            "duration": "11:10"
        },
        {
            "title": "Goal Setting and Achievement Systems",
            "youtube": "https://www.youtube.com/watch?v=TQMbvJNRpLE",
            "youtube_title": "Atomic Habits - James Clear",
            "duration": "16:25"
        }
    ]
}

# Generate lesson metadata files
def generate_lesson_files():
    base_path = Path("server/content/lessons")
    
    for course_id, lessons in LESSONS.items():
        course_path = base_path / course_id
        course_path.mkdir(parents=True, exist_ok=True)
        
        for idx, lesson in enumerate(lessons, 1):
            lesson_data = {
                "id": f"{course_id}_{idx:02d}",
                "courseId": course_id,
                "orderIndex": idx,
                "estimatedMinutes": 12,  # Average read time
                "youtubeVideos": [
                    {
                        "title": lesson["youtube_title"],
                        "url": lesson["youtube"],
                        "duration": lesson["duration"]
                    }
                ]
            }
            
            filename = course_path / f"{idx:02d}.json"
            with open(filename, 'w') as f:
                json.dump(lesson_data, f, indent=2)
            
            print(f"Created: {filename}")

if __name__ == "__main__":
    generate_lesson_files()
    print("\n✅ All lesson metadata files created!")
