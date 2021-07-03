import { getRandomArrayIndex } from './array';
import {
  jokes,
  cars,
  facts,
  startPhrase,
  goodbyePhrase,
  salutPhrase,
} from '../../data';

class MessagesFactory {
  getRandom() {
    const messages = getAll();
    const randomIndex = getRandomArrayIndex(messages.length);
    return messages[randomIndex];
  }

  getAll() {}
}

export class Jokes extends MessagesFactory {
  getAll() {
    return jokes;
  }
}

export class Cars extends MessagesFactory {
  getAll() {
    return cars;
  }
}

export class Facts extends MessagesFactory {
  getAll() {
    return facts;
  }
}

export function getSalutPhase(members) {
  const phrase = `${salutPhrase} There are members of our room: ${members.map(
    (member, index) =>
      `${member.name} on ${Cars.getRandom()}${
        index == members.length - 1 ? '' : ','
      }`,
  )}`;
  return phrase;
}

export function getStartPhrase() {
  return startPhrase;
}

export function getGoodbyePhrase(rankList) {
  return goodbyePhrase;
}
