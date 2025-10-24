const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("anunnaki-theme");

const applyTheme = (mode) => {
  root.dataset.theme = mode;
  if (mode === "light") {
    root.style.setProperty("--bg", "#f5f6ff");
    root.style.setProperty("--bg-alt", "#ffffff");
    root.style.setProperty("--surface", "rgba(255, 255, 255, 0.8)");
    root.style.setProperty("--card", "rgba(255, 255, 255, 0.65)");
    root.style.setProperty("--text", "#0f172a");
    root.style.setProperty("--muted", "#475569");
    root.style.setProperty("--border", "rgba(79, 70, 229, 0.2)");
    document.body.classList.add("light-theme");
  } else {
    root.style.removeProperty("--bg");
    root.style.removeProperty("--bg-alt");
    root.style.removeProperty("--surface");
    root.style.removeProperty("--card");
    root.style.removeProperty("--text");
    root.style.removeProperty("--muted");
    root.style.removeProperty("--border");
    document.body.classList.remove("light-theme");
  }
};

const initTheme = () => {
  let mode = "dark";
  if (storedTheme) {
    mode = storedTheme;
  } else if (!prefersDark.matches) {
    mode = "light";
  }
  applyTheme(mode);
};

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("anunnaki-theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

themeToggle?.addEventListener("click", () => {
  const current = root.dataset.theme === "light" ? "dark" : "light";
  applyTheme(current);
  localStorage.setItem("anunnaki-theme", current);
});

initTheme();

document.getElementById("year").textContent = new Date().getFullYear();

// Animated counters
const counters = document.querySelectorAll("[data-count]");
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const intersectionObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll(".reveal, .card, .timeline-item, .showcase-card, .team-card").forEach((element) => {
  element.classList.add("reveal");
  intersectionObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 1,
  }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Toast notifications
const toastTemplate = document.getElementById("toast-template");
let toastTimeout;

const showToast = (message) => {
  if (!toastTemplate) return;
  const toast = toastTemplate.content.firstElementChild.cloneNode(true);
  toast.querySelector("p").textContent = message;
  document.body.appendChild(toast);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 5200);
};

const handleForm = (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name");
  showToast(`Transmission locked in${name ? ", " + name : ""}.`);
  form.reset();
};

const contactForm = document.querySelector(".contact-form");
contactForm?.addEventListener("submit", handleForm);

const newsletterForm = document.querySelector(".newsletter form");
newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailField = newsletterForm.querySelector("input[type='email']");
  showToast(`Weekly signal dispatched to ${emailField.value || "your inbox"}.`);
  newsletterForm.reset();
});

// Smooth scroll enhancement
const navLinks = document.querySelectorAll("a[href^='#']");
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

const closeMenu = () => {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  if (!mobileMenu) return;
  const isHidden = mobileMenu.hidden;
  mobileMenu.hidden = !isHidden;
  menuToggle.setAttribute("aria-expanded", String(!isHidden));
  menuToggle.setAttribute("aria-label", !isHidden ? "Open navigation" : "Close navigation");
  document.body.classList.toggle("menu-open", !mobileMenu.hidden);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// subtle hero parallax
const hero = document.querySelector(".hero");
const orbital = document.querySelector(".orbital");

document.addEventListener("mousemove", (event) => {
  if (!hero || !orbital) return;
  const rect = hero.getBoundingClientRect();
  const insideHero =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!insideHero) return;

  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 20;

  orbital.style.transform = `translate(${x}px, ${y}px)`;
});

// Progressive enhancement: reduce motion
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const setReducedMotion = (enabled) => {
  root.classList.toggle("reduce-motion", enabled);
};

setReducedMotion(motionQuery.matches);
motionQuery.addEventListener("change", (event) => setReducedMotion(event.matches));
