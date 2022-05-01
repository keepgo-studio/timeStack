import IPCMessage from "../class/IPCMessage.js";
import "../components/index.js"

function handleClickAlwaysOnTopButton(buttonElem) {
  const buttonAOT = document.getElementById("always-on-top");

  buttonElem.addEventListener("click", async () => {
    const status = await window.alwaysOnTop.toggle();
    buttonAOT.setAttribute("checked", status);
  });
}

async function handleClickDarkButton(buttonElem) {
  const buttonDM = document.getElementById("dark-mode");

  const isDark = await window.darkMode.init();

  if (isDark) buttonDM.setAttribute("checked", true);

  buttonElem.addEventListener("click", async () => {
    const status = await window.darkMode.toggle();
    buttonDM.setAttribute("checked", status);
  });
}

function handleClickSettingButton(buttonElem) {
  buttonElem.addEventListener("click", () => {
    window.open("../pages/settings.html", {
      width: 700,
      height: 500,
      resizable: false
    })
  })
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
        handleClickSettingButton(liElem)
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

let global_hour = 0;
let global_min = 0;
let global_sec = 0;
let global_timerId;
let global_timerState = {
  start: false,
  pause: false,
  stop: true,
};
let global_startDate = null;
let global_msg = null;

function timerOperator(command) {
  const go = () => {
    global_sec++;

    if (global_sec >= 60) {
      global_sec = 0;
      global_min++;
    }

    if (global_min >= 60) {
      global_min = 0;
      global_hour++;
    }
    drawTimerText(global_hour, global_min, global_sec);
  };

  switch (command) {
    case "start":
      global_timerState["start"] = true;
      global_timerState["pause"] = false;
      global_timerState["stop"] = false;

      drawCurrentTime();
      global_startDate = new Date();

      global_timerId = setInterval(go, 1000);
      break;

    case "pause":
      global_timerState["start"] = false;
      global_timerState["pause"] = true;
      global_timerState["stop"] = false;

      clearInterval(global_timerId);
      break;

    case "stop":
      global_timerState["start"] = false;
      global_timerState["pause"] = false;
      global_timerState["stop"] = true;

      if (global_startDate) {
        global_msg = new IPCMessage("save-stack-node", {
          startDateTime: global_startDate,
          endDateTime: new Date(),
          totalTime: `${global_hour}/${global_min}`
        });

        swtichContentsFocus();
        drawEditorHeader();

        global_startDate = null;

        drawCurrentTime(global_hour, global_min);
  
        clearInterval(global_timerId);
        global_hour = 0;
        global_min = 0;
        global_sec = 0;
        drawTimerText(global_hour, global_min, global_sec);
      }

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

  startElem.addEventListener("mouseup", (e) => {
    e.stopPropagation();
    if (startElem.classList.contains("mode-start")) {
      timerOperator("start");
      startElem.classList.remove("mode-start");
      startElem.classList.add("mode-pause");
    } else {
      timerOperator("pause");
      startElem.classList.add("mode-start");
      startElem.classList.remove("mode-pause");
    }
  });

  stopElem.addEventListener("mouseup", (e) => {
    e.stopPropagation();
    timerOperator("stop");

    if (startElem.classList.contains("mode-pause")) {
      startElem.classList.add("mode-start");
      startElem.classList.remove("mode-pause");
    }
  });
}

function initTimerPauseNote() {}

let global_isLoading = true;

function initHandleWorkerMessage() {
  window.addEventListener("message", ({ data }) => {
    let msg;

    switch (data.channel) {
      case "worker--min-changed":
        drawCurrentTime();
        break;
      case "worker--success":
        global_isLoading = false;
        drawAlertMessage(true, data.jsonData.message);
        break;
      case "worker--failed":
        global_isLoading = false;
        drawAlertMessage(false, data.jsonData.message);
        break;

      case "memo-editor--save":
        msg = new IPCMessage("save-memo-to-stack-node", {
          editor_js_blocks: JSON.stringify(data.editorJson),
          stack_node: global_msg.getJsonData()
        });
        
        window.workerCall.saveMemoToStackNode(msg);
        resetEditor();
        break;
      
      case "memo-editor--unsave":
        window.workerCall.saveStackNode(globla_msg);
        resetEditor();
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

  if (global_timerState["start"] && global_startDate === null)
    dateElem.innerHTML = `<span>START AT</span> ${hours} <b>:</b> ${mins}`;
  else if (global_timerState["stop"])
    dateElem.innerHTML = `CURRENT ${hours} <b>:</b> ${mins}`;
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

function drawEditorHeader() {
  document.querySelector(".editor__header-container > h3").textContent = `${global_hour}시간 ${global_min}분 동안 한 일들`
}

function drawDialog() {
  const customDialog = document.createElement('ts-dialog');

  customDialog.setAttribute('hour', global_hour.toString());
  customDialog.setAttribute('minutes', global_min.toString())
  customDialog.setAttribute('type', "작업");

  customDialog.addEventListener('should-save', ({ detail }) => {
    if (detail.shouldSave){ 
      document.querySelector("iframe").contentWindow.postMessage({call: 'shouldSave', value: true});
    }
    
    swtichContentsFocus();
  })

  document.body.appendChild(customDialog);
}

function initEditorButtons() {
  document.querySelector(".editor__buttons-container button:nth-child(1)").addEventListener("click", () => {
    drawDialog();
  })

  document.querySelector(".editor__buttons-container button:nth-child(2)").addEventListener("click", () => {
    swtichContentsFocus();
  })
}

function swtichContentsFocus() {
  const timer = document.querySelector(".timer");
  const editor = document.querySelector(".editor");

  if(timer.classList.contains("focus")){
    timer.classList.remove("focus");

    setTimeout(()=>{
      timer.style.left = "100%";
      
      setTimeout(()=>{
        editor.classList.add("focus");
      },300);

    },300);
    
  } else {
    editor.classList.remove("focus");

    setTimeout(()=>{
      timer.style.left = "0";
      
      setTimeout(()=>{
        timer.classList.add("focus");
      },300);

    },300);
  }
}

function resetEditor() {
  document.querySelector("iframe").contentWindow.location.reload()
}
(() => {
  initHandleWorkerMessage();
  initMenuButton();
  initHomeButton();
  initTimerButtons();
  initEditorButtons();

  drawCurrentTime();
})();