// =========================================
// 1. TYPING EFFECT (Hero Section)
// =========================================
const nameElement = document.getElementById('typed-name');
const nameText = "ULRICH FOSSO LIENOU";
let i = 0;

// On vide le h1 au chargement
nameElement.innerHTML = '';

function typeWriter() {
    if (i < nameText.length) {
        nameElement.innerHTML += nameText.charAt(i);
        i++;
        setTimeout(typeWriter, 80); // Vitesse de frappe (80ms)
    } else {
        // Quand c'est fini, on ajoute le curseur qui clignote
        nameElement.innerHTML += '<span class="cursor">|</span>';
    }
}

// On lance l'animation après un petit délai
setTimeout(typeWriter, 500);


// =========================================
// 2. SCROLL FADE-IN ANIMATION
// =========================================
// On utilise l'Intersection Observer (très performant)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // L'animation se déclenche quand 10% de l'élément est visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // On arrête d'observer une fois visible
        }
    });
}, observerOptions);

// On sélectionne toutes les sections (sauf le hero qui est déjà visible)
document.querySelectorAll('section:not(#hero)').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// =========================================
// 3. STATS COUNTER ANIMATION
// =========================================
// Les vrais chiffres sont ecrits directement dans le HTML ("20+", "2", "1") :
// si le JS ne s'execute pas, le visiteur voit la bonne valeur, pas 0.
// Le JS ne fait qu'animer le comptage, puis restaure le texte d'origine.
const aboutSection = document.querySelector('#about');
const counters = Array.from(document.querySelectorAll('.count')).map(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/); // ex: "20+" -> 20 et "+"
    return {
        el: el,
        raw: raw,
        target: match ? parseInt(match[1], 10) : null,
        suffix: match ? match[2] : ''
    };
});

let hasAnimated = false; // Pour ne jouer l'animation qu'une seule fois

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Si la section About est visible a l'ecran et que l'animation n'a pas encore joue
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true; // On bloque pour ne pas rejouer

            counters.forEach(counter => {
                if (counter.target === null) return; // Pas un nombre : on n'y touche pas

                const duration = 1500; // L'animation dure 1.5 secondes
                const increment = counter.target / (duration / 16); // Calcul pour 60 FPS
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < counter.target) {
                        counter.el.textContent = Math.ceil(current) + counter.suffix;
                        requestAnimationFrame(updateCounter); // Boucle fluide
                    } else {
                        // Quand c'est fini, on remet exactement le texte du HTML
                        counter.el.textContent = counter.raw;
                    }
                };

                updateCounter();
            });
        }
    });
}, { threshold: 0.5 }); // Se declenche quand 50% de la section est visible

if (aboutSection && counters.length > 0) {
    statsObserver.observe(aboutSection);
}


// =========================================
// 4. BASCULE DE LANGUE (FR / EN)
// =========================================
// Le francais est ecrit en dur dans le HTML : sans JavaScript, le site reste
// lisible et complet en francais. Le JS ne fait qu'echanger les textes vers
// l'anglais quand on clique sur EN, puis les remet en francais.
const I18N_EN = {
    // Navigation
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.stack': 'Stack',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': "Hi. I'm",
    'hero.subtitle': 'Full Stack Developer (Java · Spring Boot · Angular) · AI Integration · Application Security &amp; DevSecOps',
    'hero.location': '📍 Limoges, France · 3iL Ingénieurs — Computer Engineering, security track (2nd year)',
    'hero.cta.projects': 'View Projects →',
    'hero.cta.contact': 'Contact me',

    // A propos
    'about.title': 'About Me',
    'about.p1': 'I build full-stack applications that solve real problems — one of them runs every day in a family business in Cameroon.',
    'about.p2': "I'm in my second year of the computer engineering cycle at <strong>3iL Ingénieurs</strong> in Limoges, France, on the <strong>security track</strong> (2026–2027). Before that I studied at Institut Universitaire de la Côte (IUC) in Douala, Cameroon: integrated preparatory classes and the first year of the engineering cycle.",
    'about.p3': "I'm looking for a <strong>software engineering internship starting June 2027</strong>, in Java or full stack, ideally with a security dimension.",
    'about.p4': 'My focus: <strong>Spring Boot + Angular + AI integration + application security.</strong>',
    'stat.repos': 'GitHub repositories',
    'stat.internships': 'Internships completed',
    'stat.production': 'App in production',
    'alt.photo': 'Portrait of Ulrich FOSSO LIENOU',

    // Projets
    'projects.title': 'Featured Projects',
    'badge.production': 'In Production',
    'badge.vision': 'AI · Vision',
    'badge.llm': 'AI · LLM',
    'badge.mvp': 'MVP in progress',
    'fishcam.why': '<em>Fish shop management — built for a family business and used daily.</em>',
    'fishcam.desc': 'Purchase tracking, cash and credit sales, till monitoring, role-based access control and PDF reports.',
    'agronet.why': '<em>Cassava disease detection, designed for Cameroonian farmers.</em>',
    'agronet.desc': 'Android app that identifies diseases from photos of cassava leaves, with an on-device image classification model.',
    'correct.why': '<em>AI-assisted grading of student exercises.</em>',
    'correct.desc': 'Web app that compares student answers with reference solutions and drafts correction suggestions using a language model (Groq API).',
    'institut.why': '<em>Automated email notifications built in.</em>',
    'institut.desc': 'Web application for managing an institute, with automatic email sending (JavaMailSender).',
    'shoptrack.why': '<em>Sales and till tracking, on mobile.</em>',
    'shoptrack.desc': 'Mobile app for sales tracking and cash register management, with a local Drift database and a Supabase backend.',
    'projects.all': 'View all projects on GitHub →',

    // Parcours
    'experience.title': 'Experience',
    'job.title': 'Software Development Intern',
    'job1.date': 'Jul – Sep 2026',
    'job1.company': 'BAJ Service SA · Douala, Cameroon',
    'job1.task1': 'Built a Python application that retrieves attendance data from Dahua time clocks for the HR team.',
    'job1.task2': 'Built three showcase websites with Astro.',
    'job2.date': 'May – Aug 2025',
    'job2.company': 'NGOMBE SARL · Douala, Cameroon',
    'job2.task1': 'Built a full-stack payroll management application with Spring Boot, Angular and MySQL.',
    'job2.task2': 'Implemented JWT authentication.',

    // Stack
    'stack.title': 'Tech Stack',
    'stack.backend': 'Backend',
    'stack.backend.list': 'Java · Spring Boot · Spring Security · Python · FastAPI · REST APIs',
    'stack.frontend': 'Frontend',
    'stack.mobile': 'Mobile',
    'stack.databases': 'Databases',
    'stack.ai': 'AI',
    'stack.ai.list': 'TensorFlow Lite · EfficientNetV2 · Groq API',
    'stack.tools': 'Tools',
    'stack.learning': 'Currently learning',
    'stack.learning.list': 'Docker · CI/CD (GitHub Actions) · Application security · DevSecOps',
    'alt.backend': 'Backend technology icons: Java, Spring, Python, FastAPI',
    'alt.frontend': 'Frontend technology icons: Angular, TypeScript, JavaScript, HTML, CSS',
    'alt.mobile': 'Mobile technology icons: Kotlin, Android, Flutter',
    'alt.databases': 'Database icons: PostgreSQL, MySQL, Supabase',
    'alt.ai': 'AI technology icon: TensorFlow',
    'alt.tools': 'Tooling icons: Git, GitHub, Linux, Postman',
    'alt.learning': 'Icons of technologies I am currently learning: Docker, GitHub Actions',

    // Contact & footer
    'contact.title': "Let's work together",
    'contact.sub': 'Looking for a <strong>software engineering internship from June 2027</strong><br>\n          Java or full stack, ideally with a security dimension · Limoges, France',
    'contact.quote': '"Build things that solve real problems. Secure them. Then scale them."',
    'footer': '© 2026 Ulrich FOSSO LIENOU · Hand-coded HTML, CSS &amp; JavaScript · Hosted on GitHub Pages'
};

const textNodes = document.querySelectorAll('[data-i18n]');
const altNodes = document.querySelectorAll('[data-i18n-alt]');
const langButtons = document.querySelectorAll('.lang-btn');

// On garde une copie du francais tel qu'il est ecrit dans le HTML
const frText = new Map();
textNodes.forEach(node => frText.set(node, node.innerHTML));
const frAlt = new Map();
altNodes.forEach(node => frAlt.set(node, node.getAttribute('alt')));

function setLang(lang) {
    const toEnglish = lang === 'en';

    textNodes.forEach(node => {
        const key = node.getAttribute('data-i18n');
        // Si une traduction manque, on retombe sur le francais plutot que sur du vide
        node.innerHTML = toEnglish && I18N_EN[key] ? I18N_EN[key] : frText.get(node);
    });

    altNodes.forEach(node => {
        const key = node.getAttribute('data-i18n-alt');
        node.setAttribute('alt', toEnglish && I18N_EN[key] ? I18N_EN[key] : frAlt.get(node));
    });

    document.documentElement.lang = lang;

    langButtons.forEach(btn => {
        const isActive = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    try {
        localStorage.setItem('lang', lang);
    } catch (e) {
        // Navigation privee ou stockage bloque : on ignore, la bascule marche quand meme
    }
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
});

// Langue au chargement : francais par defaut, sauf si le visiteur a deja
// choisi l'anglais lors d'une visite precedente.
let initialLang = null;
try {
    initialLang = localStorage.getItem('lang');
} catch (e) {
    initialLang = null;
}
if (initialLang === 'en') {
    setLang('en');
}
