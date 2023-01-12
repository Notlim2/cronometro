const cron = document.getElementById("cron");
cron.innerText = formatTime();

let intervalId;

let startDates = [];
let pauseDates = [];

function formatTimeUnit(timeUnit) {
  return `${timeUnit}`.padStart(2, "0");
}

function formatTime(hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(
    seconds
  )}.${milliseconds.toString().padStart(3, "0")}`;
}

function writeTime(passedTime) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const dayHours = 24;
  const secondMilliseconds = 1000;
  const minuteSeconds = 60;
  const hourMinutes = 60;

  const milliseconds = Math.floor(passedTime % secondMilliseconds);
  const seconds = Math.floor((passedTime / second) % minuteSeconds);
  const minutes = Math.floor((passedTime / minute) % hourMinutes);
  const hours = Math.floor((passedTime / hour) % dayHours);

  cron.innerText = formatTime(hours, minutes, seconds, milliseconds);
}

function configureInterval() {
  intervalId = setInterval(function () {
    let passedTime = 0;
    for (let i = 0; i < Math.max(startDates.length, pauseDates.length); i++) {
      const startDate = startDates[i];
      const pauseDate = pauseDates[i];
      if (pauseDate) {
        passedTime += pauseDate - startDate;
      } else {
        passedTime += getActualDate() - startDate;
      }
    }
    writeTime(passedTime);
  }, 30);
}

function getActualDate() {
  return Date.now();
}

function stopInterval() {
  clearInterval(intervalId);
  intervalId = undefined;
}

function start() {
  startDates.push(getActualDate());
  configureInterval();
}

function pause() {
  const isPaused = pauseDates.length >= startDates.length;
  if (isPaused) {
    start();
  } else {
    pauseDates.push(getActualDate());
    stopInterval();
  }
}

function stop() {
  stopInterval();
  startDates = [];
  pauseDates = [];
  cron.innerText = formatTime();
}
