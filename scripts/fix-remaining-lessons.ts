import { db } from "../server/db";

// Fix remaining lessons 11-20 that currently have English content in German/French/Portuguese versions

const lessonUpdates = [
    {
        id: "lesson_neuroplasticity",
        de: {
            title: "Neuroplastizität in der Tiefe",
            content: `<p>Neuroplastizität ist die bemerkenswerte Fähigkeit des Gehirns, sich durch die Bildung neuer neuronaler Verbindungen im Laufe des Lebens neu zu organisieren. Diese Lektion vertieft, wie Sie diesen Prozess nutzen können.</p>

<h3>Mechanismen der Veränderung</h3>

<p>Ihr Gehirn verändert sich auf drei Arten:</p>
<ul>
<li><strong>Chemisch:</strong> Kurzfristige Veränderungen, die das Kurzzeitgedächtnis unterstützen</li>
<li><strong>Strukturell:</strong> Langfristige Veränderungen in Verbindungen zwischen Neuronen</li>
<li><strong>Funktionell:</strong> Ganze Gehirnregionen übernehmen neue Funktionen</li>
</ul>

<h3>Neuroplastizität fördern</h3>

<p><strong>1. Neuheit:</strong> Das Gehirn liebt neue Erfahrungen. Reisen Sie an neue Orte, probieren Sie neue Lebensmittel, nehmen Sie einen neuen Weg zur Arbeit.</p>

<p><strong>2. Aufmerksamkeit:</strong> Neuroplastizität erfordert fokussierte Aufmerksamkeit. Passives Erleben reicht nicht aus.</p>

<p><strong>3. Herausforderung:</strong> Die Aufgabe muss schwierig genug sein, um Anstrengung zu erfordern, aber nicht so schwer, dass sie unmöglich ist.</p>

<p><strong>4. Wiederholung:</strong> "Neuronen, die zusammen feuern, vernetzen sich." Übung stärkt die Verbindungen.</p>

<p>Sie sind der Architekt Ihres eigenen Gehirns. Jede Handlung und jeder Gedanke formt Ihre neuronale Struktur.</p>`
        },
        fr: {
            title: "Neuroplasticité en profondeur",
            content: `<p>La neuroplasticité est la capacité remarquable du cerveau à se réorganiser en formant de nouvelles connexions neuronales tout au long de la vie. Cette leçon approfondit comment vous pouvez exploiter ce processus.</p>

<h3>Mécanismes de changement</h3>

<p>Votre cerveau change de trois manières:</p>
<ul>
<li><strong>Chimique:</strong> Changements à court terme soutenant la mémoire à court terme</li>
<li><strong>Structurel:</strong> Changements à long terme dans les connexions entre les neurones</li>
<li><strong>Fonctionnel:</strong> Des régions entières du cerveau assument de nouvelles fonctions</li>
</ul>

<h3>Favoriser la neuroplasticité</h3>

<p><strong>1. Nouveauté:</strong> Le cerveau aime les nouvelles expériences. Voyagez vers de nouveaux endroits, essayez de nouveaux aliments.</p>

<p><strong>2. Attention:</strong> La neuroplasticité nécessite une attention focalisée. L'expérience passive ne suffit pas.</p>

<p><strong>3. Défi:</strong> La tâche doit être assez difficile pour nécessiter un effort, mais pas impossible.</p>

<p><strong>4. Répétition:</strong> "Les neurones qui s'activent ensemble se connectent ensemble." La pratique renforce les liens.</p>

<p>Vous êtes l'architecte de votre propre cerveau. Chaque action et pensée façonne votre structure neuronale.</p>`
        },
        pt: {
            title: "Neuroplasticidade em Profundidade",
            content: `<p>Neuroplasticidade é a notável capacidade do cérebro de se reorganizar formando novas conexões neurais ao longo da vida. Esta lição aprofunda como você pode aproveitar esse processo.</p>

<h3>Mecanismos de Mudança</h3>

<p>Seu cérebro muda de três maneiras:</p>
<ul>
<li><strong>Química:</strong> Mudanças de curto prazo apoiando memória de curto prazo</li>
<li><strong>Estrutural:</strong> Mudanças de longo prazo nas conexões entre neurônios</li>
<li><strong>Funcional:</strong> Regiões inteiras do cérebro assumem novas funções</li>
</ul>

<h3>Promovendo Neuroplasticidade</h3>

<p><strong>1. Novidade:</strong> O cérebro adora novas experiências. Viaje para novos lugares, experimente novos alimentos.</p>

<p><strong>2. Atenção:</strong> Neuroplasticidade requer atenção focada. Experiência passiva não é suficiente.</p>

<p><strong>3. Desafio:</strong> A tarefa deve ser difícil o suficiente para exigir esforço, mas não impossível.</p>

<p><strong>4. Repetição:</strong> "Neurônios que disparam juntos, conectam-se juntos." A prática fortalece os laços.</p>

<p>Você é o arquiteto do seu próprio cérebro. Cada ação e pensamento molda sua estrutura neural.</p>`
        }
    },
    {
        id: "lesson_exercise",
        de: {
            title: "Die Rolle körperlicher Bewegung",
            content: `<p>Körperliche Bewegung ist wohl das Wichtigste, was Sie für Ihr Gehirn tun können. Sie verbessert die Durchblutung, reduziert Entzündungen und stimuliert das Wachstum neuer Gehirnzellen.</p>

<h3>BDNF: Dünger für das Gehirn</h3>

<p>Bewegung stimuliert die Produktion von BDNF (Brain-Derived Neurotrophic Factor), einem Protein, das:</p>
<ul>
<li>Das Überleben bestehender Neuronen fördert</li>
<li>Das Wachstum neuer Neuronen und Synapsen anregt</li>
<li>Die kognitive Funktion und Stimmung verbessert</li>
</ul>

<h3>Beste Übungen für das Gehirn</h3>

<p><strong>Aerobes Training:</strong> Laufen, Schwimmen, Radfahren. Erhöht die Herzfrequenz und Sauerstoffversorgung des Gehirns.</p>

<p><strong>Krafttraining:</strong> Verbessert die Exekutivfunktion und das Gedächtnis.</p>

<p><strong>Koordinationsübungen:</strong> Tanzen, Tennis, Yoga. Fordern das Gehirn heraus, komplexe Bewegungen zu steuern.</p>

<p><strong>Empfehlung:</strong> Streben Sie 150 Minuten moderate Aktivität pro Woche an. Schon 20 Minuten Gehen können die kognitive Leistung sofort steigern.</p>`
        },
        fr: {
            title: "Le rôle de l'exercice physique",
            content: `<p>L'exercice physique est sans doute la chose la plus importante que vous puissiez faire pour votre cerveau. Il améliore la circulation sanguine, réduit l'inflammation et stimule la croissance de nouvelles cellules cérébrales.</p>

<h3>BDNF: Engrais pour le cerveau</h3>

<p>L'exercice stimule la production de BDNF (Brain-Derived Neurotrophic Factor), une protéine qui:</p>
<ul>
<li>Favorise la survie des neurones existants</li>
<li>Stimule la croissance de nouveaux neurones et synapses</li>
<li>Améliore la fonction cognitive et l'humeur</li>
</ul>

<h3>Meilleurs exercices pour le cerveau</h3>

<p><strong>Entraînement aérobie:</strong> Course, natation, vélo. Augmente la fréquence cardiaque et l'oxygénation du cerveau.</p>

<p><strong>Entraînement de force:</strong> Améliore la fonction exécutive et la mémoire.</p>

<p><strong>Exercices de coordination:</strong> Danse, tennis, yoga. Défient le cerveau de contrôler des mouvements complexes.</p>

<p><strong>Recommandation:</strong> Visez 150 minutes d'activité modérée par semaine. Même 20 minutes de marche peuvent stimuler immédiatement la performance cognitive.</p>`
        },
        pt: {
            title: "O Papel do Exercício Físico",
            content: `<p>O exercício físico é possivelmente a coisa mais importante que você pode fazer pelo seu cérebro. Melhora o fluxo sanguíneo, reduz a inflamação e estimula o crescimento de novas células cerebrais.</p>

<h3>BDNF: Fertilizante para o Cérebro</h3>

<p>O exercício estimula a produção de BDNF (Fator Neurotrófico Derivado do Cérebro), uma proteína que:</p>
<ul>
<li>Promove a sobrevivência de neurônios existentes</li>
<li>Estimula o crescimento de novos neurônios e sinapses</li>
<li>Melhora a função cognitiva e o humor</li>
</ul>

<h3>Melhores Exercícios para o Cérebro</h3>

<p><strong>Treino Aeróbico:</strong> Corrida, natação, ciclismo. Aumenta a frequência cardíaca e oxigenação do cérebro.</p>

<p><strong>Treino de Força:</strong> Melhora a função executiva e memória.</p>

<p><strong>Exercícios de Coordenação:</strong> Dança, tênis, yoga. Desafiam o cérebro a controlar movimentos complexos.</p>

<p><strong>Recomendação:</strong> Mire em 150 minutos de atividade moderada por semana. Mesmo 20 minutos de caminhada podem aumentar imediatamente o desempenho cognitivo.</p>`
        }
    },
    {
        id: "lesson_social",
        de: {
            title: "Soziale Bindung und Gehirngesundheit",
            content: `<p>Menschen sind von Natur aus soziale Wesen. Soziale Interaktion ist eine komplexe kognitive Aufgabe, die das Gehirn scharf hält und vor kognitivem Abbau schützt.</p>

<h3>Die Kraft der Verbindung</h3>

<p>Forschung zeigt, dass starke soziale Bindungen:</p>
<ul>
<li>Das Risiko für Demenz um bis zu 50% senken können</li>
<li>Stresshormone reduzieren</li>
<li>Das Immunsystem stärken</li>
<li>Depressionen und Angstzuständen vorbeugen</li>
</ul>

<h3>Qualität vor Quantität</h3>

<p>Es geht nicht darum, wie viele Freunde Sie haben, sondern um die Qualität Ihrer Beziehungen. Eine tiefe, unterstützende Beziehung ist wertvoller als viele oberflächliche.</p>

<h3>Strategien für mehr Verbindung</h3>

<p><strong>1. Planen Sie regelmäßige Treffen:</strong> Machen Sie soziale Interaktion zur Priorität.</p>

<p><strong>2. Treten Sie Gruppen bei:</strong> Vereine, Buchclubs oder Sportgruppen verbinden Sie mit Gleichgesinnten.</p>

<p><strong>3. Freiwilligenarbeit:</strong> Bietet Sinn und soziale Verbindung.</p>

<p><strong>4. Aktives Zuhören:</strong> Vertieft bestehende Beziehungen und fördert Empathie.</p>`
        },
        fr: {
            title: "Lien social et santé cérébrale",
            content: `<p>Les humains sont des êtres sociaux par nature. L'interaction sociale est une tâche cognitive complexe qui garde le cerveau vif et protège contre le déclin cognitif.</p>

<h3>Le pouvoir de la connexion</h3>

<p>La recherche montre que des liens sociaux forts:</p>
<ul>
<li>Peuvent réduire le risque de démence jusqu'à 50%</li>
<li>Réduisent les hormones de stress</li>
<li>Renforcent le système immunitaire</li>
<li>Préviennent la dépression et l'anxiété</li>
</ul>

<h3>Qualité sur quantité</h3>

<p>Il ne s'agit pas du nombre d'amis que vous avez, mais de la qualité de vos relations. Une relation profonde et solidaire est plus précieuse que de nombreuses relations superficielles.</p>

<h3>Stratégies pour plus de connexion</h3>

<p><strong>1. Planifiez des rencontres régulières:</strong> Faites de l'interaction sociale une priorité.</p>

<p><strong>2. Rejoignez des groupes:</strong> Clubs, clubs de lecture ou groupes sportifs vous connectent avec des personnes partageant les mêmes idées.</p>

<p><strong>3. Bénévolat:</strong> Offre un sens et une connexion sociale.</p>

<p><strong>4. Écoute active:</strong> Approfondit les relations existantes et favorise l'empathie.</p>`
        },
        pt: {
            title: "Conexão Social e Saúde Cerebral",
            content: `<p>Humanos são seres sociais por natureza. A interação social é uma tarefa cognitiva complexa que mantém o cérebro afiado e protege contra o declínio cognitivo.</p>

<h3>O Poder da Conexão</h3>

<p>Pesquisas mostram que laços sociais fortes:</p>
<ul>
<li>Podem reduzir o risco de demência em até 50%</li>
<li>Reduzem hormônios do estresse</li>
<li>Fortalecem o sistema imunológico</li>
<li>Previnem depressão e ansiedade</li>
</ul>

<h3>Qualidade sobre Quantidade</h3>

<p>Não se trata de quantos amigos você tem, mas da qualidade de seus relacionamentos. Um relacionamento profundo e solidário é mais valioso do que muitos superficiais.</p>

<h3>Estratégias para Mais Conexão</h3>

<p><strong>1. Planeje encontros regulares:</strong> Faça da interação social uma prioridade.</p>

<p><strong>2. Junte-se a grupos:</strong> Clubes, grupos de leitura ou esportivos conectam você com pessoas que pensam parecido.</p>

<p><strong>3. Voluntariado:</strong> Oferece propósito e conexão social.</p>

<p><strong>4. Escuta Ativa:</strong> Aprofunda relacionamentos existentes e promove empatia.</p>`
        }
    },
    {
        id: "lesson_new_skill",
        de: {
            title: "Eine neue Fähigkeit erlernen",
            content: `<p>Das Erlernen neuer Fähigkeiten ist eines der effektivsten Mittel, um das Gehirn jung und flexibel zu halten. Es zwingt das Gehirn, neue neuronale Pfade zu schmieden.</p>

<h3>Was zählt als "neu"?</h3>

<p>Die Aktivität muss:</p>
<ul>
<li><strong>Neuartig sein:</strong> Etwas, das Sie noch nie zuvor getan haben</li>
<li><strong>Komplex sein:</strong> Erfordert Konzentration und geistige Anstrengung</li>
<li><strong>Herausfordernd sein:</strong> Bringt Sie aus Ihrer Komfortzone</li>
</ul>

<h3>Ideen für neue Fähigkeiten</h3>

<p><strong>Sprachen lernen:</strong> Verzögert den Beginn von Demenz um durchschnittlich 4,5 Jahre.</p>

<p><strong>Musikinstrument spielen:</strong> Beansprucht visuelle, auditive und motorische Bereiche gleichzeitig.</p>

<p><strong>Tanzen:</strong> Kombiniert körperliche Bewegung, Rhythmus und das Merken von Schritten.</p>

<p><strong>Kunst und Handwerk:</strong> Malen, Stricken oder Töpfern fördern Feinmotorik und Kreativität.</p>

<p>Wählen Sie etwas, das Ihnen Spaß macht, damit Sie dabei bleiben.</p>`
        },
        fr: {
            title: "Apprendre une nouvelle compétence",
            content: `<p>Apprendre de nouvelles compétences est l'un des moyens les plus efficaces de garder le cerveau jeune et flexible. Cela force le cerveau à forger de nouvelles voies neuronales.</p>

<h3>Qu'est-ce qui compte comme "nouveau"?</h3>

<p>L'activité doit:</p>
<ul>
<li><strong>Être nouvelle:</strong> Quelque chose que vous n'avez jamais fait auparavant</li>
<li><strong>Être complexe:</strong> Nécessite de la concentration et un effort mental</li>
<li><strong>Être un défi:</strong> Vous sort de votre zone de confort</li>
</ul>

<h3>Idées de nouvelles compétences</h3>

<p><strong>Apprendre des langues:</strong> Retarde le début de la démence de 4,5 ans en moyenne.</p>

<p><strong>Jouer d'un instrument:</strong> Sollicite les zones visuelles, auditives et motrices simultanément.</p>

<p><strong>Danse:</strong> Combine exercice physique, rythme et mémorisation des pas.</p>

<p><strong>Arts et artisanat:</strong> Peinture, tricot ou poterie favorisent la motricité fine et la créativité.</p>

<p>Choisissez quelque chose que vous aimez pour persévérer.</p>`
        },
        pt: {
            title: "Aprendendo uma Nova Habilidade",
            content: `<p>Aprender novas habilidades é uma das maneiras mais eficazes de manter o cérebro jovem e flexível. Isso força o cérebro a forjar novos caminhos neurais.</p>

<h3>O que conta como "novo"?</h3>

<p>A atividade deve:</p>
<ul>
<li><strong>Ser nova:</strong> Algo que você nunca fez antes</li>
<li><strong>Ser complexa:</strong> Requer concentração e esforço mental</li>
<li><strong>Ser desafiadora:</strong> Tira você da sua zona de conforto</li>
</ul>

<h3>Ideias para Novas Habilidades</h3>

<p><strong>Aprender idiomas:</strong> Atrasa o início da demência em média 4,5 anos.</p>

<p><strong>Tocar um instrumento:</strong> Envolve áreas visuais, auditivas e motoras simultaneamente.</p>

<p><strong>Dança:</strong> Combina exercício físico, ritmo e memorização de passos.</p>

<p><strong>Artes e artesanato:</strong> Pintura, tricô ou cerâmica promovem coordenação motora fina e criatividade.</p>

<p>Escolha algo que você goste para continuar praticando.</p>`
        }
    },
    {
        id: "lesson_music",
        de: {
            title: "Musik und das Gehirn",
            content: `<p>Musik hat eine einzigartige Wirkung auf das Gehirn. Sie aktiviert fast alle Gehirnregionen gleichzeitig und kann Stimmung, Gedächtnis und Kognition tiefgreifend beeinflussen.</p>

<h3>Der "Mozart-Effekt" und darüber hinaus</h3>

<p>Musik hören und machen:</p>
<ul>
<li><strong>Reduziert Stress:</strong> Senkt Cortisolspiegel und Blutdruck</li>
<li><strong>Verbessert Gedächtnis:</strong> Musik ist oft eng mit emotionalen Erinnerungen verknüpft</li>
<li><strong>Steigert Fokus:</strong> Bestimmte Musikarten können Konzentration fördern</li>
<li><strong>Fördert Neuroplastizität:</strong> Musiker haben oft stärker vernetzte Gehirnhälften</li>
</ul>

<h3>Musik therapeutisch nutzen</h3>

<p><strong>Zur Entspannung:</strong> Langsame Tempi (60 BPM) können Herzfrequenz und Atmung synchronisieren.</p>

<p><strong>Zur Energie:</strong> Schnelle, rhythmische Musik kann Motivation beim Sport steigern.</p>

<p><strong>Zum Fokus:</strong> Instrumentalmusik oder Naturgeräusche können Ablenkungen minimieren.</p>

<p>Erstellen Sie Playlists für verschiedene kognitive Zustände, die Sie erreichen möchten.</p>`
        },
        fr: {
            title: "La musique et le cerveau",
            content: `<p>La musique a un effet unique sur le cerveau. Elle active presque toutes les régions du cerveau simultanément et peut influencer profondément l'humeur, la mémoire et la cognition.</p>

<h3>L'effet Mozart et au-delà</h3>

<p>Écouter et faire de la musique:</p>
<ul>
<li><strong>Réduit le stress:</strong> Baisse les niveaux de cortisol et la pression artérielle</li>
<li><strong>Améliore la mémoire:</strong> La musique est souvent étroitement liée aux souvenirs émotionnels</li>
<li><strong>Augmente la concentration:</strong> Certains types de musique peuvent favoriser la concentration</li>
<li><strong>Favorise la neuroplasticité:</strong> Les musiciens ont souvent des hémisphères cérébraux plus connectés</li>
</ul>

<h3>Utiliser la musique de manière thérapeutique</h3>

<p><strong>Pour la relaxation:</strong> Des tempos lents (60 BPM) peuvent synchroniser la fréquence cardiaque et la respiration.</p>

<p><strong>Pour l'énergie:</strong> Une musique rapide et rythmé peut augmenter la motivation pendant le sport.</p>

<p><strong>Pour la concentration:</strong> La musique instrumentale ou les sons de la nature peuvent minimiser les distractions.</p>

<p>Créez des listes de lecture pour différents états cognitifs que vous souhaitez atteindre.</p>`
        },
        pt: {
            title: "Música e o Cérebro",
            content: `<p>A música tem um efeito único no cérebro. Ela ativa quase todas as regiões do cérebro simultaneamente e pode influenciar profundamente o humor, a memória e a cognição.</p>

<h3>O Efeito Mozart e Além</h3>

<p>Ouvir e fazer música:</p>
<ul>
<li><strong>Reduz o estresse:</strong> Baixa níveis de cortisol e pressão arterial</li>
<li><strong>Melhora a memória:</strong> Música é frequentemente ligada a memórias emocionais</li>
<li><strong>Aumenta o foco:</strong> Certos tipos de música podem promover concentração</li>
<li><strong>Promove neuroplasticidade:</strong> Músicos frequentemente têm hemisférios cerebrais mais conectados</li>
</ul>

<h3>Usando Música Terapeuticamente</h3>

<p><strong>Para relaxamento:</strong> Tempos lentos (60 BPM) podem sincronizar frequência cardíaca e respiração.</p>

<p><strong>Para energia:</strong> Música rápida e rítmica pode aumentar motivação durante o esporte.</p>

<p><strong>Para foco:</strong> Música instrumental ou sons da natureza podem minimizar distrações.</p>

<p>Crie playlists para diferentes estados cognitivos que você deseja alcançar.</p>`
        }
    },
    {
        id: "lesson_digital_detox",
        de: {
            title: "Digital Detox und Aufmerksamkeit",
            content: `<p>In unserer hypervernetzten Welt ist unsere Aufmerksamkeit ständig fragmentiert. Digitale Überlastung kann zu kognitiver Ermüdung, reduziertem Fokus und erhöhtem Stress führen.</p>

<h3>Auswirkungen von Technologie auf das Gehirn</h3>

<ul>
<li><strong>Multitasking-Mythos:</strong> Das Gehirn kann nicht wirklich multitasken, es schaltet nur schnell um, was Energie kostet</li>
<li><strong>Dopamin-Schleifen:</strong> Soziale Medien sind so konzipiert, dass sie süchtig machen</li>
<li><strong>Reduzierte Aufmerksamkeitsspanne:</strong> Ständige Unterbrechungen trainieren das Gehirn auf Ablenkung</li>
</ul>

<h3>Strategien für digitales Wohlbefinden</h3>

<p><strong>1. Tech-freie Zonen:</strong> Kein Telefon im Schlafzimmer oder am Esstisch.</p>

<p><strong>2. Benachrichtigungen ausschalten:</strong> Minimieren Sie Unterbrechungen.</p>

<p><strong>3. 20-20-20 Regel:</strong> Alle 20 Minuten 20 Sekunden lang auf etwas in 20 Fuß (6m) Entfernung schauen.</p>

<p><strong>4. Geplante Pausen:</strong> Legen Sie feste Zeiten fest, um E-Mails/Nachrichten zu checken.</p>

<p>Geben Sie Ihrem Gehirn Raum zum Atmen und zur Erholung von der digitalen Flut.</p>`
        },
        fr: {
            title: "Détox numérique et attention",
            content: `<p>Dans notre monde hyperconnecté, notre attention est constamment fragmentée. La surcharge numérique peut entraîner une fatigue cognitive, une concentration réduite et un stress accru.</p>

<h3>Impact de la technologie sur le cerveau</h3>

<ul>
<li><strong>Mythe du multitâche:</strong> Le cerveau ne peut pas vraiment faire plusieurs choses à la fois, il change juste rapidement, ce qui coûte de l'énergie</li>
<li><strong>Boucles de dopamine:</strong> Les médias sociaux sont conçus pour créer une dépendance</li>
<li><strong>Durée d'attention réduite:</strong> Les interruptions constantes entraînent le cerveau à la distraction</li>
</ul>

<h3>Stratégies pour le bien-être numérique</h3>

<p><strong>1. Zones sans technologie:</strong> Pas de téléphone dans la chambre ou à table.</p>

<p><strong>2. Désactiver les notifications:</strong> Minimisez les interruptions.</p>

<p><strong>3. Règle 20-20-20:</strong> Toutes les 20 minutes, regardez quelque chose à 20 pieds (6m) pendant 20 secondes.</p>

<p><strong>4. Pauses planifiées:</strong> Fixez des heures précises pour vérifier les e-mails/messages.</p>

<p>Donnez à votre cerveau de l'espace pour respirer et récupérer du déluge numérique.</p>`
        },
        pt: {
            title: "Detox Digital e Atenção",
            content: `<p>Em nosso mundo hiperconectado, nossa atenção é constantemente fragmentada. A sobrecarga digital pode levar à fadiga cognitiva, foco reduzido e aumento do estresse.</p>

<h3>Impacto da Tecnologia no Cérebro</h3>

<ul>
<li><strong>Mito da Multitarefa:</strong> O cérebro não pode realmente fazer multitarefa, ele apenas alterna rapidamente, o que custa energia</li>
<li><strong>Loops de Dopamina:</strong> Redes sociais são projetadas para viciar</li>
<li><strong>Tempo de Atenção Reduzido:</strong> Interrupções constantes treinam o cérebro para distração</li>
</ul>

<h3>Estratégias para Bem-Estar Digital</h3>

<p><strong>1. Zonas Livres de Tecnologia:</strong> Sem telefone no quarto ou na mesa de jantar.</p>

<p><strong>2. Desativar Notificações:</strong> Minimize interrupções.</p>

<p><strong>3. Regra 20-20-20:</strong> A cada 20 minutos, olhe para algo a 20 pés (6m) por 20 segundos.</p>

<p><strong>4. Pausas Planejadas:</strong> Defina horários fixos para verificar e-mails/mensagens.</p>

<p>Dê ao seu cérebro espaço para respirar e se recuperar do dilúvio digital.</p>`
        }
    },
    {
        id: "lesson_emotional_iq",
        de: {
            title: "Emotionale Intelligenz",
            content: `<p>Emotionale Intelligenz (EQ) ist die Fähigkeit, eigene und fremde Emotionen zu verstehen und zu steuern. Sie ist entscheidend für geistige Gesundheit und sozialen Erfolg.</p>

<h3>Komponenten der EQ</h3>

<ul>
<li><strong>Selbstwahrnehmung:</strong> Erkennen eigener Emotionen</li>
<li><strong>Selbstregulierung:</strong> Kontrolle impulsiver Gefühle</li>
<li><strong>Motivation:</strong> Antrieb jenseits externer Belohnungen</li>
<li><strong>Empathie:</strong> Verstehen der Gefühle anderer</li>
<li><strong>Soziale Kompetenz:</strong> Aufbau und Pflege von Beziehungen</li>
</ul>

<h3>EQ trainieren</h3>

<p><strong>Gefühle benennen:</strong> "Ich fühle mich frustriert" statt "Du bist nervig".</p>

<p><strong>Pause machen:</strong> Atmen Sie tief durch, bevor Sie reagieren.</p>

<p><strong>Perspektivenwechsel:</strong> Versuchen Sie, Situationen aus der Sicht anderer zu sehen.</p>

<p>Hohe EQ korreliert mit besserer psychischer Gesundheit, Führungskompetenz und Lebenszufriedenheit.</p>`
        },
        fr: {
            title: "Intelligence émotionnelle",
            content: `<p>L'intelligence émotionnelle (QE) est la capacité de comprendre et de gérer ses propres émotions et celles des autres. Elle est cruciale pour la santé mentale et le succès social.</p>

<h3>Composantes du QE</h3>

<ul>
<li><strong>Conscience de soi:</strong> Reconnaître ses propres émotions</li>
<li><strong>Autorégulation:</strong> Contrôle des sentiments impulsifs</li>
<li><strong>Motivation:</strong> Moteur au-delà des récompenses externes</li>
<li><strong>Empathie:</strong> Comprendre les sentiments des autres</li>
<li><strong>Compétences sociales:</strong> Construire et entretenir des relations</li>
</ul>

<h3>Entraîner le QE</h3>

<p><strong>Nommer les sentiments:</strong> "Je me sens frustré" au lieu de "Tu es ennuyeux".</p>

<p><strong>Faire une pause:</strong> Respirez profondément avant de réagir.</p>

<p><strong>Changement de perspective:</strong> Essayez de voir les situations du point de vue des autres.</p>

<p>Un QE élevé est corrélé à une meilleure santé mentale, des compétences en leadership et une satisfaction de vie.</p>`
        },
        pt: {
            title: "Inteligência Emocional",
            content: `<p>Inteligência Emocional (QE) é a capacidade de entender e gerenciar suas próprias emoções e as dos outros. É crucial para saúde mental e sucesso social.</p>

<h3>Componentes do QE</h3>

<ul>
<li><strong>Autoconsciência:</strong> Reconhecer próprias emoções</li>
<li><strong>Autorregulação:</strong> Controle de sentimentos impulsivos</li>
<li><strong>Motivação:</strong> Impulso além de recompensas externas</li>
<li><strong>Empatia:</strong> Entender os sentimentos dos outros</li>
<li><strong>Habilidades Sociais:</strong> Construir e manter relacionamentos</li>
</ul>

<h3>Treinando o QE</h3>

<p><strong>Nomear Sentimentos:</strong> "Eu me sinto frustrado" em vez de "Você é irritante".</p>

<p><strong>Fazer uma Pausa:</strong> Respire fundo antes de reagir.</p>

<p><strong>Mudança de Perspectiva:</strong> Tente ver situações do ponto de vista dos outros.</p>

<p>Alto QE correlaciona-se com melhor saúde mental, liderança e satisfação com a vida.</p>`
        }
    },
    {
        id: "lesson_gut_brain",
        de: {
            title: "Darm-Hirn-Achse",
            content: `<p>Ihr Darm wird oft als "zweites Gehirn" bezeichnet. Die Verbindung zwischen Darm und Gehirn ist tiefgreifend und beeinflusst Stimmung, Kognition und geistige Gesundheit.</p>

<h3>Wie sie kommunizieren</h3>

<ul>
<li><strong>Vagusnerv:</strong> Direkte Datenautobahn zwischen Darm und Gehirn</li>
<li><strong>Neurotransmitter:</strong> 90% des Serotonins (Glückshormon) werden im Darm produziert</li>
<li><strong>Immunsystem:</strong> Darmbakterien beeinflussen Entzündungen, die das Gehirn betreffen</li>
</ul>

<h3>Pflege Ihres Mikrobioms</h3>

<p><strong>Fermentierte Lebensmittel:</strong> Joghurt, Sauerkraut, Kimchi liefern Probiotika.</p>

<p><strong>Ballaststoffe:</strong> Gemüse, Obst, Vollkornprodukte füttern gute Bakterien (Präbiotika).</p>

<p><strong>Vermeidung von Antibiotika:</strong> Nur wenn medizinisch notwendig, da sie auch gute Bakterien töten.</p>

<p>Ein gesunder Darm führt zu einem klareren Geist und stabilerer Stimmung.</p>`
        },
        fr: {
            title: "Axe intestin-cerveau",
            content: `<p>Votre intestin est souvent appelé le "deuxième cerveau". La connexion entre l'intestin et le cerveau est profonde et influence l'humeur, la cognition et la santé mentale.</p>

<h3>Comment ils communiquent</h3>

<ul>
<li><strong>Nerf vague:</strong> Autoroute directe de données entre l'intestin et le cerveau</li>
<li><strong>Neurotransmetteurs:</strong> 90% de la sérotonine (hormone du bonheur) est produite dans l'intestin</li>
<li><strong>Système immunitaire:</strong> Les bactéries intestinales influencent l'inflammation qui affecte le cerveau</li>
</ul>

<h3>Prendre soin de votre microbiome</h3>

<p><strong>Aliments fermentés:</strong> Yaourt, choucroute, kimchi fournissent des probiotiques.</p>

<p><strong>Fibres:</strong> Légumes, fruits, grains entiers nourrissent les bonnes bactéries (prébiotiques).</p>

<p><strong>Éviter les antibiotiques:</strong> Seulement si médicalement nécessaire, car ils tuent aussi les bonnes bactéries.</p>

<p>Un intestin sain mène à un esprit plus clair et une humeur plus stable.</p>`
        },
        pt: {
            title: "Eixo Intestino-Cérebro",
            content: `<p>Seu intestino é frequentemente chamado de "segundo cérebro". A conexão entre intestino e cérebro é profunda e influencia humor, cognição e saúde mental.</p>

<h3>Como eles se comunicam</h3>

<ul>
<li><strong>Nervo Vago:</strong> Rodovia direta de dados entre intestino e cérebro</li>
<li><strong>Neurotransmissores:</strong> 90% da serotonina (hormônio da felicidade) é produzida no intestino</li>
<li><strong>Sistema Imunológico:</strong> Bactérias intestinais influenciam inflamação que afeta o cérebro</li>
</ul>

<h3>Cuidando do seu Microbioma</h3>

<p><strong>Alimentos Fermentados:</strong> Iogurte, chucrute, kimchi fornecem probióticos.</p>

<p><strong>Fibras:</strong> Legumes, frutas, grãos integrais alimentam boas bactérias (prebióticos).</p>

<p><strong>Evitar Antibióticos:</strong> Apenas se medicamente necessário, pois matam também boas bactérias.</p>

<p>Um intestino saudável leva a uma mente mais clara e humor mais estável.</p>`
        }
    },
    {
        id: "lesson_cognitive_reserve",
        de: {
            title: "Kognitive Reserve",
            content: `<p>Kognitive Reserve ist die Widerstandsfähigkeit Ihres Gehirns gegen Schäden. Sie erklärt, warum manche Menschen trotz Gehirnveränderungen (wie bei Alzheimer) keine Symptome zeigen.</p>

<h3>Aufbau der Reserve</h3>

<p>Stellen Sie sich die kognitive Reserve als Bankkonto vor. Sie zahlen ein durch:</p>
<ul>
<li><strong>Bildung:</strong> Lebenslanges Lernen</li>
<li><strong>Berufliche Komplexität:</strong> Geistig fordernde Arbeit</li>
<li><strong>Freizeitaktivitäten:</strong> Lesen, Spiele, soziale Interaktion</li>
<li><strong>Zweisprachigkeit:</strong> Das Sprechen mehrerer Sprachen stärkt exekutive Funktionen</li>
</ul>

<h3>Es ist nie zu spät</h3>

<p>Sie können Ihre kognitive Reserve in jedem Alter aufbauen. Je mehr Sie Ihr Gehirn fordern, desto mehr Verbindungen und alternative Pfade baut es auf.</p>

<p>Ein aktives, engagiertes Leben ist die beste Versicherung gegen kognitiven Abbau.</p>`
        },
        fr: {
            title: "Réserve cognitive",
            content: `<p>La réserve cognitive est la résilience de votre cerveau face aux dommages. Elle explique pourquoi certaines personnes ne présentent aucun symptôme malgré des changements cérébraux (comme dans la maladie d'Alzheimer).</p>

<h3>Construire la réserve</h3>

<p>Imaginez la réserve cognitive comme un compte bancaire. Vous déposez par:</p>
<ul>
<li><strong>Éducation:</strong> Apprentissage tout au long de la vie</li>
<li><strong>Complexité professionnelle:</strong> Travail mentalement exigeant</li>
<li><strong>Activités de loisirs:</strong> Lecture, jeux, interaction sociale</li>
<li><strong>Bilinguisme:</strong> Parler plusieurs langues renforce les fonctions exécutives</li>
</ul>

<h3>Il n'est jamais trop tard</h3>

<p>Vous pouvez construire votre réserve cognitive à tout âge. Plus vous défiez votre cerveau, plus il construit de connexions et de voies alternatives.</p>

<p>Une vie active et engagée est la meilleure assurance contre le déclin cognitif.</p>`
        },
        pt: {
            title: "Reserva Cognitiva",
            content: `<p>Reserva cognitiva é a resiliência do seu cérebro contra danos. Ela explica por que algumas pessoas não apresentam sintomas apesar de mudanças cerebrais (como no Alzheimer).</p>

<h3>Construindo a Reserva</h3>

<p>Imagine a reserva cognitiva como uma conta bancária. Você deposita através de:</p>
<ul>
<li><strong>Educação:</strong> Aprendizado ao longo da vida</li>
<li><strong>Complexidade Profissional:</strong> Trabalho mentalmente exigente</li>
<li><strong>Atividades de Lazer:</strong> Leitura, jogos, interação social</li>
<li><strong>Bilinguismo:</strong> Falar vários idiomas fortalece funções executivas</li>
</ul>

<h3>Nunca é tarde demais</h3>

<p>Você pode construir sua reserva cognitiva em qualquer idade. Quanto mais você desafia seu cérebro, mais conexões e caminhos alternativos ele constrói.</p>

<p>Uma vida ativa e engajada é o melhor seguro contra o declínio cognitivo.</p>`
        }
    },
    {
        id: "lesson_future",
        de: {
            title: "Zukunft der Gehirngesundheit",
            content: `<p>Die Wissenschaft der Gehirngesundheit entwickelt sich rasant. Wir verstehen heute mehr denn je über das Potenzial des menschlichen Gehirns.</p>

<h3>Aufkommende Trends</h3>

<ul>
<li><strong>Personalisierte Medizin:</strong> Behandlungen basierend auf Genetik und Biomarkern</li>
<li><strong>Neurofeedback:</strong> Echtzeit-Training von Gehirnwellen</li>
<li><strong>Nicht-invasive Stimulation:</strong> Technologien zur Verbesserung von Lernen und Gedächtnis</li>
<li><strong>KI und Big Data:</strong> Früherkennung von kognitiven Problemen</li>
</ul>

<h3>Ihr persönlicher Weg</h3>

<p>Unabhängig von technologischen Fortschritten bleiben die Grundlagen gleich:</p>
<p>Schlaf, Ernährung, Bewegung, Stressmanagement und lebenslanges Lernen sind die Säulen, auf denen kognitive Gesundheit ruht.</p>

<p>Sie haben nun das Werkzeug. Die Anwendung liegt bei Ihnen. Beginnen Sie heute, in Ihre kognitive Zukunft zu investieren.</p>`
        },
        fr: {
            title: "L'avenir de la santé cérébrale",
            content: `<p>La science de la santé cérébrale évolue rapidement. Nous comprenons aujourd'hui plus que jamais le potentiel du cerveau humain.</p>

<h3>Tendances émergentes</h3>

<ul>
<li><strong>Médecine personnalisée:</strong> Traitements basés sur la génétique et les biomarqueurs</li>
<li><strong>Neurofeedback:</strong> Entraînement en temps réel des ondes cérébrales</li>
<li><strong>Stimulation non invasive:</strong> Technologies pour améliorer l'apprentissage et la mémoire</li>
<li><strong>IA et Big Data:</strong> Détection précoce des problèmes cognitifs</li>
</ul>

<h3>Votre chemin personnel</h3>

<p>Indépendamment des progrès technologiques, les bases restent les mêmes:</p>
<p>Sommeil, nutrition, exercice, gestion du stress et apprentissage tout au long de la vie sont les piliers sur lesquels repose la santé cognitive.</p>

<p>Vous avez maintenant les outils. L'application vous appartient. Commencez aujourd'hui à investir dans votre avenir cognitif.</p>`
        },
        pt: {
            title: "Futuro da Saúde Cerebral",
            content: `<p>A ciência da saúde cerebral evolui rapidamente. Entendemos hoje mais do que nunca o potencial do cérebro humano.</p>

<h3>Tendências Emergentes</h3>

<ul>
<li><strong>Medicina Personalizada:</strong> Tratamentos baseados em genética e biomarcadores</li>
<li><strong>Neurofeedback:</strong> Treinamento em tempo real de ondas cerebrais</li>
<li><strong>Estimulação Não Invasiva:</strong> Tecnologias para melhorar aprendizado e memória</li>
<li><strong>IA e Big Data:</strong> Detecção precoce de problemas cognitivos</li>
</ul>

<h3>Seu Caminho Pessoal</h3>

<p>Independentemente dos avanços tecnológicos, os fundamentos permanecem os mesmos:</p>
<p>Sono, nutririção, exercício, gestão de estresse e aprendizado ao longo da vida são os pilares sobre os quais repousa a saúde cognitiva.</p>

<p>Você tem agora as ferramentas. A aplicação cabe a você. Comece hoje a investir no seu futuro cognitivo.</p>`
        }
    }
];

async function main() {
    console.log("Updating remaining lessons 11-20 with proper German/French/Portuguese content...\n");

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
        console.log("\nAll lessons should now have correct language content.");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
