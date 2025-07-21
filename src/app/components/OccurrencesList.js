// src/app/components/OccurrencesList.js
"use client";
export default function OccurrencesList({ occurrences }) {
  if (occurrences.length === 0) {
    return <div className="occurrence-item">No occurrences found</div>;
  }
  return (
    <div className="occurrences-list">
      {occurrences.map((d, i) => (
        <div key={i} className="occurrence-item">
          {d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </div>
      ))}
    </div>
  );
}
