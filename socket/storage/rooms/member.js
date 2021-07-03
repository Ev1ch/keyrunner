export class Member {
  constructor(username) {
    this.name = username;
    this.progress = 0;
    this.status = 0;
    this.endTime = Infinity;
  }

  getName() {
    return this.name;
  }

  setProgress(progress) {
    this.progress = progress;
  }

  getProgress() {
    return this.progress;
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  setEndTime(endTime) {
    this.endTime = endTime;
  }

  resetEndTime(endTime) {
    this.endTime = Infinity;
  }

  getEndTime() {
    return this.endTime;
  }
}
