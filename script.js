"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jaydn Coppolino",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-02-25T17:01:17.194Z",
    "2023-02-27T23:36:17.929Z",
    "2023-02-28T10:51:36.790Z",
  ],
  currency: "AUD",
  locale: "en-AU", // de-DE
};

const account2 = {
  owner: "Mengxuan Liang",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2023-01-10T14:43:26.374Z",
    "2023-02-25T18:49:59.371Z",
    "2023-02-28T12:01:20.894Z",
  ],
  currency: "CNY",
  locale: "zh-CN",
};

const account3 = {
  owner: "Lulu Stink",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Blue Muff",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatMovementsDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "today";
  if (daysPassed === 1) return "yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  return new Intl.DateTimeFormat(locale).format(date);
};
//format currency using Intl API
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((element, i) => {
    const type = element > 0 ? "deposit" : "withdrawal";
    //get each date out of the movementsDates array using the same index of each movements
    const dates = new Date(acc.movementsDates[i]);

    const displayDates = formatMovementsDates(dates, acc.locale);
    const formattedEl = formatCurrency(element, acc.locale, acc.currency);

    const html = ` 
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    }${type} </div>
      <div class="movements__date"> ${displayDates}</div>
      <div class="movements__value">${formattedEl}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//calculate balance
const displayCalcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//calculate summery
const displayCalcSummery = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  const spense = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(spense),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//create user name
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

//update UI
const updateUI = function (acc) {
  displayMovements(acc);
  displayCalcBalance(acc);
  displayCalcSummery(acc);
};

//timer
const startLogInTimer = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//intl

//event handler;
//login function

let currentAcc, timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAcc = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  //console.log(currentAcc);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(" ")[0]
    }`;
    //show the content
    containerApp.style.opacity = 1;
    //create dates and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    };
    //const locale = navigator.language;
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = //`${day}/${month}/${year}, ${hour}:${minute}`;
      new Intl.DateTimeFormat(currentAcc.locale, options).format(now);

    //check if timer exist
    if (timer) clearInterval(timer);
    timer = startLogInTimer();

    //clear input feild
    inputLoginUsername.value = inputLoginPin.value = "";
    //get rid of the cursor
    inputLoginPin.blur();

    updateUI(currentAcc);
  }
});

//transfer function
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receivingAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    currentAcc.balance >= amount &&
    receivingAcc &&
    receivingAcc.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    receivingAcc.movements.push(amount);
    //add curent date
    currentAcc.movementsDates.push(new Date().toISOString());
    receivingAcc.movementsDates.push(new Date().toISOString());
  }
  //clear input fields
  inputTransferTo.value = inputTransferAmount.value = "";

  updateUI(currentAcc);

  //reset timer
  clearInterval(timer);
  timer = startLogInTimer();
});

//loan function
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some((mov) => mov >= amount * 0.1)) {
    //set a timer
    setTimeout(function () {
      currentAcc.movements.push(amount);
      //add current date
      currentAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAcc);
      //reset timer
      clearInterval(timer);
      timer = startLogInTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

//close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    //find the index of current account in accounts array
    const index = accounts.findIndex(
      (acc) => acc.username === currentAcc.username
    );
    accounts.splice(index);
  }
  //clear input fields
  inputCloseUsername.value = inputClosePin.value = "";
  //hide UI
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Log in to get started";
});

//sort function
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAcc, !sorted);
  sorted = !sorted;
});
