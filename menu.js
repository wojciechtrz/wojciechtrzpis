// Shared navigation behavior for the home and resume pages.

const header = document.getElementById("header");
const hero = document.getElementById("hero");

if (header && hero && document.getElementById("nextSection")) {
  const headerObserver = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("bg-transparent", entry.isIntersecting);
      header.classList.toggle("bg-[#000000d4]", !entry.isIntersecting);
    },
    {
      threshold: 0,
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    }
  );

  headerObserver.observe(hero);
}

const homeLink = document.getElementById("home-link");
const projectsLink = document.getElementById("projects-link");
const projects = document.getElementById("nextSection");

if (homeLink && projectsLink && hero && projects) {
  const activate = (link) => {
    link.classList.add("bg-white", "text-indigo-700");
  };

  const deactivate = (link) => {
    link.classList.remove("bg-white", "text-indigo-700");
  };

  const checkScroll = () => {
    const heroRect = hero.getBoundingClientRect();
    const projectsRect = projects.getBoundingClientRect();

    if (heroRect.bottom > 200) {
      activate(homeLink);
      deactivate(projectsLink);
    } else if (projectsRect.top <= window.innerHeight && projectsRect.bottom >= 0) {
      activate(projectsLink);
      deactivate(homeLink);
    } else {
      activate(homeLink);
      deactivate(projectsLink);
    }
  };

  window.addEventListener("scroll", checkScroll);
  checkScroll();
}

const burgerBtn = document.getElementById("burger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay");

if (burgerBtn && mobileMenu && mobileOverlay) {
  let isOpen = false;
  let closeTimer;

  const openMenu = () => {
    window.clearTimeout(closeTimer);
    mobileOverlay.classList.remove("hidden");
    mobileMenu.classList.remove("opacity-0", "max-h-0", "scale-y-95", "invisible");
    mobileMenu.classList.add("opacity-100", "max-h-[500px]", "scale-y-100", "visible");
    burgerBtn.setAttribute("aria-expanded", "true");
    burgerBtn.setAttribute("aria-label", "Close menu");
    isOpen = true;
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("opacity-100", "max-h-[500px]", "scale-y-100", "visible");
    mobileMenu.classList.add("opacity-0", "max-h-0", "scale-y-95", "invisible");
    burgerBtn.setAttribute("aria-expanded", "false");
    burgerBtn.setAttribute("aria-label", "Open menu");
    isOpen = false;
    closeTimer = window.setTimeout(() => {
      mobileOverlay.classList.add("hidden");
    }, 300);
  };

  burgerBtn.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  mobileOverlay.addEventListener("click", (event) => {
    if (event.target === mobileOverlay) {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
    }
  });
}
