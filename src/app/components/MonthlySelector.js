// src/app/components/MonthlySelector.js
"use client";
import useRecurrenceStore from '../store/useRecurrenceStore';

export default function MonthlySelector() {
  const { monthlyPattern, monthDay, weekdayPosition, selectedWeekday, updateState } = useRecurrenceStore();
  return (
    <div className="form-group">
      <label className="form-label">Monthly Pattern</label>
      <select
        value={monthlyPattern}
        onChange={e => updateState({ monthlyPattern: e.target.value })}
        className="form-control"
      >
        <option value="bymonthday">On day of month</option>
        <option value="byweekday">By weekday position</option>
      </select>

      {monthlyPattern === 'bymonthday' ? (
        <input
          type="number"
          min="1"
          max="31"
          value={monthDay}
          onChange={e => updateState({ monthDay: parseInt(e.target.value) || 1 })}
          className="form-control mt-2"
        />
      ) : (
        <div className="flex gap-2 mt-2">
          <select
            value={weekdayPosition}
            onChange={e => updateState({ weekdayPosition: parseInt(e.target.value) })}
            className="form-control"
          >
            {[1,2,3,4,-1].map(n => (
              <option key={n} value={n}>{n === -1 ? 'Last' : ['First','Second','Third','Fourth'][n-1]}</option>
            ))}
          </select>
          <select
            value={selectedWeekday}
            onChange={e => updateState({ selectedWeekday: parseInt(e.target.value) })}
            className="form-control"
          >
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => (
              <option key={i} value={i}>{d}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
