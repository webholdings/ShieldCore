import { db } from "../server/db";

// Fix lessons 9-20 that currently have English content in German/French/Portuguese versions
// These lessons need proper translated content with HTML formatting

const lessonUpdates = [
    {
        id: "lesson_stress",
        de: {
            title: "Stressbewältigung",
            content: `<p>Stress ist eine natürliche Reaktion des Körpers auf Herausforderungen, aber chronischer Stress kann die kognitive Funktion erheblich beeinträchtigen. Diese Lektion bietet evidenzbasierte Strategien zur effektiven Stressbewältigung.</p>

<h3>Stressreaktion verstehen</h3>

<p>Wenn Sie Stress erleben, aktiviert Ihr Körper die "Kampf-oder-Flucht"-Reaktion:</p>
<ul>
<li><strong>Cortisol-Freisetzung:</strong> Erhöht Wachsamkeit, kann aber bei chronischer Erhöhung Gedächtnis und Lernen beeinträchtigen</li>
<li><strong>Erhöhte Herzfrequenz:</strong> Bereitet den Körper auf Aktion vor</li>
<li><strong>Veränderte Gehirnfunktion:</strong> Emotionale Zentren werden aktiver, logisches Denken kann beeinträchtigt werden</li>
</ul>

<h3>Stressbewältigungstechniken</h3>

<p><strong>1. Tiefe Atmung:</strong> Aktiviert das parasympathische Nervensystem, fördert Entspannung</p>

<p><strong>2. Progressive Muskelentspannung:</strong> Systematisches Anspannen und Entspannen von Muskelgruppen</p>

<p><strong>3. Achtsamkeitsmeditation:</strong> Konzentriert Aufmerksamkeit auf den gegenwärtigen Moment</p>

<p><strong>4. Körperliche Bewegung:</strong> Reduziert Stresshormone und verbessert die Stimmung</p>

<p><strong>5. Soziale Unterstützung:</strong> Verbindung mit anderen puffert Stresseffekte</p>

<p>Denken Sie daran, effektives Stressmanagement ist eine Fähigkeit, die sich mit der Übung verbessert.</p>`
        },
        fr: {
            title: "Gestion du stress",
            content: `<p>Le stress est une réponse naturelle du corps aux défis, mais le stress chronique peut considérablement altérer la fonction cognitive. Cette leçon fournit des stratégies fondées sur des preuves pour gérer efficacement le stress.</p>

<h3>Comprendre la réponse au stress</h3>

<p>Lorsque vous ressentez du stress, votre corps active la réponse "combat ou fuite":</p>
<ul>
<li><strong>Libération de cortisol:</strong> Augmente la vigilance, mais peut altérer la mémoire et l'apprentissage lorsqu'il est chroniquement élevé</li>
<li><strong>Fréquence cardiaque accrue:</strong> Prépare le corps à l'action</li>
<li><strong>Fonction cérébrale modifiée:</strong> Les centres émotionnels deviennent plus actifs, la pensée logique peut être altérée</li>
</ul>

<h3>Techniques de gestion du stress</h3>

<p><strong>1. Respiration profonde:</strong> Active le système nerveux parasympathique, favorise la relaxation</p>

<p><strong>2. Relaxation musculaire progressive:</strong> Tension et relaxation systématiques des groupes musculaires</p>

<p><strong>3. Méditation de pleine conscience:</strong> Concentre l'attention sur le moment présent</p>

<p><strong>4. Exercice physique:</strong> Réduit les hormones de stress et améliore l'humeur</p>

<p><strong>5. Soutien social:</strong> La connexion avec les autres amortit les effets du stress</p>

<p>Rappelez-vous, une gestion efficace du stress est une compétence qui s'améliore avec la pratique.</p>`
        },
        pt: {
            title: "Gestão de Estresse",
            content: `<p>O estresse é uma resposta natural do corpo a desafios, mas o estresse crônico pode prejudicar significativamente a função cognitiva. Esta lição fornece estratégias baseadas em evidências para gerenciar o estresse efetivamente.</p>

<h3>Compreendendo a Resposta ao Estresse</h3>

<p>Quando você experimenta estresse, seu corpo ativa a resposta de "luta ou fuga":</p>
<ul>
<li><strong>Liberação de cortisol:</strong> Aumenta o estado de alerta, mas pode prejudicar memória e aprendizado quando cronicamente elevado</li>
<li><strong>Frequência cardíaca aumentada:</strong> Prepara o corpo para ação</li>
<li><strong>Função cerebral alterada:</strong> Centros emocionais se tornam mais ativos, pensamento lógico pode ser prejudicado</li>
</ul>

<h3>Técnicas de Gestão de Estresse</h3>

<p><strong>1. Respiração Profunda:</strong> Ativa o sistema nervoso parassimpático, promove relaxamento</p>

<p><strong>2. Relaxamento Muscular Progressivo:</strong> Tensão e relaxamento sistemáticos de grupos musculares</p>

<p><strong>3. Meditação Mindfulness:</strong> Foca a atenção no momento presente</p>

<p><strong>4. Exercício Físico:</strong> Reduz hormônios do estresse e melhora o humor</p>

<p><strong>5. Apoio Social:</strong> Conexão com outros amortece efeitos do estresse</p>

<p>Lembre-se, gestão eficaz de estresse é uma habilidade que melhora com a prática.</p>`
        }
    },
    {
        id: "lesson_vitality",
        de: {
            title: "Erhaltung der kognitiven Vitalität",
            content: `<p>Die Aufrechterhaltung der kognitiven Vitalität während des gesamten Lebens erfordert einen proaktiven, ganzheitlichen Ansatz. Diese Lektion integriert alle Prinzipien, die Sie gelernt haben, in einen umfassenden Lebensstilplan.</p>

<h3>Säulen der kognitiven Vitalität</h3>

<ul>
<li><strong>Kontinuierliches Lernen:</strong> Fordern Sie Ihr Gehirn regelmäßig mit neuen Fähigkeiten und Wissen heraus</li>
<li><strong>Körperliche Aktivität:</strong> Regelmäßige Bewegung unterstützt die Gehirngesundheit</li>
<li><strong>Soziales Engagement:</strong> Bedeutungsvolle Beziehungen stimulieren kognitive Funktion</li>
<li><strong>Stressmanagement:</strong> Chronischer Stress beschleunigt kognitiven Abbau</li>
<li><strong>Qualitätsschlaf:</strong> Essentiell für Gedächtniskonsolidierung und Gehirnreparatur</li>
<li><strong>Ernährung:</strong> Gehirngesunde Lebensmittel unterstützen optimale Funktion</li>
</ul>

<h3>Aufbau Ihres Vitalitätsplans</h3>

<p><strong>Wöchentliche Ziele:</strong></p>
<ul>
<li>150 Minuten moderate Bewegung</li>
<li>7-9 Stunden Schlaf pro Nacht</li>
<li>Tägliche Achtsamkeitspraxis</li>
<li>Soziale Verbindungen pflegen</li>
<li>Neue Fähigkeiten lernen</li>
</ul>

<p>Denken Sie daran, kognitive Vitalität ist eine lebenslange Reise, kein Ziel.</p>`
        },
        fr: {
            title: "Maintenir la vitalité cognitive",
            content: `<p>Maintenir la vitalité cognitive tout au long de la vie nécessite une approche proactive et holistique. Cette leçon intègre tous les principes que vous avez appris dans un plan de style de vie complet.</p>

<h3>Piliers de la vitalité cognitive</h3>

<ul>
<li><strong>Apprentissage continu:</strong> Défiez régulièrement votre cerveau avec de nouvelles compétences et connaissances</li>
<li><strong>Activité physique:</strong> L'exercice régulier soutient la santé cérébrale</li>
<li><strong>Engagement social:</strong> Les relations significatives stimulent la fonction cognitive</li>
<li><strong>Gestion du stress:</strong> Le stress chronique accélère le déclin cognitif</li>
<li><strong>Sommeil de qualité:</strong> Essentiel pour la consolidation de la mémoire et la réparation cérébrale</li>
<li><strong>Nutrition:</strong> Les aliments bons pour le cerveau soutiennent une fonction optimale</li>
</ul>

<h3>Construire votre plan de vitalité</h3>

<p><strong>Objectifs hebdomadaires:</strong></p>
<ul>
<li>150 minutes d'exercice modéré</li>
<li>7-9 heures de sommeil par nuit</li>
<li>Pratique quotidienne de pleine conscience</li>
<li>Entretenir les connexions sociales</li>
<li>Apprendre de nouvelles compétences</li>
</ul>

<p>Rappelez-vous, la vitalité cognitive est un voyage de toute une vie, pas une destination.</p>`
        },
        pt: {
            title: "Mantendo a Vitalidade Cognitiva",
            content: `<p>Manter a vitalidade cognitiva ao longo da vida requer uma abordagem proativa e holística. Esta lição integra todos os princípios que você aprendeu em um plano de estilo de vida abrangente.</p>

<h3>Pilares da Vitalidade Cognitiva</h3>

<ul>
<li><strong>Aprendizado Contínuo:</strong> Desafie regularmente seu cérebro com novas habilidades e conhecimentos</li>
<li><strong>Atividade Física:</strong> Exercício regular apoia a saúde cerebral</li>
<li><strong>Engajamento Social:</strong> Relacionamentos significativos estimulam função cognitiva</li>
<li><strong>Gestão de Estresse:</strong> Estresse crônico acelera declínio cognitivo</li>
<li><strong>Sono de Qualidade:</strong> Essencial para consolidação de memória e reparo cerebral</li>
<li><strong>Nutrição:</strong> Alimentos saudáveis para o cérebro apoiam função ótima</li>
</ul>

<h3>Construindo Seu Plano de Vitalidade</h3>

<p><strong>Metas Semanais:</strong></p>
<ul>
<li>150 minutos de exercício moderado</li>
<li>7-9 horas de sono por noite</li>
<li>Prática diária de mindfulness</li>
<li>Nutrir conexões sociais</li>
<li>Aprender novas habilidades</li>
</ul>

<p>Lembre-se, vitalidade cognitiva é uma jornada de vida inteira, não um destino.</p>`
        }
    }
];

// Add similar content for remaining lessons (neuroplasticity, digital_detox, cognitive_reserve, future, exercise, new_skill, music, emotional_iq, social, gut_brain)

async function main() {
    console.log("Updating lessons with proper German/French/Portuguese content...\n");

    try {
        const batch = db.batch();
        let updateCount = 0;

        for (const lessonUpdate of lessonUpdates) {
            for (const [lang, data] of Object.entries(lessonUpdate)) {
                if (lang === 'id') continue;

                const lessonId = `${lessonUpdate.id}_${lang}`;
                const lessonRef = db.collection('lessons').doc(lessonId);

                batch.update(lessonRef, {
                    title: data.title,
                    content: data.content,
                    updatedAt: new Date()
                });

                console.log(`✓ Updated ${lessonId} with proper ${lang.toUpperCase()} content`);
                updateCount++;
            }
        }

        await batch.commit();
        console.log(`\n✅ Successfully updated ${updateCount} lesson versions with proper translations!`);
        console.log("\nNote: This is a partial fix. Remaining lessons will be updated in next batch.");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
