(function(win) {
  'use strict';

  class Game {
    constructor(type, description, range, price, minMaxNumber, color) {
      this.type = type;
      this.description = description;
      this.range = Number(range);
      this.price = Number(price);
      this.minMaxNumber = Number(minMaxNumber);
      this.color = color;
      this.numbers = [];
    }

    selectNumber(number) {
      if(!number) return;
      if(this.isComplete()) return;
      if(number > this.range) return;
      if(this.numbers.includes(number)) return;
      this.numbers.push(number);
    }

    isComplete() {
      return this.numbers.length === this.minMaxNumber;
    }

    unselectNumber(number) {
      if(!number) return;
      if(typeof number !== 'number') number = Number(number);
      const indexOfNumber = this.numbers.indexOf(number);
      this.numbers.splice(indexOfNumber, 1);
    }

    completeGame() {
      while(this.numbers.length < this.minMaxNumber) {
        const randomNumber = Math.ceil(Math.random() * this.range);
        this.selectNumber(randomNumber);
      }
      console.log(this.numbers)
    }

    clearGame() {
      this.numbers = [];
      console.log(this.numbers)
    }

    getNumbersAsStringArray() {
      this.numbers.sort((a, b) => a-b);
      const numbers = this.numbers.map((number) => {
        if(number < 10) return `0${number}`;
        return `${number}`;
      });
      return numbers;
    }

    calculateTotal() {
      const total = this.numbers.length * this.price;
      const totalInBRL = `R$${total}`.replace('.', ',');
      return totalInBRL;
    }
  }

  win.Game = Game;
})(window);