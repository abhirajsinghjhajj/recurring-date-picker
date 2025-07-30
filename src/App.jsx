import React, { useState, useContext, createContext, useMemo } from 'react';
import './App.css';

const WEEK_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_WEEK_OPTIONS = ["first", "second", "third", "fourth", "last"];
const RECURRENCE_TYPES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];

const RecurrenceContext = createContext();

const RecurrenceProvider = ({ children }) => {
  const [state, setState] = useState({
    recurrenceType: 'weekly',
    interval: 1,
    weekDays: [1], // Monday default
    monthDay: 1,
    monthWeek: 'first',
    monthWeekDay: 'monday',
    startDate: new Date(),
    endType: 'never',
    endDate: null,
    endOccurrences: 10
  });

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  return (
    <RecurrenceContext.Provider value={{ state, updateState }}>
      {children}
    </RecurrenceContext.Provider>
  );
};

// Enhanced utility functions with better error handling
const generateRecurringDates = (config, maxDates = 50) => {
  const dates = [];
  const { recurrenceType, interval, weekDays, monthDay, monthWeek, monthWeekDay, startDate, endType, endDate, endOccurrences } = config;

  if (!startDate) return dates;

  let currentDate = new Date(startDate);
  let count = 0;
  const maxIterations = 1000;

  const shouldAddDate = (date) => {
    if (endType === 'never') return true;
    if (endType === 'after' && count >= endOccurrences) return false;
    if (endType === 'on' && endDate && date > endDate) return false;
    return true;
  };

  const getNthWeekdayOfMonth = (year, month, weekday, nth) => {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();

    let targetDate;
    if (nth === 'last') {
      const lastDay = new Date(year, month + 1, 0);
      const lastWeekday = lastDay.getDay();
      const daysBack = (lastWeekday - weekday + 7) % 7;
      targetDate = new Date(year, month, lastDay.getDate() - daysBack);
    } else {
      const nthMap = { 'first': 1, 'second': 2, 'third': 3, 'fourth': 4 };
      const occurrence = nthMap[nth];
      const daysToAdd = (weekday - firstWeekday + 7) % 7;
      const targetDay = 1 + daysToAdd + (occurrence - 1) * 7;
      targetDate = new Date(year, month, targetDay);

      if (targetDate.getMonth() !== month) {
        return null;
      }
    }

    return targetDate;
  };

  while (dates.length < maxDates && count < maxIterations) {
    let shouldAdd = false;

    try {
      switch (recurrenceType) {
        case 'daily':
          shouldAdd = true;
          break;

        case 'weekly':
          shouldAdd = weekDays.includes(currentDate.getDay());
          break;

        case 'monthly':
          if (monthWeek && monthWeekDay) {
            const weekdayNum = WEEK_DAY_NAMES.findIndex(day => day.toLowerCase() === monthWeekDay);
            const targetDate = getNthWeekdayOfMonth(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              weekdayNum,
              monthWeek
            );
            shouldAdd = targetDate && currentDate.toDateString() === targetDate.toDateString();
          } else {
            shouldAdd = currentDate.getDate() === monthDay;
          }
          break;

        case 'yearly':
          const startMonth = startDate.getMonth();
          const startDay = startDate.getDate();
          shouldAdd = currentDate.getMonth() === startMonth && currentDate.getDate() === startDay;
          break;
      }

      if (shouldAdd && currentDate >= startDate && shouldAddDate(currentDate)) {
        dates.push(new Date(currentDate));
        count++;
      }

      // Move to next date based on recurrence type
      switch (recurrenceType) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 1);
          if (currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + (interval - 1) * 7);
          }
          break;
        case 'monthly':
          if (monthWeek && monthWeekDay) {
            currentDate.setMonth(currentDate.getMonth() + interval);
            currentDate.setDate(1);
          } else {
            currentDate.setMonth(currentDate.getMonth() + interval);
            const targetDay = Math.min(monthDay, new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate());
            currentDate.setDate(targetDay);
          }
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
      }
    } catch (error) {
      console.error('Error generating recurring dates:', error);
      break;
    }

    count++;
  }

  return dates;
};

const generatePatternText = (config) => {
  const { recurrenceType, interval, weekDays, monthDay, monthWeek, monthWeekDay, endType, endDate, endOccurrences } = config;

  let text = '';

  switch (recurrenceType) {
    case 'daily':
      text = interval === 1 ? 'Every day' : `Every ${interval} days`;
      break;

    case 'weekly':
      const dayNames = weekDays.map(day => WEEK_DAY_NAMES[day]);
      if (interval === 1) {
        text = `Every ${dayNames.join(', ')}`;
      } else {
        text = `Every ${interval} weeks on ${dayNames.join(', ')}`;
      }
      break;

    case 'monthly':
      if (monthWeek && monthWeekDay) {
        const weekText = interval === 1 ? 'month' : `${interval} months`;
        text = `The ${monthWeek} ${monthWeekDay} of every ${weekText}`;
      } else {
        const dayText = `${monthDay}${getOrdinalSuffix(monthDay)}`;
        const monthText = interval === 1 ? 'month' : `${interval} months`;
        text = `The ${dayText} day of every ${monthText}`;
      }
      break;

    case 'yearly':
      const yearText = interval === 1 ? 'year' : `${interval} years`;
      text = `Every ${yearText}`;
      break;
  }

  switch (endType) {
    case 'on':
      if (endDate) {
        text += ` until ${endDate.toLocaleDateString()}`;
      }
      break;
    case 'after':
      text += ` for ${endOccurrences} occurrences`;
      break;
  }

  return text;
};

const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

// Enhanced RecurrenceTypeSelector with better accessibility
const RecurrenceTypeSelector = () => {
  const { state, updateState } = useContext(RecurrenceContext);

  return (
    <div className="form-section">
      <h3 className="section-title">Recurrence Type</h3>
      <div className="radio-group">
        {RECURRENCE_TYPES.map(type => (
          <label key={type.value} className="radio-option">
            <input
              type="radio"
              name="recurrenceType"
              value={type.value}
              checked={state.recurrenceType === type.value}
              onChange={(e) => updateState({ recurrenceType: e.target.value })}
              className="radio-input"
            />
            <span className="radio-label">{type.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Enhanced RecurrenceOptions with improved form validation
const RecurrenceOptions = () => {
  const { state, updateState } = useContext(RecurrenceContext);

  const handleWeekDayToggle = (dayIndex) => {
    const newWeekDays = state.weekDays.includes(dayIndex)
      ? state.weekDays.filter(d => d !== dayIndex)
      : [...state.weekDays, dayIndex].sort((a, b) => a - b);

    if (newWeekDays.length > 0) {
      updateState({ weekDays: newWeekDays });
    }
  };

  const handleIntervalChange = (value) => {
    const interval = Math.max(1, Math.min(100, parseInt(value) || 1));
    updateState({ interval });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Options</h3>

      <div className="form-row">
        <label className="form-label">Every</label>
        <input
          type="number"
          min="1"
          max="100"
          value={state.interval}
          onChange={(e) => handleIntervalChange(e.target.value)}
          className="form-control interval-input"
          aria-label="Interval"
        />
        <span className="interval-unit">
          {state.recurrenceType === 'daily' && (state.interval === 1 ? 'day' : 'days')}
          {state.recurrenceType === 'weekly' && (state.interval === 1 ? 'week' : 'weeks')}
          {state.recurrenceType === 'monthly' && (state.interval === 1 ? 'month' : 'months')}
          {state.recurrenceType === 'yearly' && (state.interval === 1 ? 'year' : 'years')}
        </span>
      </div>

      {state.recurrenceType === 'weekly' && (
        <div className="weekday-section">
          <label className="form-label">Days of the week</label>
          <div className="weekday-selector">
            {WEEK_DAY_NAMES.map((day, index) => (
              <button
                key={index}
                type="button"
                className={`weekday-button ${state.weekDays.includes(index) ? 'selected' : ''}`}
                onClick={() => handleWeekDayToggle(index)}
                aria-pressed={state.weekDays.includes(index)}
                aria-label={day}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.recurrenceType === 'monthly' && (
        <div className="monthly-section">
          <div className="monthly-option">
            <label className="radio-option">
              <input
                type="radio"
                name="monthlyType"
                value="day"
                checked={!state.monthWeek}
                onChange={() => updateState({ monthWeek: null, monthWeekDay: null })}
                className="radio-input"
              />
              <span className="radio-label">On day</span>
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={state.monthDay}
              onChange={(e) => updateState({ monthDay: parseInt(e.target.value) || 1 })}
              className="form-control day-input"
              disabled={!!state.monthWeek}
              aria-label="Day of month"
            />
            <span>of the month</span>
          </div>

          <div className="monthly-option">
            <label className="radio-option">
              <input
                type="radio"
                name="monthlyType"
                value="weekday"
                checked={!!state.monthWeek}
                onChange={() => updateState({ monthWeek: 'first', monthWeekDay: 'monday' })}
                className="radio-input"
              />
              <span className="radio-label">On the</span>
            </label>
            <select
              value={state.monthWeek || 'first'}
              onChange={(e) => updateState({ monthWeek: e.target.value })}
              className="form-control"
              disabled={!state.monthWeek}
              aria-label="Week of month"
            >
              {MONTH_WEEK_OPTIONS.map(week => (
                <option key={week} value={week}>
                  {week.charAt(0).toUpperCase() + week.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={state.monthWeekDay || 'monday'}
              onChange={(e) => updateState({ monthWeekDay: e.target.value })}
              className="form-control"
              disabled={!state.monthWeek}
              aria-label="Day of week"
            >
              {WEEK_DAY_NAMES.map(day => (
                <option key={day.toLowerCase()} value={day.toLowerCase()}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced DateRangePicker with better date handling
const DateRangePicker = () => {
  const { state, updateState } = useContext(RecurrenceContext);

  const formatDateForInput = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      updateState({ startDate: date });
    }
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (!e.target.value || !isNaN(date.getTime())) {
      updateState({ endDate: date });
    }
  };

  const handleOccurrencesChange = (value) => {
    const occurrences = Math.max(1, Math.min(1000, parseInt(value) || 1));
    updateState({ endOccurrences: occurrences });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Date Range</h3>

      <div className="form-group">
        <label className="form-label" htmlFor="start-date">Start Date</label>
        <input
          id="start-date"
          type="date"
          value={formatDateForInput(state.startDate)}
          onChange={handleStartDateChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">End Condition</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="endType"
              value="never"
              checked={state.endType === 'never'}
              onChange={(e) => updateState({ endType: e.target.value })}
              className="radio-input"
            />
            <span className="radio-label">Never ends</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="endType"
              value="on"
              checked={state.endType === 'on'}
              onChange={(e) => updateState({ endType: e.target.value })}
              className="radio-input"
            />
            <span className="radio-label">On date</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="endType"
              value="after"
              checked={state.endType === 'after'}
              onChange={(e) => updateState({ endType: e.target.value })}
              className="radio-input"
            />
            <span className="radio-label">After occurrences</span>
          </label>
        </div>

        {state.endType === 'on' && (
          <input
            type="date"
            value={formatDateForInput(state.endDate)}
            onChange={handleEndDateChange}
            className="form-control end-date-input"
            min={formatDateForInput(state.startDate)}
            aria-label="End date"
          />
        )}

        {state.endType === 'after' && (
          <div className="occurrences-input">
            <input
              type="number"
              min="1"
              max="1000"
              value={state.endOccurrences}
              onChange={(e) => handleOccurrencesChange(e.target.value)}
              className="form-control occurrences-number"
              aria-label="Number of occurrences"
            />
            <span>occurrences</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced CalendarPreview with better navigation and accessibility
const CalendarPreview = ({ recurringDates }) => {
  const { state } = useContext(RecurrenceContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isRecurringDate = (date) => {
    return recurringDates.some(recurDate =>
      recurDate.toDateString() === date.toDateString()
    );
  };

  const isStartDate = (date) => {
    return state.startDate && state.startDate.toDateString() === date.toDateString();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="calendar-section">
      <h3 className="section-title">Calendar Preview</h3>
      <div className="calendar">
        <div className="calendar-header">
          <button
            className="calendar-nav-btn"
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
          >
            ← Previous
          </button>
          <h4 className="calendar-title">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          <button
            className="calendar-nav-btn"
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
          >
            Next →
          </button>
        </div>

        <div className="calendar-weekdays">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day, index) => {
            const isRecurring = isRecurringDate(day.date);
            const isStart = isStartDate(day.date);

            return (
              <div
                key={index}
                className={`calendar-day ${
                  !day.isCurrentMonth ? 'other-month' : ''
                } ${day.isToday ? 'today' : ''} ${isStart ? 'start-date' : isRecurring ? 'recurring' : ''}`}
                title={isStart ? 'Start Date' : isRecurring ? 'Recurring Date' : ''}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot start"></div>
            <span>Start Date</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot recurring"></div>
            <span>Recurring Dates</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot today"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced PatternSummary with better formatting
const PatternSummary = ({ patternText, recurringDates }) => {
  const upcomingDates = recurringDates.slice(0, 8);

  return (
    <div className="pattern-preview">
      <h4 className="pattern-title">Pattern Summary</h4>
      <p className="pattern-text">{patternText}</p>

      {upcomingDates.length > 0 && (
        <div className="upcoming-dates">
          <h5 className="upcoming-title">Next occurrences:</h5>
          <div className="dates-grid">
            {upcomingDates.map((date, index) => (
              <div key={index} className="date-item">
                <div className="date-weekday">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="date-day">
                  {date.getDate()}
                </div>
                <div className="date-month">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced main App component with better layout
const App = () => {
  const { state } = useContext(RecurrenceContext);

  const recurringDates = useMemo(() => {
    return generateRecurringDates(state, 100);
  }, [state]);

  const patternText = useMemo(() => {
    return generatePatternText(state);
  }, [state]);

  return (
    <div className="app-container">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">Recurring Date Picker</h1>
          <p className="app-description">
            Create and preview recurring date patterns with ease
          </p>
        </header>

        <div className="layout-grid">
          <div className="configuration-panel">
            <div className="card">
              <RecurrenceTypeSelector />
              <div className="divider"></div>
              <RecurrenceOptions />
              <div className="divider"></div>
              <DateRangePicker />
            </div>
          </div>

          <div className="preview-panel">
            <CalendarPreview recurringDates={recurringDates} />
          </div>
        </div>

        <div className="summary-section">
          <PatternSummary
            patternText={patternText}
            recurringDates={recurringDates}
          />
        </div>
      </div>
    </div>
  );
};

// Main component export
const RecurringDatePicker = () => {
  return (
    <RecurrenceProvider>
      <App />
    </RecurrenceProvider>
  );
};

export default RecurringDatePicker;