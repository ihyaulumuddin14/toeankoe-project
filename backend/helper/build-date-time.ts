export function buildDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}