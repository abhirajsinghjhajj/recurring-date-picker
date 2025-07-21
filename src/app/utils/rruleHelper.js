import { RRule } from 'rrule'

export class RRuleHelper {
  static buildRRule(options) {
    try {
      const startDate = new Date(options.startDate)
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid start date')
      }

      const config = {
        freq: RRule[options.frequency],
        interval: options.interval,
        dtstart: startDate
      }

      // Add end date if specified
      if (options.endDate) {
        const endDate = new Date(options.endDate)
        if (!isNaN(endDate.getTime())) {
          config.until = endDate
        }
      }

      // Frequency-specific configurations
      switch (options.frequency) {
        case 'WEEKLY':
          if (options.selectedWeekdays.length > 0) {
            config.byweekday = options.selectedWeekdays.map(day => RRule[this.getWeekdayName(day)])
          } else {
            config.byweekday = [RRule[this.getWeekdayName(startDate.getDay())]]
          }
          break
        case 'MONTHLY':
          if (options.monthlyPattern === 'bymonthday') {
            config.bymonthday = options.monthDay
          } else {
            const weekdayName = this.getWeekdayName(options.selectedWeekday)
            config.byweekday = RRule[weekdayName].nth(options.weekdayPosition)
          }
          break
      }

      const rule = new RRule(config)
      const dates = rule.all().slice(0, 50) // Limit for performance

      return {
        rule: rule.toString(),
        dates,
        nextOccurrences: dates.slice(0, 10)
      }
    } catch (error) {
      console.error('Error building RRule:', error)
      return {
        rule: '',
        dates: [],
        nextOccurrences: []
      }
    }
  }

  static getWeekdayName(dayNumber) {
    const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    return weekdays[dayNumber]
  }
}
