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
    const messages = this.getAll();
    const randomIndex = getRandomArrayIndex(messages.length);
    return messages[randomIndex];
  }

  getAll() {}
}

class Jokes extends MessagesFactory {
  getAll() {
    return jokes;
  }
}

class Cars extends MessagesFactory {
  getAll() {
    return cars;
  }
}

class Facts extends MessagesFactory {
  getAll() {
    return facts;
  }
}

export function getRandomJoke() {
  const jokes = new Jokes();
  return `Joke: ${jokes.getRandom()}`;
}

export function getRandomFact() {
  const facts = new Facts();
  return `Fact: ${facts.getRandom()}`;
}

export function getSalutPhase(members) {
  const cars = new Cars();
  let phrase = `${salutPhrase} There are members of our room:`;
  members.map((member, index) => {
    phrase += ` ${member.name} on ${cars.getRandom()}${
      index != members.length - 1 ? ',' : ''
    }`;
  });
  return phrase;
}

export function getStartPhrase() {
  return startPhrase;
}

export function getStatusPhrase(room) {
  let phrase = 'Current status:';
  const rankList = room.getRankList();

  for (let i = 0; i < rankList.length; i++) {
    const member = rankList[i];
    phrase += ` ${member.name} on ${i + 1} place with progress: ${
      member.progress
    }%;`;
  }

  return phrase;
}

export function getFinishingPhrase(username) {
  return `${username} is nearly finishing!`;
}

export function getCloseToFinishPhrase(username) {
  return `${username} is close to finish!`;
}

export function getGoodbyePhrase(room) {
  let phrase = `${goodbyePhrase} There are the list of winners:`;
  const rankList = room.getRankList();

  for (let i = 0; i < (rankList.length < 3 ? rankList.length : 3); i++) {
    const member = rankList[i];
    phrase += ` ${member.name} on ${i + 1} place${
      member.progress == 100 ? ` with time: ${member.time} s.` : ''
    };`;
  }

  return phrase;
}
