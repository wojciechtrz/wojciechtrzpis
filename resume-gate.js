// Simple client-side gate only; static-site content is still accessible in source files.
const RESUME_PASSWORD = "ScttKGWT8Ccz";
const RESUME_UNLOCK_KEY = "resume-unlocked";

const passwordGate = document.getElementById("resume-password-gate");
const passwordForm = document.getElementById("resume-password-form");
const passwordInput = document.getElementById("resume-password");
const passwordError = document.getElementById("resume-password-error");
const passwordErrorMessage = document.getElementById("resume-password-error-message");
const resumeContent = document.getElementById("resume-content");
const resumeBackground = document.getElementById("resume-background");

if (resumeBackground && matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    resumeBackground.classList.add("is-active");
    resumeBackground.style.transform = `translate3d(${-x * 64}px, ${-y * 64}px, 0) scale(1.1)`;
  });

  document.addEventListener("pointerleave", () => {
    resumeBackground.classList.remove("is-active");
    resumeBackground.style.transform = "scale(1.1)";
  });
}

if (passwordGate && passwordForm && passwordInput && passwordError && passwordErrorMessage && resumeContent) {
  const unlockResume = () => {
    passwordGate.classList.add("hidden");
    resumeContent.classList.remove("hidden");
  };

  const showError = (message) => {
    passwordErrorMessage.textContent = message;
    passwordError.classList.add("is-visible");
    passwordError.setAttribute("aria-hidden", "false");
    passwordInput.setAttribute("aria-invalid", "true");
  };

  const hideError = () => {
    passwordError.classList.remove("is-visible");
    passwordError.setAttribute("aria-hidden", "true");
    passwordInput.removeAttribute("aria-invalid");
  };

  if (sessionStorage.getItem(RESUME_UNLOCK_KEY) === "true") {
    unlockResume();
  }

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredPassword = passwordInput.value.trim();

    if (!enteredPassword) {
      showError("Please enter your password.");
      passwordInput.focus();
      return;
    }

    if (enteredPassword === RESUME_PASSWORD) {
      sessionStorage.setItem(RESUME_UNLOCK_KEY, "true");
      unlockResume();
      return;
    }

    showError("That password is incorrect.");
    passwordInput.select();
  });

  passwordInput.addEventListener("input", () => {
    hideError();
  });
}
