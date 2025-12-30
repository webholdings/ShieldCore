import { db } from "./db";
import { iqQuestions } from "@shared/schema";
import { eq } from "drizzle-orm";
const iqQuestionsMultilingual = [
    // ENGLISH QUESTIONS
    // Pattern Recognition (10)
    { question: "What number comes next in the sequence: 2, 4, 8, 16, ?", questionType: "pattern", options: JSON.stringify(["24", "32", "20", "28"]), correctAnswer: "32", difficulty: 1, language: "en" },
    { question: "Complete the pattern: A, C, E, G, ?", questionType: "pattern", options: JSON.stringify(["H", "I", "J", "K"]), correctAnswer: "I", difficulty: 1, language: "en" },
    { question: "What comes next: 1, 1, 2, 3, 5, 8, ?", questionType: "pattern", options: JSON.stringify(["11", "13", "15", "17"]), correctAnswer: "13", difficulty: 2, language: "en" },
    { question: "Which shape completes the pattern: Circle, Square, Triangle, Circle, Square, ?", questionType: "pattern", options: JSON.stringify(["Circle", "Triangle", "Square", "Pentagon"]), correctAnswer: "Triangle", difficulty: 1, language: "en" },
    { question: "Complete: 100, 95, 85, 70, ?", questionType: "pattern", options: JSON.stringify(["50", "55", "60", "65"]), correctAnswer: "50", difficulty: 2, language: "en" },
    { question: "What's next: Z, X, V, T, ?", questionType: "pattern", options: JSON.stringify(["S", "R", "Q", "P"]), correctAnswer: "R", difficulty: 3, language: "en" },
    { question: "Complete: 3, 6, 12, 24, ?", questionType: "pattern", options: JSON.stringify(["36", "48", "40", "32"]), correctAnswer: "48", difficulty: 2, language: "en" },
    { question: "What comes next: 1, 4, 9, 16, 25, ?", questionType: "pattern", options: JSON.stringify(["30", "36", "35", "49"]), correctAnswer: "36", difficulty: 2, language: "en" },
    { question: "Complete the series: 2, 6, 12, 20, 30, ?", questionType: "pattern", options: JSON.stringify(["40", "42", "38", "44"]), correctAnswer: "42", difficulty: 3, language: "en" },
    { question: "What's next: J, F, M, A, M, ?", questionType: "pattern", options: JSON.stringify(["J", "S", "A", "N"]), correctAnswer: "J", difficulty: 2, language: "en" },
    // Logical Reasoning (10)
    { question: "If all roses are flowers and some flowers fade quickly, which statement must be true?", questionType: "logic", options: JSON.stringify(["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "All flowers are roses"]), correctAnswer: "Some roses may fade quickly", difficulty: 2, language: "en" },
    { question: "John is taller than Mary. Mary is taller than Sarah. Who is shortest?", questionType: "logic", options: JSON.stringify(["John", "Mary", "Sarah", "Cannot determine"]), correctAnswer: "Sarah", difficulty: 1, language: "en" },
    { question: "If it's raining, the ground is wet. The ground is wet. What can we conclude?", questionType: "logic", options: JSON.stringify(["It is raining", "It might be raining", "It is not raining", "None of the above"]), correctAnswer: "It might be raining", difficulty: 3, language: "en" },
    { question: "All birds have feathers. Some things with feathers can fly. Therefore:", questionType: "logic", options: JSON.stringify(["All birds can fly", "Some birds can fly", "No birds can fly", "All flying things are birds"]), correctAnswer: "Some birds can fly", difficulty: 2, language: "en" },
    { question: "If A is west of B, and B is west of C, what is the relationship between A and C?", questionType: "logic", options: JSON.stringify(["A is west of C", "A is east of C", "A equals C", "Cannot determine"]), correctAnswer: "A is west of C", difficulty: 1, language: "en" },
    { question: "No cats are dogs. All dogs are animals. Therefore:", questionType: "logic", options: JSON.stringify(["No cats are animals", "All animals are dogs", "Some animals are not cats", "All cats are animals"]), correctAnswer: "Some animals are not cats", difficulty: 3, language: "en" },
    { question: "If today is Monday, what day was it 10 days ago?", questionType: "logic", options: JSON.stringify(["Monday", "Friday", "Saturday", "Sunday"]), correctAnswer: "Friday", difficulty: 2, language: "en" },
    { question: "A is older than B. C is younger than B. Who is youngest?", questionType: "logic", options: JSON.stringify(["A", "B", "C", "Cannot determine"]), correctAnswer: "C", difficulty: 1, language: "en" },
    { question: "If some students are athletes and all athletes are healthy, what must be true?", questionType: "logic", options: JSON.stringify(["All students are healthy", "Some students are healthy", "No students are healthy", "All healthy people are students"]), correctAnswer: "Some students are healthy", difficulty: 2, language: "en" },
    { question: "Red is darker than pink. Blue is darker than red. Which is lightest?", questionType: "logic", options: JSON.stringify(["Red", "Pink", "Blue", "Cannot determine"]), correctAnswer: "Pink", difficulty: 1, language: "en" },
    // Mathematical Skills (10)
    { question: "What is 15% of 200?", questionType: "math", options: JSON.stringify(["20", "25", "30", "35"]), correctAnswer: "30", difficulty: 1, language: "en" },
    { question: "If x + 5 = 12, what is x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "en" },
    { question: "A shirt costs $40 after a 20% discount. What was the original price?", questionType: "math", options: JSON.stringify(["$45", "$48", "$50", "$55"]), correctAnswer: "$50", difficulty: 2, language: "en" },
    { question: "What is the average of 10, 20, and 30?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "en" },
    { question: "If 3x = 21, what is x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "en" },
    { question: "What is 25% of 80?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "en" },
    { question: "A rectangle has length 8 and width 5. What is its area?", questionType: "math", options: JSON.stringify(["30", "35", "40", "45"]), correctAnswer: "40", difficulty: 1, language: "en" },
    { question: "If y - 8 = 15, what is y?", questionType: "math", options: JSON.stringify(["20", "21", "22", "23"]), correctAnswer: "23", difficulty: 1, language: "en" },
    { question: "What is 1/4 of 100?", questionType: "math", options: JSON.stringify(["20", "25", "30", "40"]), correctAnswer: "25", difficulty: 1, language: "en" },
    { question: "A car travels 60 miles in 2 hours. What is its average speed?", questionType: "math", options: JSON.stringify(["25 mph", "30 mph", "35 mph", "40 mph"]), correctAnswer: "30 mph", difficulty: 2, language: "en" },
    // Verbal Reasoning (10)
    { question: "Choose the word that is most opposite to DIFFICULT:", questionType: "verbal", options: JSON.stringify(["Hard", "Simple", "Complex", "Challenging"]), correctAnswer: "Simple", difficulty: 1, language: "en" },
    { question: "Which word does not belong: Apple, Banana, Carrot, Orange", questionType: "verbal", options: JSON.stringify(["Apple", "Banana", "Carrot", "Orange"]), correctAnswer: "Carrot", difficulty: 1, language: "en" },
    { question: "Choose the synonym for HAPPY:", questionType: "verbal", options: JSON.stringify(["Sad", "Joyful", "Angry", "Tired"]), correctAnswer: "Joyful", difficulty: 1, language: "en" },
    { question: "Complete the analogy: Hot is to Cold as Day is to ?", questionType: "verbal", options: JSON.stringify(["Light", "Night", "Sun", "Moon"]), correctAnswer: "Night", difficulty: 1, language: "en" },
    { question: "Which word is most similar to BRAVE:", questionType: "verbal", options: JSON.stringify(["Fearful", "Courageous", "Weak", "Timid"]), correctAnswer: "Courageous", difficulty: 1, language: "en" },
    { question: "Complete: Cat is to Meow as Dog is to ?", questionType: "verbal", options: JSON.stringify(["Purr", "Bark", "Chirp", "Roar"]), correctAnswer: "Bark", difficulty: 1, language: "en" },
    { question: "Choose the opposite of ANCIENT:", questionType: "verbal", options: JSON.stringify(["Old", "Modern", "Historic", "Traditional"]), correctAnswer: "Modern", difficulty: 1, language: "en" },
    { question: "Which does not belong: Chair, Table, Desk, Apple", questionType: "verbal", options: JSON.stringify(["Chair", "Table", "Desk", "Apple"]), correctAnswer: "Apple", difficulty: 1, language: "en" },
    { question: "Complete the analogy: Fish is to Water as Bird is to ?", questionType: "verbal", options: JSON.stringify(["Nest", "Air", "Tree", "Sky"]), correctAnswer: "Air", difficulty: 2, language: "en" },
    { question: "Choose the synonym for DIFFICULT:", questionType: "verbal", options: JSON.stringify(["Easy", "Hard", "Simple", "Clear"]), correctAnswer: "Hard", difficulty: 1, language: "en" },
    // Spatial Reasoning (10)
    { question: "How many faces does a cube have?", questionType: "spatial", options: JSON.stringify(["4", "6", "8", "12"]), correctAnswer: "6", difficulty: 1, language: "en" },
    { question: "If you rotate a square 90 degrees, what shape do you get?", questionType: "spatial", options: JSON.stringify(["Rectangle", "Square", "Triangle", "Circle"]), correctAnswer: "Square", difficulty: 1, language: "en" },
    { question: "How many sides does a pentagon have?", questionType: "spatial", options: JSON.stringify(["4", "5", "6", "7"]), correctAnswer: "5", difficulty: 1, language: "en" },
    { question: "Which direction is opposite to North?", questionType: "spatial", options: JSON.stringify(["East", "West", "South", "Northeast"]), correctAnswer: "South", difficulty: 1, language: "en" },
    { question: "How many corners does a triangle have?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "3", difficulty: 1, language: "en" },
    { question: "If you fold a square in half, what shapes can you make?", questionType: "spatial", options: JSON.stringify(["Circle", "Rectangle", "Triangle", "Pentagon"]), correctAnswer: "Rectangle", difficulty: 2, language: "en" },
    { question: "How many edges does a cube have?", questionType: "spatial", options: JSON.stringify(["6", "8", "10", "12"]), correctAnswer: "12", difficulty: 2, language: "en" },
    { question: "What 3D shape has only one face?", questionType: "spatial", options: JSON.stringify(["Cube", "Sphere", "Cone", "Cylinder"]), correctAnswer: "Sphere", difficulty: 2, language: "en" },
    { question: "How many right angles are in a square?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "4", difficulty: 1, language: "en" },
    { question: "If you look at a clock from behind, which direction do the hands move?", questionType: "spatial", options: JSON.stringify(["Clockwise", "Counterclockwise", "Up", "Down"]), correctAnswer: "Counterclockwise", difficulty: 3, language: "en" },
    // GERMAN QUESTIONS
    // Mustererkennung (Pattern Recognition) (10)
    { question: "Welche Zahl kommt als nächstes in der Reihe: 2, 4, 8, 16, ?", questionType: "pattern", options: JSON.stringify(["24", "32", "20", "28"]), correctAnswer: "32", difficulty: 1, language: "de" },
    { question: "Vervollständige das Muster: A, C, E, G, ?", questionType: "pattern", options: JSON.stringify(["H", "I", "J", "K"]), correctAnswer: "I", difficulty: 1, language: "de" },
    { question: "Was kommt als nächstes: 1, 1, 2, 3, 5, 8, ?", questionType: "pattern", options: JSON.stringify(["11", "13", "15", "17"]), correctAnswer: "13", difficulty: 2, language: "de" },
    { question: "Welche Form vervollständigt das Muster: Kreis, Quadrat, Dreieck, Kreis, Quadrat, ?", questionType: "pattern", options: JSON.stringify(["Kreis", "Dreieck", "Quadrat", "Fünfeck"]), correctAnswer: "Dreieck", difficulty: 1, language: "de" },
    { question: "Vervollständige: 100, 95, 85, 70, ?", questionType: "pattern", options: JSON.stringify(["50", "55", "60", "65"]), correctAnswer: "50", difficulty: 2, language: "de" },
    { question: "Was kommt als nächstes: Z, X, V, T, ?", questionType: "pattern", options: JSON.stringify(["S", "R", "Q", "P"]), correctAnswer: "R", difficulty: 3, language: "de" },
    { question: "Vervollständige: 3, 6, 12, 24, ?", questionType: "pattern", options: JSON.stringify(["36", "48", "40", "32"]), correctAnswer: "48", difficulty: 2, language: "de" },
    { question: "Was kommt als nächstes: 1, 4, 9, 16, 25, ?", questionType: "pattern", options: JSON.stringify(["30", "36", "35", "49"]), correctAnswer: "36", difficulty: 2, language: "de" },
    { question: "Vervollständige die Reihe: 2, 6, 12, 20, 30, ?", questionType: "pattern", options: JSON.stringify(["40", "42", "38", "44"]), correctAnswer: "42", difficulty: 3, language: "de" },
    { question: "Was kommt als nächstes: J, F, M, A, M, ?", questionType: "pattern", options: JSON.stringify(["J", "S", "A", "N"]), correctAnswer: "J", difficulty: 2, language: "de" },
    // Logisches Denken (10)
    { question: "Wenn alle Rosen Blumen sind und manche Blumen schnell verwelken, welche Aussage muss wahr sein?", questionType: "logic", options: JSON.stringify(["Alle Rosen verwelken schnell", "Manche Rosen verwelken möglicherweise schnell", "Keine Rosen verwelken schnell", "Alle Blumen sind Rosen"]), correctAnswer: "Manche Rosen verwelken möglicherweise schnell", difficulty: 2, language: "de" },
    { question: "Johannes ist größer als Maria. Maria ist größer als Sarah. Wer ist am kleinsten?", questionType: "logic", options: JSON.stringify(["Johannes", "Maria", "Sarah", "Kann nicht bestimmt werden"]), correctAnswer: "Sarah", difficulty: 1, language: "de" },
    { question: "Wenn es regnet, ist der Boden nass. Der Boden ist nass. Was können wir schlussfolgern?", questionType: "logic", options: JSON.stringify(["Es regnet", "Es könnte regnen", "Es regnet nicht", "Keine der oben genannten"]), correctAnswer: "Es könnte regnen", difficulty: 3, language: "de" },
    { question: "Alle Vögel haben Federn. Manche Dinge mit Federn können fliegen. Daher:", questionType: "logic", options: JSON.stringify(["Alle Vögel können fliegen", "Manche Vögel können fliegen", "Keine Vögel können fliegen", "Alle fliegenden Dinge sind Vögel"]), correctAnswer: "Manche Vögel können fliegen", difficulty: 2, language: "de" },
    { question: "Wenn A westlich von B liegt und B westlich von C, welche Beziehung besteht zwischen A und C?", questionType: "logic", options: JSON.stringify(["A liegt westlich von C", "A liegt östlich von C", "A gleich C", "Kann nicht bestimmt werden"]), correctAnswer: "A liegt westlich von C", difficulty: 1, language: "de" },
    { question: "Keine Katzen sind Hunde. Alle Hunde sind Tiere. Daher:", questionType: "logic", options: JSON.stringify(["Keine Katzen sind Tiere", "Alle Tiere sind Hunde", "Manche Tiere sind keine Katzen", "Alle Katzen sind Tiere"]), correctAnswer: "Manche Tiere sind keine Katzen", difficulty: 3, language: "de" },
    { question: "Wenn heute Montag ist, welcher Tag war vor 10 Tagen?", questionType: "logic", options: JSON.stringify(["Montag", "Freitag", "Samstag", "Sonntag"]), correctAnswer: "Freitag", difficulty: 2, language: "de" },
    { question: "A ist älter als B. C ist jünger als B. Wer ist am jüngsten?", questionType: "logic", options: JSON.stringify(["A", "B", "C", "Kann nicht bestimmt werden"]), correctAnswer: "C", difficulty: 1, language: "de" },
    { question: "Wenn manche Studenten Athleten sind und alle Athleten gesund sind, was muss wahr sein?", questionType: "logic", options: JSON.stringify(["Alle Studenten sind gesund", "Manche Studenten sind gesund", "Keine Studenten sind gesund", "Alle gesunden Menschen sind Studenten"]), correctAnswer: "Manche Studenten sind gesund", difficulty: 2, language: "de" },
    { question: "Rot ist dunkler als Rosa. Blau ist dunkler als Rot. Was ist am hellsten?", questionType: "logic", options: JSON.stringify(["Rot", "Rosa", "Blau", "Kann nicht bestimmt werden"]), correctAnswer: "Rosa", difficulty: 1, language: "de" },
    // Mathematische Fähigkeiten (10)
    { question: "Was sind 15% von 200?", questionType: "math", options: JSON.stringify(["20", "25", "30", "35"]), correctAnswer: "30", difficulty: 1, language: "de" },
    { question: "Wenn x + 5 = 12, was ist x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "de" },
    { question: "Ein Hemd kostet 40€ nach 20% Rabatt. Was war der ursprüngliche Preis?", questionType: "math", options: JSON.stringify(["45€", "48€", "50€", "55€"]), correctAnswer: "50€", difficulty: 2, language: "de" },
    { question: "Was ist der Durchschnitt von 10, 20 und 30?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "de" },
    { question: "Wenn 3x = 21, was ist x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "de" },
    { question: "Was sind 25% von 80?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "de" },
    { question: "Ein Rechteck hat die Länge 8 und die Breite 5. Was ist seine Fläche?", questionType: "math", options: JSON.stringify(["30", "35", "40", "45"]), correctAnswer: "40", difficulty: 1, language: "de" },
    { question: "Wenn y - 8 = 15, was ist y?", questionType: "math", options: JSON.stringify(["20", "21", "22", "23"]), correctAnswer: "23", difficulty: 1, language: "de" },
    { question: "Was ist 1/4 von 100?", questionType: "math", options: JSON.stringify(["20", "25", "30", "40"]), correctAnswer: "25", difficulty: 1, language: "de" },
    { question: "Ein Auto fährt 60 Meilen in 2 Stunden. Was ist seine durchschnittliche Geschwindigkeit?", questionType: "math", options: JSON.stringify(["25 mph", "30 mph", "35 mph", "40 mph"]), correctAnswer: "30 mph", difficulty: 2, language: "de" },
    // Verbales Denken (10)
    { question: "Wähle das Wort, das am meisten das Gegenteil von SCHWIERIG ist:", questionType: "verbal", options: JSON.stringify(["Hart", "Einfach", "Komplex", "Herausfordernd"]), correctAnswer: "Einfach", difficulty: 1, language: "de" },
    { question: "Welches Wort gehört nicht dazu: Apfel, Banane, Karotte, Orange", questionType: "verbal", options: JSON.stringify(["Apfel", "Banane", "Karotte", "Orange"]), correctAnswer: "Karotte", difficulty: 1, language: "de" },
    { question: "Wähle das Synonym für GLÜCKLICH:", questionType: "verbal", options: JSON.stringify(["Traurig", "Freudig", "Wütend", "Müde"]), correctAnswer: "Freudig", difficulty: 1, language: "de" },
    { question: "Vervollständige die Analogie: Heiß verhält sich zu Kalt wie Tag zu ?", questionType: "verbal", options: JSON.stringify(["Licht", "Nacht", "Sonne", "Mond"]), correctAnswer: "Nacht", difficulty: 1, language: "de" },
    { question: "Welches Wort ist am ähnlichsten zu MUTIG:", questionType: "verbal", options: JSON.stringify(["Ängstlich", "Tapfer", "Schwach", "Schüchtern"]), correctAnswer: "Tapfer", difficulty: 1, language: "de" },
    { question: "Vervollständige: Katze verhält sich zu Miau wie Hund zu ?", questionType: "verbal", options: JSON.stringify(["Schnurren", "Bellen", "Zwitschern", "Brüllen"]), correctAnswer: "Bellen", difficulty: 1, language: "de" },
    { question: "Wähle das Gegenteil von ANTIK:", questionType: "verbal", options: JSON.stringify(["Alt", "Modern", "Historisch", "Traditionell"]), correctAnswer: "Modern", difficulty: 1, language: "de" },
    { question: "Was gehört nicht dazu: Stuhl, Tisch, Schreibtisch, Apfel", questionType: "verbal", options: JSON.stringify(["Stuhl", "Tisch", "Schreibtisch", "Apfel"]), correctAnswer: "Apfel", difficulty: 1, language: "de" },
    { question: "Vervollständige die Analogie: Fisch verhält sich zu Wasser wie Vogel zu ?", questionType: "verbal", options: JSON.stringify(["Nest", "Luft", "Baum", "Himmel"]), correctAnswer: "Luft", difficulty: 2, language: "de" },
    { question: "Wähle das Synonym für SCHWIERIG:", questionType: "verbal", options: JSON.stringify(["Leicht", "Hart", "Einfach", "Klar"]), correctAnswer: "Hart", difficulty: 1, language: "de" },
    // Räumliches Denken (10)
    { question: "Wie viele Flächen hat ein Würfel?", questionType: "spatial", options: JSON.stringify(["4", "6", "8", "12"]), correctAnswer: "6", difficulty: 1, language: "de" },
    { question: "Wenn du ein Quadrat um 90 Grad drehst, welche Form erhältst du?", questionType: "spatial", options: JSON.stringify(["Rechteck", "Quadrat", "Dreieck", "Kreis"]), correctAnswer: "Quadrat", difficulty: 1, language: "de" },
    { question: "Wie viele Seiten hat ein Fünfeck?", questionType: "spatial", options: JSON.stringify(["4", "5", "6", "7"]), correctAnswer: "5", difficulty: 1, language: "de" },
    { question: "Welche Richtung ist das Gegenteil von Norden?", questionType: "spatial", options: JSON.stringify(["Osten", "Westen", "Süden", "Nordosten"]), correctAnswer: "Süden", difficulty: 1, language: "de" },
    { question: "Wie viele Ecken hat ein Dreieck?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "3", difficulty: 1, language: "de" },
    { question: "Wenn du ein Quadrat in der Mitte faltest, welche Formen kannst du machen?", questionType: "spatial", options: JSON.stringify(["Kreis", "Rechteck", "Dreieck", "Fünfeck"]), correctAnswer: "Rechteck", difficulty: 2, language: "de" },
    { question: "Wie viele Kanten hat ein Würfel?", questionType: "spatial", options: JSON.stringify(["6", "8", "10", "12"]), correctAnswer: "12", difficulty: 2, language: "de" },
    { question: "Welche 3D-Form hat nur eine Fläche?", questionType: "spatial", options: JSON.stringify(["Würfel", "Kugel", "Kegel", "Zylinder"]), correctAnswer: "Kugel", difficulty: 2, language: "de" },
    { question: "Wie viele rechte Winkel hat ein Quadrat?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "4", difficulty: 1, language: "de" },
    { question: "Wenn du eine Uhr von hinten betrachtest, in welche Richtung bewegen sich die Zeiger?", questionType: "spatial", options: JSON.stringify(["Im Uhrzeigersinn", "Gegen den Uhrzeigersinn", "Nach oben", "Nach unten"]), correctAnswer: "Gegen den Uhrzeigersinn", difficulty: 3, language: "de" },
    // FRENCH QUESTIONS
    // Reconnaissance de motifs (10)
    { question: "Quel nombre vient ensuite dans la séquence : 2, 4, 8, 16, ?", questionType: "pattern", options: JSON.stringify(["24", "32", "20", "28"]), correctAnswer: "32", difficulty: 1, language: "fr" },
    { question: "Complétez le motif : A, C, E, G, ?", questionType: "pattern", options: JSON.stringify(["H", "I", "J", "K"]), correctAnswer: "I", difficulty: 1, language: "fr" },
    { question: "Qu'est-ce qui vient ensuite : 1, 1, 2, 3, 5, 8, ?", questionType: "pattern", options: JSON.stringify(["11", "13", "15", "17"]), correctAnswer: "13", difficulty: 2, language: "fr" },
    { question: "Quelle forme complète le motif : Cercle, Carré, Triangle, Cercle, Carré, ?", questionType: "pattern", options: JSON.stringify(["Cercle", "Triangle", "Carré", "Pentagone"]), correctAnswer: "Triangle", difficulty: 1, language: "fr" },
    { question: "Complétez : 100, 95, 85, 70, ?", questionType: "pattern", options: JSON.stringify(["50", "55", "60", "65"]), correctAnswer: "50", difficulty: 2, language: "fr" },
    { question: "Qu'est-ce qui vient ensuite : Z, X, V, T, ?", questionType: "pattern", options: JSON.stringify(["S", "R", "Q", "P"]), correctAnswer: "R", difficulty: 3, language: "fr" },
    { question: "Complétez : 3, 6, 12, 24, ?", questionType: "pattern", options: JSON.stringify(["36", "48", "40", "32"]), correctAnswer: "48", difficulty: 2, language: "fr" },
    { question: "Qu'est-ce qui vient ensuite : 1, 4, 9, 16, 25, ?", questionType: "pattern", options: JSON.stringify(["30", "36", "35", "49"]), correctAnswer: "36", difficulty: 2, language: "fr" },
    { question: "Complétez la série : 2, 6, 12, 20, 30, ?", questionType: "pattern", options: JSON.stringify(["40", "42", "38", "44"]), correctAnswer: "42", difficulty: 3, language: "fr" },
    { question: "Qu'est-ce qui vient ensuite : J, F, M, A, M, ?", questionType: "pattern", options: JSON.stringify(["J", "S", "A", "N"]), correctAnswer: "J", difficulty: 2, language: "fr" },
    // Raisonnement logique (10)
    { question: "Si toutes les roses sont des fleurs et certaines fleurs fanent rapidement, quelle affirmation doit être vraie ?", questionType: "logic", options: JSON.stringify(["Toutes les roses fanent rapidement", "Certaines roses peuvent faner rapidement", "Aucune rose ne fane rapidement", "Toutes les fleurs sont des roses"]), correctAnswer: "Certaines roses peuvent faner rapidement", difficulty: 2, language: "fr" },
    { question: "Jean est plus grand que Marie. Marie est plus grande que Sarah. Qui est la plus petite ?", questionType: "logic", options: JSON.stringify(["Jean", "Marie", "Sarah", "Impossible à déterminer"]), correctAnswer: "Sarah", difficulty: 1, language: "fr" },
    { question: "S'il pleut, le sol est mouillé. Le sol est mouillé. Que pouvons-nous conclure ?", questionType: "logic", options: JSON.stringify(["Il pleut", "Il pourrait pleuvoir", "Il ne pleut pas", "Aucune des réponses ci-dessus"]), correctAnswer: "Il pourrait pleuvoir", difficulty: 3, language: "fr" },
    { question: "Tous les oiseaux ont des plumes. Certaines choses avec des plumes peuvent voler. Par conséquent :", questionType: "logic", options: JSON.stringify(["Tous les oiseaux peuvent voler", "Certains oiseaux peuvent voler", "Aucun oiseau ne peut voler", "Toutes les choses qui volent sont des oiseaux"]), correctAnswer: "Certains oiseaux peuvent voler", difficulty: 2, language: "fr" },
    { question: "Si A est à l'ouest de B, et B est à l'ouest de C, quelle est la relation entre A et C ?", questionType: "logic", options: JSON.stringify(["A est à l'ouest de C", "A est à l'est de C", "A égale C", "Impossible à déterminer"]), correctAnswer: "A est à l'ouest de C", difficulty: 1, language: "fr" },
    { question: "Aucun chat n'est un chien. Tous les chiens sont des animaux. Par conséquent :", questionType: "logic", options: JSON.stringify(["Aucun chat n'est un animal", "Tous les animaux sont des chiens", "Certains animaux ne sont pas des chats", "Tous les chats sont des animaux"]), correctAnswer: "Certains animaux ne sont pas des chats", difficulty: 3, language: "fr" },
    { question: "Si aujourd'hui est lundi, quel jour était-il il y a 10 jours ?", questionType: "logic", options: JSON.stringify(["Lundi", "Vendredi", "Samedi", "Dimanche"]), correctAnswer: "Vendredi", difficulty: 2, language: "fr" },
    { question: "A est plus âgé que B. C est plus jeune que B. Qui est le plus jeune ?", questionType: "logic", options: JSON.stringify(["A", "B", "C", "Impossible à déterminer"]), correctAnswer: "C", difficulty: 1, language: "fr" },
    { question: "Si certains étudiants sont des athlètes et tous les athlètes sont en bonne santé, qu'est-ce qui doit être vrai ?", questionType: "logic", options: JSON.stringify(["Tous les étudiants sont en bonne santé", "Certains étudiants sont en bonne santé", "Aucun étudiant n'est en bonne santé", "Toutes les personnes en bonne santé sont des étudiants"]), correctAnswer: "Certains étudiants sont en bonne santé", difficulty: 2, language: "fr" },
    { question: "Le rouge est plus foncé que le rose. Le bleu est plus foncé que le rouge. Lequel est le plus clair ?", questionType: "logic", options: JSON.stringify(["Rouge", "Rose", "Bleu", "Impossible à déterminer"]), correctAnswer: "Rose", difficulty: 1, language: "fr" },
    // Compétences mathématiques (10)
    { question: "Combien font 15% de 200 ?", questionType: "math", options: JSON.stringify(["20", "25", "30", "35"]), correctAnswer: "30", difficulty: 1, language: "fr" },
    { question: "Si x + 5 = 12, quelle est la valeur de x ?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "fr" },
    { question: "Une chemise coûte 40€ après une réduction de 20%. Quel était le prix d'origine ?", questionType: "math", options: JSON.stringify(["45€", "48€", "50€", "55€"]), correctAnswer: "50€", difficulty: 2, language: "fr" },
    { question: "Quelle est la moyenne de 10, 20 et 30 ?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "fr" },
    { question: "Si 3x = 21, quelle est la valeur de x ?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "fr" },
    { question: "Combien font 25% de 80 ?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "fr" },
    { question: "Un rectangle a une longueur de 8 et une largeur de 5. Quelle est son aire ?", questionType: "math", options: JSON.stringify(["30", "35", "40", "45"]), correctAnswer: "40", difficulty: 1, language: "fr" },
    { question: "Si y - 8 = 15, quelle est la valeur de y ?", questionType: "math", options: JSON.stringify(["20", "21", "22", "23"]), correctAnswer: "23", difficulty: 1, language: "fr" },
    { question: "Combien font 1/4 de 100 ?", questionType: "math", options: JSON.stringify(["20", "25", "30", "40"]), correctAnswer: "25", difficulty: 1, language: "fr" },
    { question: "Une voiture parcourt 60 miles en 2 heures. Quelle est sa vitesse moyenne ?", questionType: "math", options: JSON.stringify(["25 mph", "30 mph", "35 mph", "40 mph"]), correctAnswer: "30 mph", difficulty: 2, language: "fr" },
    // Raisonnement verbal (10)
    { question: "Choisissez le mot qui est le plus opposé à DIFFICILE :", questionType: "verbal", options: JSON.stringify(["Dur", "Simple", "Complexe", "Difficile"]), correctAnswer: "Simple", difficulty: 1, language: "fr" },
    { question: "Quel mot ne fait pas partie du groupe : Pomme, Banane, Carotte, Orange", questionType: "verbal", options: JSON.stringify(["Pomme", "Banane", "Carotte", "Orange"]), correctAnswer: "Carotte", difficulty: 1, language: "fr" },
    { question: "Choisissez le synonyme de HEUREUX :", questionType: "verbal", options: JSON.stringify(["Triste", "Joyeux", "En colère", "Fatigué"]), correctAnswer: "Joyeux", difficulty: 1, language: "fr" },
    { question: "Complétez l'analogie : Chaud est à Froid comme Jour est à ?", questionType: "verbal", options: JSON.stringify(["Lumière", "Nuit", "Soleil", "Lune"]), correctAnswer: "Nuit", difficulty: 1, language: "fr" },
    { question: "Quel mot est le plus similaire à COURAGEUX :", questionType: "verbal", options: JSON.stringify(["Peureux", "Brave", "Faible", "Timide"]), correctAnswer: "Brave", difficulty: 1, language: "fr" },
    { question: "Complétez : Chat est à Miauler comme Chien est à ?", questionType: "verbal", options: JSON.stringify(["Ronronner", "Aboyer", "Gazouiller", "Rugir"]), correctAnswer: "Aboyer", difficulty: 1, language: "fr" },
    { question: "Choisissez l'opposé de ANCIEN :", questionType: "verbal", options: JSON.stringify(["Vieux", "Moderne", "Historique", "Traditionnel"]), correctAnswer: "Moderne", difficulty: 1, language: "fr" },
    { question: "Qu'est-ce qui ne fait pas partie du groupe : Chaise, Table, Bureau, Pomme", questionType: "verbal", options: JSON.stringify(["Chaise", "Table", "Bureau", "Pomme"]), correctAnswer: "Pomme", difficulty: 1, language: "fr" },
    { question: "Complétez l'analogie : Poisson est à Eau comme Oiseau est à ?", questionType: "verbal", options: JSON.stringify(["Nid", "Air", "Arbre", "Ciel"]), correctAnswer: "Air", difficulty: 2, language: "fr" },
    { question: "Choisissez le synonyme de DIFFICILE :", questionType: "verbal", options: JSON.stringify(["Facile", "Dur", "Simple", "Clair"]), correctAnswer: "Dur", difficulty: 1, language: "fr" },
    // Raisonnement spatial (10)
    { question: "Combien de faces a un cube ?", questionType: "spatial", options: JSON.stringify(["4", "6", "8", "12"]), correctAnswer: "6", difficulty: 1, language: "fr" },
    { question: "Si vous faites pivoter un carré de 90 degrés, quelle forme obtenez-vous ?", questionType: "spatial", options: JSON.stringify(["Rectangle", "Carré", "Triangle", "Cercle"]), correctAnswer: "Carré", difficulty: 1, language: "fr" },
    { question: "Combien de côtés a un pentagone ?", questionType: "spatial", options: JSON.stringify(["4", "5", "6", "7"]), correctAnswer: "5", difficulty: 1, language: "fr" },
    { question: "Quelle direction est opposée au Nord ?", questionType: "spatial", options: JSON.stringify(["Est", "Ouest", "Sud", "Nord-Est"]), correctAnswer: "Sud", difficulty: 1, language: "fr" },
    { question: "Combien de coins a un triangle ?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "3", difficulty: 1, language: "fr" },
    { question: "Si vous pliez un carré en deux, quelles formes pouvez-vous créer ?", questionType: "spatial", options: JSON.stringify(["Cercle", "Rectangle", "Triangle", "Pentagone"]), correctAnswer: "Rectangle", difficulty: 2, language: "fr" },
    { question: "Combien d'arêtes a un cube ?", questionType: "spatial", options: JSON.stringify(["6", "8", "10", "12"]), correctAnswer: "12", difficulty: 2, language: "fr" },
    { question: "Quelle forme 3D n'a qu'une seule face ?", questionType: "spatial", options: JSON.stringify(["Cube", "Sphère", "Cône", "Cylindre"]), correctAnswer: "Sphère", difficulty: 2, language: "fr" },
    { question: "Combien d'angles droits y a-t-il dans un carré ?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "4", difficulty: 1, language: "fr" },
    { question: "Si vous regardez une horloge par derrière, dans quelle direction se déplacent les aiguilles ?", questionType: "spatial", options: JSON.stringify(["Dans le sens des aiguilles d'une montre", "Dans le sens inverse des aiguilles d'une montre", "Vers le haut", "Vers le bas"]), correctAnswer: "Dans le sens inverse des aiguilles d'une montre", difficulty: 3, language: "fr" },
    // PORTUGUESE QUESTIONS
    // Reconhecimento de padrões (10)
    { question: "Qual número vem a seguir na sequência: 2, 4, 8, 16, ?", questionType: "pattern", options: JSON.stringify(["24", "32", "20", "28"]), correctAnswer: "32", difficulty: 1, language: "pt" },
    { question: "Complete o padrão: A, C, E, G, ?", questionType: "pattern", options: JSON.stringify(["H", "I", "J", "K"]), correctAnswer: "I", difficulty: 1, language: "pt" },
    { question: "O que vem a seguir: 1, 1, 2, 3, 5, 8, ?", questionType: "pattern", options: JSON.stringify(["11", "13", "15", "17"]), correctAnswer: "13", difficulty: 2, language: "pt" },
    { question: "Qual forma completa o padrão: Círculo, Quadrado, Triângulo, Círculo, Quadrado, ?", questionType: "pattern", options: JSON.stringify(["Círculo", "Triângulo", "Quadrado", "Pentágono"]), correctAnswer: "Triângulo", difficulty: 1, language: "pt" },
    { question: "Complete: 100, 95, 85, 70, ?", questionType: "pattern", options: JSON.stringify(["50", "55", "60", "65"]), correctAnswer: "50", difficulty: 2, language: "pt" },
    { question: "O que vem a seguir: Z, X, V, T, ?", questionType: "pattern", options: JSON.stringify(["S", "R", "Q", "P"]), correctAnswer: "R", difficulty: 3, language: "pt" },
    { question: "Complete: 3, 6, 12, 24, ?", questionType: "pattern", options: JSON.stringify(["36", "48", "40", "32"]), correctAnswer: "48", difficulty: 2, language: "pt" },
    { question: "O que vem a seguir: 1, 4, 9, 16, 25, ?", questionType: "pattern", options: JSON.stringify(["30", "36", "35", "49"]), correctAnswer: "36", difficulty: 2, language: "pt" },
    { question: "Complete a série: 2, 6, 12, 20, 30, ?", questionType: "pattern", options: JSON.stringify(["40", "42", "38", "44"]), correctAnswer: "42", difficulty: 3, language: "pt" },
    { question: "O que vem a seguir: J, F, M, A, M, ?", questionType: "pattern", options: JSON.stringify(["J", "S", "A", "N"]), correctAnswer: "J", difficulty: 2, language: "pt" },
    // Raciocínio lógico (10)
    { question: "Se todas as rosas são flores e algumas flores murcham rapidamente, qual afirmação deve ser verdadeira?", questionType: "logic", options: JSON.stringify(["Todas as rosas murcham rapidamente", "Algumas rosas podem murchar rapidamente", "Nenhuma rosa murcha rapidamente", "Todas as flores são rosas"]), correctAnswer: "Algumas rosas podem murchar rapidamente", difficulty: 2, language: "pt" },
    { question: "João é mais alto que Maria. Maria é mais alta que Sara. Quem é a mais baixa?", questionType: "logic", options: JSON.stringify(["João", "Maria", "Sara", "Não é possível determinar"]), correctAnswer: "Sara", difficulty: 1, language: "pt" },
    { question: "Se está chovendo, o chão está molhado. O chão está molhado. O que podemos concluir?", questionType: "logic", options: JSON.stringify(["Está chovendo", "Pode estar chovendo", "Não está chovendo", "Nenhuma das anteriores"]), correctAnswer: "Pode estar chovendo", difficulty: 3, language: "pt" },
    { question: "Todos os pássaros têm penas. Algumas coisas com penas podem voar. Portanto:", questionType: "logic", options: JSON.stringify(["Todos os pássaros podem voar", "Alguns pássaros podem voar", "Nenhum pássaro pode voar", "Todas as coisas que voam são pássaros"]), correctAnswer: "Alguns pássaros podem voar", difficulty: 2, language: "pt" },
    { question: "Se A está a oeste de B, e B está a oeste de C, qual é a relação entre A e C?", questionType: "logic", options: JSON.stringify(["A está a oeste de C", "A está a leste de C", "A é igual a C", "Não é possível determinar"]), correctAnswer: "A está a oeste de C", difficulty: 1, language: "pt" },
    { question: "Nenhum gato é cachorro. Todos os cachorros são animais. Portanto:", questionType: "logic", options: JSON.stringify(["Nenhum gato é animal", "Todos os animais são cachorros", "Alguns animais não são gatos", "Todos os gatos são animais"]), correctAnswer: "Alguns animais não são gatos", difficulty: 3, language: "pt" },
    { question: "Se hoje é segunda-feira, que dia era há 10 dias?", questionType: "logic", options: JSON.stringify(["Segunda", "Sexta", "Sábado", "Domingo"]), correctAnswer: "Sexta", difficulty: 2, language: "pt" },
    { question: "A é mais velho que B. C é mais jovem que B. Quem é o mais jovem?", questionType: "logic", options: JSON.stringify(["A", "B", "C", "Não é possível determinar"]), correctAnswer: "C", difficulty: 1, language: "pt" },
    { question: "Se alguns estudantes são atletas e todos os atletas são saudáveis, o que deve ser verdade?", questionType: "logic", options: JSON.stringify(["Todos os estudantes são saudáveis", "Alguns estudantes são saudáveis", "Nenhum estudante é saudável", "Todas as pessoas saudáveis são estudantes"]), correctAnswer: "Alguns estudantes são saudáveis", difficulty: 2, language: "pt" },
    { question: "Vermelho é mais escuro que rosa. Azul é mais escuro que vermelho. Qual é o mais claro?", questionType: "logic", options: JSON.stringify(["Vermelho", "Rosa", "Azul", "Não é possível determinar"]), correctAnswer: "Rosa", difficulty: 1, language: "pt" },
    // Habilidades matemáticas (10)
    { question: "Quanto é 15% de 200?", questionType: "math", options: JSON.stringify(["20", "25", "30", "35"]), correctAnswer: "30", difficulty: 1, language: "pt" },
    { question: "Se x + 5 = 12, qual é o valor de x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "pt" },
    { question: "Uma camisa custa R$40 após um desconto de 20%. Qual era o preço original?", questionType: "math", options: JSON.stringify(["R$45", "R$48", "R$50", "R$55"]), correctAnswer: "R$50", difficulty: 2, language: "pt" },
    { question: "Qual é a média de 10, 20 e 30?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "pt" },
    { question: "Se 3x = 21, qual é o valor de x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1, language: "pt" },
    { question: "Quanto é 25% de 80?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1, language: "pt" },
    { question: "Um retângulo tem comprimento 8 e largura 5. Qual é sua área?", questionType: "math", options: JSON.stringify(["30", "35", "40", "45"]), correctAnswer: "40", difficulty: 1, language: "pt" },
    { question: "Se y - 8 = 15, qual é o valor de y?", questionType: "math", options: JSON.stringify(["20", "21", "22", "23"]), correctAnswer: "23", difficulty: 1, language: "pt" },
    { question: "Quanto é 1/4 de 100?", questionType: "math", options: JSON.stringify(["20", "25", "30", "40"]), correctAnswer: "25", difficulty: 1, language: "pt" },
    { question: "Um carro percorre 60 milhas em 2 horas. Qual é sua velocidade média?", questionType: "math", options: JSON.stringify(["25 mph", "30 mph", "35 mph", "40 mph"]), correctAnswer: "30 mph", difficulty: 2, language: "pt" },
    // Raciocínio verbal (10)
    { question: "Escolha a palavra que é mais oposta a DIFÍCIL:", questionType: "verbal", options: JSON.stringify(["Duro", "Simples", "Complexo", "Desafiador"]), correctAnswer: "Simples", difficulty: 1, language: "pt" },
    { question: "Qual palavra não pertence ao grupo: Maçã, Banana, Cenoura, Laranja", questionType: "verbal", options: JSON.stringify(["Maçã", "Banana", "Cenoura", "Laranja"]), correctAnswer: "Cenoura", difficulty: 1, language: "pt" },
    { question: "Escolha o sinônimo de FELIZ:", questionType: "verbal", options: JSON.stringify(["Triste", "Alegre", "Irritado", "Cansado"]), correctAnswer: "Alegre", difficulty: 1, language: "pt" },
    { question: "Complete a analogia: Quente está para Frio como Dia está para ?", questionType: "verbal", options: JSON.stringify(["Luz", "Noite", "Sol", "Lua"]), correctAnswer: "Noite", difficulty: 1, language: "pt" },
    { question: "Qual palavra é mais semelhante a CORAJOSO:", questionType: "verbal", options: JSON.stringify(["Medroso", "Valente", "Fraco", "Tímido"]), correctAnswer: "Valente", difficulty: 1, language: "pt" },
    { question: "Complete: Gato está para Miar como Cachorro está para ?", questionType: "verbal", options: JSON.stringify(["Ronronar", "Latir", "Piar", "Rugir"]), correctAnswer: "Latir", difficulty: 1, language: "pt" },
    { question: "Escolha o oposto de ANTIGO:", questionType: "verbal", options: JSON.stringify(["Velho", "Moderno", "Histórico", "Tradicional"]), correctAnswer: "Moderno", difficulty: 1, language: "pt" },
    { question: "O que não pertence ao grupo: Cadeira, Mesa, Escrivaninha, Maçã", questionType: "verbal", options: JSON.stringify(["Cadeira", "Mesa", "Escrivaninha", "Maçã"]), correctAnswer: "Maçã", difficulty: 1, language: "pt" },
    { question: "Complete a analogia: Peixe está para Água como Pássaro está para ?", questionType: "verbal", options: JSON.stringify(["Ninho", "Ar", "Árvore", "Céu"]), correctAnswer: "Ar", difficulty: 2, language: "pt" },
    { question: "Escolha o sinônimo de DIFÍCIL:", questionType: "verbal", options: JSON.stringify(["Fácil", "Duro", "Simples", "Claro"]), correctAnswer: "Duro", difficulty: 1, language: "pt" },
    // Raciocínio espacial (10)
    { question: "Quantas faces tem um cubo?", questionType: "spatial", options: JSON.stringify(["4", "6", "8", "12"]), correctAnswer: "6", difficulty: 1, language: "pt" },
    { question: "Se você girar um quadrado 90 graus, que forma você obtém?", questionType: "spatial", options: JSON.stringify(["Retângulo", "Quadrado", "Triângulo", "Círculo"]), correctAnswer: "Quadrado", difficulty: 1, language: "pt" },
    { question: "Quantos lados tem um pentágono?", questionType: "spatial", options: JSON.stringify(["4", "5", "6", "7"]), correctAnswer: "5", difficulty: 1, language: "pt" },
    { question: "Qual direção é oposta ao Norte?", questionType: "spatial", options: JSON.stringify(["Leste", "Oeste", "Sul", "Nordeste"]), correctAnswer: "Sul", difficulty: 1, language: "pt" },
    { question: "Quantos cantos tem um triângulo?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "3", difficulty: 1, language: "pt" },
    { question: "Se você dobrar um quadrado ao meio, que formas você pode fazer?", questionType: "spatial", options: JSON.stringify(["Círculo", "Retângulo", "Triângulo", "Pentágono"]), correctAnswer: "Retângulo", difficulty: 2, language: "pt" },
    { question: "Quantas arestas tem um cubo?", questionType: "spatial", options: JSON.stringify(["6", "8", "10", "12"]), correctAnswer: "12", difficulty: 2, language: "pt" },
    { question: "Qual forma 3D tem apenas uma face?", questionType: "spatial", options: JSON.stringify(["Cubo", "Esfera", "Cone", "Cilindro"]), correctAnswer: "Esfera", difficulty: 2, language: "pt" },
    { question: "Quantos ângulos retos há em um quadrado?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "4", difficulty: 1, language: "pt" },
    { question: "Se você olhar para um relógio por trás, em que direção os ponteiros se movem?", questionType: "spatial", options: JSON.stringify(["No sentido horário", "No sentido anti-horário", "Para cima", "Para baixo"]), correctAnswer: "No sentido anti-horário", difficulty: 3, language: "pt" },
];
export async function seedIQQuestionsMultilingual() {
    console.log("🧠 Starting multilingual IQ questions seeding...");
    let questionsCreated = 0;
    let questionsSkipped = 0;
    for (const questionData of iqQuestionsMultilingual) {
        // Check if question already exists
        const existing = await db
            .select()
            .from(iqQuestions)
            .where(eq(iqQuestions.question, questionData.question))
            .limit(1);
        if (existing.length > 0) {
            questionsSkipped++;
            continue;
        }
        await db.insert(iqQuestions).values(questionData);
        questionsCreated++;
    }
    console.log(`✅ Created ${questionsCreated} IQ questions`);
    console.log(`⏭️  Skipped ${questionsSkipped} existing questions`);
    console.log(`📊 Total questions in database: ${questionsCreated + questionsSkipped}`);
    return questionsCreated;
}
// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    seedIQQuestionsMultilingual().catch(console.error).finally(() => process.exit(0));
}
//# sourceMappingURL=seed-iq-questions-multilingual.js.map