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
      while(!this.isComplete()) {
        const randomNumber = Math.ceil(Math.random() * this.range);
        this.selectNumber(randomNumber);
      }
    }

    equals(otherGame) {
      if(this.type !== otherGame.type) return false;
      for(let i=0; i<this.numbers; i++)
        if(this.numbers[i] !== otherGame.numbers[i]) return false;
      return true;
    }

    clearGame() {
      this.numbers = [];
    }

    getNumbersAsString() {
      this.numbers.sort((a, b) => a-b);
      const numbers = this.numbers.map((number) => {
        if(number < 10) return `0${number}`;
        return `${number}`;
      });
      return numbers.join(", ");
    }

    getPriceInBRL() {
      let priceInBRL = `R$ ${this.price}`.replace('.', ',');
      if(priceInBRL.indexOf(',') === -1)
        priceInBRL += ',00'; 
      else if(priceInBRL.split(',')[1].length === 1)
        priceInBRL += '0';
      return priceInBRL;
    }
  }

  win.Game = Game;
})(window);