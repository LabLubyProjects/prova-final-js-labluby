(function(win) {
  'use strict';

  class Cart {
    constructor(minValue) {
      this.minValue = Number(minValue);
      this.bets = [];
    }
    
    addToCart(game) {
      this.bets.push(game);
    }

    removeFromCart(game) {
      for(let i=0; i<this.bets.length; i++) {
        if(game.equals(this.bets[i])) {
          this.bets.splice(i,1);
          break;
        }
      }
    }

    getTotalAsNumber() {
      return this.bets.reduce((acc, curr) => acc+curr.price, 0);
    }

    save() {
      const totalAsNumber = this.getTotalAsNumber();
      if(totalAsNumber < this.minValue) return false;
      this.bets = [];
      return true;
    }

    calculateTotal() {
      if(this.bets.length === 0) return 'R$ 0,00';
      const total = this.getTotalAsNumber();
      return this.formatAsBRL(total);
    }

    formatAsBRL(number) {
      let formatedNumber = `R$ ${number}`.replace('.', ',');
      if(formatedNumber.indexOf(',') === -1)
        formatedNumber += ',00'; 
      else if(formatedNumber.split(',')[1].length === 1)
        formatedNumber += '0';
      return formatedNumber;
    }
  }

  win.Cart = Cart;
})(window);