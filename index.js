const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOl_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter the deposit amount : ");
    const depositAmountInNumber = parseFloat(depositAmount);

    if (isNaN(depositAmountInNumber) || depositAmountInNumber <= 0) {
      console.log("Invalid deposit amount, please try again!");
    } else {
      return depositAmountInNumber;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on: ");
    const linesInNumber = parseFloat(lines);

    if (isNaN(linesInNumber) || linesInNumber <= 0 || linesInNumber > 3) {
      console.log("Invalid number of lines, please try again!");
    } else {
      return linesInNumber;
    }
  }
};

const getBet = (deposit, lines) => {
  while (true) {
    const betInput = prompt("Enter the bet per line: ");
    const bet = parseFloat(betInput);

    if (isNaN(bet) || bet <= 0 || bet > deposit / lines) {
      console.log("Invalid bet, please try again!");
    } else {
      return bet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const randomSymbol = reelSymbols[randomIndex];
      reels[i].push(randomSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

// Did'nt understood this one
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += "|";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (bet, lines, rows) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let status = true;
    for (const symbol of symbols) {
      if (symbols[row] != symbol[0]) {
        status = false;
        break;
      }
    }
    if (status) {
      winnings += bet * SYMBOl_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();
  while (true) {
    console.log("Your current balance : $" + balance);
    const numberOfLines = getNumberOfLines();
    const betAmount = getBet(balance, numberOfLines);
    balance -= betAmount * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(betAmount, numberOfLines, rows);
    console.log("You won $" + winnings);
    balance += winnings;

    if (balance <= 0) {
      console.log("you ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)?");
    if (playAgain != "y") break;
  }
};

game();
