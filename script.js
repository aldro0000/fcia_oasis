const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  const texto = `Hola, soy ${nombre}.%0A` +
    `Mi teléfono es: ${telefono}.%0A` +
    `Consulta: ${mensaje}`;

  const whatsappURL = `https://wa.me/541153324146?text=${texto}`;
  window.open(whatsappURL, "_blank");
});