(function(win, doc) {
  'use strict';

  class DOMHandler {

    static textReplacer(querySelector, newText) {
      if(!(querySelector && newText)) return;
      doc.querySelector(querySelector).textContent = newText;
    }

    static getElementByQuerySelector(querySelector) {
      if(!querySelector) return;
      return doc.querySelector(querySelector);
    }

    static generateGameButton(game) {
      if(!game) return;
      this.games = { ...this.games, ...game };
      const gameButton = doc.createElement('button');
      gameButton.setAttribute('data-js', "game-button");
      gameButton.textContent = game.type;
      gameButton.classList.add('game-button');
      gameButton.style.color = game.color;
      gameButton.style.borderColor = game.color;
      return gameButton;
    }

    static disableAllGameButtons() {
      const gameButtons = document.querySelectorAll('[data-js="game-button"]');
      Array.prototype.forEach.call(gameButtons, (gameButton) => {
        if(gameButton.style.backgroundColor !== '') {
          gameButton.style.backgroundColor = ''
          gameButton.style.color = gameButton.style.borderColor;
        }
      });
    }

    static generateNumberBall(number) {
      if(!number || typeof number !== 'number') return;
      const numberBall = doc.createElement('button');
      numberBall.textContent = number < 10 ? `0${number}` : String(number);
      numberBall.classList.add('number');
      return numberBall;
    };

    static replaceParentChildren(parentQuerySelector, elements) {
      if(!(parentQuerySelector && elements) || elements.length === 0) return;
      const parent = doc.querySelector(parentQuerySelector);
      parent.replaceChildren(...elements)
    }
  }

  win.DOMHandler = DOMHandler;
})(window, document);