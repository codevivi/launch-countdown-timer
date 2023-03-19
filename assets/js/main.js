class DisplayDom {
  constructor(card, currentEls, nextEls) {
    this.cardEl = card;
    this.currentEls = currentEls;
    this.nextEls = nextEls; //next card display that will flip
  }
  setNext(value) {
    if (value < 0) {
      value = 0;
    }

    value = pad0(value);
    let currentValue = this.currentEls[0].textContent;

    if (!currentValue) {
      // on page load
      currentValue = value;

      this.currentEls.forEach((el) => {
        el.textContent = pad0(value);
      });

      this.nextEls.forEach((el) => {
        el.textContent = pad0(value);
      });
    }

    if (value === currentValue) {
      return;
    }

    this.nextEls.forEach((el) => {
      //set display under with new value
      el.textContent = value;
    });

    this.cardEl.classList.add("action"); //start animation
    setTimeout(() => {
      //reverse animation
      this.currentEls.forEach((el) => {
        el.textContent = value;
      });
      this.cardEl.classList.remove("action");
    }, 900);
  }
}

const titleEl = document.getElementById("title");
const timeEls = document.querySelectorAll(".time");

const secondsCardEl = document.getElementById("seconds");
const secondsElements = document.querySelectorAll(".seconds");
const secondsNextElements = document.querySelectorAll(".seconds-next");

const minutesCardEl = document.getElementById("minutes");
const minutesElements = document.querySelectorAll(".minutes");
const minutesNextElements = document.querySelectorAll(".minutes-next");

const hoursCardEl = document.getElementById("hours");
const hoursElements = document.querySelectorAll(".hours");
const hoursNextElements = document.querySelectorAll(".hours-next");

const daysCardEl = document.getElementById("days");
const daysElements = document.querySelectorAll(".days");
const daysNextElements = document.querySelectorAll(".days-next");

const secondsDom = new DisplayDom(secondsCardEl, secondsElements, secondsNextElements);
const minutesDom = new DisplayDom(minutesCardEl, minutesElements, minutesNextElements);
const hoursDom = new DisplayDom(hoursCardEl, hoursElements, hoursNextElements);
const daysDom = new DisplayDom(daysCardEl, daysElements, daysNextElements);

let countDownTitle = localStorage.getItem("countdown-title") || `We're launching soon`;
//set due date to be one from localStorage or 14 days (as on design requirements)
let dueDate = new Date(Number(localStorage.getItem("countdown-time-stamp")) || Date.now() + 1000 * (14 * 86400));

let intervalId = null;
initTimer(dueDate);

function initTimer(dueDate, title = countDownTitle) {
  titleEl.textContent = title;
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (getFullDaysLeft(dueDate) > 99) {
    //reduce font size
    timeEls.forEach((el) => el.classList.add("fit"));
  }

  calcTimeLeftAndUpdateView(dueDate);
  intervalId = setInterval(() => {
    calcTimeLeftAndUpdateView(dueDate);
  }, 1000);
}

function calcTimeLeftAndUpdateView(dueDate) {
  let unitsLeft = calcUnitsLeft(timeLeftInSeconds(dueDate));
  updateDisplay(unitsLeft);
  if (unitsLeft.end) {
    clearInterval(intervalId);
    titleEl.textContent = "Countdown finished on " + dueDate.toLocaleDateString() + " " + dueDate.toLocaleTimeString();
    return;
  }
}

function calcUnitsLeft(allTimeInSeconds) {
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let end = true;
  if (allTimeInSeconds >= 0) {
    days = Math.floor(allTimeInSeconds / (3600 * 24));
    let moreSeconds = allTimeInSeconds % (3600 * 24);
    hours = Math.floor(moreSeconds / 3600);
    moreSeconds = moreSeconds % 3600;
    minutes = Math.floor(moreSeconds / 60);
    seconds = moreSeconds % 60;
    end = false;
  }
  return { days, hours, minutes, seconds, end };
}

function updateDisplay(timeLeft) {
  daysDom.setNext(timeLeft.days);
  hoursDom.setNext(timeLeft.hours);
  minutesDom.setNext(timeLeft.minutes);
  secondsDom.setNext(timeLeft.seconds);
}

function timeLeftInSeconds(dueDate) {
  return Math.ceil((dueDate.getTime() - Date.now()) / 1000);
}

function getFullDaysLeft(dueDate) {
  let seconds = timeLeftInSeconds(dueDate);
  return Math.floor(seconds / (3600 * 24));
}

function pad0(num) {
  let str = num.toString();
  if (str.length < 2) {
    str = "0" + str;
  }
  return str;
}
