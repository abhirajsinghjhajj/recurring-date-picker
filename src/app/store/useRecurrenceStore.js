import { create } from 'zustand'

const useRecurrenceStore = create((set, get) => ({
  // State
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  frequency: 'DAILY',
  interval: 1,
  selectedWeekdays: [],
  monthlyPattern: 'bymonthday',
  monthDay: 1,
  weekdayPosition: 1,
  selectedWeekday: 1,

  // Actions
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
  
  resetState: () => set({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    frequency: 'DAILY',
    interval: 1,
    selectedWeekdays: [],
    monthlyPattern: 'bymonthday',
    monthDay: 1,
    weekdayPosition: 1,
    selectedWeekday: 1,
  }),

  // Computed values
  getRecurrenceConfig: () => {
    const state = get()
    return {
      startDate: state.startDate,
      endDate: state.endDate,
      frequency: state.frequency,
      interval: state.interval,
      selectedWeekdays: state.selectedWeekdays,
      monthlyPattern: state.monthlyPattern,
      monthDay: state.monthDay,
      weekdayPosition: state.weekdayPosition,
      selectedWeekday: state.selectedWeekday,
    }
  }
}))

export default useRecurrenceStore
