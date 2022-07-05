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
      this.cart = new win.Cart(this.gamesObject['min-cart-value']);
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

    numberBallClickHandler(numberBall, game, number, isFromCompleteGame=false) {
      if(game.isComplete() && isFromCompleteGame) {
        numberBall.classList.add('selected-number');
        game.selectNumber(number);
        return;
      }
      else if(game.isComplete() && !isFromCompleteGame && numberBall.classList.contains('selected-number')) {
        numberBall.classList.remove('selected-number');
        game.unselectNumber(number);
        return;
      }
      else if(game.isComplete() && !isFromCompleteGame && !numberBall.classList.contains('selected-number')) {
        alert(`Você já selecionou todos os ${this.currentSelectedGame.minMaxNumber} números`);
        return;
      }
      
      const isSelected = numberBall.classList.toggle('selected-number');
      if(isSelected)
        game.selectNumber(number);
      else
        game.unselectNumber(number);
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
      const saveCart = win.DOMHandler.getElementByQuerySelector('[data-js="save"]');
      const cartItemsDiv =  win.DOMHandler.getElementByQuerySelector('[data-js="cart-items"]');

      win.DOMHandler.setUpMutationObserver(cartItemsDiv, (mutationList, observer) => {
        const emptyCartParagraph = win.DOMHandler.getElementByQuerySelector('[data-js="empty-cart-message"]');
        for(const mutation of mutationList) {
          if(mutation.type === 'childList') {
            const elementHasDivChilds = DOMHandler.checkForDivChilds(cartItemsDiv);
            if(elementHasDivChilds && !emptyCartParagraph.classList.contains('hidden'))
              emptyCartParagraph.classList.add('hidden');
            else if(!elementHasDivChilds && emptyCartParagraph.classList.contains('hidden'))
              emptyCartParagraph.classList.remove('hidden');
          }
        }
      }, { childList: true });

      addToCartButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.addToCart();
      });

      saveCart.addEventListener('click', (event) => {
        this.saveCart();
      });
    }

    addToCart() {
      if(!this.currentSelectedGame.isComplete()) {
        const quantityOfMissingNumbers = this.currentSelectedGame.quantityOfMissingNumbers();
        const pluralizeIfGreaterThanOne = quantityOfMissingNumbers > 1 ? ['faltam', 'números'] : ['falta', 'número'];
        alert(`Ainda ${pluralizeIfGreaterThanOne[0]} ${quantityOfMissingNumbers} ${pluralizeIfGreaterThanOne[1]} para selecionar`); 
        return;
      }
      this.cart.addToCart(this.currentSelectedGame);
      const cartItemDiv = win.DOMHandler.generateCartItem(this.currentSelectedGame, this.cart);
      win.DOMHandler.insertIntoParent('[data-js="cart-items"]', cartItemDiv);
      win.DOMHandler.textReplacer('[data-js="cart-total"]', `${this.cart.calculateTotal()}`);
      this.clearCurrentGame();
    }

    saveCart() {
      if(this.cart.save()) {
        win.DOMHandler.replaceParentChildren('[data-js="cart-items"');
        win.DOMHandler.textReplacer('[data-js="cart-total"]', `${this.cart.calculateTotal()}`);
        alert('Carrinho salvo!');
      }
      else 
        alert(`O valor mínimo do carrinho deve ser ${this.cart.formatAsBRL(this.cart.minValue)}`);
    }
  }

  new Main();
})(window, document);