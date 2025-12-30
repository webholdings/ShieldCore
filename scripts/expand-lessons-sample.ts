import { db } from "../server/db";

// This script will expand existing English lessons and create complete translations
// Due to the large volume, I'll create a template-based approach with proper educational content

const expandedLessons = {
    lesson_intro: {
        en: {
            title: "Introduction to Cognitive Wellness",
            content: `Welcome to your cognitive wellness journey! This comprehensive program is designed to help you enhance your cognitive abilities through evidence-based techniques and practices.

**What is Cognitive Wellness?**

Cognitive wellness refers to the optimal functioning of your mental processes, including memory, attention, problem-solving, and decision-making. It's not just about preventing cognitive decline—it's about actively nurturing and enhancing your brain's capabilities throughout your life.

**Why Cognitive Wellness Matters**

Your brain is your most valuable asset. It controls everything you do, think, and feel. Just as physical fitness requires regular exercise and proper nutrition, cognitive wellness requires consistent mental stimulation, healthy lifestyle choices, and targeted brain training.

Research shows that people who actively engage in cognitive wellness practices experience:
- Improved memory and recall
- Better focus and concentration
- Enhanced problem-solving abilities
- Increased creativity and innovation
- Greater resilience to stress
- Reduced risk of cognitive decline with age

**What You'll Learn**

Over the next 20 lessons, you'll discover practical strategies and techniques to:

1. **Enhance Memory**: Learn proven methods to improve both short-term and long-term memory, including mnemonic devices, visualization techniques, and spaced repetition.

2. **Boost Attention**: Develop the ability to maintain focus in our distraction-filled world through mindfulness practices and attention training exercises.

3. **Sharpen Problem-Solving**: Master structured approaches to tackle complex challenges and make better decisions.

4. **Foster Creativity**: Unlock your creative potential through techniques that promote divergent thinking and innovation.

5. **Optimize Brain Health**: Understand the crucial role of nutrition, sleep, exercise, and stress management in maintaining peak cognitive function.

**The Science Behind the Program**

This course is grounded in neuroscience research and draws from multiple disciplines including cognitive psychology, neurology, and behavioral science. Each lesson incorporates evidence-based practices that have been shown to enhance cognitive function.

**Your Commitment**

Cognitive wellness is a journey, not a destination. To get the most from this program:
- Complete each lesson in order
- Practice the techniques regularly
- Apply what you learn to your daily life
- Be patient with yourself—cognitive changes take time
- Stay curious and open to new ideas

**Getting Started**

As you begin this journey, remember that every brain is unique. What works best for one person may differ for another. Experiment with the techniques presented, pay attention to what resonates with you, and adapt the practices to fit your lifestyle and goals.

Let's embark on this exciting journey to unlock your brain's full potential!`
        },
        de: {
            title: "Einführung in die kognitive Wellness",
            content: `Willkommen auf Ihrer Reise zum kognitiven Wohlbefinden! Dieses umfassende Programm wurde entwickelt, um Ihnen zu helfen, Ihre kognitiven Fähigkeiten durch evidenzbasierte Techniken und Praktiken zu verbessern.

**Was ist kognitive Wellness?**

Kognitive Wellness bezieht sich auf die optimale Funktion Ihrer mentalen Prozesse, einschließlich Gedächtnis, Aufmerksamkeit, Problemlösung und Entscheidungsfindung. Es geht nicht nur darum, kognitiven Abbau zu verhindern – es geht darum, die Fähigkeiten Ihres Gehirns aktiv zu pflegen und zu verbessern.

**Warum kognitive Wellness wichtig ist**

Ihr Gehirn ist Ihr wertvollstes Gut. Es kontrolliert alles, was Sie tun, denken und fühlen. Genau wie körperliche Fitness regelmäßige Bewegung und richtige Ernährung erfordert, benötigt kognitive Wellness konsequente mentale Stimulation, gesunde Lebensgewohnheiten und gezieltes Gehirntraining.

Forschungen zeigen, dass Menschen, die sich aktiv mit kognitiver Wellness beschäftigen, Folgendes erleben:
- Verbessertes Gedächtnis und Erinnerungsvermögen
- Besserer Fokus und Konzentration
- Verbesserte Problemlösungsfähigkeiten
- Gesteigerte Kreativität und Innovation
- Größere Stressresilienz
- Reduziertes Risiko für kognitiven Abbau im Alter

**Was Sie lernen werden**

In den nächsten 20 Lektionen entdecken Sie praktische Strategien und Techniken, um:

1. **Gedächtnis verbessern**: Lernen Sie bewährte Methoden zur Verbesserung des Kurzzeit- und Langzeitgedächtnisses, einschließlich Mnemotechniken, Visualisierungstechniken und verteilter Wiederholung.

2. **Aufmerksamkeit steigern**: Entwickeln Sie die Fähigkeit, in unserer ablenkungsreichen Welt den Fokus aufrechtzuerhalten durch Achtsamkeitspraktiken und Aufmerksamkeitstraining.

3. **Problemlösung schärfen**: Meistern Sie strukturierte Ansätze zur Bewältigung komplexer Herausforderungen und treffen Sie bessere Entscheidungen.

4. **Kreativität fördern**: Entfesseln Sie Ihr kreatives Potenzial durch Techniken, die divergentes Denken und Innovation fördern.

5. **Gehirngesundheit optimieren**: Verstehen Sie die entscheidende Rolle von Ernährung, Schlaf, Bewegung und Stressmanagement für die Aufrechterhaltung optimaler kognitiver Funktion.

**Die Wissenschaft hinter dem Programm**

Dieser Kurs basiert auf neurowissenschaftlicher Forschung und schöpft aus mehreren Disziplinen, darunter kognitive Psychologie, Neurologie und Verhaltenswissenschaft. Jede Lektion enthält evidenzbasierte Praktiken, die nachweislich die kognitive Funktion verbessern.

**Ihr Engagement**

Kognitive Wellness ist eine Reise, kein Ziel. Um das Beste aus diesem Programm herauszuholen:
- Absolvieren Sie jede Lektion in der richtigen Reihenfolge
- Üben Sie die Techniken regelmäßig
- Wenden Sie das Gelernte in Ihrem täglichen Leben an
- Seien Sie geduldig mit sich selbst – kognitive Veränderungen brauchen Zeit
- Bleiben Sie neugierig und offen für neue Ideen

**Erste Schritte**

Denken Sie daran, dass jedes Gehirn einzigartig ist. Was für eine Person am besten funktioniert, kann für eine andere anders sein. Experimentieren Sie mit den vorgestellten Techniken, achten Sie darauf, was bei Ihnen ankommt, und passen Sie die Praktiken an Ihren Lebensstil und Ihre Ziele an.

Lassen Sie uns diese spannende Reise beginnen, um das volle Potenzial Ihres Gehirns freizusetzen!`
        },
        fr: {
            title: "Introduction au bien-être cognitif",
            content: `Bienvenue dans votre parcours de bien-être cognitif ! Ce programme complet est conçu pour vous aider à améliorer vos capacités cognitives grâce à des techniques et pratiques fondées sur des preuves.

**Qu'est-ce que le bien-être cognitif ?**

Le bien-être cognitif fait référence au fonctionnement optimal de vos processus mentaux, y compris la mémoire, l'attention, la résolution de problèmes et la prise de décision. Il ne s'agit pas seulement de prévenir le déclin cognitif, mais de nourrir et d'améliorer activement les capacités de votre cerveau tout au long de votre vie.

**Pourquoi le bien-être cognitif est important**

Votre cerveau est votre atout le plus précieux. Il contrôle tout ce que vous faites, pensez et ressentez. Tout comme la forme physique nécessite un exercice régulier et une nutrition appropriée, le bien-être cognitif nécessite une stimulation mentale constante, des choix de vie sains et un entraînement cérébral ciblé.

Les recherches montrent que les personnes qui s'engagent activement dans des pratiques de bien-être cognitif connaissent :
- Une mémoire et un rappel améliorés
- Une meilleure concentration et attention
- Des capacités de résolution de problèmes améliorées
- Une créativité et une innovation accrues
- Une plus grande résilience au stress
- Un risque réduit de déclin cognitif avec l'âge

**Ce que vous apprendrez**

Au cours des 20 prochaines leçons, vous découvrirez des stratégies et techniques pratiques pour :

1. **Améliorer la mémoire** : Apprenez des méthodes éprouvées pour améliorer la mémoire à court et à long terme, y compris les dispositifs mnémoniques, les techniques de visualisation et la répétition espacée.

2. **Renforcer l'attention** : Développez la capacité de maintenir la concentration dans notre monde rempli de distractions grâce à des pratiques de pleine conscience et des exercices d'entraînement de l'attention.

3. **Affiner la résolution de problèmes** : Maîtrisez des approches structurées pour relever des défis complexes et prendre de meilleures décisions.

4. **Favoriser la créativité** : Libérez votre potentiel créatif grâce à des techniques qui favorisent la pensée divergente et l'innovation.

5. **Optimiser la santé cérébrale** : Comprenez le rôle crucial de la nutrition, du sommeil, de l'exercice et de la gestion du stress dans le maintien d'une fonction cognitive optimale.

**La science derrière le programme**

Ce cours est fondé sur la recherche en neurosciences et s'inspire de plusieurs disciplines, notamment la psychologie cognitive, la neurologie et les sciences du comportement. Chaque leçon intègre des pratiques fondées sur des preuves qui ont démontré leur efficacité pour améliorer la fonction cognitive.

**Votre engagement**

Le bien-être cognitif est un voyage, pas une destination. Pour tirer le meilleur parti de ce programme :
- Complétez chaque leçon dans l'ordre
- Pratiquez les techniques régulièrement
- Appliquez ce que vous apprenez à votre vie quotidienne
- Soyez patient avec vous-même – les changements cognitifs prennent du temps
- Restez curieux et ouvert aux nouvelles idées

**Pour commencer**

En commençant ce voyage, rappelez-vous que chaque cerveau est unique. Ce qui fonctionne le mieux pour une personne peut différer pour une autre. Expérimentez avec les techniques présentées, faites attention à ce qui résonne avec vous et adaptez les pratiques à votre style de vie et à vos objectifs.

Embarquons dans ce voyage passionnant pour libérer tout le potentiel de votre cerveau !`
        },
        pt: {
            title: "Introdução ao Bem-Estar Cognitivo",
            content: `Bem-vindo à sua jornada de bem-estar cognitivo! Este programa abrangente foi projetado para ajudá-lo a melhorar suas habilidades cognitivas através de técnicas e práticas baseadas em evidências.

**O que é Bem-Estar Cognitivo?**

O bem-estar cognitivo refere-se ao funcionamento ideal dos seus processos mentais, incluindo memória, atenção, resolução de problemas e tomada de decisões. Não se trata apenas de prevenir o declínio cognitivo – trata-se de nutrir e melhorar ativamente as capacidades do seu cérebro ao longo da vida.

**Por que o Bem-Estar Cognitivo é Importante**

Seu cérebro é seu ativo mais valioso. Ele controla tudo o que você faz, pensa e sente. Assim como a aptidão física requer exercício regular e nutrição adequada, o bem-estar cognitivo requer estimulação mental consistente, escolhas de estilo de vida saudáveis e treinamento cerebral direcionado.

Pesquisas mostram que pessoas que se envolvem ativamente em práticas de bem-estar cognitivo experimentam:
- Memória e recordação melhoradas
- Melhor foco e concentração
- Habilidades aprimoradas de resolução de problemas
- Maior criatividade e inovação
- Maior resiliência ao estresse
- Risco reduzido de declínio cognitivo com a idade

**O que Você Vai Aprender**

Ao longo das próximas 20 lições, você descobrirá estratégias e técnicas práticas para:

1. **Melhorar a Memória**: Aprenda métodos comprovados para melhorar a memória de curto e longo prazo, incluindo dispositivos mnemônicos, técnicas de visualização e repetição espaçada.

2. **Aumentar a Atenção**: Desenvolva a capacidade de manter o foco em nosso mundo cheio de distrações através de práticas de atenção plena e exercícios de treinamento de atenção.

3. **Aprimorar a Resolução de Problemas**: Domine abordagens estruturadas para enfrentar desafios complexos e tomar melhores decisões.

4. **Promover a Criatividade**: Desbloqueie seu potencial criativo através de técnicas que promovem o pensamento divergente e a inovação.

5. **Otimizar a Saúde Cerebral**: Compreenda o papel crucial da nutrição, sono, exercício e gestão de estresse na manutenção da função cognitiva ideal.

**A Ciência Por Trás do Programa**

Este curso é fundamentado em pesquisas de neurociência e baseia-se em múltiplas disciplinas, incluindo psicologia cognitiva, neurologia e ciência comportamental. Cada lição incorpora práticas baseadas em evidências que demonstraram melhorar a função cognitiva.

**Seu Compromisso**

O bem-estar cognitivo é uma jornada, não um destino. Para aproveitar ao máximo este programa:
- Complete cada lição em ordem
- Pratique as técnicas regularmente
- Aplique o que aprender em sua vida diária
- Seja paciente consigo mesmo – mudanças cognitivas levam tempo
- Mantenha-se curioso e aberto a novas ideias

**Começando**

Ao iniciar esta jornada, lembre-se de que cada cérebro é único. O que funciona melhor para uma pessoa pode diferir para outra. Experimente as técnicas apresentadas, preste atenção ao que ressoa com você e adapte as práticas ao seu estilo de vida e objetivos.

Vamos embarcar nesta jornada emocionante para desbloquear todo o potencial do seu cérebro!`
        }
    }
};

async function main() {
    console.log("Expanding and translating lesson: Introduction to Cognitive Wellness\n");

    try {
        const batch = db.batch();
        let count = 0;

        // Update/Create lessons for all languages
        for (const [lang, data] of Object.entries(expandedLessons.lesson_intro)) {
            const lessonId = lang === 'en' ? 'lesson_intro' : `lesson_intro_${lang}`;
            const courseId = lang === 'en' ? 'course_cognitive_wellness' : `course_cognitive_wellness_${lang}`;

            const lessonRef = db.collection('lessons').doc(lessonId);
            batch.set(lessonRef, {
                title: data.title,
                content: data.content,
                courseId: courseId,
                language: lang,
                orderIndex: 1,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log(`✓ ${lang.toUpperCase()}: ${data.title}`);
            console.log(`  Content length: ${data.content.length} characters\n`);
            count++;
        }

        await batch.commit();
        console.log(`\n✅ Successfully updated/created ${count} lesson versions!`);
        console.log("\nNOTE: This is just the first lesson. Due to the large volume (20 lessons × 4 languages = 80 lessons),");
        console.log("I recommend we do this in batches. Would you like me to continue with the remaining lessons?");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
