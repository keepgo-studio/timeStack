function initClickAlwaysOnTopButton(buttonElem) {
  const buttonAOT = document.getElementById("always-on-top")

  buttonAOT.onchange = ({ detail }) => { window.alwaysOnTop.toggle(); }

  buttonElem.addEventListener("click", async () => { 
    const status = await window.alwaysOnTop.toggle()
    buttonAOT.setAttribute('checked', status);
  })
}

async function initClickDarkButton(buttonElem) {
  const buttonDM = document.getElementById('dark-mode');

  const isDark = await window.darkMode.init();

  if (isDark) buttonDM.setAttribute('checked', true)

  buttonDM.onchange = ({ detail }) => { window.darkMode.toggle(); }

  buttonElem.addEventListener("click", async () => {
    const status = await window.darkMode.toggle()
    buttonDM.setAttribute('checked', status);
  })
}

function initMenuButton() {
  const menuIcon = document.querySelector(".timer-nav__menu-icon");
  const menuDiv = document.querySelector(".menu-block");
  const menuUl = document.querySelector(".menu-block ul");
  const menuLine = document.querySelector(".menu-block__line");
  
  for(let i = 0 ; i < menuUl.children.length ; i++){
    const liElem = menuUl.children[i];
    liElem.addEventListener('mouseenter', (e) => {
      menuLine.style.top = `${e.currentTarget.offsetTop}px`;
      menuLine.style.left = '0px';
    })

    liElem.addEventListener('mouseout', (e) => {
      menuLine.style.left = '-2px';
    })

    switch(i) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        initClickAlwaysOnTopButton(liElem);
        break;
      case 3:
        initClickDarkButton(liElem);
        break;
    }
  }

  menuIcon.addEventListener("click", () => { menuDiv.classList.toggle("close") })
}

function initHomeButton() {
  const homeIcon = document.querySelector('.timer-nav__home-icon');

  homeIcon.addEventListener("click", async () => { await window.openDashboard.open(); })
}


function timerOperator() {
}  
function initCLock() {
}
function initTimer() {
}
function initTimerButtons() {
}
function initTimerPauseNote() {
}

(() => {
  initMenuButton();
  initHomeButton();

})();
