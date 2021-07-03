import { showBlock, hideBlock } from '../../helpers/dom/dom.mjs';

const messageBlock = document.getElementById('commentator__message');
const messageInput = document.querySelector('#commentator__message > span');

class Commentator {
  showMessage(message) {
    messageInput.innerText = message;
  }

  showJoke(joke) {
    this.showMessage(joke);
    messageBlock.className = 'joke';
  }

  showFact(fact) {
    this.showMessage(fact);
    messageBlock.className = 'fact';
  }

  showCloseToFinish(message) {
    this.showMessage(message);
    messageBlock.className = 'closeToFinish';
  }

  showFinishing(message) {
    this.showMessage(message);
    messageBlock.className = 'finishing';
  }

  showStatus(status) {
    this.showMessage(status);
    messageBlock.className = 'status';
  }
}

export class CommentatorFacade {
  constructor() {
    this.commentator = new Commentator();
  }

  showMessage(message, type) {
    hideBlock(messageBlock);
    switch (type) {
      case 'joke':
        this.commentator.showJoke(message);
        break;
      case 'fact':
        this.commentator.showFact(message);
        break;
      case 'finishing':
        this.commentator.showFinishing(message);
        break;
      case 'closeToFinish':
        this.commentator.showCloseToFinish(message);
        break;
      default:
        this.commentator.showStatus(message);
        break;
    }
    showBlock(messageBlock);
  }
}
