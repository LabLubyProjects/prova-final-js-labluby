(function(win) {
  'use strict';

  class Cart {
    constructor() {
      this.bets = [];
    }

    canAddToCart(game) {
      if(!game.isComplete()) return false;
      console.log(this.bets)
      for(let i=0; i<this.bets.length; i++)
      {
        if(game.equals(this.bets[i])) return false;
      }
      return true;
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

    calculateTotal() {
      if(this.bets.length === 0) return 'R$ 0,00';
      const total = this.bets.reduce((acc, curr) => acc+curr.price, 0);
      let totalInBRL = `R$ ${total}`.replace('.', ',');
      if(totalInBRL.indexOf(',') === -1)
        totalInBRL += ',00'; 
      else if(totalInBRL.split(',')[1].length === 1)
        totalInBRL += '0';
      return totalInBRL;
    }
  }

  win.Cart = Cart;
})(window);