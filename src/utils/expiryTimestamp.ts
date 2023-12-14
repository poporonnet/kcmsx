export const expiryTimestamp = (expirySeconds: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + expirySeconds);
  return time;
};
