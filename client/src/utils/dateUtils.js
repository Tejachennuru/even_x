export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function daysInMonth(date) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return end.getDate()
}

export function datesForMonth(date) {
  const first = startOfMonth(date)
  const total = daysInMonth(date)
  const arr = []
  for (let i = 1; i <= total; i++) {
    arr.push(new Date(date.getFullYear(), date.getMonth(), i))
  }
  return arr
}

export function isSameDay(d1, d2) {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function formatDateHuman(d) {
  if (!d) return ''
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function parseISODate(iso) {
  return new Date(iso)
}
