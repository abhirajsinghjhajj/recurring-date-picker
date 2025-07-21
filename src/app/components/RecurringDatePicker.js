"use client";
import { useState, useEffect } from 'react'
import useRecurrenceStore from '../store/useRecurrenceStore'
import { RRuleHelper } from '../utils/rruleHelper'
import RecurrenceOptions from './RecurrenceOptions'
import WeeklySelector from './WeeklySelector'
import MonthlySelector from './MonthlySelector'
import DateRangeSelector from './DateRangeSelector'
import CalendarPreview from './CalendarPreview'
import OccurrencesList from './OccurrencesList'

const RecurringDatePicker = ({ onRuleChange }) => {
  const store = useRecurrenceStore()
  const [recurringDates, setRecurringDates] = useState([])
  const [nextOccurrences, setNextOccurrences] = useState([])

  useEffect(() => {
    const config = store.getRecurrenceConfig()
    const result = RRuleHelper.buildRRule(config)
    
    setRecurringDates(result.dates)
    setNextOccurrences(result.nextOccurrences)
    
    if (onRuleChange) {
      onRuleChange(result.rule, result.dates)
    }
  }, [store.startDate, store.endDate, store.frequency, store.interval, 
      store.selectedWeekdays, store.monthlyPattern, store.monthDay, 
      store.weekdayPosition, store.selectedWeekday, onRuleChange])

  const handleClear = () => {
    store.resetState()
  }

  const handleConsoleLog = () => {
    const config = store.getRecurrenceConfig()
    const result = RRuleHelper.buildRRule(config)
    console.log('RRULE String:', result.rule)
    console.log('Next 10 Dates:', result.nextOccurrences)
    console.log('Current Settings:', config)
  }

  return (
    <div className="recurring-date-picker">
      <div className="card">
        <div className="card-header">
          <h1>Recurring Date Picker</h1>
          <p>Configure recurring dates with live preview</p>
        </div>
        
        <div className="card-body">
          <div className="picker-layout">
            {/* Settings Panel */}
            <div className="settings-panel">
              <h3>Recurrence Settings</h3>
              
              <DateRangeSelector />
              <RecurrenceOptions />
              
              {store.frequency === 'WEEKLY' && <WeeklySelector />}
              {store.frequency === 'MONTHLY' && <MonthlySelector />}
              
              <div className="action-buttons">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleConsoleLog}
                >
                  Console RRULE
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="preview-panel">
              <h3>Calendar Preview</h3>
              <CalendarPreview recurringDates={recurringDates} />
              <OccurrencesList occurrences={nextOccurrences} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecurringDatePicker
