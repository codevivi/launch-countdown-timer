//function initTimer must be available globally for settings to work
//initTimer, resetExample and formatNumber functions are defined in main.js. main.js must run before this file

"use strict";

const openSettingsBtn = document.getElementById("open-settings");
const openSettingsIcon = openSettingsBtn.querySelector("img");
const settingsEl = document.querySelector(".settings");
const resetExampleBtn = document.querySelector(".reset-btn");
const dateForm = settingsEl.querySelector("form");
const dateInput = settingsEl.querySelector("#date");
const titleInput = settingsEl.querySelector("#countdownTitle");

openSettingsBtn.addEventListener("click", toggleSettings);
dateForm.addEventListener("submit", setDate);
resetExampleBtn.addEventListener("click", resetExample);

function setDate(e) {
  e.preventDefault();
  let inputs = getFormData(dateForm);
  let date = new Date(inputs.date);
  localStorage.setItem("countdown-time-stamp", date.getTime().toString());
  localStorage.setItem("countdown-title", inputs.countdownTitle);

  initTimer(date, inputs.countdownTitle);
  toggleSettings();
}

function resetExample() {
  localStorage.clear();
  clearInterval(intervalId);
  setTimeout(() => {
    // titleInput.value = getTitle();
    initTimer();
  }, 1000);
}

function toggleSettings() {
  settingsEl.classList.toggle("hidden");
  let isClosed = openSettingsIcon.src.endsWith("gear.svg");

  if (isClosed) {
    openSettingsIcon.src = "./assets/images/close_remove.svg";

    // set min max and default values for date input
    const minDate = new Date(); //now //sets on open settings, so possible to choose date slightly in the past, but it will just show that timer finished
    const maxDate = new Date(minDate.getTime() + 366 * 86400000); //~one year
    const defaultDate = new Date(minDate.getTime() + 1 * 86400000); //one day //but sets on open settings so will be a bit behind
    dateInput.setAttribute("min", dateToAttrString(minDate));
    dateInput.setAttribute("max", dateToAttrString(maxDate));
    dateInput.value = dateToAttrString(new Date(Number(localStorage.getItem("countdown-time-stamp")) || defaultDate));
    titleInput.value = localStorage.getItem("countdown-title") || "We're launching soon";
  } else {
    openSettingsIcon.src = "./assets/images/settings_gear.svg";
  }
}

function dateToAttrString(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  return `${year}-${formatNumber(month)}-${formatNumber(day)}T${formatNumber(hour)}:${formatNumber(minute)}`;
}

function getFormData(form) {
  const formData = new FormData(form);
  let data = {};
  for (const [key, value] of formData) {
    data[key] = value;
  }
  return data;
}
