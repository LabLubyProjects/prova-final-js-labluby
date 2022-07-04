(function(win) {
  'use strict';

  class Main {
    constructor() {
      this.requestGamesJSONAndInit('../games.json');
    }

    async requestGamesJSONAndInit(url) {
      const response = await fetch(url);
      const gamesObject = await response.json();
      this.gamesObject = gamesObject;
      this.init()
    }

    init() {
      this.cart = new win.Cart();
      this.games = this.gamesObject.types.map((type) => new win.Game(type.type, type.description, type.range, type.price, type.min_and_max_number, type.color));
      this.renderGameButtons(this.games);
      this.setGameHelperButtonsListeners();
      this.setUpCart();
    }

    renderGameButtons(games) {
      if(!games) return;
      const gameButtons = games.map(game => {
        const button = win.DOMHandler.generateGameButton(game);
        button.addEventListener('click', (event) => {
          event.preventDefault();
          this.enableGameButton(button, game, games);
        });
        return button;
      });
      this.enableGameButton(gameButtons[0], games[0], games);
      win.DOMHandler.replaceParentChildren('[data-js="game-buttons"]', gameButtons);
    }
    
    enableGameButton(button, game, games) {
      win.DOMHandler.disableAllGameButtons();
      win.DOMHandler.textReplacer('[data-js="game-name"]', `FOR ${game.type.toUpperCase()}`);
      win.DOMHandler.textReplacer('[data-js="game-description"]', `${game.description}`);
      games.forEach((game) => game.clearGame());
      this.currentSelectedGame = game;
      this.renderGameTable(game);
      button.style.backgroundColor = game.color
      button.style.color = '#FFFFFF';
    }

    renderGameTable(game) {
      this.numberBalls = [];
      for(let i=1; i<=game.range; i++) {
        const numberBall = win.DOMHandler.generateNumberBall(i);
        numberBall.addEventListener('click', (event) => {
          event.preventDefault();
          this.numberBallClickHandler(numberBall, game, i)
        });
        this.numberBalls.push(numberBall);
      }
      win.DOMHandler.replaceParentChildren('[data-js="numbers"]', this.numberBalls);
    }

    numberBallClickHandler(numberBall, game, number, isFromCompleteGame) {
      // const isSelected = numberBall.classList.toggle('selected-number');
      // if(isSelected && game.isComplete())
      // if(isSelected) game.selectNumber(number);
      // else game.unselectNumber(number);
      if(numberBall.classList.contains('selected-number')) {
        game.unselectNumber(number);
        numberBall.classList.remove('selected-number');
      }
      else if(!isFromCompleteGame && game.isComplete()) return;
      else {
        game.selectNumber(number);
        numberBall.classList.add('selected-number');
      }
    }

    setGameHelperButtonsListeners() {
      const completeGameButtonHelper =  win.DOMHandler.getElementByQuerySelector('[data-js="complete-game-button"]');
      const clearGameButtonHelper =  win.DOMHandler.getElementByQuerySelector('[data-js="clear-game-button"]');

      completeGameButtonHelper.addEventListener('click', (event) => {
        event.preventDefault();
        this.completeCurrentGame();
      });

      clearGameButtonHelper.addEventListener('click', (event) => {
        event.preventDefault();
        this.clearCurrentGame();
      });
    }

    completeCurrentGame() {
      if(this.currentSelectedGame.isComplete()) return;
      this.currentSelectedGame.completeGame();
      const arrayOfSelectedNumbers = this.currentSelectedGame.getNumbersAsString();
      this.numberBalls.forEach((numberBall, index) => {
        if(arrayOfSelectedNumbers.includes(numberBall.textContent)) this.numberBallClickHandler(numberBall, this.currentSelectedGame, index+1, true);
      });
    }

    clearCurrentGame() {
      this.currentSelectedGame.clearGame();
      this.numberBalls.forEach((numberBall) => numberBall.classList.remove('selected-number'));
    }

    setUpCart() {
      win.DOMHandler.textReplacer('[data-js="cart-total"]', `${this.cart.calculateTotal()}`);
      const addToCartButton = win.DOMHandler.getElementByQuerySelector('[data-js="add-cart"]');

      addToCartButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.addToCart();
      });
    }

    addToCart() {
      if(!this.cart.canAddToCart(this.currentSelectedGame)) return;
      console.log("entrei")
      this.cart.addToCart(this.currentSelectedGame);
      const cartItemDiv = win.DOMHandler.generateCartItem(this.currentSelectedGame, this.cart);
      win.DOMHandler.insertIntoParent('[data-js="cart-items"]', cartItemDiv);
      win.DOMHandler.textReplacer('[data-js="cart-total"]', `${this.cart.calculateTotal()}`);
      this.clearCurrentGame();
    }
  }

  new Main();
})(window, document);