
const prompt = require("prompt-sync")();

const rows = 3;
const cols = 3;

const symbols_count = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const symbol_values = {
    A: 5,
    B: 4,
    C: 3,
    D: 2

}

function deposit(){
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        } else{
            return numberDepositAmount;
        }
    }
}

function getNumberOfLines(){
    while(true){
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        } else{
            return numberOfLines;
        }
    }
} 

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
            console.log("Invalid bet, try again.");
        } else{
            return numberBet;
        }
    }
}

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(symbols_count)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for(let i = 0; i< cols; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for(let j = 0; j < rows; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

function transpose(reels){
    const Trows = [];

    for(let i = 0; i < rows; i++){
        Trows.push([]);
        for(let j = 0; j < cols; j++){
            Trows[i].push(reels[j][i]);
        }
    }

    return Trows;
}

function printSlot(Trows){
    for(const row of Trows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol
            if( i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString);
    }
}

function getWinnings(Trows, bet, lines){
    let winnings = 0;

    for(let row = 0; row < lines; row++){
        const symbols = Trows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * symbol_values[symbols[0]];
        }

    }
    return winnings;
}

function game(){
    let balance = deposit();

    while(true){
        console.log("You have a balance of $" + balance);
        const lines = getNumberOfLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines;
        const reels = spin();
        const Trows = transpose(reels);
        printSlot(Trows);
        const winnings = getWinnings(Trows, bet, lines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0){
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt("Do you want to play again (y/n) ?");
        if (playAgain != "y") break;
   }
}

game();
