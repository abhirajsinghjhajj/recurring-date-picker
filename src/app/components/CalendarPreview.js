import { useState, useMemo } from 'react'

const CalendarPreview = ({ recurringDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const recurringDateStrings = useMemo(() => 
    new Set(recurringDates.map(date => date.toISOString().split('T')[0])),
    [recurringDates]
  )

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const today = new Date().toISOString().split('T')[0]

    const days = []

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isOtherMonth: true,
        isToday: false,
        isRecurring: false
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        day,
        isOtherMonth: false,
        isToday: dateString === today,
        isRecurring: recurringDateStrings.has(dateString)
      })
    }

    // Next month days
    const totalCells = days.length
    const remainingCells = 42 - totalCells
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isOtherMonth: true,
        isToday: false,
        isRecurring: false
      })
    }

    return days
  }, [currentDate, recurringDateStrings])

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="calendar-preview">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)} className="nav-btn">‹</button>
        <h4>{monthYear}</h4>
        <button onClick={() => navigateMonth(1)} className="nav-btn">›</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarData.map((dayData, index) => (
            <div 
              key={index}
              className={`calendar-day ${dayData.isOtherMonth ? 'other-month' : ''} ${dayData.isToday ? 'today' : ''} ${dayData.isRecurring ? 'recurring' : ''}`}
            >
              {dayData.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarPreview
