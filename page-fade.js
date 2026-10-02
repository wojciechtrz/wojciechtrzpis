// Shared page fade-in and optional link fade-out behavior.

const showPage = () => {
  document.body.classList.remove("opacity-0");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showPage, { once: true });
} else {
  showPage();
}

document.querySelectorAll("[data-fade]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.add("opacity-0");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 500);
  });
});
