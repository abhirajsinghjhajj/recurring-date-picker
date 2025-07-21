import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecurringDatePicker from '../components/RecurringDatePicker'

// Mock RRule
jest.mock('rrule', () => ({
  RRule: {
    DAILY: 3,
    WEEKLY: 2,
    MONTHLY: 1,
    YEARLY: 0,
    SU: 6, MO: 0, TU: 1, WE: 2, TH: 3, FR: 4, SA: 5,
    toString: jest.fn(() => 'FREQ=DAILY'),
    all: jest.fn(() => [new Date('2024-01-01'), new Date('2024-01-02')])
  }
}))

describe('RecurringDatePicker Integration', () => {
  test('complete user workflow', async () => {
    const mockOnRuleChange = jest.fn()
    render(<RecurringDatePicker onRuleChange={mockOnRuleChange} />)

    // Check initial render
    expect(screen.getByText('Recurring Date Picker')).toBeInTheDocument()
    expect(screen.getByText('Daily')).toBeInTheDocument()

    // Change to weekly
    const weeklyRadio = screen.getByDisplayValue('WEEKLY')
    fireEvent.click(weeklyRadio)

    // Wait for state update and rule generation
    await waitFor(() => {
      expect(mockOnRuleChange).toHaveBeenCalled()
    })

    // Test clear functionality
    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    // Verify reset to daily
    await waitFor(() => {
      expect(screen.getByDisplayValue('DAILY')).toBeChecked()
    })
  })
})
