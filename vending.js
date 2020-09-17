class Vending {

    constructor() {
        this.balance = 0.0;
        this.coinLookup = {
            "nickle": {
                value: .05,
                count: 10 //1 - Last Test Scenario  
            },
            "dime": {
                value: .1,
                count: 10  //0 - Last Test Scenario    
            },
            "quarter": {
                value: .25,
                count: 10 //10 - Last Test Scenario  
            }
        };

        this.coinReverseLookupArray = [
            { 
                coinValue: 25,
                coinName: "quarter",
                coin: this.coinLookup.quarter
            },
            { 
                coinValue: 10,
                coinName: "dime",
                coin: this.coinLookup.dime
            },
            {
                coinValue: 5,
                coinName: "nickle",
                coin: this.coinLookup.nickle
            }
        ]

        this.productLookUp = {
            "1": {
                name: "cola",
                price: 1.00,
                inventory: 5
            },
            "2": {
                name: "chips",
                price: .5,
                inventory: 5
            },
            "3": {
                name: "candy",
                price: .65,
                inventory: 5
            },
            "4": {
                name: "chocolate",
                price: .20,
                inventory: 0
            }
        };
        this.rejectedCoins = [];
        this.displayText = '';
    }
    getDefaultDisplay = () => this.balance === 0.0 ? "INSERT COINS" : ("balance: " + this.balance.toFixed(2));
    getDisplay = () => {
        let currentDisplay = this.displayText;
        this.displayText = '';
        const currentDisplayIsEmpty = currentDisplay.length === 0;
        return currentDisplayIsEmpty ? this.getDefaultDisplay() : currentDisplay;
    }
    insertCoin = (coinName) => {
        const coinIdentified = this.coinLookup[coinName];
        if (!coinIdentified) {
            this.rejectedCoins.push(coinName);
        } else {
            this.balance += coinIdentified.value;
            this.coinLookup[coinName].count += 1;
        }
    }
    getChange = () => {
        return this.rejectedCoins;
    }
    processCoinRejection = (remainingBalance, initialRejectedCoins) => {
        for (let i = 0; i < this.coinReverseLookupArray.length; i++) {
            const currentCoin = this.coinReverseLookupArray[i];
            if (currentCoin.coinValue <= remainingBalance) {
                this.rejectedCoins.push(currentCoin.coinName);
                //for EXACT CHANGE ONLY scenario - Last TestCase
                if (currentCoin.coin.count - 1 < 1) {
                    this.resetState(initialRejectedCoins);
                    return false;
                }
                currentCoin.coin.count -= 1;
                remainingBalance -= currentCoin.coinValue;
                break;
            }
        }
        return remainingBalance;
    }
    makeChange = (remainingBalance) => {
        const initialRejectedCoins = [...this.rejectedCoins];
        remainingBalance = remainingBalance * 100;
        const testObj = { initialRejectedCoins, remainingBalance }
        while (remainingBalance > 0) {
            this.processCoinRejection(remainingBalance, initialRejectedCoins)
        }
        return true;
    }
    resetState = (initialRejectedCoins) => {
        this.rejectedCoins = initialRejectedCoins;
    }
    selectProduct = (productNumber) => {
        let selectedProduct = this.productLookUp[parseInt(productNumber)];
        if (this.balance < selectedProduct.price) {
            this.displayText = "PRICE $" + selectedProduct.price.toFixed(2);
        }
        else {
            if (this.balance > selectedProduct.price) {
                if (selectedProduct.inventory === 0) {
                    this.displayText = "SOLD OUT";
                    return;
                }
                let remainingBalance = (((this.balance * 100) - (selectedProduct.price * 100)) / 100);
                let makeChangeRes = this.makeChange(remainingBalance);
                if (!makeChangeRes) {
                    this.displayText = "EXACT CHANGE ONLY";
                    return;
                }
            }
            selectedProduct.inventory -= 1;
            this.balance = 0;
            this.displayText = "THANK YOU";
        }
    }
    returnCoins = () => {
        let remainingBalance = this.balance;
        this.makeChange(remainingBalance);
        this.balance = 0;
    }
}

module.exports = Vending;