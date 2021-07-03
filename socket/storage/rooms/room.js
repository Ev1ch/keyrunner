import { Member } from './member';
import * as config from '../../config';

export class Room {
  constructor(roomname) {
    this.name = roomname;
    this.status = 0;
    this.startTime = 0;
    this.members = [];
  }

  getStartTime() {
    return this.startTime;
  }

  setStartTime(startTime) {
    this.startTime = startTime;
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

  setMemberStatus(username, status) {
    const member = this.members.find((member) => member.getName() == username);
    member.setStatus(status);
  }

  setMemberProgress(username, progress) {
    const member = this.members.find((member) => member.getName() == username);
    member.setProgress(progress);
  }

  setMemberTime(username, time) {
    const member = this.members.find((member) => member.getName() == username);
    member.setEndTime(time);
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
      (member) => member.getName() == username,
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
      (member) => member.getProgress() != 100,
    );
    return notFinishedMember ? false : true;
  }

  getRankList() {
    let members = [...this.members];

    members.sort((a, b) => {
      if (a.getProgress() == b.getProgress()) {
        return a.getEndTime() - b.getEndTime();
      } else {
        return b.getProgress() - a.getProgress();
      }
    });

    members = members.map((member) => ({
      name: member.getName(),
      time: Math.round((member.getEndTime() - this.startTime) / 1000),
      progress: member.getProgress(),
    }));

    return members;
  }

  reset() {
    this.members.forEach((member) => {
      member.setStatus(0);
      member.setProgress(0);
      member.resetEndTime();
    });
    this.status = 0;
    this.startTime = 0;
  }
}
