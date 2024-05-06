document.addEventListener("DOMContentLoaded", function () {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const holidays = [
    { month: 0, day: 1 },
    { month: 2, day: 29 },
    { month: 2, day: 30 },
    { month: 4, day: 1 },
    { month: 4, day: 21 },
    { month: 5, day: 9 },
    { month: 5, day: 20 },
    { month: 5, day: 29 },
    { month: 6, day: 16 },
    { month: 7, day: 15 },
    { month: 8, day: 18 },
    { month: 8, day: 19 },
    { month: 8, day: 20 },
    { month: 9, day: 12 },
    { month: 9, day: 27 },
    { month: 9, day: 31 },
    { month: 10, day: 1 },
    { month: 11, day: 8 },
    { month: 11, day: 25 },
  ];

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectingRange = false;
  let startDate = null;
  let endDate = null;
  let rangeMode = false;

  const calendar = document.getElementById("calendar");
  const currentMonthYear = document.getElementById("currentMonthYear");
  const oneWayNote = document.querySelector(".note.one-way");
  const roundTripNote = document.querySelector(".note.round-trip");
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");
  const travelModeSwitch = document.getElementById("cambiar-modo");
  const tipoViajeParagraph = document.getElementById("tipo-viaje"); // Obtener el párrafo donde se muestra el tipo de viaje

  // Initialize notes visibility based on the travel mode switch state
  oneWayNote.style.display = "block";
  roundTripNote.style.display = "none";
  tipoViajeParagraph.textContent = "Viaje solo de ida";

  console.log(
    "El día actual es:",
    weekdays[currentDate.getDay()],
    currentDate.getDate(),
    monthNames[currentDate.getMonth()],
    currentDate.getFullYear()
  );

  travelModeSwitch.addEventListener("change", (e) => {
    rangeMode = e.target.checked;
    oneWayNote.style.display = rangeMode ? "none" : "block";
    roundTripNote.style.display = rangeMode ? "block" : "none";
    tipoViajeParagraph.textContent = rangeMode
      ? "Viaje de ida y vuelta"
      : "Viaje solo de ida"; // Cambiar texto según el estado del switch
    resetSelection();
    highlightCurrentDay();
  });
  function highlightCurrentDay() {
    const today = new Date();
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      const dayDate = new Date(
        currentYear,
        currentMonth,
        parseInt(day.textContent) || 0
      );
      if (dayDate.toDateString() === today.toDateString()) {
        if (
          (!rangeMode && !document.querySelector(".day.selected")) ||
          (rangeMode && !selectingRange && !startDate)
        ) {
          day.classList.add("today");
        } else {
          day.classList.remove("today");
        }
      } else {
        day.classList.remove("today");
      }
    });
  }

  prevMonthButton.addEventListener("click", () => {
    if (
      currentMonth > currentDate.getMonth() ||
      currentYear > currentDate.getFullYear()
    ) {
      changeMonth(-1);
    }
  });
  nextMonthButton.addEventListener("click", () => changeMonth(1));

  function changeMonth(change) {
    currentMonth += change;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    } else if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    console.log(`Cambiado a: ${monthNames[currentMonth]} ${currentYear}`);
    updateCalendar();
  }

  const updateCalendar = () => {
    currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendar.innerHTML = "";
    const firstDay = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const offsetDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = 0; i < offsetDays; i++) {
      calendar.insertAdjacentHTML("beforeend", '<div class="day"></div>');
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = day;

      if (isHoliday(dayDate)) dayElement.classList.add("holiday");
      if (dayDate < new Date(new Date().setHours(0, 0, 0, 0)))
        dayElement.classList.add("blocked");
      if (dayDate.toDateString() === new Date().toDateString())
        dayElement.classList.add("today"); // Asegura que el día actual siempre tenga la clase 'today'

      dayElement.addEventListener("mousedown", () =>
        handleDayClick(dayDate, dayElement)
      );
      dayElement.addEventListener("mouseenter", () => handleDayHover(dayDate));

      calendar.appendChild(dayElement);
    }

    highlightRange();
    adjustButtonStates();
  };

  const adjustButtonStates = () => {
    if (
      currentMonth <= currentDate.getMonth() &&
      currentYear <= currentDate.getFullYear()
    ) {
      prevMonthButton.classList.add("button-disabled");
    } else {
      prevMonthButton.classList.remove("button-disabled");
    }
  };

  const isHoliday = (dayDate) =>
    holidays.some(
      (h) => dayDate.getMonth() === h.month && dayDate.getDate() === h.day
    );

  function handleDayClick(dayDate, dayElement) {
    if (dayElement.classList.contains("blocked")) {
      console.log(
        "Intento de selección en día bloqueado:",
        dayDate.toDateString()
      );
      return; // No hacer nada si el día está bloqueado
    }

    const todayElement = document.querySelector(".day.today");
    if (!rangeMode) {
      // Modo de selección única
      const oldSelected = document.querySelector(".day.selected");
      if (oldSelected && oldSelected !== dayElement) {
        oldSelected.classList.remove("selected");
      }
      dayElement.classList.add("selected");
      startDate = dayDate;
      endDate = null;
      selectingRange = false;
      if (todayElement) todayElement.classList.remove("today");
      console.log(
        "Has seleccionado el dia:",
        weekdays[dayDate.getDay()],
        dayDate.getDate(),
        monthNames[dayDate.getMonth()],
        dayDate.getFullYear()
      );
    } else {
      // Modo de rango
      if (!selectingRange && !startDate) {
        // Seleccionando la primera fecha del nuevo rango
        startDate = dayDate;
        endDate = null;
        selectingRange = true;
        document
          .querySelectorAll(".day.selected, .day.in-range")
          .forEach((d) => d.classList.remove("selected", "in-range"));
        dayElement.classList.add("selected");
      } else if (selectingRange && !endDate) {
        // Seleccionando la segunda fecha del rango
        endDate = dayDate;
        if (startDate > endDate) {
          [startDate, endDate] = [endDate, startDate]; // Asegurar que startDate es siempre menor que endDate
        }
        selectingRange = false;
        highlightRange(); // Resaltar rango seleccionado
      } else {
        // Al seleccionar una tercera fecha, resetea todo para comenzar una nueva selección de dos fechas
        document
          .querySelectorAll(".day.selected, .day.in-range")
          .forEach((d) => d.classList.remove("selected", "in-range"));
        startDate = dayDate; // Establecer la tercera fecha clickeada como la nueva fecha de inicio
        endDate = null;
        selectingRange = true; // Habilitar la selección de la segunda fecha del nuevo rango
        dayElement.classList.add("selected");
      }
      if (todayElement) todayElement.classList.remove("today");
      console.log(
        "Rango seleccionado:",
        weekdays[startDate.getDay()],
        startDate.getDate(),
        monthNames[startDate.getMonth()],
        startDate.getFullYear(),
        " - ",
        weekdays[endDate.getDay()],
        endDate.getDate(),
        monthNames[endDate.getMonth()],
        endDate.getFullYear()
      );
    }
  }

  const handleDayHover = (dayDate) => {
    if (rangeMode && selectingRange) {
      const potentialEndDate = dayDate;
      const start = startDate > potentialEndDate ? potentialEndDate : startDate;
      const end = startDate > potentialEndDate ? startDate : potentialEndDate;
      highlightTemporaryRange(start, end);
    }
  };

  const highlightRange = () => {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      const dayDate = new Date(
        currentYear,
        currentMonth,
        parseInt(day.textContent) || 0
      );
      day.classList.remove("selected", "in-range");
      if (startDate && dayDate.toDateString() === startDate.toDateString())
        day.classList.add("selected");
      if (endDate && dayDate.toDateString() === endDate.toDateString())
        day.classList.add("selected");
      if (startDate && endDate && dayDate >= startDate && dayDate <= endDate)
        day.classList.add("in-range");
    });
  };

  const highlightTemporaryRange = (start, end) => {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      const dayDate = new Date(
        currentYear,
        currentMonth,
        parseInt(day.textContent) || 0
      );
      day.classList.remove("in-range");
      if (dayDate >= start && dayDate <= end) day.classList.add("in-range");
    });
  };

  const resetSelection = () => {
    // Reiniciar fecha a hoy
    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();

    startDate = null;
    endDate = null;
    selectingRange = false;
    highlightRange();
    updateCalendar(); // Asegúrate de llamar a updateCalendar para reflejar los cambios
  };

  updateCalendar();
});
