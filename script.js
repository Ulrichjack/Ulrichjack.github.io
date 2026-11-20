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
