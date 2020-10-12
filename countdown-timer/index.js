const timesElements = document.querySelectorAll(".number");

function calculateTimeUntilNewYear() {
  const target = new Date("Jan 1, 2021 00:00:00");
  let now = new Date().getTime();
  let timeInterval = target - now;

  let months = Math.floor(timeInterval / (1000 * 60 * 60 * 24 * 30));
  let days = Math.floor(
    (timeInterval % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
  );
  let hours = Math.floor(
    (timeInterval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = Math.floor((timeInterval % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeInterval % (1000 * 60)) / 1000);

  return [months, days, hours, minutes, seconds];
}

function updateTimes() {
  const times = calculateTimeUntilNewYear();
  timesElements.forEach((timeElement, index) => {
    timeElement.textContent = times[index];
  });
}

setInterval(() => {
  updateTimes();
}, 1000);
