export default function toLocalISOString(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');

  // const year = date.getFullYear();
  // const month = pad(date.getMonth() + 1);
  // const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  const ms = String(date.getMilliseconds()).padStart(3, '0');

  return `${hour}:${minute}:${second}.${ms}`;
}