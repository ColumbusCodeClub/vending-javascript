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
    getDisplay = () => {
        let currentDisplay = this.displayText;
        if (currentDisplay.length === 0) {
            currentDisplay = this.balance === 0.0 ? "INSERT COINS" : ("balance: " + this.balance.toFixed(2));
        }
        this.displayText = '';
        return currentDisplay;
    }
    insertCoin = (coinName) => {
        const identifiedCoin = this.coinLookup[coinName];

        if (!identifiedCoin) {
            this.rejectedCoins.push(coinName);
        } else {
            this.balance += identifiedCoin.value;
            this.coinLookup[coinName].count += 1;
        }
    }
    getChange = () => {
        return this.rejectedCoins;
    }

    makeChange = (remainingBalance) => {
        const initialRejectedCoins = [...this.rejectedCoins];
        remainingBalance = remainingBalance * 100
        while (remainingBalance > 0) {
            for (let i = 0; i < this.coinReverseLookupArray.length; i++) {
                const currentCoin = this.coinReverseLookupArray[i];
                if (currentCoin.coinValue <= remainingBalance) {
                    this.rejectedCoins.push(currentCoin.coinName);
                    if (currentCoin.coin.count - 1 < 1) {
                        this.resetState(initialRejectedCoins);
                        return false;
                    }
                    currentCoin.coin.count -= 1;
                    remainingBalance -= currentCoin.coinValue;
                    break;
                }
            }
        }
        return true;
    }

    resetState = (initialRejectedCoins) => {
        this.rejectedCoins = initialRejectedCoins;
    }

    selectProduct = (productNumber) => {
        let responseMessage = ""
        let selectedProduct = this.productLookUp[parseInt(productNumber)];
        responseMessage = this.checkForEnoughMoney(selectedProduct, responseMessage);
        responseMessage = this.checkForSoldOut(selectedProduct, responseMessage);        
        responseMessage = this.checkForExactChange(this.calculatePurchase(selectedProduct), responseMessage);
        responseMessage = this.successfulPurchase(responseMessage, selectedProduct);
        this.displayText = responseMessage
    }

    returnCoins = () => {
        let remainingBalance = this.balance;
        this.makeChange(remainingBalance);
        this.balance = 0;
    }

    calculatePurchase(selectedProduct) {
        let remainingBalance = this.calcRemainingBalance(selectedProduct);
        let makeChangeRes = this.makeChange(remainingBalance);
        return makeChangeRes;
    }

    checkForEnoughMoney(selectedProduct, responseMessage) {
        if (this.notEnoughMoney(selectedProduct)) {
            responseMessage = "PRICE $" + selectedProduct.price.toFixed(2);
        }
        return responseMessage;
    }

    checkForSoldOut(selectedProduct, responseMessage) {
        if (this.enoughMoney(selectedProduct) && isSoldOut(selectedProduct)) {
            responseMessage = "SOLD OUT";
        }
        return responseMessage;
    }

    checkForExactChange(makeChangeRes, responseMessage) {
        if (exactChangeRequired(makeChangeRes)) {
            responseMessage = "EXACT CHANGE ONLY";
        }
        return responseMessage;
    }

    successfulPurchase(responseMessage, selectedProduct) {
        if (responseMessage === "") {
            selectedProduct.inventory -= 1;
            this.balance = 0;
            responseMessage = "THANK YOU";

        }
        return responseMessage;
    }



    calcRemainingBalance(selectedProduct) {
        return (((this.balance * 100) - (selectedProduct.price * 100)) / 100);
    }

    notEnoughMoney(selectedProduct) {
        return this.balance < selectedProduct.price;
    }

    enoughMoney(selectedProduct) {
        return this.balance > selectedProduct.price;
    }
}

const exactChangeRequired = (makeChangeRes) => !makeChangeRes
const isSoldOut = (selectedProduct) => selectedProduct.inventory === 0;

module.exports = Vending;