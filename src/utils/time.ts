export const expiryTimestamp = (expirySeconds: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + expirySeconds);
  return time;
};

export const parseSeconds = (seconds: number): string => {
  const time = {
    minutes: Math.floor(seconds / 60),
    seconds: seconds % 60,
  };

  const justify = (value: number) => value.toString().padStart(2, "0");

  return `${justify(time.minutes)}:${justify(time.seconds)}`;
};
