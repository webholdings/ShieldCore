import { db } from "../server/db";

// Batch 1: Lessons 2-6 (Memory, Attention, Problem-Solving, Creative Thinking, Mindfulness)

const expandedLessons = {
    lesson_memory: {
        en: {
            title: "Memory Enhancement Techniques",
            content: `Memory is one of the most important cognitive functions, allowing us to store and retrieve information that shapes our identity, knowledge, and daily functioning. This lesson explores proven techniques to enhance both short-term and long-term memory.

**Understanding Memory**

Memory isn't a single system but rather multiple interconnected processes:

- **Sensory Memory**: Brief retention of sensory information (less than 1 second)
- **Short-Term Memory**: Temporary storage of information (15-30 seconds)
- **Working Memory**: Active manipulation of information for complex tasks
- **Long-Term Memory**: Potentially permanent storage of information

**The Science of Memory Formation**

Memory formation involves three key stages:

1. **Encoding**: Converting information into a form that can be stored
2. **Consolidation**: Stabilizing and strengthening memory traces
3. **Retrieval**: Accessing stored information when needed

Understanding these stages helps us apply techniques more effectively.

**Proven Memory Enhancement Techniques**

**1. The Method of Loci (Memory Palace)**

This ancient technique involves associating information with specific locations in a familiar place. To use it:
- Choose a familiar route (your home, commute, etc.)
- Create vivid mental images of items you want to remember
- Place these images at specific locations along your route
- To recall, mentally walk through your route

Research shows this technique can dramatically improve memory, with some practitioners remembering hundreds of items in order.

**2. Chunking**

Breaking information into meaningful groups makes it easier to remember. For example:
- Phone numbers: 555-123-4567 (not 5551234567)
- Credit cards: 1234 5678 9012 3456 (not 1234567890123456)

The magic number is 7±2 chunks - most people can hold this many items in working memory.

**3. Spaced Repetition**

Instead of cramming, review information at increasing intervals:
- First review: 1 day later
- Second review: 3 days later
- Third review: 1 week later
- Fourth review: 2 weeks later
- Fifth review: 1 month later

This leverages the "spacing effect" - our brains remember better when learning is distributed over time.

**4. Elaborative Encoding**

Connect new information to existing knowledge:
- Ask "why" and "how" questions
- Create personal connections
- Generate examples
- Explain concepts in your own words

The more connections you create, the more retrieval paths you build.

**5. Visualization**

Create vivid mental images:
- Make them colorful and exaggerated
- Add motion and emotion
- Engage multiple senses
- Make them personally meaningful

Visual memory is often stronger than verbal memory.

**6. The Peg System**

Associate numbers with rhyming words:
- One = Sun
- Two = Shoe
- Three = Tree
- Four = Door
- Five = Hive

Then create vivid images linking what you want to remember with these pegs.

**7. Acronyms and Acrostics**

Create memorable phrases:
- HOMES for the Great Lakes (Huron, Ontario, Michigan, Erie, Superior)
- "Every Good Boy Does Fine" for musical notes (E, G, B, D, F)

**Lifestyle Factors for Better Memory**

**Sleep**: Memory consolidation primarily occurs during sleep. Aim for 7-9 hours.

**Exercise**: Physical activity increases blood flow to the brain and promotes neurogenesis.

**Nutrition**: Omega-3 fatty acids, antioxidants, and B vitamins support memory.

**Stress Management**: Chronic stress impairs memory formation and retrieval.

**Social Engagement**: Conversations and social interactions stimulate memory systems.

**Practice Exercises**

1. **Daily Memory Challenge**: Each morning, memorize a short list (5-10 items) using different techniques
2. **Name-Face Association**: When meeting someone, create a vivid association between their name and a facial feature
3. **Backward Recall**: At day's end, recall your day's events in reverse chronological order
4. **Memory Palace Practice**: Create a memory palace for a topic you're learning

**Common Memory Myths**

- **Myth**: "I have a bad memory" - Memory is a skill that can be improved
- **Myth**: "Multitasking helps memory" - It actually impairs encoding
- **Myth**: "Memory decline is inevitable" - Active engagement can maintain memory

**Moving Forward**

Choose 2-3 techniques that resonate with you and practice them consistently for the next week. Track your progress and notice improvements. Remember, like any skill, memory enhancement requires regular practice.

In our next lesson, we'll explore attention and focus strategies to complement your enhanced memory capabilities.`
        },
        de: {
            title: "Techniken zur Gedächtnisverbesserung",
            content: `Das Gedächtnis ist eine der wichtigsten kognitiven Funktionen und ermöglicht es uns, Informationen zu speichern und abzurufen, die unsere Identität, unser Wissen und unser tägliches Funktionieren prägen. Diese Lektion erforscht bewährte Techniken zur Verbesserung sowohl des Kurzzeit- als auch des Langzeitgedächtnisses.

**Gedächtnis verstehen**

Das Gedächtnis ist kein einzelnes System, sondern vielmehr mehrere miteinander verbundene Prozesse:

- **Sensorisches Gedächtnis**: Kurze Speicherung sensorischer Informationen (weniger als 1 Sekunde)
- **Kurzzeitgedächtnis**: Temporäre Speicherung von Informationen (15-30 Sekunden)
- **Arbeitsgedächtnis**: Aktive Manipulation von Informationen für komplexe Aufgaben
- **Langzeitgedächtnis**: Potenziell dauerhafte Speicherung von Informationen

**Die Wissenschaft der Gedächtnisbildung**

Die Gedächtnisbildung umfasst drei Schlüsselphasen:

1. **Kodierung**: Umwandlung von Informationen in eine speicherbare Form
2. **Konsolidierung**: Stabilisierung und Stärkung von Gedächtnisspuren
3. **Abruf**: Zugriff auf gespeicherte Informationen bei Bedarf

Das Verständnis dieser Phasen hilft uns, Techniken effektiver anzuwenden.

**Bewährte Techniken zur Gedächtnisverbesserung**

**1. Die Loci-Methode (Gedächtnispalast)**

Diese alte Technik beinhaltet die Verknüpfung von Informationen mit bestimmten Orten an einem vertrauten Ort. So verwenden Sie sie:
- Wählen Sie eine vertraute Route (Ihr Zuhause, Arbeitsweg usw.)
- Erstellen Sie lebhafte mentale Bilder von Dingen, die Sie sich merken möchten
- Platzieren Sie diese Bilder an bestimmten Orten entlang Ihrer Route
- Zum Erinnern gehen Sie mental Ihre Route durch

Forschungen zeigen, dass diese Technik das Gedächtnis dramatisch verbessern kann, wobei einige Praktizierende sich Hunderte von Elementen in Reihenfolge merken können.

**2. Chunking**

Das Aufteilen von Informationen in bedeutungsvolle Gruppen erleichtert das Merken. Zum Beispiel:
- Telefonnummern: 555-123-4567 (nicht 5551234567)
- Kreditkarten: 1234 5678 9012 3456 (nicht 1234567890123456)

Die magische Zahl ist 7±2 Chunks - die meisten Menschen können diese Anzahl von Elementen im Arbeitsgedächtnis halten.

**3. Verteilte Wiederholung**

Anstatt zu pauken, wiederholen Sie Informationen in zunehmenden Abständen:
- Erste Wiederholung: 1 Tag später
- Zweite Wiederholung: 3 Tage später
- Dritte Wiederholung: 1 Woche später
- Vierte Wiederholung: 2 Wochen später
- Fünfte Wiederholung: 1 Monat später

Dies nutzt den "Spacing-Effekt" - unser Gehirn erinnert sich besser, wenn das Lernen über die Zeit verteilt ist.

**4. Elaborative Kodierung**

Verbinden Sie neue Informationen mit bestehendem Wissen:
- Stellen Sie "Warum"- und "Wie"-Fragen
- Schaffen Sie persönliche Verbindungen
- Generieren Sie Beispiele
- Erklären Sie Konzepte in Ihren eigenen Worten

Je mehr Verbindungen Sie schaffen, desto mehr Abrufpfade bauen Sie auf.

**5. Visualisierung**

Erstellen Sie lebhafte mentale Bilder:
- Machen Sie sie farbenfroh und übertrieben
- Fügen Sie Bewegung und Emotion hinzu
- Beziehen Sie mehrere Sinne ein
- Machen Sie sie persönlich bedeutsam

Visuelles Gedächtnis ist oft stärker als verbales Gedächtnis.

**6. Das Peg-System**

Verknüpfen Sie Zahlen mit reimenden Wörtern:
- Eins = Sonne
- Zwei = Ei
- Drei = Brei
- Vier = Tier
- Fünf = Strumpf

Erstellen Sie dann lebhafte Bilder, die das, was Sie sich merken möchten, mit diesen Pegs verbinden.

**7. Akronyme und Akrostichons**

Erstellen Sie einprägsame Phrasen:
- HOMES für die Großen Seen (Huron, Ontario, Michigan, Erie, Superior)
- Merksätze für verschiedene Wissensbereiche

**Lebensstilfaktoren für besseres Gedächtnis**

**Schlaf**: Gedächtniskonsolidierung erfolgt hauptsächlich während des Schlafs. Streben Sie 7-9 Stunden an.

**Bewegung**: Körperliche Aktivität erhöht die Durchblutung des Gehirns und fördert die Neurogenese.

**Ernährung**: Omega-3-Fettsäuren, Antioxidantien und B-Vitamine unterstützen das Gedächtnis.

**Stressmanagement**: Chronischer Stress beeinträchtigt Gedächtnisbildung und -abruf.

**Soziales Engagement**: Gespräche und soziale Interaktionen stimulieren Gedächtnissysteme.

**Übungen**

1. **Tägliche Gedächtnisherausforderung**: Merken Sie sich jeden Morgen eine kurze Liste (5-10 Elemente) mit verschiedenen Techniken
2. **Name-Gesicht-Assoziation**: Erstellen Sie beim Kennenlernen eine lebhafte Assoziation zwischen Namen und Gesichtsmerkmal
3. **Rückwärtserinnerung**: Erinnern Sie sich am Tagesende an die Ereignisse in umgekehrter chronologischer Reihenfolge
4. **Gedächtnispalast-Übung**: Erstellen Sie einen Gedächtnispalast für ein Thema, das Sie lernen

**Häufige Gedächtnismythen**

- **Mythos**: "Ich habe ein schlechtes Gedächtnis" - Gedächtnis ist eine Fähigkeit, die verbessert werden kann
- **Mythos**: "Multitasking hilft dem Gedächtnis" - Es beeinträchtigt tatsächlich die Kodierung
- **Mythos**: "Gedächtnisverlust ist unvermeidlich" - Aktives Engagement kann das Gedächtnis erhalten

**Weitermachen**

Wählen Sie 2-3 Techniken, die bei Ihnen ankommen, und üben Sie sie konsequent für die nächste Woche. Verfolgen Sie Ihren Fortschritt und bemerken Sie Verbesserungen. Denken Sie daran, wie jede Fähigkeit erfordert Gedächtnisverbesserung regelmäßige Übung.

In unserer nächsten Lektion werden wir Aufmerksamkeits- und Fokusstrategien erkunden, um Ihre verbesserten Gedächtnisfähigkeiten zu ergänzen.`
        },
        fr: {
            title: "Techniques d'amélioration de la mémoire",
            content: `La mémoire est l'une des fonctions cognitives les plus importantes, nous permettant de stocker et de récupérer des informations qui façonnent notre identité, nos connaissances et notre fonctionnement quotidien. Cette leçon explore des techniques éprouvées pour améliorer la mémoire à court et à long terme.

**Comprendre la mémoire**

La mémoire n'est pas un système unique mais plutôt plusieurs processus interconnectés :

- **Mémoire sensorielle** : Rétention brève d'informations sensorielles (moins d'1 seconde)
- **Mémoire à court terme** : Stockage temporaire d'informations (15-30 secondes)
- **Mémoire de travail** : Manipulation active d'informations pour des tâches complexes
- **Mémoire à long terme** : Stockage potentiellement permanent d'informations

**La science de la formation de la mémoire**

La formation de la mémoire implique trois étapes clés :

1. **Encodage** : Conversion de l'information en une forme stockable
2. **Consolidation** : Stabilisation et renforcement des traces mnésiques
3. **Récupération** : Accès aux informations stockées en cas de besoin

Comprendre ces étapes nous aide à appliquer les techniques plus efficacement.

**Techniques éprouvées d'amélioration de la mémoire**

**1. La méthode des loci (Palais de mémoire)**

Cette technique ancienne consiste à associer des informations à des emplacements spécifiques dans un lieu familier. Pour l'utiliser :
- Choisissez un itinéraire familier (votre maison, trajet quotidien, etc.)
- Créez des images mentales vives des éléments à mémoriser
- Placez ces images à des emplacements spécifiques le long de votre itinéraire
- Pour vous souvenir, parcourez mentalement votre itinéraire

Les recherches montrent que cette technique peut améliorer considérablement la mémoire, certains praticiens mémorisant des centaines d'éléments dans l'ordre.

**2. Le chunking**

Diviser l'information en groupes significatifs facilite la mémorisation. Par exemple :
- Numéros de téléphone : 555-123-4567 (pas 5551234567)
- Cartes de crédit : 1234 5678 9012 3456 (pas 1234567890123456)

Le nombre magique est 7±2 chunks - la plupart des gens peuvent retenir ce nombre d'éléments en mémoire de travail.

**3. La répétition espacée**

Au lieu de bachoter, révisez les informations à intervalles croissants :
- Première révision : 1 jour plus tard
- Deuxième révision : 3 jours plus tard
- Troisième révision : 1 semaine plus tard
- Quatrième révision : 2 semaines plus tard
- Cinquième révision : 1 mois plus tard

Cela exploite "l'effet d'espacement" - notre cerveau se souvient mieux lorsque l'apprentissage est distribué dans le temps.

**4. L'encodage élaboratif**

Connectez les nouvelles informations aux connaissances existantes :
- Posez des questions "pourquoi" et "comment"
- Créez des connexions personnelles
- Générez des exemples
- Expliquez les concepts avec vos propres mots

Plus vous créez de connexions, plus vous construisez de chemins de récupération.

**5. La visualisation**

Créez des images mentales vives :
- Rendez-les colorées et exagérées
- Ajoutez du mouvement et de l'émotion
- Engagez plusieurs sens
- Rendez-les personnellement significatives

La mémoire visuelle est souvent plus forte que la mémoire verbale.

**6. Le système de chevilles**

Associez des nombres à des mots qui riment :
- Un = Brun
- Deux = Feu
- Trois = Bois
- Quatre = Quatre
- Cinq = Zinc

Créez ensuite des images vives reliant ce que vous voulez mémoriser à ces chevilles.

**7. Acronymes et acrostiches**

Créez des phrases mémorables :
- HOMES pour les Grands Lacs (Huron, Ontario, Michigan, Erie, Superior)
- Phrases mnémotechniques pour divers domaines de connaissance

**Facteurs de style de vie pour une meilleure mémoire**

**Sommeil** : La consolidation de la mémoire se produit principalement pendant le sommeil. Visez 7-9 heures.

**Exercice** : L'activité physique augmente le flux sanguin vers le cerveau et favorise la neurogenèse.

**Nutrition** : Les acides gras oméga-3, les antioxydants et les vitamines B soutiennent la mémoire.

**Gestion du stress** : Le stress chronique altère la formation et la récupération de la mémoire.

**Engagement social** : Les conversations et interactions sociales stimulent les systèmes de mémoire.

**Exercices pratiques**

1. **Défi mémoire quotidien** : Chaque matin, mémorisez une courte liste (5-10 éléments) en utilisant différentes techniques
2. **Association nom-visage** : Lors d'une rencontre, créez une association vive entre le nom et un trait du visage
3. **Rappel inversé** : En fin de journée, rappelez-vous les événements en ordre chronologique inverse
4. **Pratique du palais de mémoire** : Créez un palais de mémoire pour un sujet que vous apprenez

**Mythes courants sur la mémoire**

- **Mythe** : "J'ai une mauvaise mémoire" - La mémoire est une compétence qui peut être améliorée
- **Mythe** : "Le multitâche aide la mémoire" - Il altère en fait l'encodage
- **Mythe** : "Le déclin de la mémoire est inévitable" - L'engagement actif peut maintenir la mémoire

**Aller de l'avant**

Choisissez 2-3 techniques qui résonnent avec vous et pratiquez-les régulièrement pendant la semaine prochaine. Suivez vos progrès et remarquez les améliorations. Rappelez-vous, comme toute compétence, l'amélioration de la mémoire nécessite une pratique régulière.

Dans notre prochaine leçon, nous explorerons les stratégies d'attention et de concentration pour compléter vos capacités de mémoire améliorées.`
        },
        pt: {
            title: "Técnicas de Melhoria da Memória",
            content: `A memória é uma das funções cognitivas mais importantes, permitindo-nos armazenar e recuperar informações que moldam nossa identidade, conhecimento e funcionamento diário. Esta lição explora técnicas comprovadas para melhorar tanto a memória de curto quanto de longo prazo.

**Compreendendo a Memória**

A memória não é um sistema único, mas sim múltiplos processos interconectados:

- **Memória Sensorial**: Retenção breve de informações sensoriais (menos de 1 segundo)
- **Memória de Curto Prazo**: Armazenamento temporário de informações (15-30 segundos)
- **Memória de Trabalho**: Manipulação ativa de informações para tarefas complexas
- **Memória de Longo Prazo**: Armazenamento potencialmente permanente de informações

**A Ciência da Formação da Memória**

A formação da memória envolve três estágios principais:

1. **Codificação**: Conversão de informações em uma forma armazenável
2. **Consolidação**: Estabilização e fortalecimento de traços de memória
3. **Recuperação**: Acesso a informações armazenadas quando necessário

Compreender esses estágios nos ajuda a aplicar técnicas de forma mais eficaz.

**Técnicas Comprovadas de Melhoria da Memória**

**1. O Método dos Loci (Palácio da Memória)**

Esta técnica antiga envolve associar informações a locais específicos em um lugar familiar. Para usá-la:
- Escolha uma rota familiar (sua casa, trajeto diário, etc.)
- Crie imagens mentais vívidas dos itens que deseja lembrar
- Coloque essas imagens em locais específicos ao longo de sua rota
- Para lembrar, percorra mentalmente sua rota

Pesquisas mostram que esta técnica pode melhorar dramaticamente a memória, com alguns praticantes lembrando centenas de itens em ordem.

**2. Chunking**

Dividir informações em grupos significativos facilita a memorização. Por exemplo:
- Números de telefone: 555-123-4567 (não 5551234567)
- Cartões de crédito: 1234 5678 9012 3456 (não 1234567890123456)

O número mágico é 7±2 chunks - a maioria das pessoas pode reter esse número de itens na memória de trabalho.

**3. Repetição Espaçada**

Em vez de estudar intensivamente, revise informações em intervalos crescentes:
- Primeira revisão: 1 dia depois
- Segunda revisão: 3 dias depois
- Terceira revisão: 1 semana depois
- Quarta revisão: 2 semanas depois
- Quinta revisão: 1 mês depois

Isso aproveita o "efeito de espaçamento" - nosso cérebro lembra melhor quando o aprendizado é distribuído ao longo do tempo.

**4. Codificação Elaborativa**

Conecte novas informações ao conhecimento existente:
- Faça perguntas "por quê" e "como"
- Crie conexões pessoais
- Gere exemplos
- Explique conceitos com suas próprias palavras

Quanto mais conexões você criar, mais caminhos de recuperação você constrói.

**5. Visualização**

Crie imagens mentais vívidas:
- Torne-as coloridas e exageradas
- Adicione movimento e emoção
- Envolva múltiplos sentidos
- Torne-as pessoalmente significativas

A memória visual é frequentemente mais forte que a memória verbal.

**6. O Sistema de Pinos**

Associe números a palavras que rimam:
- Um = Jejum
- Dois = Voz
- Três = Mês
- Quatro = Prato
- Cinco = Cinco

Em seguida, crie imagens vívidas ligando o que você quer lembrar a esses pinos.

**7. Acrônimos e Acrósticos**

Crie frases memoráveis:
- HOMES para os Grandes Lagos (Huron, Ontario, Michigan, Erie, Superior)
- Frases mnemônicas para várias áreas de conhecimento

**Fatores de Estilo de Vida para Melhor Memória**

**Sono**: A consolidação da memória ocorre principalmente durante o sono. Procure 7-9 horas.

**Exercício**: A atividade física aumenta o fluxo sanguíneo para o cérebro e promove a neurogênese.

**Nutrição**: Ácidos graxos ômega-3, antioxidantes e vitaminas B apoiam a memória.

**Gestão de Estresse**: O estresse crônico prejudica a formação e recuperação da memória.

**Engajamento Social**: Conversas e interações sociais estimulam os sistemas de memória.

**Exercícios Práticos**

1. **Desafio Diário de Memória**: Cada manhã, memorize uma lista curta (5-10 itens) usando diferentes técnicas
2. **Associação Nome-Rosto**: Ao conhecer alguém, crie uma associação vívida entre o nome e uma característica facial
3. **Recordação Reversa**: No final do dia, lembre-se dos eventos em ordem cronológica inversa
4. **Prática do Palácio da Memória**: Crie um palácio da memória para um tópico que está aprendendo

**Mitos Comuns sobre Memória**

- **Mito**: "Eu tenho uma memória ruim" - A memória é uma habilidade que pode ser melhorada
- **Mito**: "Multitarefa ajuda a memória" - Na verdade prejudica a codificação
- **Mito**: "O declínio da memória é inevitável" - O engajamento ativo pode manter a memória

**Seguindo em Frente**

Escolha 2-3 técnicas que ressoam com você e pratique-as consistentemente pela próxima semana. Acompanhe seu progresso e observe melhorias. Lembre-se, como qualquer habilidade, a melhoria da memória requer prática regular.

Em nossa próxima lição, exploraremos estratégias de atenção e foco para complementar suas capacidades de memória aprimoradas.`
        }
    }
};

async function main() {
    console.log("Creating expanded Memory Enhancement lesson in all languages...\n");

    try {
        const batch = db.batch();
        let count = 0;

        for (const [lang, data] of Object.entries(expandedLessons.lesson_memory)) {
            const lessonId = lang === 'en' ? 'lesson_memory' : `lesson_memory_${lang}`;
            const courseId = lang === 'en' ? 'course_cognitive_wellness' : `course_cognitive_wellness_${lang}`;

            const lessonRef = db.collection('lessons').doc(lessonId);
            batch.set(lessonRef, {
                title: data.title,
                content: data.content,
                courseId: courseId,
                language: lang,
                orderIndex: 2,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log(`✓ ${lang.toUpperCase()}: ${data.title}`);
            console.log(`  Content length: ${data.content.length} characters\n`);
            count++;
        }

        await batch.commit();
        console.log(`\n✅ Successfully created/updated ${count} lesson versions for Memory Enhancement!`);

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
