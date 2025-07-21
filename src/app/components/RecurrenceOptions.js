import useRecurrenceStore from '../store/useRecurrenceStore'

const RecurrenceOptions = () => {
  const { frequency, interval, updateState } = useRecurrenceStore()

  const handleFrequencyChange = (e) => {
    if (e.target.checked) {
      updateState({ frequency: e.target.value })
    }
  }

  const handleIntervalChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1)
    updateState({ interval: value })
  }

  const getIntervalLabel = () => {
    const labels = {
      'DAILY': 'day(s)',
      'WEEKLY': 'week(s)',
      'MONTHLY': 'month(s)',
      'YEARLY': 'year(s)'
    }
    return labels[frequency]
  }

  return (
    <div className="recurrence-options">
      {/* Frequency Selection */}
      <div className="form-group">
        <label className="form-label">Frequency</label>
        <div className="frequency-options">
          {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map((freq) => (
            <label key={freq} className="frequency-option">
              <input
                type="radio"
                name="frequency"
                value={freq}
                checked={frequency === freq}
                onChange={handleFrequencyChange}
              />
              <span>{freq.charAt(0) + freq.slice(1).toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interval Selection */}
      <div className="form-group">
        <label className="form-label">Every</label>
        <div className="interval-input">
          <input
            type="number"
            min="1"
            value={interval}
            onChange={handleIntervalChange}
            className="interval-number"
          />
          <span className="interval-label">{getIntervalLabel()}</span>
        </div>
      </div>
    </div>
  )
}

export default RecurrenceOptions
