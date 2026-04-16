import { addMinutes, format, parseISO } from 'date-fns'
import { GameDuration } from '~~/types/games'

export const getGameEndTime = (startTime: string, duration: GameDuration): string => {
  const parsedStart = parseISO(startTime)
  const durationInMinutes = duration === GameDuration.TwoXFifteen ? 45 : 90
  const endDate = addMinutes(parsedStart, durationInMinutes)
  return format(endDate, "yyyy-MM-dd'T'HH:mm:ss")
}
