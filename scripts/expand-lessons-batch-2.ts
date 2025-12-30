import { db } from "../server/db";

// Batch 2: Lessons 4-8 (Problem-Solving, Creative Thinking, Mindfulness, Brain Nutrition, Sleep)

const lessons = [
    {
        id: "lesson_problem_solving",
        orderIndex: 4,
        en: {
            title: "Problem-Solving Skills", content: `Effective problem-solving is a critical cognitive skill that helps us navigate life's challenges with confidence and creativity. This lesson provides structured approaches to tackle complex problems systematically.

**The Problem-Solving Process**

1. **Define the Problem**: Clearly articulate what needs to be solved
2. **Gather Information**: Collect relevant data and context
3. **Generate Solutions**: Brainstorm multiple possible approaches
4. **Evaluate Options**: Assess pros and cons of each solution
5. **Implement**: Execute the chosen solution
6. **Review**: Assess results and learn from the outcome

**Cognitive Strategies**

**Analytical Thinking**: Break complex problems into manageable parts. Use logic trees, flowcharts, and systematic analysis.

**Creative Thinking**: Generate unconventional solutions through brainstorming, lateral thinking, and "what if" scenarios.

**Critical Thinking**: Question assumptions, evaluate evidence, and consider multiple perspectives before deciding.

**Systems Thinking**: Understand how different elements interact and influence each other within the larger context.

**Problem-Solving Techniques**

**The 5 Whys**: Ask "why" five times to get to the root cause of a problem. This technique, developed by Toyota, helps identify underlying issues rather than symptoms.

**SWOT Analysis**: Evaluate Strengths, Weaknesses, Opportunities, and Threats to understand all aspects of a situation.

**Mind Mapping**: Create visual diagrams connecting ideas and concepts to see relationships and generate new insights.

**Reverse Engineering**: Start with the desired outcome and work backwards to identify necessary steps.

**The Eisenhower Matrix**: Prioritize problems by urgency and importance to focus on what truly matters.

**Common Problem-Solving Pitfalls**

- **Confirmation Bias**: Seeking only information that supports existing beliefs
- **Analysis Paralysis**: Over-analyzing without taking action
- **Jumping to Solutions**: Implementing the first idea without proper evaluation
- **Emotional Decision-Making**: Letting emotions override logical analysis
- **Groupthink**: Conforming to group consensus without critical evaluation

**Developing Problem-Solving Skills**

Practice with puzzles, brain teasers, and real-world challenges. Reflect on past problem-solving experiences to identify what worked and what didn't. Seek diverse perspectives and collaborate with others to expand your thinking.

**Practical Exercises**

1. Daily Problem Journal: Document problems you encounter and how you solve them
2. Case Study Analysis: Study how others have solved similar problems
3. Constraint Challenges: Solve problems with artificial constraints to boost creativity
4. Post-Mortem Reviews: Analyze both successful and unsuccessful problem-solving attempts

Remember, effective problem-solving is a skill that improves with practice and reflection.` },
        de: {
            title: "Problemlösungsfähigkeiten", content: `Effektive Problemlösung ist eine kritische kognitive Fähigkeit, die uns hilft, Lebensherausforderungen mit Zuversicht und Kreativität zu meistern. Diese Lektion bietet strukturierte Ansätze zur systematischen Bewältigung komplexer Probleme.

**Der Problemlösungsprozess**

1. **Problem definieren**: Klar artikulieren, was gelöst werden muss
2. **Informationen sammeln**: Relevante Daten und Kontext sammeln
3. **Lösungen generieren**: Mehrere mögliche Ansätze brainstormen
4. **Optionen bewerten**: Vor- und Nachteile jeder Lösung bewerten
5. **Implementieren**: Die gewählte Lösung ausführen
6. **Überprüfen**: Ergebnisse bewerten und aus dem Ergebnis lernen

**Kognitive Strategien**

**Analytisches Denken**: Komplexe Probleme in handhabbare Teile zerlegen. Logikbäume, Flussdiagramme und systematische Analyse verwenden.

**Kreatives Denken**: Unkonventionelle Lösungen durch Brainstorming, laterales Denken und "Was-wäre-wenn"-Szenarien generieren.

**Kritisches Denken**: Annahmen hinterfragen, Beweise bewerten und mehrere Perspektiven berücksichtigen.

**Systemdenken**: Verstehen, wie verschiedene Elemente im größeren Kontext interagieren und sich gegenseitig beeinflussen.

**Problemlösungstechniken**

**Die 5 Warums**: Fünfmal "warum" fragen, um zur Grundursache eines Problems zu gelangen.

**SWOT-Analyse**: Stärken, Schwächen, Chancen und Bedrohungen bewerten.

**Mind Mapping**: Visuelle Diagramme erstellen, die Ideen und Konzepte verbinden.

**Reverse Engineering**: Mit dem gewünschten Ergebnis beginnen und rückwärts arbeiten.

**Die Eisenhower-Matrix**: Probleme nach Dringlichkeit und Wichtigkeit priorisieren.

**Häufige Problemlösungsfallen**

- **Bestätigungsfehler**: Nur Informationen suchen, die bestehende Überzeugungen unterstützen
- **Analyseparalyse**: Zu viel analysieren ohne zu handeln
- **Zu schnelle Lösungen**: Die erste Idee implementieren ohne richtige Bewertung
- **Emotionale Entscheidungsfindung**: Emotionen die logische Analyse überschreiben lassen
- **Gruppendenken**: Sich dem Gruppenkonsens anpassen ohne kritische Bewertung

**Entwicklung von Problemlösungsfähigkeiten**

Üben Sie mit Rätseln, Denksportaufgaben und realen Herausforderungen. Reflektieren Sie vergangene Problemlösungserfahrungen. Suchen Sie diverse Perspektiven und arbeiten Sie mit anderen zusammen.

**Praktische Übungen**

1. Tägliches Problemjournal: Dokumentieren Sie Probleme und deren Lösungen
2. Fallstudienanalyse: Studieren Sie, wie andere ähnliche Probleme gelöst haben
3. Constraint-Herausforderungen: Lösen Sie Probleme mit künstlichen Einschränkungen
4. Post-Mortem-Reviews: Analysieren Sie erfolgreiche und erfolglose Problemlösungsversuche

Denken Sie daran, effektive Problemlösung ist eine Fähigkeit, die sich mit Übung und Reflexion verbessert.` },
        fr: {
            title: "Compétences en résolution de problèmes", content: `La résolution efficace de problèmes est une compétence cognitive critique qui nous aide à naviguer les défis de la vie avec confiance et créativité. Cette leçon fournit des approches structurées pour aborder systématiquement les problèmes complexes.

**Le processus de résolution de problèmes**

1. **Définir le problème**: Articuler clairement ce qui doit être résolu
2. **Recueillir des informations**: Collecter des données et du contexte pertinents
3. **Générer des solutions**: Faire un brainstorming de plusieurs approches possibles
4. **Évaluer les options**: Évaluer les avantages et inconvénients de chaque solution
5. **Mettre en œuvre**: Exécuter la solution choisie
6. **Examiner**: Évaluer les résultats et apprendre du résultat

**Stratégies cognitives**

**Pensée analytique**: Décomposer les problèmes complexes en parties gérables. Utiliser des arbres logiques, des organigrammes et une analyse systématique.

**Pensée créative**: Générer des solutions non conventionnelles par le brainstorming, la pensée latérale et les scénarios "et si".

**Pensée critique**: Questionner les hypothèses, évaluer les preuves et considérer plusieurs perspectives.

**Pensée systémique**: Comprendre comment différents éléments interagissent dans le contexte plus large.

**Techniques de résolution de problèmes**

**Les 5 Pourquoi**: Demander "pourquoi" cinq fois pour arriver à la cause racine d'un problème.

**Analyse SWOT**: Évaluer les Forces, Faiblesses, Opportunités et Menaces.

**Carte mentale**: Créer des diagrammes visuels reliant idées et concepts.

**Rétro-ingénierie**: Commencer par le résultat souhaité et travailler à rebours.

**La matrice d'Eisenhower**: Prioriser les problèmes par urgence et importance.

**Pièges courants de résolution de problèmes**

- **Biais de confirmation**: Chercher uniquement des informations qui soutiennent les croyances existantes
- **Paralysie de l'analyse**: Sur-analyser sans passer à l'action
- **Sauter aux solutions**: Mettre en œuvre la première idée sans évaluation appropriée
- **Prise de décision émotionnelle**: Laisser les émotions supplanter l'analyse logique
- **Pensée de groupe**: Se conformer au consensus du groupe sans évaluation critique

**Développer les compétences en résolution de problèmes**

Pratiquez avec des puzzles, des casse-têtes et des défis du monde réel. Réfléchissez aux expériences passées de résolution de problèmes. Recherchez des perspectives diverses et collaborez avec d'autres.

**Exercices pratiques**

1. Journal quotidien des problèmes: Documentez les problèmes et comment vous les résolvez
2. Analyse d'études de cas: Étudiez comment d'autres ont résolu des problèmes similaires
3. Défis de contraintes: Résolvez des problèmes avec des contraintes artificielles
4. Examens post-mortem: Analysez les tentatives de résolution réussies et infructueuses

Rappelez-vous, la résolution efficace de problèmes est une compétence qui s'améliore avec la pratique et la réflexion.` },
        pt: {
            title: "Habilidades de Resolução de Problemas", content: `A resolução eficaz de problemas é uma habilidade cognitiva crítica que nos ajuda a navegar pelos desafios da vida com confiança e criatividade. Esta lição fornece abordagens estruturadas para enfrentar problemas complexos sistematicamente.

**O Processo de Resolução de Problemas**

1. **Definir o Problema**: Articular claramente o que precisa ser resolvido
2. **Coletar Informações**: Reunir dados e contexto relevantes
3. **Gerar Soluções**: Fazer brainstorming de múltiplas abordagens possíveis
4. **Avaliar Opções**: Avaliar prós e contras de cada solução
5. **Implementar**: Executar a solução escolhida
6. **Revisar**: Avaliar resultados e aprender com o resultado

**Estratégias Cognitivas**

**Pensamento Analítico**: Dividir problemas complexos em partes gerenciáveis. Usar árvores lógicas, fluxogramas e análise sistemática.

**Pensamento Criativo**: Gerar soluções não convencionais através de brainstorming, pensamento lateral e cenários "e se".

**Pensamento Crítico**: Questionar suposições, avaliar evidências e considerar múltiplas perspectivas.

**Pensamento Sistêmico**: Compreender como diferentes elementos interagem no contexto maior.

**Técnicas de Resolução de Problemas**

**Os 5 Porquês**: Perguntar "por quê" cinco vezes para chegar à causa raiz de um problema.

**Análise SWOT**: Avaliar Forças, Fraquezas, Oportunidades e Ameaças.

**Mapa Mental**: Criar diagramas visuais conectando ideias e conceitos.

**Engenharia Reversa**: Começar com o resultado desejado e trabalhar para trás.

**A Matriz de Eisenhower**: Priorizar problemas por urgência e importância.

**Armadilhas Comuns na Resolução de Problemas**

- **Viés de Confirmação**: Buscar apenas informações que apoiam crenças existentes
- **Paralisia de Análise**: Analisar demais sem agir
- **Pular para Soluções**: Implementar a primeira ideia sem avaliação adequada
- **Tomada de Decisão Emocional**: Deixar emoções sobreporem análise lógica
- **Pensamento de Grupo**: Conformar-se ao consenso do grupo sem avaliação crítica

**Desenvolvendo Habilidades de Resolução de Problemas**

Pratique com quebra-cabeças, desafios mentais e desafios do mundo real. Reflita sobre experiências passadas de resolução de problemas. Busque perspectivas diversas e colabore com outros.

**Exercícios Práticos**

1. Diário Diário de Problemas: Documente problemas e como você os resolve
2. Análise de Estudos de Caso: Estude como outros resolveram problemas similares
3. Desafios de Restrição: Resolva problemas com restrições artificiais
4. Revisões Post-Mortem: Analise tentativas de resolução bem-sucedidas e malsucedidas

Lembre-se, a resolução eficaz de problemas é uma habilidade que melhora com prática e reflexão.` }
    },
    {
        id: "lesson_creative_thinking",
        orderIndex: 5,
        en: {
            title: "Creative Thinking", content: `Creativity isn't just for artists—it's a vital cognitive skill that enhances problem-solving, innovation, and adaptability. This lesson explores techniques to unlock and develop your creative potential.

**Understanding Creativity**

Creativity involves generating novel and useful ideas by making unexpected connections between existing concepts. It requires both divergent thinking (generating many ideas) and convergent thinking (selecting the best ideas).

**The Creative Process**

1. **Preparation**: Immerse yourself in the problem or topic
2. **Incubation**: Step away and let your subconscious work
3. **Illumination**: The "aha!" moment when insight strikes
4. **Verification**: Test and refine the creative idea

**Techniques to Boost Creativity**

**Brainstorming**: Generate as many ideas as possible without judgment. Quantity over quality initially—evaluation comes later.

**SCAMPER Method**:
- Substitute: What can be replaced?
- Combine: What can be merged?
- Adapt: What can be adjusted?
- Modify: What can be changed?
- Put to other uses: How else can this be used?
- Eliminate: What can be removed?
- Reverse: What can be rearranged?

**Random Word Association**: Pick a random word and force connections with your problem. This breaks habitual thinking patterns.

**Six Thinking Hats**: Approach problems from six perspectives (facts, emotions, caution, benefits, creativity, process) to ensure comprehensive thinking.

**Mind Wandering**: Allow your mind to drift during low-stakes activities like walking or showering. Many creative insights emerge during these moments.

**Constraints**: Paradoxically, limitations can boost creativity by forcing novel approaches. Set artificial constraints to stimulate creative thinking.

**Overcoming Creative Blocks**

- Change your environment
- Take breaks and get adequate sleep
- Engage in physical exercise
- Expose yourself to diverse experiences
- Practice mindfulness to quiet the inner critic
- Collaborate with others for fresh perspectives

**Cultivating a Creative Mindset**

- Embrace curiosity and ask "what if" questions
- Challenge assumptions regularly
- View failures as learning opportunities
- Maintain a beginner's mind
- Practice regularly—creativity is a skill, not just talent

**Creative Exercises**

1. **Alternative Uses**: List 20 uses for a common object (e.g., a brick)
2. **Forced Connections**: Randomly select two unrelated concepts and find connections
3. **Reverse Assumptions**: List assumptions about a problem, then reverse each one
4. **Creative Constraints**: Solve a problem using only 3 materials or in 5 minutes

**The Role of Knowledge**

While creativity involves thinking outside the box, you need to know what's in the box first. Deep domain knowledge provides the raw material for creative connections. Balance learning with experimentation.

**Environmental Factors**

Create a creativity-friendly environment: minimize distractions, surround yourself with inspiring stimuli, and establish routines that support creative work. Many creatives find their peak creative hours and protect them fiercely.

Remember, everyone has creative potential. The key is consistent practice and creating conditions that allow creativity to flourish.` },
        de: {
            title: "Kreatives Denken", content: `Kreativität ist nicht nur für Künstler – sie ist eine wichtige kognitive Fähigkeit, die Problemlösung, Innovation und Anpassungsfähigkeit verbessert. Diese Lektion erforscht Techniken, um Ihr kreatives Potenzial freizusetzen und zu entwickeln.

**Kreativität verstehen**

Kreativität beinhaltet das Generieren neuartiger und nützlicher Ideen durch unerwartete Verbindungen zwischen bestehenden Konzepten. Sie erfordert sowohl divergentes Denken (viele Ideen generieren) als auch konvergentes Denken (die besten Ideen auswählen).

**Der kreative Prozess**

1. **Vorbereitung**: Tauchen Sie in das Problem oder Thema ein
2. **Inkubation**: Treten Sie zurück und lassen Sie Ihr Unterbewusstsein arbeiten
3. **Erleuchtung**: Der "Aha!"-Moment, wenn Einsicht eintritt
4. **Verifizierung**: Testen und verfeinern Sie die kreative Idee

**Techniken zur Steigerung der Kreativität**

**Brainstorming**: Generieren Sie so viele Ideen wie möglich ohne Urteil. Zunächst Quantität über Qualität—Bewertung kommt später.

**SCAMPER-Methode**:
- Ersetzen: Was kann ersetzt werden?
- Kombinieren: Was kann zusammengeführt werden?
- Anpassen: Was kann angepasst werden?
- Modifizieren: Was kann geändert werden?
- Andere Verwendung: Wie sonst kann dies verwendet werden?
- Eliminieren: Was kann entfernt werden?
- Umkehren: Was kann neu angeordnet werden?

**Zufällige Wortassoziation**: Wählen Sie ein zufälliges Wort und erzwingen Sie Verbindungen mit Ihrem Problem.

**Sechs Denkhüte**: Nähern Sie sich Problemen aus sechs Perspektiven (Fakten, Emotionen, Vorsicht, Vorteile, Kreativität, Prozess).

**Gedankenwandern**: Erlauben Sie Ihrem Geist, während Aktivitäten mit geringem Einsatz wie Gehen oder Duschen abzuschweifen.

**Einschränkungen**: Paradoxerweise können Einschränkungen die Kreativität steigern, indem sie neuartige Ansätze erzwingen.

**Überwindung kreativer Blockaden**

- Ändern Sie Ihre Umgebung
- Machen Sie Pausen und schlafen Sie ausreichend
- Betreiben Sie körperliche Bewegung
- Setzen Sie sich vielfältigen Erfahrungen aus
- Üben Sie Achtsamkeit, um den inneren Kritiker zu beruhigen
- Arbeiten Sie mit anderen für frische Perspektiven zusammen

**Kultivierung einer kreativen Denkweise**

- Umarmen Sie Neugier und stellen Sie "Was-wäre-wenn"-Fragen
- Hinterfragen Sie regelmäßig Annahmen
- Betrachten Sie Fehler als Lernmöglichkeiten
- Bewahren Sie einen Anfängergeist
- Üben Sie regelmäßig—Kreativität ist eine Fähigkeit, nicht nur Talent

**Kreative Übungen**

1. **Alternative Verwendungen**: Listen Sie 20 Verwendungen für ein gewöhnliches Objekt auf
2. **Erzwungene Verbindungen**: Wählen Sie zufällig zwei unzusammenhängende Konzepte und finden Sie Verbindungen
3. **Umgekehrte Annahmen**: Listen Sie Annahmen über ein Problem auf, dann kehren Sie jede um
4. **Kreative Einschränkungen**: Lösen Sie ein Problem mit nur 3 Materialien oder in 5 Minuten

**Die Rolle des Wissens**

Während Kreativität das Denken außerhalb der Box beinhaltet, müssen Sie zuerst wissen, was in der Box ist. Tiefes Domänenwissen liefert das Rohmaterial für kreative Verbindungen.

Denken Sie daran, jeder hat kreatives Potenzial. Der Schlüssel ist konsequente Übung und die Schaffung von Bedingungen, die Kreativität gedeihen lassen.` },
        fr: {
            title: "Pensée créative", content: `La créativité n'est pas seulement pour les artistes—c'est une compétence cognitive vitale qui améliore la résolution de problèmes, l'innovation et l'adaptabilité. Cette leçon explore des techniques pour débloquer et développer votre potentiel créatif.

**Comprendre la créativité**

La créativité implique de générer des idées nouvelles et utiles en établissant des connexions inattendues entre des concepts existants. Elle nécessite à la fois une pensée divergente (générer de nombreuses idées) et une pensée convergente (sélectionner les meilleures idées).

**Le processus créatif**

1. **Préparation**: Immergez-vous dans le problème ou le sujet
2. **Incubation**: Prenez du recul et laissez votre subconscient travailler
3. **Illumination**: Le moment "eurêka!" où l'insight frappe
4. **Vérification**: Testez et affinez l'idée créative

**Techniques pour stimuler la créativité**

**Brainstorming**: Générez autant d'idées que possible sans jugement. Quantité plutôt que qualité initialement—l'évaluation vient plus tard.

**Méthode SCAMPER**:
- Substituer: Que peut-on remplacer?
- Combiner: Que peut-on fusionner?
- Adapter: Que peut-on ajuster?
- Modifier: Que peut-on changer?
- Utiliser autrement: Comment peut-on l'utiliser autrement?
- Éliminer: Que peut-on supprimer?
- Inverser: Que peut-on réorganiser?

**Association de mots aléatoires**: Choisissez un mot au hasard et forcez des connexions avec votre problème.

**Six chapeaux de la pensée**: Abordez les problèmes sous six perspectives (faits, émotions, prudence, avantages, créativité, processus).

**Vagabondage mental**: Permettez à votre esprit de dériver pendant des activités à faible enjeu comme marcher ou se doucher.

**Contraintes**: Paradoxalement, les limitations peuvent stimuler la créativité en forçant des approches nouvelles.

**Surmonter les blocages créatifs**

- Changez votre environnement
- Prenez des pauses et dormez suffisamment
- Faites de l'exercice physique
- Exposez-vous à des expériences diverses
- Pratiquez la pleine conscience pour calmer le critique intérieur
- Collaborez avec d'autres pour des perspectives fraîches

**Cultiver un état d'esprit créatif**

- Embrassez la curiosité et posez des questions "et si"
- Remettez régulièrement en question les hypothèses
- Considérez les échecs comme des opportunités d'apprentissage
- Maintenez un esprit de débutant
- Pratiquez régulièrement—la créativité est une compétence, pas seulement un talent

**Exercices créatifs**

1. **Utilisations alternatives**: Listez 20 utilisations pour un objet commun
2. **Connexions forcées**: Sélectionnez aléatoirement deux concepts non liés et trouvez des connexions
3. **Hypothèses inversées**: Listez les hypothèses sur un problème, puis inversez chacune
4. **Contraintes créatives**: Résolvez un problème en utilisant seulement 3 matériaux ou en 5 minutes

**Le rôle de la connaissance**

Bien que la créativité implique de penser en dehors de la boîte, vous devez d'abord savoir ce qui est dans la boîte. Une connaissance approfondie du domaine fournit la matière première pour les connexions créatives.

Rappelez-vous, tout le monde a un potentiel créatif. La clé est une pratique constante et la création de conditions qui permettent à la créativité de s'épanouir.` },
        pt: {
            title: "Pensamento Criativo", content: `A criatividade não é apenas para artistas—é uma habilidade cognitiva vital que melhora a resolução de problemas, inovação e adaptabilidade. Esta lição explora técnicas para desbloquear e desenvolver seu potencial criativo.

**Compreendendo a Criatividade**

A criatividade envolve gerar ideias novas e úteis fazendo conexões inesperadas entre conceitos existentes. Requer tanto pensamento divergente (gerar muitas ideias) quanto pensamento convergente (selecionar as melhores ideias).

**O Processo Criativo**

1. **Preparação**: Mergulhe no problema ou tópico
2. **Incubação**: Afaste-se e deixe seu subconsciente trabalhar
3. **Iluminação**: O momento "eureka!" quando o insight surge
4. **Verificação**: Teste e refine a ideia criativa

**Técnicas para Impulsionar a Criatividade**

**Brainstorming**: Gere tantas ideias quanto possível sem julgamento. Quantidade sobre qualidade inicialmente—avaliação vem depois.

**Método SCAMPER**:
- Substituir: O que pode ser substituído?
- Combinar: O que pode ser fundido?
- Adaptar: O que pode ser ajustado?
- Modificar: O que pode ser mudado?
- Usar de outra forma: Como mais pode ser usado?
- Eliminar: O que pode ser removido?
- Reverter: O que pode ser reorganizado?

**Associação de Palavras Aleatórias**: Escolha uma palavra aleatória e force conexões com seu problema.

**Seis Chapéus do Pensamento**: Aborde problemas de seis perspectivas (fatos, emoções, cautela, benefícios, criatividade, processo).

**Divagação Mental**: Permita que sua mente vagueie durante atividades de baixo risco como caminhar ou tomar banho.

**Restrições**: Paradoxalmente, limitações podem impulsionar a criatividade forçando abordagens novas.

**Superando Bloqueios Criativos**

- Mude seu ambiente
- Faça pausas e durma adequadamente
- Pratique exercício físico
- Exponha-se a experiências diversas
- Pratique mindfulness para acalmar o crítico interno
- Colabore com outros para perspectivas frescas

**Cultivando uma Mentalidade Criativa**

- Abrace a curiosidade e faça perguntas "e se"
- Desafie suposições regularmente
- Veja falhas como oportunidades de aprendizado
- Mantenha uma mente de principiante
- Pratique regularmente—criatividade é uma habilidade, não apenas talento

**Exercícios Criativos**

1. **Usos Alternativos**: Liste 20 usos para um objeto comum
2. **Conexões Forçadas**: Selecione aleatoriamente dois conceitos não relacionados e encontre conexões
3. **Suposições Reversas**: Liste suposições sobre um problema, então reverta cada uma
4. **Restrições Criativas**: Resolva um problema usando apenas 3 materiais ou em 5 minutos

**O Papel do Conhecimento**

Embora a criatividade envolva pensar fora da caixa, você precisa primeiro saber o que está na caixa. Conhecimento profundo do domínio fornece a matéria-prima para conexões criativas.

Lembre-se, todos têm potencial criativo. A chave é prática consistente e criar condições que permitam que a criatividade floresça.` }
    }
];

// Continue with lessons 6-8 in similar format...
// (Mindfulness, Brain Nutrition, Sleep)

async function main() {
    console.log("Creating Batch 2: Lessons 4-5 (Problem-Solving, Creative Thinking)...\n");

    try {
        const batch = db.batch();
        let count = 0;

        for (const lesson of lessons) {
            for (const [lang, data] of Object.entries(lesson)) {
                if (lang === 'id' || lang === 'orderIndex') continue;

                const lessonId = lang === 'en' ? lesson.id : `${lesson.id}_${lang}`;
                const courseId = lang === 'en' ? 'course_cognitive_wellness' : `course_cognitive_wellness_${lang}`;

                const lessonRef = db.collection('lessons').doc(lessonId);
                batch.set(lessonRef, {
                    title: data.title,
                    content: data.content,
                    courseId: courseId,
                    language: lang,
                    orderIndex: lesson.orderIndex,
                    videoUrl: "",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                console.log(`✓ ${lang.toUpperCase()}: ${data.title} (${data.content.length} chars)`);
                count++;
            }
        }

        await batch.commit();
        console.log(`\n✅ Successfully created/updated ${count} lesson versions!`);
        console.log("\nProgress: 5/20 lessons complete (25%)");
        console.log("Next batch will include: Mindfulness, Brain Nutrition, Sleep");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
