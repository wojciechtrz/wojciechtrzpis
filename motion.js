// Mouse-following GSAP image trail, constrained to the hero section.
function playAnimation(shape) {
  const timeline = gsap.timeline();
  timeline.from(shape, {
    opacity: 0,
    scale: 0,
    ease: "elastic.out(1,1)",
  })
  .to(shape, {
    rotation: "random([-360, 360])",
  }, "<")
  .to(shape, {
    y: "120vh",
    ease: "back.in(.4)",
    duration: 1,
  }, 0);
}

const gap = 100;
const flair = gsap.utils.toArray(".flair");
let flairOrder = gsap.utils.shuffle([...flair]);
let flairOrderIndex = 0;
let lastFlair = null;
gsap.defaults({ duration: 1 });

let mousePos = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let cachedMousePos = { x: 0, y: 0 };

const heroSection = document.getElementById("hero");
const heroBackground = document.getElementById("hero-bg");

if (heroSection && heroBackground) {
  gsap.set(heroBackground, { scale: 1.15 });
  const moveBackgroundY = gsap.quickTo(heroBackground, "y", {
    duration: 0.5,
    ease: "power2.out",
  });

  const updateHeroParallax = () => {
    const bounds = heroSection.getBoundingClientRect();
    const progress = gsap.utils.clamp(0, 1, -bounds.top / bounds.height);
    moveBackgroundY(progress * 90);
  };

  window.addEventListener("scroll", updateHeroParallax, { passive: true });
  window.addEventListener("resize", updateHeroParallax);
  updateHeroParallax();
}

if (heroSection) {
  heroSection.addEventListener("mousemove", (event) => {
    const heroBounds = heroSection.getBoundingClientRect();
    mousePos = {
      x: event.clientX - heroBounds.left,
      y: event.clientY - heroBounds.top,
    };
  });
}

if (flair.length > 0 && heroSection) {
  gsap.ticker.add(ImageTrail);
}

function ImageTrail() {
  const travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.1
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos = { ...mousePos };
  }
}

function animateImage() {
  if (flairOrderIndex >= flairOrder.length) {
    flairOrder = gsap.utils.shuffle([...flair]);
    if (flairOrder.length > 1 && flairOrder[0] === lastFlair) {
      [flairOrder[0], flairOrder[1]] = [flairOrder[1], flairOrder[0]];
    }
    flairOrderIndex = 0;
  }

  const img = flairOrder[flairOrderIndex++];
  lastFlair = img;

  gsap.killTweensOf(img);
  gsap.set(img, { clearProps: "all" });
  gsap.set(img, {
    opacity: 1,
    left: mousePos.x,
    top: mousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  playAnimation(img);
}

// Animate the actual hero headline, preserving its nested gradient link.
gsap.registerPlugin(SplitText);

const heroTitle = document.querySelector("#hero-title");
const heroRole = document.querySelector("#hero-role");

if (heroTitle) {
  document.fonts.ready.then(() => {
    const titleSplit = SplitText.create(heroTitle, {
      type: "words",
      wordsClass: "word",
      ignore: heroRole ? [heroRole] : [],
    });

    gsap.from([...titleSplit.words, ...(heroRole ? [heroRole] : [])], {
      y: 80,
      opacity: 0,
      rotation: "random(-12, 12)",
      stagger: 0.08,
      duration: 0.8,
      ease: "back.out(1.4)",
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentWord = document.querySelector("#contact-word-current");
  const nextWord = document.querySelector("#contact-word-next");
  const words = [
    "meaningful",
"useful",
"intuitive",
"human",
"simple",
"clear",
"accessible",
"thoughtful",
"purposeful",
"valuable",
"impactful",
"delightful",
"elegant",
"seamless",
"coherent",
"consistent",
"practical",
"efficient",
"flexible",
"scalable",
"inclusive",
"adaptive",
"effective",
"strategic",
"relevant",
"focused",
"memorable",
"remarkable",
"intentional",
"better",
"smarter",
"easier",
"simpler",
"clearer",
"friendlier",
"enjoyable",
"ambitious",
"considered",
"human-centered",
"user-focused",
"future-ready",

  ];

  if (!currentWord || !nextWord) return;

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    let wordIndex = 0;
    let outgoingWord = currentWord;
    let incomingWord = nextWord;
    let transition;
    let pause;

    const animateNextWord = () => {
      incomingWord.textContent = `${words[wordIndex]}.`;
      wordIndex = (wordIndex + 1) % words.length;

      transition = gsap.timeline({
        onComplete: () => {
          outgoingWord.setAttribute("aria-hidden", "true");
          incomingWord.removeAttribute("aria-hidden");
          [outgoingWord, incomingWord] = [incomingWord, outgoingWord];
          pause = gsap.delayedCall(1, animateNextWord);
        },
      });

      transition
        .to(outgoingWord, {
          y: -12,
          opacity: 0,
          duration: 0.2,
          ease: "power1.in",
        }, 0)
        .fromTo(
          incomingWord,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          0
        );
    };

    animateNextWord();

    return () => {
      transition.kill();
      if (pause) pause.kill();
    };
  });
});