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
DisplayDom.prototype.setInitial = function setInitial(nextValue, currentValue) {
  this.nextEls.forEach((el) => {
    el.textContent = pad0(nextValue);
  });
  this.currentEls.forEach((el) => {
    el.textContent = pad0(currentValue);
  });
};

DisplayDom.prototype.setNext = function setNext(value) {
  let currentValue = this.nextEls[0].textContent;
  value = pad0(value);
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

//same as on design
const dueDate = new Date(Date.now() + 1000 * (41 + 55 * 60 + 23 * 3600 + 8 * 86400));

// let dueDate = localStorage.getItem("dueDate");
// if (!dueDate) {
//   dueDate = exampleDueDate; // months in js starts from 0
//   localStorage.setItem("dueDate", dueDate.toString());
// } else {
//   dueDate = Date.parse(dueDate);
// }

setInitialTimeLeft(calcTimeLeft(), calcTimeLeft(0));
let intervalId = setInterval(calcTimeLeftAndUpdateView, 1000);

function calcTimeLeftAndUpdateView() {
  setTimeLeft(calcTimeLeft());
}

function calcTimeLeft(delay = 1) {
  //calculates time with one second delay as updating next display with
  let nowDate = new Date();
  let allTimeInSeconds = Math.floor((dueDate - nowDate) / 1000) - delay; //+1  as will be updating next display

  // if (allTimeInSeconds <= 0) {
  //   clearInterval(intervalId);
  //   //  secondsEl.textContent = "00";
  //   titleEl.textContent = `Countdown finished on ${exampleDueDate.toLocaleString()}`;
  //   return;
  // }

  let daysLeft = Math.floor(allTimeInSeconds / (3600 * 24));
  let moreSeconds = allTimeInSeconds % (3600 * 24);
  let hoursLeft = Math.floor(moreSeconds / 3600);
  moreSeconds = moreSeconds % 3600;
  let minutesLeft = Math.floor(moreSeconds / 60);
  let secondsLeft = moreSeconds % 60;
  return { daysLeft, hoursLeft, minutesLeft, secondsLeft };
}
function setTimeLeft(timeLeft) {
  daysDom.setNext(timeLeft.daysLeft);
  hoursDom.setNext(timeLeft.hoursLeft);
  minutesDom.setNext(timeLeft.minutesLeft);
  secondsDom.setNext(timeLeft.secondsLeft);
}
function setInitialTimeLeft(nextTimeLeft, currentTimeLeft) {
  daysDom.setInitial(nextTimeLeft.daysLeft, currentTimeLeft.daysLeft);
  hoursDom.setInitial(nextTimeLeft.hoursLeft, currentTimeLeft.hoursLeft);
  minutesDom.setInitial(nextTimeLeft.minutesLeft, currentTimeLeft.minutesLeft);
  secondsDom.setInitial(nextTimeLeft.secondsLeft, currentTimeLeft.secondsLeft);
}

function pad0(num) {
  let str = num.toString();
  if (str.length < 2) {
    str = "0" + str;
  }
  return str;
}
