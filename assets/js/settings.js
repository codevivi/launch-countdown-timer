//function initTimer must be available globally for settings to work
//initTimer is defined in main.js. main.js must run before this file

"use strict";

const openSettingsBtn = document.getElementById("open-settings");
const openSettingsIcon = openSettingsBtn.querySelector("img");
const settingsEl = document.querySelector(".settings");
const dateForm = settingsEl.querySelector("form");
const dateInput = settingsEl.querySelector("#date");
const titleInput = settingsEl.querySelector("#title");

openSettingsBtn.addEventListener("click", toggleSettings);
dateForm.addEventListener("submit", setDate);

function setDate(e) {
  e.preventDefault();
  let inputs = getFormData(dateForm);
  let date = new Date(inputs.date);
  localStorage.setItem("countdown-time-stamp", date.getTime().toString());
  localStorage.setItem("countdown-title", inputs.title);

  initTimer(date, inputs.title);
  toggleSettings();
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
    titleInput.value = localStorage.getItem("countdown-title") || "";
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
  return `${year}-${pad0(month)}-${pad0(day)}T${pad0(hour)}:${pad0(minute)}`;
}

function getFormData(form) {
  const formData = new FormData(form);
  let data = {};
  for (const [key, value] of formData) {
    data[key] = value;
  }
  return data;
}
