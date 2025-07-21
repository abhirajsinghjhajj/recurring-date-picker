"use client";
import './styles/datePickerStyles.css';
import RecurringDatePicker from './components/RecurringDatePicker';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <RecurringDatePicker onRuleChange={(rule, dates) => console.log(rule, dates)} />
    </main>
  );
}
