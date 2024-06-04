export default function FormatDate(date: Date | string) {
  const newDate = typeof date === "string" ? new Date(date) : date

  return `${(newDate.getUTCDate()).toString().padStart(2, "0")}/${(newDate.getUTCMonth() + 1).toString().padStart(2, "0")}/${newDate.getUTCFullYear()}`
}
