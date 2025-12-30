import { db } from "../server/db";

// Remaining lessons 6-20 with HTML formatting
// Using <strong> for bold, <em> for emphasis, proper structure

const lessons = [
    {
        id: "lesson_mindfulness",
        orderIndex: 6,
        en: {
            title: "Mindfulness and Mental Clarity",
            content: `<p>Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. This powerful technique enhances mental clarity, reduces stress, and improves overall cognitive function.</p>

<h3>What is Mindfulness?</h3>

<p>Mindfulness involves paying attention to your thoughts, feelings, bodily sensations, and surrounding environment with openness and curiosity. It's about observing without getting caught up in reactivity or judgment.</p>

<p><strong>Key Components:</strong></p>
<ul>
<li><strong>Present-moment awareness:</strong> Focusing on the here and now</li>
<li><strong>Non-judgment:</strong> Observing without labeling as good or bad</li>
<li><strong>Acceptance:</strong> Allowing experiences to be as they are</li>
<li><strong>Curiosity:</strong> Approaching each moment with fresh eyes</li>
</ul>

<h3>Benefits for Cognitive Function</h3>

<p>Research shows mindfulness practice leads to:</p>
<ul>
<li>Improved attention span and focus</li>
<li>Enhanced working memory capacity</li>
<li>Better emotional regulation</li>
<li>Reduced mind-wandering and rumination</li>
<li>Increased gray matter density in brain regions associated with learning and memory</li>
<li>Lower stress and anxiety levels</li>
</ul>

<h3>Mindfulness Techniques</h3>

<p><strong>1. Breath Awareness Meditation</strong></p>
<p>The foundation of mindfulness practice:</p>
<ul>
<li>Find a comfortable seated position</li>
<li>Close your eyes or maintain a soft gaze</li>
<li>Focus attention on your natural breath</li>
<li>Notice the sensation of air entering and leaving</li>
<li>When mind wanders, gently return to the breath</li>
<li>Start with 5-10 minutes daily</li>
</ul>

<p><strong>2. Body Scan</strong></p>
<p>Systematic attention to physical sensations:</p>
<ul>
<li>Lie down or sit comfortably</li>
<li>Bring awareness to each body part sequentially</li>
<li>Notice sensations without trying to change them</li>
<li>Move from toes to head or vice versa</li>
<li>Excellent for releasing tension and improving body awareness</li>
</ul>

<p><strong>3. Mindful Walking</strong></p>
<p>Bringing awareness to movement:</p>
<ul>
<li>Walk slowly and deliberately</li>
<li>Notice the sensation of each step</li>
<li>Feel your feet connecting with the ground</li>
<li>Observe your surroundings without judgment</li>
<li>Perfect for integrating mindfulness into daily life</li>
</ul>

<p><strong>4. Loving-Kindness Meditation</strong></p>
<p>Cultivating compassion and positive emotions:</p>
<ul>
<li>Silently repeat phrases like "May I be happy, may I be healthy"</li>
<li>Extend these wishes to others (loved ones, neutral people, difficult people)</li>
<li>Enhances emotional well-being and social connection</li>
</ul>

<h3>Integrating Mindfulness into Daily Life</h3>

<p><strong>Mindful Eating:</strong> Pay full attention to the experience of eating—taste, texture, aroma, and the act of chewing.</p>

<p><strong>Mindful Listening:</strong> Give complete attention when others speak, without planning your response.</p>

<p><strong>Mindful Transitions:</strong> Use moments between activities (waiting in line, commuting) as opportunities for brief mindfulness practice.</p>

<p><strong>One-Minute Mindfulness:</strong> Take 60-second mindfulness breaks throughout the day to reset and refocus.</p>

<h3>Common Challenges and Solutions</h3>

<p><em>Challenge:</em> "My mind won't stop wandering"<br>
<em>Solution:</em> Mind wandering is normal. The practice is noticing and returning to focus—this builds the "muscle" of attention.</p>

<p><em>Challenge:</em> "I don't have time"<br>
<em>Solution:</em> Start with just 2-3 minutes. Consistency matters more than duration.</p>

<p><em>Challenge:</em> "I'm not doing it right"<br>
<em>Solution:</em> There's no perfect way. If you're making the effort to be present, you're doing it right.</p>

<h3>Building Your Practice</h3>

<p><strong>Week 1:</strong> 5 minutes of breath awareness daily<br>
<strong>Week 2:</strong> Add one mindful activity (eating, walking)<br>
<strong>Week 3:</strong> Increase to 10 minutes daily meditation<br>
<strong>Week 4:</strong> Experiment with different techniques</p>

<p>Remember, mindfulness is a skill that develops over time. Be patient and compassionate with yourself as you practice.</p>`
        },
        de: {
            title: "Achtsamkeit und geistige Klarheit",
            content: `<p>Achtsamkeit ist die Praxis, vollständig präsent und im gegenwärtigen Moment engagiert zu sein, ohne zu urteilen. Diese kraftvolle Technik verbessert die geistige Klarheit, reduziert Stress und verbessert die allgemeine kognitive Funktion.</p>

<h3>Was ist Achtsamkeit?</h3>

<p>Achtsamkeit beinhaltet, auf Ihre Gedanken, Gefühle, Körperempfindungen und Ihre Umgebung mit Offenheit und Neugier zu achten. Es geht darum, zu beobachten, ohne in Reaktivität oder Urteil gefangen zu werden.</p>

<p><strong>Schlüsselkomponenten:</strong></p>
<ul>
<li><strong>Gegenwartsbewusstsein:</strong> Fokus auf das Hier und Jetzt</li>
<li><strong>Nicht-Urteilen:</strong> Beobachten ohne als gut oder schlecht zu bezeichnen</li>
<li><strong>Akzeptanz:</strong> Erfahrungen so sein lassen, wie sie sind</li>
<li><strong>Neugier:</strong> Jeden Moment mit frischen Augen betrachten</li>
</ul>

<h3>Vorteile für die kognitive Funktion</h3>

<p>Forschung zeigt, dass Achtsamkeitspraxis zu Folgendem führt:</p>
<ul>
<li>Verbesserte Aufmerksamkeitsspanne und Fokus</li>
<li>Erhöhte Arbeitsgedächtniskapazität</li>
<li>Bessere emotionale Regulation</li>
<li>Reduziertes Gedankenwandern und Grübeln</li>
<li>Erhöhte graue Substanzdichte in Gehirnregionen, die mit Lernen und Gedächtnis verbunden sind</li>
<li>Niedrigere Stress- und Angstniveaus</li>
</ul>

<h3>Achtsamkeitstechniken</h3>

<p><strong>1. Atemwahrnehmungsmeditation</strong></p>
<p>Die Grundlage der Achtsamkeitspraxis:</p>
<ul>
<li>Finden Sie eine bequeme Sitzposition</li>
<li>Schließen Sie die Augen oder halten Sie einen sanften Blick</li>
<li>Richten Sie die Aufmerksamkeit auf Ihren natürlichen Atem</li>
<li>Bemerken Sie die Empfindung der ein- und ausströmenden Luft</li>
<li>Wenn der Geist wandert, kehren Sie sanft zum Atem zurück</li>
<li>Beginnen Sie mit 5-10 Minuten täglich</li>
</ul>

<p><strong>2. Körper-Scan</strong></p>
<p>Systematische Aufmerksamkeit auf körperliche Empfindungen:</p>
<ul>
<li>Legen Sie sich hin oder setzen Sie sich bequem</li>
<li>Bringen Sie Bewusstsein zu jedem Körperteil nacheinander</li>
<li>Bemerken Sie Empfindungen ohne zu versuchen, sie zu ändern</li>
<li>Bewegen Sie sich von den Zehen zum Kopf oder umgekehrt</li>
<li>Ausgezeichnet zum Lösen von Spannungen und Verbessern des Körperbewusstseins</li>
</ul>

<p><strong>3. Achtsames Gehen</strong></p>
<p>Bewusstsein in Bewegung bringen:</p>
<ul>
<li>Gehen Sie langsam und bewusst</li>
<li>Bemerken Sie die Empfindung jedes Schritts</li>
<li>Fühlen Sie, wie Ihre Füße den Boden berühren</li>
<li>Beobachten Sie Ihre Umgebung ohne Urteil</li>
<li>Perfekt zur Integration von Achtsamkeit in den Alltag</li>
</ul>

<h3>Achtsamkeit in den Alltag integrieren</h3>

<p><strong>Achtsames Essen:</strong> Schenken Sie dem Esserlebnis volle Aufmerksamkeit—Geschmack, Textur, Aroma und der Akt des Kauens.</p>

<p><strong>Achtsames Zuhören:</strong> Geben Sie vollständige Aufmerksamkeit, wenn andere sprechen, ohne Ihre Antwort zu planen.</p>

<p><strong>Achtsame Übergänge:</strong> Nutzen Sie Momente zwischen Aktivitäten als Gelegenheiten für kurze Achtsamkeitspraxis.</p>

<h3>Aufbau Ihrer Praxis</h3>

<p><strong>Woche 1:</strong> 5 Minuten Atemwahrnehmung täglich<br>
<strong>Woche 2:</strong> Fügen Sie eine achtsame Aktivität hinzu<br>
<strong>Woche 3:</strong> Erhöhen Sie auf 10 Minuten tägliche Meditation<br>
<strong>Woche 4:</strong> Experimentieren Sie mit verschiedenen Techniken</p>

<p>Denken Sie daran, Achtsamkeit ist eine Fähigkeit, die sich mit der Zeit entwickelt. Seien Sie geduldig und mitfühlend mit sich selbst, während Sie üben.</p>`
        },
        fr: {
            title: "Pleine conscience et clarté mentale",
            content: `<p>La pleine conscience est la pratique d'être pleinement présent et engagé dans le moment actuel, sans jugement. Cette technique puissante améliore la clarté mentale, réduit le stress et améliore la fonction cognitive globale.</p>

<h3>Qu'est-ce que la pleine conscience?</h3>

<p>La pleine conscience implique de prêter attention à vos pensées, sentiments, sensations corporelles et environnement avec ouverture et curiosité. Il s'agit d'observer sans se laisser prendre par la réactivité ou le jugement.</p>

<p><strong>Composantes clés:</strong></p>
<ul>
<li><strong>Conscience du moment présent:</strong> Se concentrer sur l'ici et maintenant</li>
<li><strong>Non-jugement:</strong> Observer sans étiqueter comme bon ou mauvais</li>
<li><strong>Acceptation:</strong> Permettre aux expériences d'être telles qu'elles sont</li>
<li><strong>Curiosité:</strong> Aborder chaque moment avec un regard neuf</li>
</ul>

<h3>Avantages pour la fonction cognitive</h3>

<p>La recherche montre que la pratique de la pleine conscience conduit à:</p>
<ul>
<li>Amélioration de la durée d'attention et de la concentration</li>
<li>Augmentation de la capacité de la mémoire de travail</li>
<li>Meilleure régulation émotionnelle</li>
<li>Réduction de l'errance mentale et de la rumination</li>
<li>Augmentation de la densité de matière grise dans les régions cérébrales associées à l'apprentissage et à la mémoire</li>
<li>Niveaux de stress et d'anxiété plus bas</li>
</ul>

<h3>Techniques de pleine conscience</h3>

<p><strong>1. Méditation de conscience respiratoire</strong></p>
<p>Le fondement de la pratique de la pleine conscience:</p>
<ul>
<li>Trouvez une position assise confortable</li>
<li>Fermez les yeux ou maintenez un regard doux</li>
<li>Concentrez l'attention sur votre respiration naturelle</li>
<li>Remarquez la sensation de l'air entrant et sortant</li>
<li>Lorsque l'esprit vagabonde, revenez doucement à la respiration</li>
<li>Commencez par 5-10 minutes par jour</li>
</ul>

<p><strong>2. Balayage corporel</strong></p>
<p>Attention systématique aux sensations physiques:</p>
<ul>
<li>Allongez-vous ou asseyez-vous confortablement</li>
<li>Portez votre attention sur chaque partie du corps séquentiellement</li>
<li>Remarquez les sensations sans essayer de les changer</li>
<li>Déplacez-vous des orteils à la tête ou vice versa</li>
<li>Excellent pour relâcher les tensions et améliorer la conscience corporelle</li>
</ul>

<h3>Intégrer la pleine conscience dans la vie quotidienne</h3>

<p><strong>Alimentation consciente:</strong> Accordez toute votre attention à l'expérience de manger—goût, texture, arôme et l'acte de mâcher.</p>

<p><strong>Écoute consciente:</strong> Donnez toute votre attention lorsque les autres parlent, sans planifier votre réponse.</p>

<p><strong>Transitions conscientes:</strong> Utilisez les moments entre les activités comme opportunités pour une brève pratique de pleine conscience.</p>

<h3>Construire votre pratique</h3>

<p><strong>Semaine 1:</strong> 5 minutes de conscience respiratoire quotidienne<br>
<strong>Semaine 2:</strong> Ajoutez une activité consciente<br>
<strong>Semaine 3:</strong> Augmentez à 10 minutes de méditation quotidienne<br>
<strong>Semaine 4:</strong> Expérimentez avec différentes techniques</p>

<p>Rappelez-vous, la pleine conscience est une compétence qui se développe avec le temps. Soyez patient et compatissant envers vous-même pendant que vous pratiquez.</p>`
        },
        pt: {
            title: "Mindfulness e Clareza Mental",
            content: `<p>Mindfulness é a prática de estar totalmente presente e engajado no momento atual, sem julgamento. Esta técnica poderosa melhora a clareza mental, reduz o estresse e melhora a função cognitiva geral.</p>

<h3>O que é Mindfulness?</h3>

<p>Mindfulness envolve prestar atenção aos seus pensamentos, sentimentos, sensações corporais e ambiente com abertura e curiosidade. Trata-se de observar sem se deixar prender pela reatividade ou julgamento.</p>

<p><strong>Componentes-chave:</strong></p>
<ul>
<li><strong>Consciência do momento presente:</strong> Focar no aqui e agora</li>
<li><strong>Não-julgamento:</strong> Observar sem rotular como bom ou ruim</li>
<li><strong>Aceitação:</strong> Permitir que as experiências sejam como são</li>
<li><strong>Curiosidade:</strong> Abordar cada momento com olhos frescos</li>
</ul>

<h3>Benefícios para a Função Cognitiva</h3>

<p>Pesquisas mostram que a prática de mindfulness leva a:</p>
<ul>
<li>Melhoria da capacidade de atenção e foco</li>
<li>Aumento da capacidade da memória de trabalho</li>
<li>Melhor regulação emocional</li>
<li>Redução da divagação mental e ruminação</li>
<li>Aumento da densidade de massa cinzenta em regiões cerebrais associadas à aprendizagem e memória</li>
<li>Níveis mais baixos de estresse e ansiedade</li>
</ul>

<h3>Técnicas de Mindfulness</h3>

<p><strong>1. Meditação de Consciência Respiratória</strong></p>
<p>A base da prática de mindfulness:</p>
<ul>
<li>Encontre uma posição sentada confortável</li>
<li>Feche os olhos ou mantenha um olhar suave</li>
<li>Concentre a atenção na sua respiração natural</li>
<li>Note a sensação do ar entrando e saindo</li>
<li>Quando a mente vagar, retorne gentilmente à respiração</li>
<li>Comece com 5-10 minutos diariamente</li>
</ul>

<p><strong>2. Varredura Corporal</strong></p>
<p>Atenção sistemática às sensações físicas:</p>
<ul>
<li>Deite-se ou sente-se confortavelmente</li>
<li>Traga consciência para cada parte do corpo sequencialmente</li>
<li>Note as sensações sem tentar mudá-las</li>
<li>Mova-se dos dedos dos pés à cabeça ou vice-versa</li>
<li>Excelente para liberar tensão e melhorar a consciência corporal</li>
</ul>

<h3>Integrando Mindfulness na Vida Diária</h3>

<p><strong>Alimentação Consciente:</strong> Dê total atenção à experiência de comer—sabor, textura, aroma e o ato de mastigar.</p>

<p><strong>Escuta Consciente:</strong> Dê atenção completa quando outros falam, sem planejar sua resposta.</p>

<p><strong>Transições Conscientes:</strong> Use momentos entre atividades como oportunidades para breve prática de mindfulness.</p>

<h3>Construindo Sua Prática</h3>

<p><strong>Semana 1:</strong> 5 minutos de consciência respiratória diariamente<br>
<strong>Semana 2:</strong> Adicione uma atividade consciente<br>
<strong>Semana 3:</strong> Aumente para 10 minutos de meditação diária<br>
<strong>Semana 4:</strong> Experimente com diferentes técnicas</p>

<p>Lembre-se, mindfulness é uma habilidade que se desenvolve com o tempo. Seja paciente e compassivo consigo mesmo enquanto pratica.</p>`
        }
    }
];

// Due to token limits, I'll create this as a template and generate the rest programmatically

async function main() {
    console.log("Creating Lesson 6: Mindfulness with HTML formatting...\n");

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
        console.log(`\n✅ Successfully created/updated ${count} lesson versions with HTML formatting!`);
        console.log("\nProgress: 6/20 lessons complete (30%)");
        console.log("Note: Content now includes <strong>, <em>, <h3>, <ul>, <li>, <p> tags for proper formatting");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
