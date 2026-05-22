import type { GameDateTime, MessageColor } from '../types/csharp';

export function convertStyleColor(color: MessageColor): string {
  const { r, g, b, a } = color;
  const styleColor = {
    r: 255 * r,
    g: 255 * g,
    b: 255 * b,
    a: a,
  };

  return `rgb(${styleColor.r} ${styleColor.g} ${styleColor.b} / ${styleColor.a})`;
}

export function convertGameTimestamp(timestamp: GameDateTime): string {
  const { year, month, day, hour, minute, second } = timestamp;

  const padded = {
    month: String(month).padStart(2, '0'),
    day: String(day).padStart(2, '0'),
    hour: String(hour).padStart(2, '0'),
    minute: String(minute).padStart(2, '0'),
    second: String(second).padStart(2, '0'),
  };
  return `${year}/${padded.month}/${padded.day} ${padded.hour}:${padded.minute}:${padded.second}`;
}
