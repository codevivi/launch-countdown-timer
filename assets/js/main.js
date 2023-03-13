const titleEl = document.getElementById("title");

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
function DisplayDom(card, currentEls, nextEls) {
  this.cardEl = card;
  this.currentEls = currentEls;
  this.nextEls = nextEls;
}
DisplayDom.prototype.setInitial = function setInitial(value, nextValue) {
  this.currentEls.forEach((el) => {
    el.textContent = pad0(value);
  });
  this.nextEls.forEach((el) => {
    el.textContent = pad0(nextValue);
  });
};

DisplayDom.prototype.setNext = function setNext(value) {
  let currentValue = this.nextEls[0].textContent;
  value = pad0(value);
  console.log("**************");
  console.log(value, currentValue);
  console.log("**************");
  if (value === currentValue) {
    return;
  }
  this.cardEl.classList.add("action");

  setTimeout(() => {
    this.currentEls.forEach((el) => {
      el.textContent = currentValue;
    });

    this.nextEls.forEach((el) => {
      el.textContent = value;
    });
    this.cardEl.classList.remove("action");
  }, 900);
};

const secondsDom = new DisplayDom(secondsCardEl, secondsElements, secondsNextElements);
const minutesDom = new DisplayDom(minutesCardEl, minutesElements, minutesNextElements);
const hoursDom = new DisplayDom(hoursCardEl, hoursElements, hoursNextElements);
const daysDom = new DisplayDom(daysCardEl, daysElements, daysNextElements);

//same as on design //always resets for now
const dueDate = new Date(Date.now() + 1000 * (1 + 55 * 60 + 23 * 3600 + 8 * 86400));
// const dueDate = new Date(Date.now() + 1000 * 4); //4 seconds for testing

setInitialDisplay(calcUnitsLeft(timeLeftInSeconds(dueDate)));
// let intervalId = setInterval(calcTimeLeftAndUpdateView, 1000);

function calcTimeLeftAndUpdateView() {
  let timeLeft = calcUnitsLeft(timeLeftInSeconds(dueDate));
  updateDisplay(timeLeft);
  if (timeLeft.end) {
    clearInterval(intervalId);
    setTimeout(() => {
      //wait to finish animation
      titleEl.textContent = "Countdown finished on " + dueDate.toLocaleDateString() + " " + dueDate.toLocaleTimeString();
    }, 1000);
    return;
  }
}

function calcUnitsLeft(allTimeInSeconds) {
  let end = false;
  if (allTimeInSeconds < 0) {
    end = true;
  }
  let days = Math.floor(allTimeInSeconds / (3600 * 24));
  let moreSeconds = allTimeInSeconds % (3600 * 24);
  let hours = Math.floor(moreSeconds / 3600);
  moreSeconds = moreSeconds % 3600;
  let minutes = Math.floor(moreSeconds / 60);
  let seconds = moreSeconds % 60;
  return { days, hours, minutes, seconds, end };
}

function updateDisplay(timeLeft) {
  daysDom.setNext(timeLeft.days);
  hoursDom.setNext(timeLeft.hours);
  minutesDom.setNext(timeLeft.minutes);
  secondsDom.setNext(timeLeft.seconds);
}

function setInitialDisplay({ days, hours, minutes, seconds, end }) {
  console.log(days, hours, minutes, seconds);
  if (end) {
    daysDom.setInitial(0, 0);
    hoursDom.setInitial(0, 0);
    minutesDom.setInitial(0, 0);
    secondsDom.setInitial(0, 0);
    return;
  }
  let nextDays = days > 0 ? days - 1 : 0;

  let dateOnHourChange = new Date(dueDate.getTime() - ((dueDate.getSeconds() + 1) * 1000 + dueDate.getMinutes() * 60 * 1000));
  console.log(dueDate);
  console.log(dateOnHourChange);
  let nextHours = calcUnitsLeft(timeLeftInSeconds(dateOnHourChange)).hours;
  if (nextHours < 0) {
    nextHours = 0;
  }
  let dateOnMinuteChange = new Date(dueDate.getTime() - (dueDate.getSeconds() + 1) * 1000);
  let nextMinutes = calcUnitsLeft(timeLeftInSeconds(dateOnMinuteChange)).minutes;
  if (nextMinutes < 0) {
    nextMinutes = 0;
  }
  let nextSeconds = seconds === 0 ? 59 : seconds - 1;
  console.log(nextDays, nextHours, nextMinutes, nextSeconds);
  daysDom.setInitial(days, nextDays);
  hoursDom.setInitial(hours, nextHours);
  minutesDom.setInitial(minutes, nextMinutes);
  secondsDom.setInitial(seconds, nextSeconds);
}

function timeLeftInSeconds(dueDate) {
  return Math.floor((dueDate.getTime() - Date.now()) / 1000);
}
function pad0(num) {
  let str = num.toString();
  if (str.length < 2) {
    str = "0" + str;
  }
  return str;
}
