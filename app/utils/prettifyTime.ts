/**
 * @param {number} time
 * @returns {string}
 * @example
 * prettifyTime(0) // "00"
 * prettifyTime(1) // "01"
 * prettifyTime(10) // "10"
 */

export function prettifyTime(time) {
  return time < 10 ? `0${time}` : `${time}`
}
