import { db } from "./db";
import { courses, lessons } from "@shared/schema";
import { eq, and } from "drizzle-orm";
// Course data for all 4 languages
const courseData = [
    // ==========================================
    // Course 1: NUTRITION - ENGLISH
    // ==========================================
    {
        title: "Nutrition for Brain Health",
        description: "Learn how proper nutrition can boost your cognitive function and mental clarity",
        category: "Nutrition",
        icon: "apple",
        color: "text-green-600",
        language: "en",
        orderIndex: 1,
        lessons: [
            {
                title: "Brain-Boosting Foods",
                content: `## Overview
Your brain is an incredible organ that requires proper nutrition to function at its best. Just like a car needs high-quality fuel to run smoothly, your brain needs specific nutrients to maintain sharp thinking, clear memory, and good focus.

## The Power Foods for Your Brain

### Fatty Fish
Salmon, mackerel, and sardines are rich in omega-3 fatty acids, which are essential building blocks for brain cells. Research shows that people who eat fish regularly have more grey matter in their brains—the tissue that processes information and memories.

### Berries
Blueberries, strawberries, and blackberries are packed with antioxidants that help protect your brain from damage. They've been shown to improve communication between brain cells and may delay brain aging by up to 2.5 years.

### Nuts and Seeds
Walnuts, almonds, and pumpkin seeds provide vitamin E, which protects brain cells from oxidative stress. Just a handful each day can make a real difference in maintaining cognitive function as you age.

### Leafy Greens
Spinach, kale, and collard greens are loaded with vitamins K, lutein, folate, and beta carotene. Studies suggest that eating one serving of leafy greens daily can slow cognitive decline equivalent to being 11 years younger!

## Key Takeaways
• Eat fatty fish 2-3 times per week for omega-3s
• Include a variety of colorful berries in your daily diet
• Snack on a small handful of nuts each day
• Add leafy greens to at least one meal daily
• These foods work together to protect and nourish your brain

## Your Action Step
This week, try adding one brain-boosting food to each meal. Start simple—berries with breakfast, a leafy green salad at lunch, and fish or nuts at dinner.

**Reading time: 3 minutes**`,
                videoUrl: "https://www.youtube.com/watch?v=sTSilOy_GW0",
                orderIndex: 1
            },
            {
                title: "The Mediterranean Diet",
                content: `## Overview
The Mediterranean diet isn't just a way of eating—it's a lifestyle that has protected brain health for centuries. This eating pattern, inspired by the traditional foods of Greece, Italy, and Spain, is one of the most researched and recommended diets for cognitive wellness.

## What Makes It Special?

### The Foundation
The Mediterranean diet focuses on whole, minimally processed foods. Think of it as eating the way your grandparents did—simple, fresh, and prepared with care. The foundation includes:

**Abundant plant foods**: Fruits, vegetables, whole grains, legumes, nuts, and seeds make up the bulk of each meal.

**Healthy fats**: Olive oil is the primary fat source, replacing butter and other saturated fats. It's rich in monounsaturated fats that support brain health.

**Moderate fish and poultry**: These provide high-quality protein and essential nutrients without the drawbacks of heavy red meat consumption.

**Limited red meat and sweets**: Occasional treats rather than daily staples.

## The Brain Benefits

Research has shown remarkable results:
• 35% lower risk of cognitive decline in older adults who follow this diet
• Better memory and thinking skills compared to low-fat diets
• Reduced risk of Alzheimer's disease by up to 40%
• Slower brain aging and better preservation of brain volume

The secret lies in the combination of anti-inflammatory foods, antioxidants, and healthy fats that work together to protect your brain cells from damage.

## Key Takeaways
• Focus on plants: vegetables, fruits, whole grains, and legumes
• Use olive oil as your main cooking fat
• Eat fish twice a week
• Choose whole grains over refined grains
• Limit red meat to a few times per month
• Enjoy meals with family and friends

## Your Action Step
This week, make one Mediterranean-style meal. Try a Greek salad with olive oil, whole grain bread, and grilled fish. Notice how satisfying and delicious brain-healthy eating can be!

**Reading time: 4 minutes**`,
                videoUrl: "https://www.youtube.com/watch?v=tGSfmnRDUGw",
                orderIndex: 2
            },
            {
                title: "Hydration and Mental Performance",
                content: `## Overview
Water makes up about 75% of your brain's weight, and even mild dehydration can significantly affect how well you think and remember. Staying properly hydrated is one of the simplest yet most powerful ways to support your cognitive performance every single day.

## How Dehydration Affects Your Brain

When you don't drink enough water, several things happen in your brain:

### Reduced Concentration
Your brain has to work harder to perform the same tasks, leading to mental fatigue and difficulty focusing. Studies show that just 2% dehydration can impair attention and short-term memory.

### Slower Thinking
Dehydration reduces blood flow to the brain, slowing down the delivery of oxygen and nutrients your brain cells need. This can make you feel mentally sluggish and slow to respond.

### Mood Changes
Not drinking enough water can affect neurotransmitter production, leading to increased feelings of anxiety, irritability, and confusion.

### Memory Problems
Research shows that dehydrated individuals perform worse on memory tasks and have trouble recalling information.

## How Much Water Do You Need?

The general guideline is to drink 8 glasses (about 2 liters) of water per day, but your individual needs may vary based on:
• Your activity level
• The climate where you live
• Your overall health
• Medications you may take

A good rule of thumb: If you feel thirsty, you're already mildly dehydrated. Aim to drink water regularly throughout the day, not just when you're thirsty.

## Signs You Need More Water
• Feeling tired or sluggish
• Difficulty concentrating
• Headaches
• Dry mouth
• Dark yellow urine

## Key Takeaways
• Your brain needs water to function properly
• Even mild dehydration affects thinking and memory
• Drink water throughout the day, not just when thirsty
• Aim for 8 glasses daily, adjusting for your needs
• Morning hydration is especially important after sleep

## Your Action Step
Start each morning with a full glass of water before your first cup of coffee or tea. Keep a water bottle near you throughout the day as a visual reminder to drink regularly.

**Reading time: 3 minutes**`,
                orderIndex: 3
            },
            {
                title: "Antioxidants and Brain Protection",
                content: `## Overview
Every day, your brain faces attacks from harmful molecules called free radicals. These unstable molecules can damage brain cells, contributing to memory loss and cognitive decline. Fortunately, nature provides powerful defenders called antioxidants that neutralize these threats and keep your brain healthy.

## Understanding Free Radicals and Oxidative Stress

Think of free radicals like rust on metal. Just as rust gradually damages metal, free radicals can damage your brain cells over time. This process, called oxidative stress, is a normal part of aging but can be accelerated by stress, pollution, poor diet, and lack of sleep.

## Your Antioxidant Army

### Colorful Fruits and Vegetables
The vibrant colors in produce come from antioxidant compounds:

**Red and Purple**: Berries, red cabbage, and beets contain anthocyanins that protect brain cells and improve memory.

**Orange and Yellow**: Carrots, sweet potatoes, and oranges provide beta-carotene and vitamin C, powerful brain protectors.

**Green**: Leafy greens like spinach and kale offer lutein and vitamin K, which support cognitive function.

### The Rainbow Approach
Eating a variety of colors ensures you get different types of antioxidants working together. This combination is more powerful than any single antioxidant alone.

## Top Antioxidant-Rich Foods for Your Brain
• Blueberries: The absolute champion for brain health
• Dark chocolate (70% cocoa or higher): Rich in flavonoids
• Pecans and walnuts: Packed with vitamin E
• Artichokes: One of the highest antioxidant vegetables
• Kidney beans: Great plant-based antioxidant source
• Green tea: Contains catechins that protect brain cells

## How Antioxidants Help Your Brain
• Reduce inflammation that can damage neurons
• Improve blood flow to the brain
• Protect cell membranes from damage
• Support the growth of new brain cells
• Enhance communication between neurons

## Key Takeaways
• Eat a rainbow of colorful fruits and vegetables daily
• Aim for at least 5 different colors each day
• Fresh, frozen, and dried fruits all provide antioxidants
• Dark chocolate can be a healthy brain-boosting treat
• Green tea is an excellent daily beverage choice

## Your Action Step
This week, challenge yourself to eat fruits or vegetables of at least 5 different colors each day. Take a photo of your colorful plate to track your progress!

**Reading time: 4 minutes**`,
                orderIndex: 4
            },
            {
                title: "Vitamins for Cognitive Function",
                content: `## Overview
Certain vitamins play crucial roles in maintaining and protecting your brain health. Understanding which vitamins your brain needs and how to get them from food can help you stay mentally sharp and protect against cognitive decline.

## The Essential Brain Vitamins

### Vitamin B12: The Energy Vitamin
B12 is essential for creating the protective coating around your nerve cells. Low B12 levels are linked to memory loss, confusion, and even brain shrinkage in older adults.

**Best food sources:**
• Fatty fish (salmon, trout, tuna)
• Eggs
• Dairy products (milk, yogurt, cheese)
• Fortified cereals and plant milks

**Important note:** Many older adults have difficulty absorbing B12 from food, so talk to your doctor about whether you might need a supplement.

### Vitamin D: The Sunshine Vitamin
Often called the "sunshine vitamin" because your skin makes it when exposed to sunlight, vitamin D helps protect brain cells and supports memory and mood.

**Best sources:**
• Sunlight exposure (15-20 minutes daily)
• Fatty fish (especially salmon and mackerel)
• Egg yolks
• Fortified milk and orange juice
• Mushrooms exposed to UV light

### Vitamin E: The Protector
This powerful antioxidant protects brain cells from oxidative damage and may slow cognitive decline. Studies show that adequate vitamin E intake is linked to better cognitive performance as we age.

**Best food sources:**
• Nuts (especially almonds and hazelnuts)
• Seeds (sunflower seeds)
• Spinach and other leafy greens
• Avocados
• Vegetable oils (sunflower, safflower)

### B Complex Vitamins
Folate (B9), B6, and other B vitamins work together to support brain health by controlling levels of homocysteine, a compound linked to brain damage when elevated.

**Best sources:**
• Leafy green vegetables
• Legumes (beans, lentils)
• Whole grains
• Citrus fruits
• Fortified cereals

## How Much Do You Need?

Most people can get adequate vitamins from a varied, balanced diet. However, some groups may need supplements:
• Adults over 50 (especially for B12)
• People with limited sun exposure (for vitamin D)
• Those on restricted diets
• Individuals with absorption issues

Always consult your doctor before starting any supplement regimen.

## Key Takeaways
• B12 protects nerve cells and prevents brain shrinkage
• Vitamin D supports memory and mood
• Vitamin E protects brain cells from damage
• B complex vitamins work together for brain health
• Food sources are generally better than supplements
• Check with your doctor about your vitamin status

## Your Action Step
Review your diet this week and identify which vitamin-rich foods you're already eating. Add one new food source for each brain vitamin to increase your variety.

**Reading time: 4 minutes**`,
                videoUrl: "https://www.youtube.com/watch?v=16rUMBX2EXE",
                orderIndex: 5
            },
            {
                title: "Reducing Processed Foods",
                content: "Understand how processed foods and added sugars can negatively impact cognitive function. Learn strategies to eat more whole foods.",
                orderIndex: 6
            },
            {
                title: "Meal Timing and Brain Energy",
                content: "Learn how meal timing affects your brain's energy levels throughout the day. Discover the best eating schedule for mental performance.",
                orderIndex: 7
            },
            {
                title: "Healthy Fats for Your Brain",
                content: "Explore the importance of healthy fats like omega-3s for brain structure and function. Learn which foods provide the best sources.",
                orderIndex: 8
            },
            {
                title: "Creating a Brain-Healthy Meal Plan",
                content: "Put it all together with a practical meal planning guide. Learn to create delicious, brain-healthy meals for the week.",
                orderIndex: 9
            },
            {
                title: "Supplements: What Works?",
                content: "Get evidence-based information about supplements for brain health. Learn which ones are worth considering and which to avoid.",
                orderIndex: 10
            }
        ]
    },
    // Course 1: NUTRITION - GERMAN
    {
        title: "Ernährung für Gehirngesundheit",
        description: "Erfahren Sie, wie richtige Ernährung Ihre kognitive Funktion und geistige Klarheit verbessern kann",
        category: "Ernährung",
        icon: "apple",
        color: "text-green-600",
        language: "de",
        orderIndex: 1,
        lessons: [
            {
                title: "Gehirnfördernde Lebensmittel",
                content: `## Überblick
Ihr Gehirn ist ein erstaunliches Organ, das die richtige Ernährung braucht, um optimal zu funktionieren. Genau wie ein Auto hochwertigen Kraftstoff benötigt, um reibungslos zu laufen, braucht Ihr Gehirn spezifische Nährstoffe, um scharfes Denken, klares Gedächtnis und gute Konzentration aufrechtzuerhalten.

## Die Kraftnahrungsmittel für Ihr Gehirn

### Fettreicher Fisch
Lachs, Makrele und Sardinen sind reich an Omega-3-Fettsäuren, die essenzielle Bausteine für Gehirnzellen sind. Forschungen zeigen, dass Menschen, die regelmäßig Fisch essen, mehr graue Substanz in ihrem Gehirn haben – das Gewebe, das Informationen und Erinnerungen verarbeitet.

### Beeren
Heidelbeeren, Erdbeeren und Brombeeren sind vollgepackt mit Antioxidantien, die Ihr Gehirn vor Schäden schützen. Es wurde gezeigt, dass sie die Kommunikation zwischen Gehirnzellen verbessern und das Altern des Gehirns um bis zu 2,5 Jahre verzögern können.

### Nüsse und Samen
Walnüsse, Mandeln und Kürbiskerne liefern Vitamin E, das Gehirnzellen vor oxidativem Stress schützt. Nur eine Handvoll pro Tag kann einen echten Unterschied bei der Aufrechterhaltung der kognitiven Funktion im Alter machen.

### Blattgemüse
Spinat, Grünkohl und Mangold sind voller Vitamine K, Lutein, Folsäure und Beta-Carotin. Studien deuten darauf hin, dass der tägliche Verzehr einer Portion Blattgemüse den kognitiven Abbau verlangsamen kann, was einem um 11 Jahre jüngeren Gehirn entspricht!

## Wichtige Erkenntnisse
• Essen Sie 2-3 Mal pro Woche fettreichen Fisch für Omega-3-Fettsäuren
• Nehmen Sie täglich eine Vielzahl bunter Beeren zu sich
• Snacken Sie täglich eine kleine Handvoll Nüsse
• Fügen Sie mindestens einer Mahlzeit täglich Blattgemüse hinzu
• Diese Lebensmittel arbeiten zusammen, um Ihr Gehirn zu schützen und zu nähren

## Ihr Aktionsschritt
Versuchen Sie diese Woche, jeder Mahlzeit ein gehirnförderndes Lebensmittel hinzuzufügen. Fangen Sie einfach an – Beeren zum Frühstück, einen Blattgemüsesalat zum Mittagessen und Fisch oder Nüsse zum Abendessen.

**Lesezeit: 3 Minuten**`,
                videoUrl: "https://www.youtube.com/watch?v=sTSilOy_GW0",
                orderIndex: 1
            },
            {
                title: "Die Mittelmeerdiät",
                content: `## Überblick
Die Mittelmeerdiät ist nicht nur eine Ernährungsweise – sie ist ein Lebensstil, der die Gehirngesundheit seit Jahrhunderten schützt. Dieses Ernährungsmuster, inspiriert von den traditionellen Lebensmitteln Griechenlands, Italiens und Spaniens, ist eine der am besten erforschten und empfohlenen Diäten für kognitives Wohlbefinden.

## Was macht sie besonders?

### Die Grundlage
Die Mittelmeerdiät konzentriert sich auf vollwertige, minimal verarbeitete Lebensmittel. Denken Sie daran, so zu essen wie Ihre Großeltern – einfach, frisch und mit Sorgfalt zubereitet. Die Grundlage umfasst:

**Reichlich pflanzliche Lebensmittel**: Obst, Gemüse, Vollkornprodukte, Hülsenfrüchte, Nüsse und Samen bilden den Großteil jeder Mahlzeit.

**Gesunde Fette**: Olivenöl ist die Hauptfettquelle und ersetzt Butter und andere gesättigte Fette. Es ist reich an einfach ungesättigten Fetten, die die Gehirngesundheit unterstützen.

**Mäßig Fisch und Geflügel**: Diese liefern hochwertiges Protein und essentielle Nährstoffe ohne die Nachteile eines hohen Verzehrs von rotem Fleisch.

**Begrenzt rotes Fleisch und Süßigkeiten**: Gelegentliche Leckereien statt tägliche Grundnahrungsmittel.

## Die Vorteile für das Gehirn

Forschungen haben bemerkenswerte Ergebnisse gezeigt:
• 35% geringeres Risiko für kognitiven Abbau bei älteren Erwachsenen, die dieser Diät folgen
• Besseres Gedächtnis und Denkfähigkeiten im Vergleich zu fettarmen Diäten
• Reduziertes Risiko für Alzheimer-Krankheit um bis zu 40%
• Langsameres Altern des Gehirns und bessere Erhaltung des Gehirnvolumens

Das Geheimnis liegt in der Kombination entzündungshemmender Lebensmittel, Antioxidantien und gesunder Fette, die zusammenwirken, um Ihre Gehirnzellen vor Schäden zu schützen.

## Wichtige Erkenntnisse
• Konzentrieren Sie sich auf Pflanzen: Gemüse, Obst, Vollkornprodukte und Hülsenfrüchte
• Verwenden Sie Olivenöl als Hauptfett zum Kochen
• Essen Sie zweimal pro Woche Fisch
• Wählen Sie Vollkornprodukte statt raffinierter Getreideprodukte
• Begrenzen Sie rotes Fleisch auf einige Male pro Monat
• Genießen Sie Mahlzeiten mit Familie und Freunden

## Ihr Aktionsschritt
Bereiten Sie diese Woche eine Mahlzeit im mediterranen Stil zu. Probieren Sie einen griechischen Salat mit Olivenöl, Vollkornbrot und gegrilltem Fisch. Bemerken Sie, wie befriedigend und köstlich gehirngesunde Ernährung sein kann!

**Lesezeit: 4 Minuten**`,
                videoUrl: "https://www.youtube.com/watch?v=tGSfmnRDUGw",
                orderIndex: 2
            },
            {
                title: "Hydratation und geistige Leistung",
                content: `## Überblick
Wasser macht etwa 75% des Gewichts Ihres Gehirns aus, und selbst leichte Dehydration kann erheblich beeinflussen, wie gut Sie denken und sich erinnern. Richtig hydratisiert zu bleiben ist eine der einfachsten und dennoch wirkungsvollsten Möglichkeiten, Ihre kognitive Leistung jeden Tag zu unterstützen.

## Wie Dehydration Ihr Gehirn beeinflusst

Wenn Sie nicht genug Wasser trinken, passieren mehrere Dinge in Ihrem Gehirn:

### Reduzierte Konzentration
Ihr Gehirn muss härter arbeiten, um dieselben Aufgaben zu erfüllen, was zu geistiger Müdigkeit und Konzentrationsschwierigkeiten führt. Studien zeigen, dass bereits 2% Dehydration Aufmerksamkeit und Kurzzeitgedächtnis beeinträchtigen können.

### Langsameres Denken
Dehydration verringert die Durchblutung des Gehirns und verlangsamt die Zufuhr von Sauerstoff und Nährstoffen, die Ihre Gehirnzellen benötigen. Dies kann dazu führen, dass Sie sich geistig träge fühlen und langsam reagieren.

### Stimmungsveränderungen
Nicht genug Wasser zu trinken kann die Produktion von Neurotransmittern beeinflussen und zu erhöhten Gefühlen von Angst, Reizbarkeit und Verwirrung führen.

### Gedächtnisprobleme
Forschungen zeigen, dass dehydrierte Personen bei Gedächtnisaufgaben schlechter abschneiden und Schwierigkeiten haben, sich an Informationen zu erinnern.

## Wie viel Wasser brauchen Sie?

Die allgemeine Richtlinie ist, 8 Gläser (etwa 2 Liter) Wasser pro Tag zu trinken, aber Ihr individueller Bedarf kann variieren basierend auf:
• Ihrem Aktivitätsniveau
• Dem Klima, in dem Sie leben
• Ihrer allgemeinen Gesundheit
• Medikamenten, die Sie einnehmen

Eine gute Faustregel: Wenn Sie Durst verspüren, sind Sie bereits leicht dehydriert. Versuchen Sie, über den Tag verteilt regelmäßig Wasser zu trinken, nicht nur wenn Sie durstig sind.

## Anzeichen, dass Sie mehr Wasser brauchen
• Müde oder träge fühlen
• Konzentrationsschwierigkeiten
• Kopfschmerzen
• Trockener Mund
• Dunkelgelber Urin

## Wichtige Erkenntnisse
• Ihr Gehirn braucht Wasser, um richtig zu funktionieren
• Selbst leichte Dehydration beeinflusst Denken und Gedächtnis
• Trinken Sie über den Tag verteilt Wasser, nicht nur wenn Sie durstig sind
• Streben Sie täglich 8 Gläser an und passen Sie nach Bedarf an
• Morgendliche Hydration ist besonders wichtig nach dem Schlaf

## Ihr Aktionsschritt
Beginnen Sie jeden Morgen mit einem vollen Glas Wasser, bevor Sie Ihre erste Tasse Kaffee oder Tee trinken. Halten Sie eine Wasserflasche in Ihrer Nähe als visuelle Erinnerung, regelmäßig zu trinken.

**Lesezeit: 3 Minuten**`,
                orderIndex: 3
            },
            {
                title: "Antioxidantien und Gehirnschutz",
                content: `## Überblick
Jeden Tag ist Ihr Gehirn Angriffen von schädlichen Molekülen ausgesetzt, die freie Radikale genannt werden. Diese instabilen Moleküle können Gehirnzellen schädigen und zu Gedächtnisverlust und kognitivem Abbau beitragen. Glücklicherweise liefert die Natur mächtige Verteidiger namens Antioxidantien, die diese Bedrohungen neutralisieren und Ihr Gehirn gesund halten.

## Freie Radikale und oxidativer Stress verstehen

Denken Sie an freie Radikale wie Rost auf Metall. Genauso wie Rost allmählich Metall beschädigt, können freie Radikale Ihre Gehirnzellen im Laufe der Zeit schädigen. Dieser Prozess, genannt oxidativer Stress, ist ein normaler Teil des Alterns, kann aber durch Stress, Umweltverschmutzung, schlechte Ernährung und Schlafmangel beschleunigt werden.

## Ihre Antioxidantien-Armee

### Buntes Obst und Gemüse
Die lebendigen Farben in Produkten kommen von antioxidativen Verbindungen:

**Rot und Lila**: Beeren, Rotkohl und Rote Bete enthalten Anthocyane, die Gehirnzellen schützen und das Gedächtnis verbessern.

**Orange und Gelb**: Karotten, Süßkartoffeln und Orangen liefern Beta-Carotin und Vitamin C, mächtige Gehirnschützer.

**Grün**: Blattgemüse wie Spinat und Grünkohl bieten Lutein und Vitamin K, die die kognitive Funktion unterstützen.

### Der Regenbogen-Ansatz
Eine Vielfalt an Farben zu essen stellt sicher, dass Sie verschiedene Arten von Antioxidantien erhalten, die zusammenarbeiten. Diese Kombination ist mächtiger als jedes einzelne Antioxidans allein.

## Top antioxidantienreiche Lebensmittel für Ihr Gehirn
• Heidelbeeren: Der absolute Champion für Gehirngesundheit
• Dunkle Schokolade (70% Kakao oder höher): Reich an Flavonoiden
• Pekannüsse und Walnüsse: Vollgepackt mit Vitamin E
• Artischocken: Eines der höchsten antioxidativen Gemüse
• Kidneybohnen: Großartige pflanzliche Antioxidantienquelle
• Grüner Tee: Enthält Catechine, die Gehirnzellen schützen

## Wie Antioxidantien Ihrem Gehirn helfen
• Reduzieren Entzündungen, die Neuronen schädigen können
• Verbessern die Durchblutung des Gehirns
• Schützen Zellmembranen vor Schäden
• Unterstützen das Wachstum neuer Gehirnzellen
• Verbessern die Kommunikation zwischen Neuronen

## Wichtige Erkenntnisse
• Essen Sie täglich einen Regenbogen aus buntem Obst und Gemüse
• Streben Sie täglich mindestens 5 verschiedene Farben an
• Frisches, gefrorenes und getrocknetes Obst liefern alle Antioxidantien
• Dunkle Schokolade kann eine gesunde gehirnfördernde Leckerei sein
• Grüner Tee ist eine ausgezeichnete tägliche Getränkewahl

## Ihr Aktionsschritt
Fordern Sie sich diese Woche heraus, Obst oder Gemüse in mindestens 5 verschiedenen Farben jeden Tag zu essen. Machen Sie ein Foto Ihres bunten Tellers, um Ihren Fortschritt zu verfolgen!

**Lesezeit: 4 Minuten**`,
                orderIndex: 4
            },
            {
                title: "Vitamine für kognitive Funktion",
                content: `## Überblick
Bestimmte Vitamine spielen entscheidende Rollen bei der Erhaltung und dem Schutz Ihrer Gehirngesundheit. Zu verstehen, welche Vitamine Ihr Gehirn braucht und wie Sie sie aus Lebensmitteln erhalten können, hilft Ihnen, geistig scharf zu bleiben und sich vor kognitivem Abbau zu schützen.

## Die essentiellen Gehirnvitamine

### Vitamin B12: Das Energie-Vitamin
B12 ist essentiell für die Schaffung der Schutzschicht um Ihre Nervenzellen. Niedrige B12-Werte sind mit Gedächtnisverlust, Verwirrung und sogar Gehirnschrumpfung bei älteren Erwachsenen verbunden.

**Beste Nahrungsquellen:**
• Fettreicher Fisch (Lachs, Forelle, Thunfisch)
• Eier
• Milchprodukte (Milch, Joghurt, Käse)
• Angereicherte Getreideprodukte und Pflanzenmilch

**Wichtiger Hinweis:** Viele ältere Erwachsene haben Schwierigkeiten, B12 aus der Nahrung aufzunehmen, sprechen Sie daher mit Ihrem Arzt darüber, ob Sie möglicherweise ein Nahrungsergänzungsmittel benötigen.

### Vitamin D: Das Sonnenschein-Vitamin
Oft als "Sonnenschein-Vitamin" bezeichnet, weil Ihre Haut es bei Sonneneinstrahlung produziert, hilft Vitamin D, Gehirnzellen zu schützen und unterstützt Gedächtnis und Stimmung.

**Beste Quellen:**
• Sonneneinstrahlung (15-20 Minuten täglich)
• Fettreicher Fisch (besonders Lachs und Makrele)
• Eigelb
• Angereicherte Milch und Orangensaft
• UV-bestrahlte Pilze

### Vitamin E: Der Beschützer
Dieses starke Antioxidans schützt Gehirnzellen vor oxidativen Schäden und kann den kognitiven Abbau verlangsamen. Studien zeigen, dass eine ausreichende Vitamin-E-Zufuhr mit besserer kognitiver Leistung im Alter verbunden ist.

**Beste Nahrungsquellen:**
• Nüsse (besonders Mandeln und Haselnüsse)
• Samen (Sonnenblumenkerne)
• Spinat und anderes Blattgemüse
• Avocados
• Pflanzenöle (Sonnenblumen-, Distelöl)

### B-Komplex-Vitamine
Folsäure (B9), B6 und andere B-Vitamine arbeiten zusammen, um die Gehirngesundheit zu unterstützen, indem sie den Homocysteinspiegel kontrollieren, eine Verbindung, die bei Erhöhung mit Gehirnschäden verbunden ist.

**Beste Quellen:**
• Blattgrünes Gemüse
• Hülsenfrüchte (Bohnen, Linsen)
• Vollkornprodukte
• Zitrusfrüchte
• Angereicherte Getreideprodukte

## Wie viel brauchen Sie?

Die meisten Menschen können ausreichend Vitamine aus einer abwechslungsreichen, ausgewogenen Ernährung erhalten. Einige Gruppen benötigen jedoch möglicherweise Nahrungsergänzungsmittel:
• Erwachsene über 50 (besonders für B12)
• Menschen mit begrenzter Sonneneinstrahlung (für Vitamin D)
• Personen mit eingeschränkten Diäten
• Personen mit Absorptionsproblemen

Konsultieren Sie immer Ihren Arzt, bevor Sie ein Nahrungsergänzungsprogramm beginnen.

## Wichtige Erkenntnisse
• B12 schützt Nervenzellen und verhindert Gehirnschrumpfung
• Vitamin D unterstützt Gedächtnis und Stimmung
• Vitamin E schützt Gehirnzellen vor Schäden
• B-Komplex-Vitamine arbeiten zusammen für Gehirngesundheit
• Nahrungsquellen sind im Allgemeinen besser als Nahrungsergänzungsmittel
• Überprüfen Sie Ihren Vitaminstatus mit Ihrem Arzt

## Ihr Aktionsschritt
Überprüfen Sie diese Woche Ihre Ernährung und identifizieren Sie, welche vitaminreichen Lebensmittel Sie bereits essen. Fügen Sie für jedes Gehirnvitamin eine neue Nahrungsquelle hinzu, um Ihre Vielfalt zu erhöhen.

**Lesezeit: 4 Minuten**`,
                videoUrl: "https://www.youtube.com/watch?v=16rUMBX2EXE",
                orderIndex: 5
            },
            { title: "Reduzierung verarbeiteter Lebensmittel", content: "Verstehen Sie, wie verarbeitete Lebensmittel und Zusatz zucker die kognitive Funktion negativ beeinflussen können. Lernen Sie Strategien, mehr Vollwertkost zu essen.", orderIndex: 6 },
            { title: "Mahlzeitenplanung und Gehirnenergie", content: "Erfahren Sie, wie der Zeitpunkt der Mahlzeiten den Energielevel Ihres Gehirns im Laufe des Tages beeinflusst. Entdecken Sie den besten Essensplan für geistige Leistung.", orderIndex: 7 },
            { title: "Gesunde Fette für Ihr Gehirn", content: "Erforschen Sie die Bedeutung gesunder Fette wie Omega-3-Fettsäuren für Gehirnstruktur und -funktion. Erfahren Sie, welche Lebensmittel die besten Quellen bieten.", orderIndex: 8 },
            { title: "Einen gehirngesunden Essensplan erstellen", content: "Setzen Sie alles zusammen mit einem praktischen Leitfaden zur Essensplanung. Lernen Sie, köstliche, gehirngesunde Mahlzeiten für die Woche zu erstellen.", orderIndex: 9 },
            { title: "Nahrungsergänzungsmittel: Was wirkt?", content: "Erhalten Sie evidenzbasierte Informationen über Nahrungsergänzungsmittel für die Gehirngesundheit. Erfahren Sie, welche es wert sind in Betracht gezogen zu werden und welche zu vermeiden sind.", orderIndex: 10 }
        ]
    },
    // Course 1: NUTRITION - FRENCH
    {
        title: "Nutrition pour la Santé du Cerveau",
        description: "Apprenez comment une bonne nutrition peut améliorer votre fonction cognitive et votre clarté mentale",
        category: "Nutrition",
        icon: "apple",
        color: "text-green-600",
        language: "fr",
        orderIndex: 1,
        lessons: [
            {
                title: "Aliments stimulants pour le cerveau",
                content: `## Aperçu
Votre cerveau est un organe incroyable qui nécessite une nutrition appropriée pour fonctionner au mieux. Tout comme une voiture a besoin de carburant de haute qualité pour fonctionner correctement, votre cerveau a besoin de nutriments spécifiques pour maintenir une pensée claire, une mémoire nette et une bonne concentration.

## Les super-aliments pour votre cerveau

### Poissons gras
Le saumon, le maquereau et les sardines sont riches en acides gras oméga-3, qui sont des éléments essentiels pour les cellules cérébrales. Les recherches montrent que les personnes qui mangent régulièrement du poisson ont plus de matière grise dans leur cerveau – le tissu qui traite les informations et les souvenirs.

### Baies
Les myrtilles, les fraises et les mûres sont remplies d'antioxydants qui aident à protéger votre cerveau contre les dommages. Il a été démontré qu'elles améliorent la communication entre les cellules cérébrales et peuvent retarder le vieillissement du cerveau jusqu'à 2,5 ans.

### Noix et graines
Les noix, les amandes et les graines de courge fournissent de la vitamine E, qui protège les cellules cérébrales du stress oxydatif. Une simple poignée chaque jour peut faire une réelle différence dans le maintien des fonctions cognitives avec l'âge.

### Légumes verts à feuilles
Les épinards, le chou frisé et les blettes sont chargés de vitamines K, lutéine, folate et bêta-carotène. Les études suggèrent que manger une portion de légumes verts à feuilles quotidiennement peut ralentir le déclin cognitif équivalent à avoir 11 ans de moins !

## Points clés
• Mangez du poisson gras 2-3 fois par semaine pour les oméga-3
• Incluez une variété de baies colorées dans votre alimentation quotidienne
• Grignotez une petite poignée de noix chaque jour
• Ajoutez des légumes verts à feuilles à au moins un repas par jour
• Ces aliments travaillent ensemble pour protéger et nourrir votre cerveau

## Votre étape d'action
Cette semaine, essayez d'ajouter un aliment stimulant pour le cerveau à chaque repas. Commencez simplement – des baies au petit-déjeuner, une salade de légumes verts au déjeuner, et du poisson ou des noix au dîner.

**Temps de lecture : 3 minutes**`,
                videoUrl: "https://www.youtube.com/watch?v=sTSilOy_GW0",
                orderIndex: 1
            },
            {
                title: "Le Régime Méditerranéen",
                content: `## Aperçu
Le régime méditerranéen n'est pas seulement une façon de manger – c'est un mode de vie qui protège la santé du cerveau depuis des siècles. Ce modèle alimentaire, inspiré des aliments traditionnels de la Grèce, de l'Italie et de l'Espagne, est l'un des régimes les plus étudiés et recommandés pour le bien-être cognitif.

## Qu'est-ce qui le rend spécial ?

### La base
Le régime méditerranéen se concentre sur des aliments entiers et peu transformés. Pensez à manger comme vos grands-parents – simple, frais et préparé avec soin. La base comprend :

**Aliments végétaux abondants** : Les fruits, légumes, céréales complètes, légumineuses, noix et graines constituent l'essentiel de chaque repas.

**Graisses saines** : L'huile d'olive est la principale source de matières grasses, remplaçant le beurre et autres graisses saturées. Elle est riche en graisses monoinsaturées qui soutiennent la santé cérébrale.

**Poisson et volaille modérés** : Ceux-ci fournissent des protéines de haute qualité et des nutriments essentiels sans les inconvénients d'une consommation élevée de viande rouge.

**Viande rouge et sucreries limitées** : Des gâteries occasionnelles plutôt que des aliments de base quotidiens.

## Les bienfaits pour le cerveau

Les recherches ont montré des résultats remarquables :
• 35% de risque réduit de déclin cognitif chez les adultes plus âgés qui suivent ce régime
• Meilleure mémoire et capacités de réflexion par rapport aux régimes faibles en gras
• Risque réduit de maladie d'Alzheimer jusqu'à 40%
• Vieillissement cérébral plus lent et meilleure préservation du volume cérébral

Le secret réside dans la combinaison d'aliments anti-inflammatoires, d'antioxydants et de graisses saines qui travaillent ensemble pour protéger vos cellules cérébrales contre les dommages.

## Points clés
• Concentrez-vous sur les plantes : légumes, fruits, céréales complètes et légumineuses
• Utilisez l'huile d'olive comme principale matière grasse pour la cuisson
• Mangez du poisson deux fois par semaine
• Choisissez des céréales complètes plutôt que des céréales raffinées
• Limitez la viande rouge à quelques fois par mois
• Savourez les repas en famille et entre amis

## Votre étape d'action
Cette semaine, préparez un repas de style méditerranéen. Essayez une salade grecque avec de l'huile d'olive, du pain complet et du poisson grillé. Remarquez à quel point une alimentation saine pour le cerveau peut être satisfaisante et délicieuse !

**Temps de lecture : 4 minutes**`,
                videoUrl: "https://www.youtube.com/watch?v=tGSfmnRDUGw",
                orderIndex: 2
            },
            {
                title: "Hydratation et Performance Mentale",
                content: `## Aperçu
L'eau représente environ 75% du poids de votre cerveau, et même une légère déshydratation peut affecter considérablement votre capacité à penser et à vous souvenir. Rester correctement hydraté est l'un des moyens les plus simples mais les plus puissants de soutenir vos performances cognitives chaque jour.

## Comment la déshydratation affecte votre cerveau

Lorsque vous ne buvez pas assez d'eau, plusieurs choses se passent dans votre cerveau :

### Concentration réduite
Votre cerveau doit travailler plus dur pour effectuer les mêmes tâches, ce qui entraîne une fatigue mentale et des difficultés de concentration. Les études montrent que seulement 2% de déshydratation peut altérer l'attention et la mémoire à court terme.

### Pensée plus lente
La déshydratation réduit le flux sanguin vers le cerveau, ralentissant la livraison d'oxygène et de nutriments dont vos cellules cérébrales ont besoin. Cela peut vous faire sentir mentalement léthargique et lent à réagir.

### Changements d'humeur
Ne pas boire assez d'eau peut affecter la production de neurotransmetteurs, entraînant une augmentation des sentiments d'anxiété, d'irritabilité et de confusion.

### Problèmes de mémoire
Les recherches montrent que les personnes déshydratées obtiennent de moins bons résultats aux tâches de mémoire et ont du mal à se souvenir des informations.

## De combien d'eau avez-vous besoin ?

La recommandation générale est de boire 8 verres (environ 2 litres) d'eau par jour, mais vos besoins individuels peuvent varier en fonction de :
• Votre niveau d'activité
• Le climat où vous vivez
• Votre état de santé général
• Les médicaments que vous prenez

Une bonne règle générale : si vous avez soif, vous êtes déjà légèrement déshydraté. Essayez de boire de l'eau régulièrement tout au long de la journée, pas seulement quand vous avez soif.

## Signes que vous avez besoin de plus d'eau
• Se sentir fatigué ou léthargique
• Difficulté à se concentrer
• Maux de tête
• Bouche sèche
• Urine jaune foncé

## Points clés
• Votre cerveau a besoin d'eau pour fonctionner correctement
• Même une légère déshydratation affecte la pensée et la mémoire
• Buvez de l'eau tout au long de la journée, pas seulement quand vous avez soif
• Visez 8 verres par jour, en ajustant selon vos besoins
• L'hydratation matinale est particulièrement importante après le sommeil

## Votre étape d'action
Commencez chaque matin avec un verre d'eau complet avant votre première tasse de café ou de thé. Gardez une bouteille d'eau près de vous tout au long de la journée comme rappel visuel de boire régulièrement.

**Temps de lecture : 3 minutes**`,
                orderIndex: 3
            },
            {
                title: "Antioxydants et Protection du Cerveau",
                content: `## Aperçu
Chaque jour, votre cerveau fait face à des attaques de molécules nocives appelées radicaux libres. Ces molécules instables peuvent endommager les cellules cérébrales, contribuant à la perte de mémoire et au déclin cognitif. Heureusement, la nature fournit de puissants défenseurs appelés antioxydants qui neutralisent ces menaces et maintiennent votre cerveau en bonne santé.

## Comprendre les radicaux libres et le stress oxydatif

Pensez aux radicaux libres comme à la rouille sur le métal. Tout comme la rouille endommage progressivement le métal, les radicaux libres peuvent endommager vos cellules cérébrales au fil du temps. Ce processus, appelé stress oxydatif, est une partie normale du vieillissement mais peut être accéléré par le stress, la pollution, une mauvaise alimentation et le manque de sommeil.

## Votre armée d'antioxydants

### Fruits et légumes colorés
Les couleurs vives des produits proviennent de composés antioxydants :

**Rouge et violet** : Les baies, le chou rouge et les betteraves contiennent des anthocyanes qui protègent les cellules cérébrales et améliorent la mémoire.

**Orange et jaune** : Les carottes, les patates douces et les oranges fournissent du bêta-carotène et de la vitamine C, de puissants protecteurs du cerveau.

**Vert** : Les légumes verts à feuilles comme les épinards et le chou frisé offrent de la lutéine et de la vitamine K, qui soutiennent la fonction cognitive.

### L'approche arc-en-ciel
Manger une variété de couleurs garantit que vous obtenez différents types d'antioxydants travaillant ensemble. Cette combinaison est plus puissante que n'importe quel antioxydant seul.

## Meilleurs aliments riches en antioxydants pour votre cerveau
• Myrtilles : Le champion absolu pour la santé du cerveau
• Chocolat noir (70% de cacao ou plus) : Riche en flavonoïdes
• Noix de pécan et noix : Remplies de vitamine E
• Artichauts : L'un des légumes les plus riches en antioxydants
• Haricots rouges : Excellente source d'antioxydants d'origine végétale
• Thé vert : Contient des catéchines qui protègent les cellules cérébrales

## Comment les antioxydants aident votre cerveau
• Réduisent l'inflammation qui peut endommager les neurones
• Améliorent le flux sanguin vers le cerveau
• Protègent les membranes cellulaires contre les dommages
• Soutiennent la croissance de nouvelles cellules cérébrales
• Améliorent la communication entre les neurones

## Points clés
• Mangez un arc-en-ciel de fruits et légumes colorés quotidiennement
• Visez au moins 5 couleurs différentes chaque jour
• Les fruits frais, congelés et séchés fournissent tous des antioxydants
• Le chocolat noir peut être une friandise saine stimulant le cerveau
• Le thé vert est un excellent choix de boisson quotidienne

## Votre étape d'action
Cette semaine, défiez-vous de manger des fruits ou légumes d'au moins 5 couleurs différentes chaque jour. Prenez une photo de votre assiette colorée pour suivre vos progrès !

**Temps de lecture : 4 minutes**`,
                orderIndex: 4
            },
            {
                title: "Vitamines pour la Fonction Cognitive",
                content: `## Aperçu
Certaines vitamines jouent des rôles cruciaux dans le maintien et la protection de votre santé cérébrale. Comprendre quelles vitamines votre cerveau a besoin et comment les obtenir à partir des aliments peut vous aider à rester mentalement vif et à vous protéger contre le déclin cognitif.

## Les vitamines cérébrales essentielles

### Vitamine B12 : La vitamine de l'énergie
La B12 est essentielle pour créer le revêtement protecteur autour de vos cellules nerveuses. De faibles niveaux de B12 sont liés à la perte de mémoire, à la confusion et même au rétrécissement du cerveau chez les adultes plus âgés.

**Meilleures sources alimentaires :**
• Poisson gras (saumon, truite, thon)
• Œufs
• Produits laitiers (lait, yaourt, fromage)
• Céréales et laits végétaux enrichis

**Note importante :** De nombreux adultes plus âgés ont des difficultés à absorber la B12 des aliments, alors parlez à votre médecin pour savoir si vous pourriez avoir besoin d'un supplément.

### Vitamine D : La vitamine du soleil
Souvent appelée "vitamine du soleil" parce que votre peau la fabrique lorsqu'elle est exposée au soleil, la vitamine D aide à protéger les cellules cérébrales et soutient la mémoire et l'humeur.

**Meilleures sources :**
• Exposition au soleil (15-20 minutes par jour)
• Poisson gras (surtout le saumon et le maquereau)
• Jaunes d'œufs
• Lait et jus d'orange enrichis
• Champignons exposés à la lumière UV

### Vitamine E : Le protecteur
Ce puissant antioxydant protège les cellules cérébrales des dommages oxydatifs et peut ralentir le déclin cognitif. Les études montrent qu'un apport adéquat en vitamine E est lié à de meilleures performances cognitives avec l'âge.

**Meilleures sources alimentaires :**
• Noix (surtout amandes et noisettes)
• Graines (graines de tournesol)
• Épinards et autres légumes verts à feuilles
• Avocats
• Huiles végétales (tournesol, carthame)

### Vitamines du complexe B
Le folate (B9), la B6 et d'autres vitamines B travaillent ensemble pour soutenir la santé du cerveau en contrôlant les niveaux d'homocystéine, un composé lié aux dommages cérébraux lorsqu'il est élevé.

**Meilleures sources :**
• Légumes verts à feuilles
• Légumineuses (haricots, lentilles)
• Céréales complètes
• Agrumes
• Céréales enrichies

## De combien avez-vous besoin ?

La plupart des gens peuvent obtenir des vitamines adéquates à partir d'une alimentation variée et équilibrée. Cependant, certains groupes peuvent avoir besoin de suppléments :
• Adultes de plus de 50 ans (surtout pour la B12)
• Personnes avec une exposition limitée au soleil (pour la vitamine D)
• Ceux avec des régimes restrictifs
• Personnes ayant des problèmes d'absorption

Consultez toujours votre médecin avant de commencer tout régime de suppléments.

## Points clés
• La B12 protège les cellules nerveuses et prévient le rétrécissement du cerveau
• La vitamine D soutient la mémoire et l'humeur
• La vitamine E protège les cellules cérébrales contre les dommages
• Les vitamines du complexe B travaillent ensemble pour la santé du cerveau
• Les sources alimentaires sont généralement meilleures que les suppléments
• Vérifiez votre statut vitaminique avec votre médecin

## Votre étape d'action
Passez en revue votre alimentation cette semaine et identifiez quels aliments riches en vitamines vous mangez déjà. Ajoutez une nouvelle source alimentaire pour chaque vitamine cérébrale pour augmenter votre variété.

**Temps de lecture : 4 minutes**`,
                videoUrl: "https://www.youtube.com/watch?v=16rUMBX2EXE",
                orderIndex: 5
            },
            { title: "Réduire les Aliments Transformés", content: "Comprenez comment les aliments transformés et les sucres ajoutés peuvent impacter négativement la fonction cognitive. Apprenez des stratégies pour manger plus d'aliments complets.", orderIndex: 6 },
            { title: "Timing des Repas et Énergie Cérébrale", content: "Apprenez comment le moment des repas affecte les niveaux d'énergie de votre cerveau tout au long de la journée. Découvrez le meilleur horaire alimentaire pour la performance mentale.", orderIndex: 7 },
            { title: "Graisses Saines pour Votre Cerveau", content: "Explorez l'importance des graisses saines comme les oméga-3 pour la structure et la fonction du cerveau. Apprenez quels aliments fournissent les meilleures sources.", orderIndex: 8 },
            { title: "Créer un Plan de Repas Sain pour le Cerveau", content: "Rassemblez tout avec un guide pratique de planification des repas. Apprenez à créer des repas délicieux et sains pour le cerveau pour la semaine.", orderIndex: 9 },
            { title: "Suppléments : Qu'est-ce qui Fonctionne ?", content: "Obtenez des informations basées sur des preuves concernant les suppléments pour la santé du cerveau. Apprenez lesquels valent la peine d'être considérés et lesquels éviter.", orderIndex: 10 }
        ]
    },
    // Course 1: NUTRITION - PORTUGUESE
    {
        title: "Nutrição para Saúde Cerebral",
        description: "Aprenda como a nutrição adequada pode melhorar sua função cognitiva e clareza mental",
        category: "Nutrição",
        icon: "apple",
        color: "text-green-600",
        language: "pt",
        orderIndex: 1,
        lessons: [
            {
                title: "Alimentos que Estimulam o Cérebro",
                content: `## Visão Geral
Seu cérebro é um órgão incrível que requer nutrição adequada para funcionar no seu melhor. Assim como um carro precisa de combustível de alta qualidade para funcionar bem, seu cérebro precisa de nutrientes específicos para manter o pensamento aguçado, memória clara e boa concentração.

## Os Super Alimentos para Seu Cérebro

### Peixes Gordurosos
Salmão, cavala e sardinhas são ricos em ácidos graxos ômega-3, que são blocos de construção essenciais para as células cerebrais. Pesquisas mostram que pessoas que comem peixe regularmente têm mais massa cinzenta em seus cérebros – o tecido que processa informações e memórias.

### Frutas Vermelhas
Mirtilos, morangos e amoras são repletos de antioxidantes que ajudam a proteger seu cérebro de danos. Foi demonstrado que eles melhoram a comunicação entre as células cerebrais e podem atrasar o envelhecimento do cérebro em até 2,5 anos.

### Nozes e Sementes
Nozes, amêndoas e sementes de abóbora fornecem vitamina E, que protege as células cerebrais do estresse oxidativo. Apenas um punhado por dia pode fazer uma diferença real na manutenção da função cognitiva à medida que você envelhece.

### Vegetais Folhosos
Espinafre, couve e acelga são carregados com vitaminas K, luteína, folato e beta-caroteno. Estudos sugerem que comer uma porção de vegetais folhosos diariamente pode retardar o declínio cognitivo equivalente a ter 11 anos a menos!

## Pontos-Chave
• Coma peixe gorduroso 2-3 vezes por semana para ômega-3
• Inclua uma variedade de frutas vermelhas coloridas em sua dieta diária
• Faça um lanche de um pequeno punhado de nozes todos os dias
• Adicione vegetais folhosos a pelo menos uma refeição por dia
• Esses alimentos trabalham juntos para proteger e nutrir seu cérebro

## Seu Passo de Ação
Esta semana, tente adicionar um alimento que estimula o cérebro a cada refeição. Comece simples – frutas vermelhas no café da manhã, uma salada de vegetais folhosos no almoço e peixe ou nozes no jantar.

**Tempo de leitura: 3 minutos**`,
                videoUrl: "https://www.youtube.com/watch?v=sTSilOy_GW0",
                orderIndex: 1
            },
            {
                title: "A Dieta Mediterrânea",
                content: `## Visão Geral
A dieta mediterrânea não é apenas uma forma de comer – é um estilo de vida que protege a saúde cerebral há séculos. Este padrão alimentar, inspirado nos alimentos tradicionais da Grécia, Itália e Espanha, é uma das dietas mais pesquisadas e recomendadas para o bem-estar cognitivo.

## O Que a Torna Especial?

### A Fundação
A dieta mediterrânea foca em alimentos integrais e minimamente processados. Pense em comer do jeito que seus avós comiam – simples, fresco e preparado com cuidado. A fundação inclui:

**Alimentos vegetais abundantes**: Frutas, vegetais, grãos integrais, leguminosas, nozes e sementes compõem a maior parte de cada refeição.

**Gorduras saudáveis**: O azeite de oliva é a principal fonte de gordura, substituindo a manteiga e outras gorduras saturadas. É rico em gorduras monoinsaturadas que apoiam a saúde cerebral.

**Peixe e aves moderados**: Estes fornecem proteína de alta qualidade e nutrientes essenciais sem as desvantagens do alto consumo de carne vermelha.

**Carne vermelha e doces limitados**: Guloseimas ocasionais em vez de alimentos básicos diários.

## Os Benefícios Cerebrais

A pesquisa mostrou resultados notáveis:
• 35% menor risco de declínio cognitivo em adultos mais velhos que seguem esta dieta
• Melhor memória e habilidades de pensamento em comparação com dietas com baixo teor de gordura
• Risco reduzido de doença de Alzheimer em até 40%
• Envelhecimento cerebral mais lento e melhor preservação do volume cerebral

O segredo está na combinação de alimentos anti-inflamatórios, antioxidantes e gorduras saudáveis que trabalham juntos para proteger suas células cerebrais de danos.

## Pontos-Chave
• Foque em plantas: vegetais, frutas, grãos integrais e leguminosas
• Use azeite de oliva como sua principal gordura para cozinhar
• Coma peixe duas vezes por semana
• Escolha grãos integrais em vez de grãos refinados
• Limite carne vermelha a algumas vezes por mês
• Desfrute de refeições com família e amigos

## Seu Passo de Ação
Esta semana, faça uma refeição de estilo mediterrâneo. Experimente uma salada grega com azeite de oliva, pão integral e peixe grelhado. Observe como uma alimentação saudável para o cérebro pode ser satisfatória e deliciosa!

**Tempo de leitura: 4 minutos**`,
                videoUrl: "https://www.youtube.com/watch?v=tGSfmnRDUGw",
                orderIndex: 2
            },
            {
                title: "Hidratação e Desempenho Mental",
                content: `## Visão Geral
A água compõe cerca de 75% do peso do seu cérebro, e mesmo a desidratação leve pode afetar significativamente o quão bem você pensa e lembra. Manter-se adequadamente hidratado é uma das maneiras mais simples, mas mais poderosas, de apoiar seu desempenho cognitivo todos os dias.

## Como a Desidratação Afeta Seu Cérebro

Quando você não bebe água suficiente, várias coisas acontecem em seu cérebro:

### Concentração Reduzida
Seu cérebro tem que trabalhar mais para realizar as mesmas tarefas, levando à fadiga mental e dificuldade de concentração. Estudos mostram que apenas 2% de desidratação pode prejudicar a atenção e a memória de curto prazo.

### Pensamento Mais Lento
A desidratação reduz o fluxo sanguíneo para o cérebro, diminuindo a entrega de oxigênio e nutrientes que suas células cerebrais precisam. Isso pode fazer você se sentir mentalmente lento e demorar para responder.

### Mudanças de Humor
Não beber água suficiente pode afetar a produção de neurotransmissores, levando a sentimentos aumentados de ansiedade, irritabilidade e confusão.

### Problemas de Memória
A pesquisa mostra que indivíduos desidratados têm pior desempenho em tarefas de memória e têm dificuldade em recordar informações.

## Quanta Água Você Precisa?

A diretriz geral é beber 8 copos (cerca de 2 litros) de água por dia, mas suas necessidades individuais podem variar com base em:
• Seu nível de atividade
• O clima onde você vive
• Sua saúde geral
• Medicamentos que você possa tomar

Uma boa regra prática: se você sentir sede, já está levemente desidratado. Tente beber água regularmente ao longo do dia, não apenas quando estiver com sede.

## Sinais de que Você Precisa de Mais Água
• Sentir-se cansado ou lento
• Dificuldade de concentração
• Dores de cabeça
• Boca seca
• Urina amarelo escuro

## Pontos-Chave
• Seu cérebro precisa de água para funcionar adequadamente
• Mesmo a desidratação leve afeta o pensamento e a memória
• Beba água ao longo do dia, não apenas quando estiver com sede
• Objetive 8 copos diariamente, ajustando às suas necessidades
• A hidratação matinal é especialmente importante após o sono

## Seu Passo de Ação
Comece cada manhã com um copo cheio de água antes de sua primeira xícara de café ou chá. Mantenha uma garrafa de água perto de você ao longo do dia como um lembrete visual para beber regularmente.

**Tempo de leitura: 3 minutos**`,
                orderIndex: 3
            },
            {
                title: "Antioxidantes e Proteção Cerebral",
                content: `## Visão Geral
Todos os dias, seu cérebro enfrenta ataques de moléculas prejudiciais chamadas radicais livres. Essas moléculas instáveis podem danificar células cerebrais, contribuindo para a perda de memória e declínio cognitivo. Felizmente, a natureza fornece defensores poderosos chamados antioxidantes que neutralizam essas ameaças e mantêm seu cérebro saudável.

## Entendendo os Radicais Livres e o Estresse Oxidativo

Pense nos radicais livres como ferrugem no metal. Assim como a ferrugem gradualmente danifica o metal, os radicais livres podem danificar suas células cerebrais ao longo do tempo. Este processo, chamado estresse oxidativo, é uma parte normal do envelhecimento, mas pode ser acelerado por estresse, poluição, má alimentação e falta de sono.

## Seu Exército de Antioxidantes

### Frutas e Vegetais Coloridos
As cores vibrantes dos produtos vêm de compostos antioxidantes:

**Vermelho e Roxo**: Frutas vermelhas, repolho roxo e beterrabas contêm antocianinas que protegem células cerebrais e melhoram a memória.

**Laranja e Amarelo**: Cenouras, batatas-doces e laranjas fornecem beta-caroteno e vitamina C, poderosos protetores cerebrais.

**Verde**: Vegetais folhosos como espinafre e couve oferecem luteína e vitamina K, que apoiam a função cognitiva.

### A Abordagem do Arco-Íris
Comer uma variedade de cores garante que você obtenha diferentes tipos de antioxidantes trabalhando juntos. Esta combinação é mais poderosa do que qualquer antioxidante sozinho.

## Principais Alimentos Ricos em Antioxidantes para Seu Cérebro
• Mirtilos: O campeão absoluto para a saúde cerebral
• Chocolate amargo (70% de cacau ou mais): Rico em flavonoides
• Nozes-pecã e nozes: Repletas de vitamina E
• Alcachofras: Um dos vegetais com maior teor de antioxidantes
• Feijão vermelho: Ótima fonte de antioxidantes de origem vegetal
• Chá verde: Contém catequinas que protegem células cerebrais

## Como os Antioxidantes Ajudam Seu Cérebro
• Reduzem a inflamação que pode danificar neurônios
• Melhoram o fluxo sanguíneo para o cérebro
• Protegem membranas celulares de danos
• Apoiam o crescimento de novas células cerebrais
• Melhoram a comunicação entre neurônios

## Pontos-Chave
• Coma um arco-íris de frutas e vegetais coloridos diariamente
• Objetive pelo menos 5 cores diferentes a cada dia
• Frutas frescas, congeladas e secas todas fornecem antioxidantes
• Chocolate amargo pode ser um deleite saudável que estimula o cérebro
• Chá verde é uma excelente escolha de bebida diária

## Seu Passo de Ação
Esta semana, desafie-se a comer frutas ou vegetais de pelo menos 5 cores diferentes todos os dias. Tire uma foto do seu prato colorido para acompanhar seu progresso!

**Tempo de leitura: 4 minutos**`,
                orderIndex: 4
            },
            {
                title: "Vitaminas para Função Cognitiva",
                content: `## Visão Geral
Certas vitaminas desempenham papéis cruciais na manutenção e proteção da saúde do seu cérebro. Entender quais vitaminas seu cérebro precisa e como obtê-las dos alimentos pode ajudá-lo a permanecer mentalmente aguçado e proteger contra o declínio cognitivo.

## As Vitaminas Cerebrais Essenciais

### Vitamina B12: A Vitamina da Energia
A B12 é essencial para criar o revestimento protetor ao redor de suas células nervosas. Níveis baixos de B12 estão ligados à perda de memória, confusão e até mesmo encolhimento cerebral em adultos mais velhos.

**Melhores fontes alimentares:**
• Peixe gorduroso (salmão, truta, atum)
• Ovos
• Produtos lácteos (leite, iogurte, queijo)
• Cereais e leites vegetais fortificados

**Nota importante:** Muitos adultos mais velhos têm dificuldade em absorver B12 dos alimentos, então converse com seu médico sobre se você pode precisar de um suplemento.

### Vitamina D: A Vitamina do Sol
Frequentemente chamada de "vitamina do sol" porque sua pele a produz quando exposta ao sol, a vitamina D ajuda a proteger células cerebrais e apoia a memória e o humor.

**Melhores fontes:**
• Exposição ao sol (15-20 minutos diariamente)
• Peixe gorduroso (especialmente salmão e cavala)
• Gemas de ovo
• Leite e suco de laranja fortificados
• Cogumelos expostos à luz UV

### Vitamina E: O Protetor
Este poderoso antioxidante protege células cerebrais de danos oxidativos e pode retardar o declínio cognitivo. Estudos mostram que a ingestão adequada de vitamina E está ligada a melhor desempenho cognitivo à medida que envelhecemos.

**Melhores fontes alimentares:**
• Nozes (especialmente amêndoas e avelãs)
• Sementes (sementes de girassol)
• Espinafre e outros vegetais folhosos
• Abacates
• Óleos vegetais (girassol, cártamo)

### Vitaminas do Complexo B
Folato (B9), B6 e outras vitaminas B trabalham juntas para apoiar a saúde cerebral controlando os níveis de homocisteína, um composto ligado a danos cerebrais quando elevado.

**Melhores fontes:**
• Vegetais folhosos verdes
• Leguminosas (feijões, lentilhas)
• Grãos integrais
• Frutas cítricas
• Cereais fortificados

## Quanto Você Precisa?

A maioria das pessoas pode obter vitaminas adequadas de uma dieta variada e equilibrada. No entanto, alguns grupos podem precisar de suplementos:
• Adultos acima de 50 anos (especialmente para B12)
• Pessoas com exposição solar limitada (para vitamina D)
• Aqueles em dietas restritas
• Indivíduos com problemas de absorção

Sempre consulte seu médico antes de iniciar qualquer regime de suplementação.

## Pontos-Chave
• B12 protege células nervosas e previne encolhimento cerebral
• Vitamina D apoia memória e humor
• Vitamina E protege células cerebrais de danos
• Vitaminas do complexo B trabalham juntas para a saúde cerebral
• Fontes alimentares geralmente são melhores que suplementos
• Verifique seu status vitamínico com seu médico

## Seu Passo de Ação
Revise sua dieta esta semana e identifique quais alimentos ricos em vitaminas você já está comendo. Adicione uma nova fonte alimentar para cada vitamina cerebral para aumentar sua variedade.

**Tempo de leitura: 4 minutos**`,
                videoUrl: "https://www.youtube.com/watch?v=16rUMBX2EXE",
                orderIndex: 5
            },
            { title: "Reduzindo Alimentos Processados", content: "Entenda como alimentos processados e açúcares adicionados podem impactar negativamente a função cognitiva. Aprenda estratégias para comer mais alimentos integrais.", orderIndex: 6 },
            { title: "Horário das Refeições e Energia Cerebral", content: "Aprenda como o horário das refeições afeta os níveis de energia do seu cérebro ao longo do dia. Descubra o melhor cronograma alimentar para desempenho mental.", orderIndex: 7 },
            { title: "Gorduras Saudáveis para Seu Cérebro", content: "Explore a importância de gorduras saudáveis como ômega-3 para a estrutura e função cerebral. Aprenda quais alimentos fornecem as melhores fontes.", orderIndex: 8 },
            { title: "Criando um Plano de Refeições Saudável para o Cérebro", content: "Junte tudo com um guia prático de planejamento de refeições. Aprenda a criar refeições deliciosas e saudáveis para o cérebro durante a semana.", orderIndex: 9 },
            { title: "Suplementos: O Que Funciona?", content: "Obtenha informações baseadas em evidências sobre suplementos para saúde cerebral. Aprenda quais vale a pena considerar e quais evitar.", orderIndex: 10 }
        ]
    },
    // ==========================================
    // Course 2: SLEEP - ENGLISH
    // ==========================================
    {
        title: "Sleep for Cognitive Performance",
        description: "Optimize your sleep to enhance memory, focus, and mental sharpness",
        category: "Sleep",
        icon: "moon",
        color: "text-indigo-600",
        language: "en",
        orderIndex: 2,
        lessons: [
            { title: "Why Sleep Matters for Your Brain", content: "Understand the crucial role sleep plays in memory consolidation, learning, and cognitive performance. Discover what happens to your brain during sleep.", orderIndex: 1 },
            { title: "The Science of Sleep Cycles", content: "Learn about REM and non-REM sleep stages and how they contribute to mental restoration and memory processing.", orderIndex: 2 },
            { title: "Creating the Perfect Sleep Environment", content: "Discover how to optimize your bedroom for better sleep: temperature, lighting, noise control, and comfort considerations.", orderIndex: 3 },
            { title: "Establishing a Bedtime Routine", content: "Learn to create a consistent pre-sleep routine that signals your brain it's time to rest. Consistency is key to better sleep.", orderIndex: 4 },
            { title: "Managing Screen Time Before Bed", content: "Understand how blue light affects your sleep and learn strategies to reduce screen exposure before bedtime.", orderIndex: 5 },
            { title: "Foods and Drinks for Better Sleep", content: "Discover which foods promote better sleep and which ones to avoid. Learn about the timing of meals and beverages.", orderIndex: 6 },
            { title: "Relaxation Techniques for Sleep", content: "Practice proven relaxation methods including progressive muscle relaxation, breathing exercises, and meditation for better sleep.", orderIndex: 7 },
            { title: "Managing Sleep Disruptions", content: "Learn strategies to handle common sleep disruptions and what to do when you can't fall back asleep.", orderIndex: 8 },
            { title: "Napping: Benefits and Best Practices", content: "Understand when and how to nap effectively to boost cognitive performance without affecting nighttime sleep.", orderIndex: 9 },
            { title: "When to Seek Professional Help", content: "Learn to recognize signs of sleep disorders and understand when it's time to consult a healthcare professional.", orderIndex: 10 }
        ]
    },
    // Course 2: SLEEP - GERMAN
    {
        title: "Schlaf für kognitive Leistung",
        description: "Optimieren Sie Ihren Schlaf, um Gedächtnis, Konzentration und geistige Schärfe zu verbessern",
        category: "Schlaf",
        icon: "moon",
        color: "text-indigo-600",
        language: "de",
        orderIndex: 2,
        lessons: [
            { title: "Warum Schlaf für Ihr Gehirn wichtig ist", content: "Verstehen Sie die entscheidende Rolle, die Schlaf bei der Gedächtniskonsolidierung, beim Lernen und bei der kognitiven Leistung spielt. Entdecken Sie, was während des Schlafs mit Ihrem Gehirn passiert.", orderIndex: 1 },
            { title: "Die Wissenschaft der Schlafzyklen", content: "Erfahren Sie mehr über REM- und Nicht-REM-Schlafphasen und wie sie zur geistigen Erholung und Gedächtnisverarbeitung beitragen.", orderIndex: 2 },
            { title: "Die perfekte Schlafumgebung schaffen", content: "Entdecken Sie, wie Sie Ihr Schlafzimmer für besseren Schlaf optimieren: Temperatur, Beleuchtung, Geräuschkontrolle und Komfortüberlegungen.", orderIndex: 3 },
            { title: "Eine Schlafenszeitroutine etablieren", content: "Lernen Sie, eine konsistente Vor-dem-Schlafengehen-Routine zu erstellen, die Ihrem Gehirn signalisiert, dass es Zeit zum Ausruhen ist. Konsistenz ist der Schlüssel zu besserem Schlaf.", orderIndex: 4 },
            { title: "Bildschirmzeit vor dem Schlafengehen verwalten", content: "Verstehen Sie, wie blaues Licht Ihren Schlaf beeinflusst, und lernen Sie Strategien, um die Bildschirmnutzung vor dem Schlafengehen zu reduzieren.", orderIndex: 5 },
            { title: "Lebensmittel und Getränke für besseren Schlaf", content: "Entdecken Sie, welche Lebensmittel besseren Schlaf fördern und welche zu vermeiden sind. Erfahren Sie mehr über das Timing von Mahlzeiten und Getränken.", orderIndex: 6 },
            { title: "Entspannungstechniken für Schlaf", content: "Üben Sie bewährte Entspannungsmethoden einschließlich progressiver Muskelentspannung, Atemübungen und Meditation für besseren Schlaf.", orderIndex: 7 },
            { title: "Schlafstörungen bewältigen", content: "Lernen Sie Strategien zum Umgang mit häufigen Schlafstörungen und was zu tun ist, wenn Sie nicht wieder einschlafen können.", orderIndex: 8 },
            { title: "Nickerchen: Vorteile und Best Practices", content: "Verstehen Sie, wann und wie Sie effektiv ein Nickerchen machen, um die kognitive Leistung zu steigern, ohne den Nachtschlaf zu beeinträchtigen.", orderIndex: 9 },
            { title: "Wann professionelle Hilfe suchen", content: "Lernen Sie, Anzeichen von Schlafstörungen zu erkennen und zu verstehen, wann es Zeit ist, einen Gesundheitsfachmann zu konsultieren.", orderIndex: 10 }
        ]
    },
    // Course 2: SLEEP - FRENCH
    {
        title: "Sommeil pour la Performance Cognitive",
        description: "Optimisez votre sommeil pour améliorer la mémoire, la concentration et l'acuité mentale",
        category: "Sommeil",
        icon: "moon",
        color: "text-indigo-600",
        language: "fr",
        orderIndex: 2,
        lessons: [
            { title: "Pourquoi le Sommeil est Important pour Votre Cerveau", content: "Comprenez le rôle crucial que joue le sommeil dans la consolidation de la mémoire, l'apprentissage et la performance cognitive. Découvrez ce qui arrive à votre cerveau pendant le sommeil.", orderIndex: 1 },
            { title: "La Science des Cycles de Sommeil", content: "Apprenez les stades de sommeil REM et non-REM et comment ils contribuent à la restauration mentale et au traitement de la mémoire.", orderIndex: 2 },
            { title: "Créer l'Environnement de Sommeil Parfait", content: "Découvrez comment optimiser votre chambre pour un meilleur sommeil : température, éclairage, contrôle du bruit et considérations de confort.", orderIndex: 3 },
            { title: "Établir une Routine du Coucher", content: "Apprenez à créer une routine pré-sommeil cohérente qui signale à votre cerveau qu'il est temps de se reposer. La cohérence est la clé d'un meilleur sommeil.", orderIndex: 4 },
            { title: "Gérer le Temps d'Écran Avant le Coucher", content: "Comprenez comment la lumière bleue affecte votre sommeil et apprenez des stratégies pour réduire l'exposition aux écrans avant le coucher.", orderIndex: 5 },
            { title: "Aliments et Boissons pour un Meilleur Sommeil", content: "Découvrez quels aliments favorisent un meilleur sommeil et lesquels éviter. Apprenez le timing des repas et des boissons.", orderIndex: 6 },
            { title: "Techniques de Relaxation pour le Sommeil", content: "Pratiquez des méthodes de relaxation éprouvées, notamment la relaxation musculaire progressive, les exercices de respiration et la méditation pour un meilleur sommeil.", orderIndex: 7 },
            { title: "Gérer les Perturbations du Sommeil", content: "Apprenez des stratégies pour gérer les perturbations courantes du sommeil et que faire lorsque vous ne pouvez pas vous rendormir.", orderIndex: 8 },
            { title: "Sieste : Avantages et Meilleures Pratiques", content: "Comprenez quand et comment faire une sieste efficacement pour améliorer la performance cognitive sans affecter le sommeil nocturne.", orderIndex: 9 },
            { title: "Quand Chercher de l'Aide Professionnelle", content: "Apprenez à reconnaître les signes de troubles du sommeil et comprenez quand il est temps de consulter un professionnel de la santé.", orderIndex: 10 }
        ]
    },
    // Course 2: SLEEP - PORTUGUESE
    {
        title: "Sono para Desempenho Cognitivo",
        description: "Otimize seu sono para melhorar memória, foco e acuidade mental",
        category: "Sono",
        icon: "moon",
        color: "text-indigo-600",
        language: "pt",
        orderIndex: 2,
        lessons: [
            { title: "Por Que o Sono é Importante para Seu Cérebro", content: "Entenda o papel crucial que o sono desempenha na consolidação da memória, aprendizado e desempenho cognitivo. Descubra o que acontece com seu cérebro durante o sono.", orderIndex: 1 },
            { title: "A Ciência dos Ciclos do Sono", content: "Aprenda sobre os estágios do sono REM e não-REM e como eles contribuem para a restauração mental e processamento de memória.", orderIndex: 2 },
            { title: "Criando o Ambiente Perfeito para Dormir", content: "Descubra como otimizar seu quarto para melhor sono: temperatura, iluminação, controle de ruído e considerações de conforto.", orderIndex: 3 },
            { title: "Estabelecendo uma Rotina de Dormir", content: "Aprenda a criar uma rotina pré-sono consistente que sinaliza ao seu cérebro que é hora de descansar. A consistência é a chave para um sono melhor.", orderIndex: 4 },
            { title: "Gerenciando o Tempo de Tela Antes de Dormir", content: "Entenda como a luz azul afeta seu sono e aprenda estratégias para reduzir a exposição a telas antes de dormir.", orderIndex: 5 },
            { title: "Alimentos e Bebidas para Melhor Sono", content: "Descubra quais alimentos promovem melhor sono e quais evitar. Aprenda sobre o tempo das refeições e bebidas.", orderIndex: 6 },
            { title: "Técnicas de Relaxamento para o Sono", content: "Pratique métodos de relaxamento comprovados, incluindo relaxamento muscular progressivo, exercícios respiratórios e meditação para melhor sono.", orderIndex: 7 },
            { title: "Gerenciando Interrupções do Sono", content: "Aprenda estratégias para lidar com interrupções comuns do sono e o que fazer quando você não consegue voltar a dormir.", orderIndex: 8 },
            { title: "Cochilos: Benefícios e Melhores Práticas", content: "Entenda quando e como cochilar efetivamente para melhorar o desempenho cognitivo sem afetar o sono noturno.", orderIndex: 9 },
            { title: "Quando Procurar Ajuda Profissional", content: "Aprenda a reconhecer sinais de distúrbios do sono e entenda quando é hora de consultar um profissional de saúde.", orderIndex: 10 }
        ]
    },
    // ==========================================
    // Course 3: EXERCISE - ENGLISH
    // ==========================================
    {
        title: "Physical Exercise and Brain Health",
        description: "Discover how regular physical activity enhances cognitive function and mental well-being",
        category: "Exercise",
        icon: "activity",
        color: "text-red-600",
        language: "en",
        orderIndex: 3,
        lessons: [
            { title: "Exercise and Brain Chemistry", content: "Learn how physical activity increases brain-derived neurotrophic factor (BDNF) and other chemicals that support cognitive health.", orderIndex: 1 },
            { title: "Aerobic Exercise for Memory", content: "Discover how cardiovascular exercise improves memory and learning. Even moderate walking can make a difference.", orderIndex: 2 },
            { title: "Strength Training and Cognition", content: "Understand the cognitive benefits of resistance training and how it supports brain health as we age.", orderIndex: 3 },
            { title: "Balance and Coordination Exercises", content: "Learn exercises that challenge your balance and coordination, which are important for brain health and fall prevention.", orderIndex: 4 },
            { title: "Starting an Exercise Routine", content: "Get practical guidance on beginning an exercise program safely, regardless of your current fitness level.", orderIndex: 5 },
            { title: "Exercise Intensity and Duration", content: "Learn about the recommended intensity and duration of exercise for optimal brain health benefits.", orderIndex: 6 },
            { title: "Outdoor Exercise Benefits", content: "Discover the additional cognitive benefits of exercising in nature and spending time outdoors.", orderIndex: 7 },
            { title: "Social Exercise Activities", content: "Explore group activities like dancing, tai chi, or group walks that combine physical and social benefits.", orderIndex: 8 },
            { title: "Staying Motivated to Exercise", content: "Learn strategies to maintain exercise consistency and overcome common barriers to regular physical activity.", orderIndex: 9 },
            { title: "Creating Your Personal Exercise Plan", content: "Put everything together to create a sustainable, enjoyable exercise routine tailored to your abilities and preferences.", orderIndex: 10 }
        ]
    },
    // Course 3: EXERCISE - GERMAN
    {
        title: "Körperliche Bewegung und Gehirngesundheit",
        description: "Entdecken Sie, wie regelmäßige körperliche Aktivität die kognitive Funktion und das geistige Wohlbefinden verbessert",
        category: "Bewegung",
        icon: "activity",
        color: "text-red-600",
        language: "de",
        orderIndex: 3,
        lessons: [
            { title: "Bewegung und Gehirnchemie", content: "Erfahren Sie, wie körperliche Aktivität den vom Gehirn abgeleiteten neurotrophen Faktor (BDNF) und andere Chemikalien erhöht, die die kognitive Gesundheit unterstützen.", orderIndex: 1 },
            { title: "Aerobic-Übungen für das Gedächtnis", content: "Entdecken Sie, wie Herz-Kreislauf-Training Gedächtnis und Lernen verbessert. Selbst moderates Gehen kann einen Unterschied machen.", orderIndex: 2 },
            { title: "Krafttraining und Kognition", content: "Verstehen Sie die kognitiven Vorteile von Krafttraining und wie es die Gehirngesundheit im Alter unterstützt.", orderIndex: 3 },
            { title: "Balance- und Koordinationsübungen", content: "Lernen Sie Übungen, die Ihre Balance und Koordination herausfordern, die wichtig für die Gehirngesundheit und Sturzprävention sind.", orderIndex: 4 },
            { title: "Ein Trainingsprogramm beginnen", content: "Erhalten Sie praktische Anleitung zum sicheren Beginn eines Trainingsprogramms, unabhängig von Ihrem aktuellen Fitnesslevel.", orderIndex: 5 },
            { title: "Trainingsintensität und -dauer", content: "Erfahren Sie mehr über die empfohlene Intensität und Dauer von Bewegung für optimale Gehirngesundheitsvorteile.", orderIndex: 6 },
            { title: "Vorteile von Outdoor-Training", content: "Entdecken Sie die zusätzlichen kognitiven Vorteile von Training in der Natur und Zeit im Freien.", orderIndex: 7 },
            { title: "Soziale Bewegungsaktivitäten", content: "Erkunden Sie Gruppenaktivitäten wie Tanzen, Tai Chi oder Gruppenspaziergänge, die körperliche und soziale Vorteile kombinieren.", orderIndex: 8 },
            { title: "Motiviert bleiben für Training", content: "Lernen Sie Strategien zur Aufrechterhaltung der Trainingskonsistenz und zur Überwindung häufiger Hindernisse für regelmäßige körperliche Aktivität.", orderIndex: 9 },
            { title: "Ihren persönlichen Trainingsplan erstellen", content: "Setzen Sie alles zusammen, um eine nachhaltige, angenehme Trainingsroutine zu erstellen, die auf Ihre Fähigkeiten und Vorlieben zugeschnitten ist.", orderIndex: 10 }
        ]
    },
    // Course 3: EXERCISE - FRENCH
    {
        title: "Exercice Physique et Santé Cérébrale",
        description: "Découvrez comment l'activité physique régulière améliore la fonction cognitive et le bien-être mental",
        category: "Exercice",
        icon: "activity",
        color: "text-red-600",
        language: "fr",
        orderIndex: 3,
        lessons: [
            { title: "Exercice et Chimie du Cerveau", content: "Apprenez comment l'activité physique augmente le facteur neurotrophique dérivé du cerveau (BDNF) et d'autres produits chimiques qui soutiennent la santé cognitive.", orderIndex: 1 },
            { title: "Exercice Aérobique pour la Mémoire", content: "Découvrez comment l'exercice cardiovasculaire améliore la mémoire et l'apprentissage. Même la marche modérée peut faire une différence.", orderIndex: 2 },
            { title: "Musculation et Cognition", content: "Comprenez les avantages cognitifs de l'entraînement en résistance et comment il soutient la santé cérébrale en vieillissant.", orderIndex: 3 },
            { title: "Exercices d'Équilibre et de Coordination", content: "Apprenez des exercices qui mettent au défi votre équilibre et votre coordination, importants pour la santé cérébrale et la prévention des chutes.", orderIndex: 4 },
            { title: "Commencer une Routine d'Exercice", content: "Obtenez des conseils pratiques pour débuter un programme d'exercice en toute sécurité, quel que soit votre niveau de forme actuel.", orderIndex: 5 },
            { title: "Intensité et Durée de l'Exercice", content: "Apprenez l'intensité et la durée recommandées de l'exercice pour des bénéfices optimaux pour la santé du cerveau.", orderIndex: 6 },
            { title: "Avantages de l'Exercice en Plein Air", content: "Découvrez les avantages cognitifs supplémentaires de l'exercice dans la nature et du temps passé à l'extérieur.", orderIndex: 7 },
            { title: "Activités Sociales d'Exercice", content: "Explorez des activités de groupe comme la danse, le tai-chi ou les promenades de groupe qui combinent bénéfices physiques et sociaux.", orderIndex: 8 },
            { title: "Rester Motivé pour l'Exercice", content: "Apprenez des stratégies pour maintenir la cohérence de l'exercice et surmonter les obstacles courants à l'activité physique régulière.", orderIndex: 9 },
            { title: "Créer Votre Plan d'Exercice Personnel", content: "Rassemblez tout pour créer une routine d'exercice durable et agréable adaptée à vos capacités et préférences.", orderIndex: 10 }
        ]
    },
    // Course 3: EXERCISE - PORTUGUESE
    {
        title: "Exercício Físico e Saúde Cerebral",
        description: "Descubra como a atividade física regular melhora a função cognitiva e o bem-estar mental",
        category: "Exercício",
        icon: "activity",
        color: "text-red-600",
        language: "pt",
        orderIndex: 3,
        lessons: [
            { title: "Exercício e Química Cerebral", content: "Aprenda como a atividade física aumenta o fator neurotrófico derivado do cérebro (BDNF) e outros químicos que apoiam a saúde cognitiva.", orderIndex: 1 },
            { title: "Exercício Aeróbico para Memória", content: "Descubra como o exercício cardiovascular melhora a memória e o aprendizado. Até mesmo caminhadas moderadas podem fazer diferença.", orderIndex: 2 },
            { title: "Treinamento de Força e Cognição", content: "Entenda os benefícios cognitivos do treinamento de resistência e como ele apoia a saúde cerebral à medida que envelhecemos.", orderIndex: 3 },
            { title: "Exercícios de Equilíbrio e Coordenação", content: "Aprenda exercícios que desafiam seu equilíbrio e coordenação, importantes para a saúde cerebral e prevenção de quedas.", orderIndex: 4 },
            { title: "Iniciando uma Rotina de Exercícios", content: "Obtenha orientação prática sobre como começar um programa de exercícios com segurança, independentemente do seu nível de condicionamento atual.", orderIndex: 5 },
            { title: "Intensidade e Duração do Exercício", content: "Aprenda sobre a intensidade e duração recomendadas de exercício para benefícios ótimos à saúde cerebral.", orderIndex: 6 },
            { title: "Benefícios do Exercício ao Ar Livre", content: "Descubra os benefícios cognitivos adicionais de se exercitar na natureza e passar tempo ao ar livre.", orderIndex: 7 },
            { title: "Atividades Sociais de Exercício", content: "Explore atividades em grupo como dança, tai chi ou caminhadas em grupo que combinam benefícios físicos e sociais.", orderIndex: 8 },
            { title: "Mantendo-se Motivado para Exercitar", content: "Aprenda estratégias para manter a consistência do exercício e superar barreiras comuns à atividade física regular.", orderIndex: 9 },
            { title: "Criando Seu Plano Pessoal de Exercícios", content: "Junte tudo para criar uma rotina de exercícios sustentável e prazerosa, adequada às suas habilidades e preferências.", orderIndex: 10 }
        ]
    },
    // ==========================================
    // Course 4: STRESS MANAGEMENT - ENGLISH
    // ==========================================
    {
        title: "Stress Management for Mental Clarity",
        description: "Learn effective techniques to manage stress and protect your cognitive function",
        category: "Stress Management",
        icon: "heart",
        color: "text-purple-600",
        language: "en",
        orderIndex: 4,
        lessons: [
            { title: "Understanding Stress and the Brain", content: "Learn how chronic stress affects cognitive function, memory, and decision-making. Understanding stress is the first step to managing it.", orderIndex: 1 },
            { title: "Breathing Techniques for Calm", content: "Practice simple breathing exercises that can quickly reduce stress and anxiety. These techniques can be used anytime, anywhere.", orderIndex: 2 },
            { title: "Mindfulness Meditation Basics", content: "Learn the fundamentals of mindfulness meditation and how regular practice can reduce stress and improve cognitive function.", orderIndex: 3 },
            { title: "Progressive Muscle Relaxation", content: "Discover this powerful technique for releasing physical tension and calming your mind through systematic muscle relaxation.", orderIndex: 4 },
            { title: "Time Management to Reduce Stress", content: "Learn practical time management strategies that reduce overwhelm and create more balance in your daily life.", orderIndex: 5 },
            { title: "Setting Healthy Boundaries", content: "Understand the importance of boundaries in managing stress and learn how to say no without guilt.", orderIndex: 6 },
            { title: "Social Connections and Support", content: "Discover how strong social relationships protect against stress and support cognitive health. Learn to nurture meaningful connections.", orderIndex: 7 },
            { title: "Gratitude and Positive Thinking", content: "Learn how cultivating gratitude and positive thinking patterns can reduce stress and improve mental well-being.", orderIndex: 8 },
            { title: "Hobbies and Creative Outlets", content: "Explore how engaging in enjoyable activities and creative pursuits helps manage stress and support brain health.", orderIndex: 9 },
            { title: "Creating Your Stress Management Plan", content: "Develop a personalized stress management plan combining techniques that work best for you and your lifestyle.", orderIndex: 10 }
        ]
    },
    // Course 4: STRESS MANAGEMENT - GERMAN
    {
        title: "Stressbewältigung für geistige Klarheit",
        description: "Lernen Sie effektive Techniken zur Stressbewältigung und zum Schutz Ihrer kognitiven Funktion",
        category: "Stressbewältigung",
        icon: "heart",
        color: "text-purple-600",
        language: "de",
        orderIndex: 4,
        lessons: [
            { title: "Stress und das Gehirn verstehen", content: "Erfahren Sie, wie chronischer Stress kognitive Funktion, Gedächtnis und Entscheidungsfindung beeinflusst. Stress zu verstehen ist der erste Schritt zur Bewältigung.", orderIndex: 1 },
            { title: "Atemtechniken zur Beruhigung", content: "Üben Sie einfache Atemübungen, die Stress und Angst schnell reduzieren können. Diese Techniken können jederzeit und überall angewendet werden.", orderIndex: 2 },
            { title: "Grundlagen der Achtsamkeitsmeditation", content: "Lernen Sie die Grundlagen der Achtsamkeitsmeditation und wie regelmäßige Praxis Stress reduzieren und die kognitive Funktion verbessern kann.", orderIndex: 3 },
            { title: "Progressive Muskelentspannung", content: "Entdecken Sie diese kraftvolle Technik zur Freisetzung körperlicher Spannung und zur Beruhigung Ihres Geistes durch systematische Muskelentspannung.", orderIndex: 4 },
            { title: "Zeitmanagement zur Stressreduzierung", content: "Lernen Sie praktische Zeitmanagementstrategien, die Überwältigung reduzieren und mehr Balance in Ihrem täglichen Leben schaffen.", orderIndex: 5 },
            { title: "Gesunde Grenzen setzen", content: "Verstehen Sie die Bedeutung von Grenzen bei der Stressbewältigung und lernen Sie, wie man ohne Schuldgefühle Nein sagt.", orderIndex: 6 },
            { title: "Soziale Verbindungen und Unterstützung", content: "Entdecken Sie, wie starke soziale Beziehungen vor Stress schützen und kognitive Gesundheit unterstützen. Lernen Sie, bedeutungsvolle Verbindungen zu pflegen.", orderIndex: 7 },
            { title: "Dankbarkeit und positives Denken", content: "Erfahren Sie, wie die Kultivierung von Dankbarkeit und positiven Denkmustern Stress reduzieren und das geistige Wohlbefinden verbessern kann.", orderIndex: 8 },
            { title: "Hobbys und kreative Ausdrucksmöglichkeiten", content: "Erkunden Sie, wie die Teilnahme an angenehmen Aktivitäten und kreativen Beschäftigungen hilft, Stress zu bewältigen und Gehirngesundheit zu unterstützen.", orderIndex: 9 },
            { title: "Ihren Stressbewältigungsplan erstellen", content: "Entwickeln Sie einen personalisierten Stressbewältigungsplan, der Techniken kombiniert, die am besten für Sie und Ihren Lebensstil funktionieren.", orderIndex: 10 }
        ]
    },
    // Course 4: STRESS MANAGEMENT - FRENCH
    {
        title: "Gestion du Stress pour la Clarté Mentale",
        description: "Apprenez des techniques efficaces pour gérer le stress et protéger votre fonction cognitive",
        category: "Gestion du Stress",
        icon: "heart",
        color: "text-purple-600",
        language: "fr",
        orderIndex: 4,
        lessons: [
            { title: "Comprendre le Stress et le Cerveau", content: "Apprenez comment le stress chronique affecte la fonction cognitive, la mémoire et la prise de décision. Comprendre le stress est la première étape pour le gérer.", orderIndex: 1 },
            { title: "Techniques de Respiration pour le Calme", content: "Pratiquez des exercices de respiration simples qui peuvent rapidement réduire le stress et l'anxiété. Ces techniques peuvent être utilisées n'importe quand, n'importe où.", orderIndex: 2 },
            { title: "Fondamentaux de la Méditation de Pleine Conscience", content: "Apprenez les fondamentaux de la méditation de pleine conscience et comment une pratique régulière peut réduire le stress et améliorer la fonction cognitive.", orderIndex: 3 },
            { title: "Relaxation Musculaire Progressive", content: "Découvrez cette technique puissante pour libérer la tension physique et calmer votre esprit par une relaxation musculaire systématique.", orderIndex: 4 },
            { title: "Gestion du Temps pour Réduire le Stress", content: "Apprenez des stratégies pratiques de gestion du temps qui réduisent le dépassement et créent plus d'équilibre dans votre vie quotidienne.", orderIndex: 5 },
            { title: "Établir des Limites Saines", content: "Comprenez l'importance des limites dans la gestion du stress et apprenez à dire non sans culpabilité.", orderIndex: 6 },
            { title: "Connexions Sociales et Soutien", content: "Découvrez comment les relations sociales fortes protègent contre le stress et soutiennent la santé cognitive. Apprenez à nourrir des connexions significatives.", orderIndex: 7 },
            { title: "Gratitude et Pensée Positive", content: "Apprenez comment cultiver la gratitude et les modèles de pensée positive peut réduire le stress et améliorer le bien-être mental.", orderIndex: 8 },
            { title: "Loisirs et Exutoires Créatifs", content: "Explorez comment s'engager dans des activités agréables et des poursuites créatives aide à gérer le stress et à soutenir la santé cérébrale.", orderIndex: 9 },
            { title: "Créer Votre Plan de Gestion du Stress", content: "Développez un plan de gestion du stress personnalisé combinant les techniques qui fonctionnent le mieux pour vous et votre mode de vie.", orderIndex: 10 }
        ]
    },
    // Course 4: STRESS MANAGEMENT - PORTUGUESE
    {
        title: "Gerenciamento de Estresse para Clareza Mental",
        description: "Aprenda técnicas eficazes para gerenciar o estresse e proteger sua função cognitiva",
        category: "Gerenciamento de Estresse",
        icon: "heart",
        color: "text-purple-600",
        language: "pt",
        orderIndex: 4,
        lessons: [
            { title: "Entendendo o Estresse e o Cérebro", content: "Aprenda como o estresse crônico afeta a função cognitiva, memória e tomada de decisões. Entender o estresse é o primeiro passo para gerenciá-lo.", orderIndex: 1 },
            { title: "Técnicas de Respiração para Calma", content: "Pratique exercícios de respiração simples que podem rapidamente reduzir estresse e ansiedade. Essas técnicas podem ser usadas a qualquer hora, em qualquer lugar.", orderIndex: 2 },
            { title: "Fundamentos da Meditação Mindfulness", content: "Aprenda os fundamentos da meditação mindfulness e como a prática regular pode reduzir o estresse e melhorar a função cognitiva.", orderIndex: 3 },
            { title: "Relaxamento Muscular Progressivo", content: "Descubra esta técnica poderosa para liberar tensão física e acalmar sua mente através de relaxamento muscular sistemático.", orderIndex: 4 },
            { title: "Gerenciamento de Tempo para Reduzir Estresse", content: "Aprenda estratégias práticas de gerenciamento de tempo que reduzem sobrecarga e criam mais equilíbrio em sua vida diária.", orderIndex: 5 },
            { title: "Estabelecendo Limites Saudáveis", content: "Entenda a importância dos limites no gerenciamento de estresse e aprenda a dizer não sem culpa.", orderIndex: 6 },
            { title: "Conexões Sociais e Apoio", content: "Descubra como relacionamentos sociais fortes protegem contra o estresse e apoiam a saúde cognitiva. Aprenda a nutrir conexões significativas.", orderIndex: 7 },
            { title: "Gratidão e Pensamento Positivo", content: "Aprenda como cultivar gratidão e padrões de pensamento positivo pode reduzir o estresse e melhorar o bem-estar mental.", orderIndex: 8 },
            { title: "Hobbies e Saídas Criativas", content: "Explore como se envolver em atividades prazerosas e buscas criativas ajuda a gerenciar o estresse e apoiar a saúde cerebral.", orderIndex: 9 },
            { title: "Criando Seu Plano de Gerenciamento de Estresse", content: "Desenvolva um plano personalizado de gerenciamento de estresse combinando técnicas que funcionam melhor para você e seu estilo de vida.", orderIndex: 10 }
        ]
    }
];
async function seedCourses() {
    console.log("🌍 Seeding multilingual courses and lessons...");
    let coursesCreated = 0;
    let lessonsCreated = 0;
    for (const courseWithLessons of courseData) {
        const { lessons: lessonData, ...courseInfo } = courseWithLessons;
        // Check if course already exists (by title AND language)
        const existingCourse = await db.query.courses.findFirst({
            where: and(eq(courses.title, courseInfo.title), eq(courses.language, courseInfo.language))
        });
        if (existingCourse) {
            console.log(`  ⏭️  Course "${courseInfo.title}" (${courseInfo.language}) already exists, skipping...`);
            continue;
        }
        // Insert course
        const [insertedCourse] = await db.insert(courses).values(courseInfo).returning();
        coursesCreated++;
        console.log(`  ✅ Created course: ${insertedCourse.title} (${insertedCourse.language})`);
        // Insert lessons
        for (const lesson of lessonData) {
            await db.insert(lessons).values({
                ...lesson,
                courseId: insertedCourse.id,
                language: courseInfo.language
            });
            lessonsCreated++;
        }
        console.log(`     📚 Added ${lessonData.length} lessons`);
    }
    console.log(`\n🎉 Seeding complete!`);
    console.log(`   Courses created: ${coursesCreated}`);
    console.log(`   Lessons created: ${lessonsCreated}`);
    console.log(`   Total languages: 4 (en, de, fr, pt)`);
}
// Export for use in production seeding
export async function seedCoursesAndLessons() {
    return seedCourses();
}
// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    seedCourses().catch(console.error).finally(() => process.exit(0));
}
//# sourceMappingURL=seed-courses-multilingual.js.map