const menu = document.querySelector(".menu-responsivo");
const sidebarToggle = document.getElementById("abrir-menu");
const cerrarMenu = document.getElementById("cerrar-menu-responsivo");
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  if (touchEndX < touchStartX && Math.abs(touchStartX - touchEndX) > 50) {
    // Deslizar hacia la izquierda
    menu.classList.remove("translate-x-[0]");
  }
  if (touchEndX > touchStartX && Math.abs(touchEndX - touchStartX) > 50) {
    // Deslizar hacia la derecha
    menu.classList.add("translate-x-[0]");
  }
}

sidebarToggle.addEventListener("click", function () {
  menu.classList.add("translate-x-[0]");
});

cerrarMenu.addEventListener("click", function () {
  menu.classList.remove("translate-x-[0]");
});

// Agregar eventos de toque
document.addEventListener(
  "touchstart",
  function (e) {
    touchStartX = e.changedTouches[0].screenX;
  },
  false
);

document.addEventListener(
  "touchend",
  function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  },
  false
);
