document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const btnCampana = document.getElementById("btn-campana");
  const notificationCenter = document.getElementById("notification-center");
  const closeBtn = document.getElementById("close-btn-notification");
  const mainContent = document.getElementById("mainContent");

  // Función para abrir el centro de notificaciones
  btnCampana.addEventListener("click", function () {
    notificationCenter.classList.add("active");
    mainContent.classList.add("blur");
  });

  // Función para cerrar el centro de notificaciones
  function closeNotificationCenter() {
    notificationCenter.classList.remove("active");
    mainContent.classList.remove("blur");
  }

  closeBtn.addEventListener("click", closeNotificationCenter);

  // Cerrar el centro de notificaciones al hacer clic fuera de él
  document.addEventListener("click", function (event) {
    // Verificar si el clic fue fuera del centro de notificaciones
    if (
      !notificationCenter.contains(event.target) &&
      !btnCampana.contains(event.target)
    ) {
      closeNotificationCenter();
    }
  });
});
