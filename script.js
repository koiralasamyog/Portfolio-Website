const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("site-nav");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const counters = document.querySelectorAll("[data-counter]");
const typedText = document.getElementById("typed-text");
const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const backToTopLink = document.querySelector(".back-to-top");

const roles = [
    "Frontend Developer",
    "UI-Focused Builder",
    "Responsive Web Designer"
];

let roleIndex = 0;
let typingIndex = 0;
let deleting = false;

function setMenuState(isOpen) {
    navbar.classList.toggle("open", isOpen);
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
    const isOpen = !navbar.classList.contains("open");
    setMenuState(isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuState(false);
    }
});

function setActiveLink() {
    const currentSection = Array.from(sections).find((section) => {
        const offsetTop = section.offsetTop - 120;
        const offsetBottom = offsetTop + section.offsetHeight;
        return window.scrollY >= offsetTop && window.scrollY < offsetBottom;
    });

    if (!currentSection) {
        return;
    }

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSection.id}`;
        link.classList.toggle("active", isActive);
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const counter = entry.target;
            const target = Number(counter.dataset.counter);
            const suffix = target === 100 ? "%" : "+";
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 40));

            const timer = setInterval(() => {
                current += increment;

                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                counter.textContent = `${current}${suffix}`;
            }, 35);

            counterObserver.unobserve(counter);
        });
    },
    { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

function typeRoles() {
    if (!typedText) {
        return;
    }

    const currentRole = roles[roleIndex];

    if (!deleting) {
        typingIndex += 1;
        typedText.textContent = currentRole.slice(0, typingIndex);

        if (typingIndex === currentRole.length) {
            deleting = true;
            setTimeout(typeRoles, 1400);
            return;
        }
    } else {
        typingIndex -= 1;
        typedText.textContent = currentRole.slice(0, typingIndex);

        if (typingIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    const speed = deleting ? 50 : 95;
    setTimeout(typeRoles, speed);
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        setMenuState(false);
    }
});

setActiveLink();
typeRoles();

if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formNote.textContent =
            "Form submission is currently a front-end demo. Connect this form to your preferred form service before deployment.";
    });
}

if (backToTopLink) {
    backToTopLink.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
