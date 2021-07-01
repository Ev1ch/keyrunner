export class Member {
  constructor(username) {
    this.name = username;
    this.progress = 0;
    this.status = 0;
    this.time = 0;
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

  setTime(time) {
    this.time = time;
  }

  getTime() {
    return this.time;
  }
}
