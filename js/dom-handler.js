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

    static generateCartItem(item, cart) {
      if(!item) return;
      const itemDiv = doc.createElement('div');
      const deleteImg = doc.createElement('img');
      const verticalBar = doc.createElement('div');
      const rightSideWrapper = doc.createElement('div');
      const numbersParagraph = doc.createElement('p');
      const itemName = doc.createElement('span');
      const itemPrice = doc.createElement('span');

      itemDiv.className = 'cart-item';
      verticalBar.className = 'vertical-bar';
      deleteImg.className = 'trash-image';
      numbersParagraph.classList.add('bold', 'italic', 'font868686', 'font08rem');
      itemName.classList.add('bold', 'italic', 'font09rem');
      itemPrice.classList.add('regular', 'normal', 'font868686', 'font09rem')
      itemName.style.color = item.color;
      verticalBar.style.backgroundColor = item.color;
      itemName.textContent = item.type;
      itemPrice.textContent = ' ' + item.getPriceInBRL();
      numbersParagraph.textContent = item.getNumbersAsString();
      deleteImg.src = '../icons/trash_gray.png';

      deleteImg.addEventListener('click', (event) => {
        event.preventDefault();
        cart.removeFromCart(item);
        itemDiv.remove();
        DOMHandler.textReplacer('[data-js="cart-total"]', `${cart.calculateTotal()}`);
      });

      rightSideWrapper.appendChild(numbersParagraph);
      rightSideWrapper.appendChild(itemName);
      rightSideWrapper.appendChild(itemPrice);
      itemDiv.appendChild(deleteImg);
      itemDiv.appendChild(verticalBar);
      itemDiv.appendChild(rightSideWrapper);
      return itemDiv;
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
      if(!parentQuerySelector) return;
      const parent = doc.querySelector(parentQuerySelector);
      parent.replaceChildren(...elements)
    }

    static insertIntoParent(parentQuerySelector, element) {
      if(!parentQuerySelector && element) return;
      const parent = doc.querySelector(parentQuerySelector);
      parent.appendChild(element);
    }
  }

  win.DOMHandler = DOMHandler;
})(window, document);