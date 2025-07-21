import useRecurrenceStore from '../store/useRecurrenceStore'

const WeeklySelector = () => {
  const { selectedWeekdays, updateState } = useRecurrenceStore()

  const weekdays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ]

  const handleWeekdayToggle = (dayValue) => {
    const newSelectedWeekdays = selectedWeekdays.includes(dayValue)
      ? selectedWeekdays.filter(day => day !== dayValue)
      : [...selectedWeekdays, dayValue]
    
    updateState({ selectedWeekdays: newSelectedWeekdays })
  }

  return (
    <div className="weekly-selector">
      <div className="form-group">
        <label className="form-label">Days of the week</label>
        <div className="weekday-buttons">
          {weekdays.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`weekday-btn ${selectedWeekdays.includes(value) ? 'selected' : ''}`}
              onClick={() => handleWeekdayToggle(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeeklySelector
