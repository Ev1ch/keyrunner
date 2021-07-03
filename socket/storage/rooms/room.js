import { Member } from './member';
import * as config from '../../config';

export class Room {
  constructor(roomname) {
    this.name = roomname;
    this.status = 0;
    this.members = [];
  }

  getName() {
    return this.name;
  }

  setStatus(status) {
    this.status = status;
  }

  getMembers() {
    return this.members;
  }

  getMember(username) {
    const foundMember = this.members.find(
      (member) => member.getName() == username,
    );
    return foundMember;
  }

  join(username) {
    this.members.push(new Member(username));
  }

  left(username) {
    const memberIndex = this.members.findIndex(
      (member) => member.name == username,
    );
    this.members.splice(memberIndex, 1);
  }

  isReady() {
    return (
      (this.members.find((member) => member.getStatus() == 0) ? false : true) &&
      this.members.length > 1
    );
  }

  isAvailable() {
    return (
      this.members.length < config.MAXIMUM_USERS_FOR_ONE_ROOM &&
      this.status == 0
    );
  }

  hasFinished() {
    const notFinishedMember = this.members.find(
      (member) => member.progress != 100,
    );
    return notFinishedMember ? false : true;
  }

  getRankList() {
    const members = JSON.parse(JSON.stringify(this.members));

    members.sort((a, b) => {
      if (a.progress == b.progress) {
        return a.time - b.time;
      } else {
        return b.progress - a.progress;
      }
    });

    return members;
  }

  reset() {
    this.members.forEach((member) => {
      member.setStatus(0);
      member.setProgress(0);
    });
    this.status = 0;
  }
}
