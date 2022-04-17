import IPCMessage from "../class/IPCMessage.js";

function handleClickAlwaysOnTopButton(buttonElem) {
  const buttonAOT = document.getElementById("always-on-top");

  buttonAOT.onchange = ({ detail }) => {
    window.alwaysOnTop.toggle();
  };

  buttonElem.addEventListener("click", async () => {
    const status = await window.alwaysOnTop.toggle();
    buttonAOT.setAttribute("checked", status);
  });
}

async function handleClickDarkButton(buttonElem) {
  const buttonDM = document.getElementById("dark-mode");

  const isDark = await window.darkMode.init();

  if (isDark) buttonDM.setAttribute("checked", true);

  buttonDM.onchange = ({ detail }) => {
    window.darkMode.toggle();
  };

  buttonElem.addEventListener("click", async () => {
    const status = await window.darkMode.toggle();
    buttonDM.setAttribute("checked", status);
  });
}

function initMenuButton() {
  const menuIcon = document.querySelector(".timer-nav__menu-icon");
  const menuDiv = document.querySelector(".menu-block");
  const menuUl = document.querySelector(".menu-block ul");
  const menuLine = document.querySelector(".menu-block__line");

  for (let i = 0; i < menuUl.children.length; i++) {
    const liElem = menuUl.children[i];
    liElem.addEventListener("mouseenter", (e) => {
      menuLine.style.top = `${e.currentTarget.offsetTop}px`;
      menuLine.style.left = "0px";
    });

    liElem.addEventListener("mouseout", (e) => {
      menuLine.style.left = "-2px";
    });

    switch (i) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        handleClickAlwaysOnTopButton(liElem);
        break;
      case 3:
        handleClickDarkButton(liElem);
        break;
    }
  }

  menuIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    menuDiv.classList.toggle("close");
  });
  document.querySelector("main").addEventListener("click", () => {
    menuDiv.classList.add("close");
  });
}

function initHomeButton() {
  const homeIcon = document.querySelector(".timer-nav__home-icon");

  homeIcon.addEventListener("click", async () => {
    await window.openDashboard.open();
  });
}

let hour = 0;
let min = 0;
let sec = 0;
let timerId;
let timerState = {
  start: false,
  pause: false,
  stop: true,
};
let startDate = null;

function timerOperator(command) {
  const go = () => {
    sec++;

    if (sec >= 60) {
      sec = 0;
      min++;
    }

    if (min >= 60) {
      min = 0;
      hour++;
    }
    drawTimerText(hour, min, sec);
  };

  switch (command) {
    case "start":
      timerState["start"] = true;
      timerState["pause"] = false;
      timerState["stop"] = false;

      drawCurrentTime();
      startDate = new Date();

      timerId = setInterval(go, 1000);
      break;

    case "pause":
      timerState["start"] = false;
      timerState["pause"] = true;
      timerState["stop"] = false;

      clearInterval(timerId);
      break;

    case "stop":
      timerState["start"] = false;
      timerState["pause"] = false;
      timerState["stop"] = true;

      const msg = new IPCMessage("save-stack-node", {
        startDateTime: startDate,
        endDateTime: new Date(),
        totalTime: `${hour}/${min}`
      });

      if (startDate) {
        window.workerCall.saveStackNode(msg);
        startDate = null;
      }

      drawCurrentTime();

      clearInterval(timerId);
      hour = 0;
      min = 0;
      sec = 0;
      drawTimerText(hour, min, sec);
      break;
  }
}

function drawCLock() {}

function drawTimerText(hour, min, sec) {
  const hourElem = document.querySelector(
    ".timer-block__timer__hour-min .hour-text"
  );
  const minElem = document.querySelector(
    ".timer-block__timer__hour-min .min-text"
  );
  const secElem = document.querySelector(".timer-block__timer__hour-min .sec");
  const column = document.querySelector(".timer-block__timer__hour-min > b");

  if (sec % 2 != 0) column.style.opacity = 0;
  else column.style.opacity = 1;

  hourElem.textContent = hour >= 10 ? hour.toString() : "0" + hour.toString();
  minElem.textContent = min >= 10 ? min.toString() : "0" + min.toString();
  secElem.textContent = sec >= 10 ? sec.toString() : "0" + sec.toString();
}

function initTimerButtons() {
  const startElem = document.getElementById("start-pause");
  const stopElem = document.getElementById("stop");

  startElem.addEventListener("mouseup", () => {
    if (startElem.classList.contains("mode-start")) {
      timerOperator("start");
      startElem.classList.remove("mode-start");
      startElem.classList.add("mode-pause");
    } else {
      timerOperator("pause");
      startElem.classList.add("mode-start");
      startElem.classList.remove("mode-pause");

      // save pause note
    }
  });

  stopElem.addEventListener("mouseup", () => {
    timerOperator("stop");

    if (startElem.classList.contains("mode-pause")) {
      startElem.classList.add("mode-start");
      startElem.classList.remove("mode-pause");

      // send data to worker process
    }
  });
}

function initTimerPauseNote() {}

function initHandleWorkerMessage() {
  window.addEventListener("message", ({ data }) => {
    switch (data.channel) {
      case "min-changed":
        drawCurrentTime();
        break;
      case "worker-success":
        drawAlertMessage(true, data.jsonData.message);
        break;
      case "worker-failed":
        drawAlertMessage(false, data.jsonData.message);
        break;
    }
  });
}

function drawCurrentTime() {
  const dateElem = document.querySelector(".timer-block__timer__current-time");
  const d = new Date();

  const hours =
    d.getHours() >= 10
      ? d.getHours().toString()
      : "0" + d.getHours().toString();
  const mins =
    d.getMinutes() >= 10
      ? d.getMinutes().toString()
      : "0" + d.getMinutes().toString();

  if (timerState["start"] && startDate === null)
    dateElem.innerHTML = `<span>START AT</span> ${hours} : ${mins}`;
  else if (timerState["stop"])
    dateElem.innerHTML = `CURRENT ${hours} : ${mins}`;
  else return;
}

function drawAlertMessage(isSuccess, errorMessage) {
  const alertBox = document.querySelector(".message-alert__box");

  alertBox.classList.add("show");
  alertBox.querySelector("span").textContent = errorMessage;

  if (isSuccess) {
    alertBox.classList.add("success");
    alertBox.classList.remove("failed");
  } else {
    alertBox.classList.remove("success");
    alertBox.classList.add("failed");
  }

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

(() => {
  initHandleWorkerMessage();
  initMenuButton();
  initHomeButton();
  initTimerButtons();

  drawCurrentTime();
})();
