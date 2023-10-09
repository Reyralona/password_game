const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");
const stats = document.querySelector("#stats");
const message = document.querySelector("#message");
const restartelm = document.querySelector("#restart");
const health = document.querySelector("#health");
const changebutton = document.querySelector("#timed");
const start = document.querySelector("#start");

const numdigits = 4;
const maxattempts = 5;
var numattempts = maxattempts;
var repeatednums = 0;
var isover = 1;
var timed = 0;
var maxtime = 30;
var timer = maxtime; // seconds
var timerinterval;
var password = genPassword();

changebutton.onclick = () => {
  if (!timed) {
    timed = 1;
    changebutton.innerText = "Attempts";
  } else {
    timed = 0;
    changebutton.innerText = "Timed";
  }
  updHealth();
};

start.onclick = () => {
  setPlayingState()
  setup(0);
};

function setPlayingState(){
  if (isover && start.innerText != "Playing!") {
    isover = 0;
    setTimer();
    start.innerText = "Playing!";
    
  }
}

function updHealth() {
  if (timed) {
    health.innerText = `Time: ${timer}s`;
  } else {
    health.innerText = `Attempts: ${numattempts}`;
  }
}

function increment(digitobj) {
  if (!isover) {
    let num = Number(digitobj.innerText);
    num >= 9 ? (num = 0) : num++;
    digitobj.innerText = String(num);
  }
}
function decrement(digitobj) {
  if (!isover) {
    let num = Number(digitobj.innerText);
    num <= 0 ? (num = 9) : num--;
    digitobj.innerText = String(num);
  }
}

function setTimer() {
  if (timed && !isover) {
    timerinterval = setInterval(() => {
      if (timer == 0 && !isover) {
        clearInterval(timerinterval);
        isover = 1;
        updStatus("You Lose!", "flex");
      } else if (!isover) {
        timer--;
        updHealth();
      }
    }, 1000);
  }
}

function setup() {
  //clear
  container1.innerHTML = "";
  container2.innerHTML = "";

  //generate digits
  let el = `<div class="digits">`;
  for (let i = 0; i < numdigits; i++) {
    el += `<div id="digit${i}" class="digit">
        <div class="inc">▲</div>
        <div class="num">0</div>
        <div class="dec">▼</div>
    </div>`;
  }
  el += `</div>`;
  container1.insertAdjacentHTML("beforeend", el);

  //add test button
  let but = `<button id="test">&nbsp;</button>`;
  container1.insertAdjacentHTML("beforeend", but);
  document.querySelector("#test").onclick = () => {
    if(isover){ setPlayingState()}
    tryCombination();
  };

  //set attempt password
  let el2 = `<div class="attempt">`;
  for (let i = 0; i < numdigits; i++) {
    el2 += `<div class="attemptdigit" id="attemptdigit${i}">0</div>`;
  }
  el2 += `</div>`;
  container2.insertAdjacentHTML("beforeend", el2);

  //add event listeners
  for (let i = 0; i < numdigits; i++) {
    let target = document.querySelector(`#digit${i}`);
    target.children[0].onclick = () => {
      if(isover){ setPlayingState() }
      increment(target.children[1]);
    };
    target.children[2].onclick = () => {
      if(isover){ setPlayingState() }
      decrement(target.children[1]);
    };
  }
  updHealth();

  restartelm.onclick = () => {
    restart();
  };
}

function getAttempt() {
  let digits = [];
  for (let i = 0; i < numdigits; i++) {
    digits.push(
      Number(document.querySelector(`#digit${i}`).children[1].innerText)
    );
  }
  return digits;
}

function changeColor(obj, color) {
  if (obj.classList.contains("green")) {
    obj.classList.replace("green", color);
  }
  if (obj.classList.contains("yellow")) {
    obj.classList.replace("yellow", color);
  }
  if (obj.classList.contains("red")) {
    obj.classList.replace("red", color);
  }
  obj.classList.add(color);
}

function updStatus(msg, display) {
  message.innerText = msg;
  stats.style.display = display;
}

function checkWin() {
  let correctattempts = 0;
  for (let i = 0; i < numdigits; i++) {
    let elm = document.querySelector(`#attemptdigit${i}`);
    if (elm.classList.contains("green")) {
      correctattempts++;
    }
  }
  if (correctattempts == numdigits) {
    isover = 1;
    updStatus("You win!", "flex");
  }
}

function checkLoss() {
  if (!timed) {
    if (numattempts == 0 && !isover) {
      isover = 1;
      updStatus("You Lose!", "flex");
    }
  }
}

function restart() {
  if (timed) {
    timer = maxtime;
  } else {
    numattempts = maxattempts;
  }
  isover = 1;
  updStatus("", "none");
  clearInterval(timerinterval)
  password = genPassword();
  start.innerText = "Play";
  setup();
}

function tryCombination() {
  if (!timed && !isover) {
    numattempts--;
    updHealth();
  }
  //compare
  if (!isover) {
    let attempt = getAttempt();
    for (let i = 0; i < numdigits; i++) {
      let elm = document.querySelector(`#attemptdigit${i}`);
      elm.innerText = attempt[i];
      if (attempt[i] == password[i]) {
        changeColor(elm, "green");
      }
      if (attempt[i] != password[i] && password.includes(attempt[i])) {
        changeColor(elm, "yellow");
      }
      if (!password.includes(attempt[i])) {
        changeColor(elm, "red");
      }
    }
    //check if win
    checkWin();
    //check if lose
    checkLoss();
  }
}

function genPassword() {
  var digits = [];
  if (repeatednums == 0) {
    while (digits.length < numdigits) {
      let d = rdi(0, 9);
      if (!digits.includes(d)) {
        digits.push(d);
      }
    }
  } else {
    for (let i = 0; i < numdigits; i++) {
      digits.push(rdi(0, 9));
    }
  }

  return digits;
}

function rdi(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

setup();
