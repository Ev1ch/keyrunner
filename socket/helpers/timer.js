export function getTimer(seconds, callback) {
  return {
    start() {
      return new Promise((resolve) => {
        let timeLeft = seconds;

        const timer = setInterval(() => {
          callback(timeLeft--, () => {
            clearInterval(timer);
            resolve();
          });
        }, 1000);

        setTimeout(() => {
          clearInterval(timer);
          resolve();
        }, (seconds + 1) * 1000);
      });
    },
  };
}
