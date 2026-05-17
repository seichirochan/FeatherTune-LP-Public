const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealTargets = document.querySelectorAll(".reveal");
const aiMark = document.querySelector("[data-ai-mark]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeMenu = () => {
  menuToggle?.classList.remove("is-open");
  nav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
};

const markAiImageLoaded = () => {
  aiMark?.closest(".ai-mark-shell")?.classList.add("is-loaded");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-open");
  nav?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (aiMark) {
  if (aiMark.complete && aiMark.naturalWidth > 0) {
    markAiImageLoaded();
  }

  aiMark.addEventListener("load", markAiImageLoaded);

  aiMark.addEventListener("error", () => {
    const fallbackSrc = aiMark.dataset.fallbackSrc;
    const markShell = aiMark.closest(".ai-mark-shell");

    markShell?.classList.remove("is-loaded");

    if (fallbackSrc && !aiMark.src.endsWith(fallbackSrc)) {
      aiMark.src = fallbackSrc;
      return;
    }

    markShell?.classList.add("is-missing");
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
