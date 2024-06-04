export default function FormatTime(time: [number, number]) {
  return `${time[0].toString().padStart(2, '0')}:${time[1].toString().padStart(2, '0')}:00`
}
