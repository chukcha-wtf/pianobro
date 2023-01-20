/**
 * Calculate duration between two dates
 * @param startTime - start time
 * @param endTime - end time
 * @returns duration in milliseconds
 */

export const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const milliseconds = Math.floor(Math.abs(end.getTime() - start.getTime()))

  return milliseconds
}