import { addMinutes, format, parseISO } from 'date-fns'
import { GameDuration } from '~~/types/games'
import { tz } from '@date-fns/tz'
import { useTimezone } from '~/composables/useTimezone'

const { active_timezone } = useTimezone()

export const getGameEndTime = (startTime: string, duration: GameDuration): string => {
  const parsedStart = parseISO(startTime, { in: tz(active_timezone.value) })
  const durationInMinutes = duration === GameDuration.TwoXFifteen ? 45 : 90
  const endDate = addMinutes(parsedStart, durationInMinutes)
  return format(endDate, "yyyy-MM-dd'T'HH:mm:ss", { in: tz(active_timezone.value) })
}
