// src/app/components/DateRangeSelector.js
"use client";
import useRecurrenceStore from '../store/useRecurrenceStore';

export default function DateRangeSelector() {
  const { startDate, endDate, updateState } = useRecurrenceStore();
  return (
    <div className="form-group">
      <label className="form-label">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={e => updateState({ startDate: e.target.value })}
        className="form-control"
      />
      <label className="form-label mt-4">End Date (Optional)</label>
      <input
        type="date"
        value={endDate}
        onChange={e => updateState({ endDate: e.target.value })}
        className="form-control"
      />
    </div>
  );
}
