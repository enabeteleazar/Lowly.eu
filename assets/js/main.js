const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-mailto-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const recipient = form.dataset.recipient || "contact@lowly.eu";
    const subject = data.get("subject") || "Contact Lowly";
    const body = [
      `Nom: ${data.get("name") || ""}`,
      `E-mail: ${data.get("email") || ""}`,
      "",
      data.get("message") || ""
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const recipient = form.dataset.recipient || "newsletter@lowly.eu";
    const email = data.get("email") || "";
    const subject = "Inscription newsletter Lowly";
    const body = `Merci de m'inscrire a la newsletter Lowly avec cette adresse : ${email}`;

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
