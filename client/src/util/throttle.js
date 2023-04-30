export const throttle = (f, timeout) => {
  let shouldFire = false;
  let lastArgs;
  let timer = false;

  return (...args) => {
    lastArgs = args;
    const fire = () => {
      f(...lastArgs);
      timer = true;
      setTimeout(() => {
        timer = false;
        if (shouldFire) {
          fire();
          shouldFire = false;
        }
      }, timeout)
    }

    if (timer) {
      shouldFire = true;
    } else {
      fire();
    }
  }
}
