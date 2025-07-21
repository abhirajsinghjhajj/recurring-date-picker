import { render, screen, fireEvent } from '@testing-library/react'
import RecurrenceOptions from '../components/RecurrenceOptions'
import useRecurrenceStore from '../store/useRecurrenceStore'

// Mock the store
jest.mock('../store/useRecurrenceStore')

describe('RecurrenceOptions', () => {
  const mockUpdateState = jest.fn()
  
  beforeEach(() => {
    useRecurrenceStore.mockReturnValue({
      frequency: 'DAILY',
      interval: 1,
      updateState: mockUpdateState
    })
    mockUpdateState.mockClear()
  })

  test('renders frequency options correctly', () => {
    render(<RecurrenceOptions />)
    
    expect(screen.getByText('Daily')).toBeInTheDocument()
    expect(screen.getByText('Weekly')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
    expect(screen.getByText('Yearly')).toBeInTheDocument()
  })

  test('handles frequency change', () => {
    render(<RecurrenceOptions />)
    
    const weeklyRadio = screen.getByDisplayValue('WEEKLY')
    fireEvent.click(weeklyRadio)
    
    expect(mockUpdateState).toHaveBeenCalledWith({ frequency: 'WEEKLY' })
  })

  test('handles interval change', () => {
    render(<RecurrenceOptions />)
    
    const intervalInput = screen.getByDisplayValue('1')
    fireEvent.change(intervalInput, { target: { value: '2' } })
    
    expect(mockUpdateState).toHaveBeenCalledWith({ interval: 2 })
  })

  test('prevents invalid interval values', () => {
    render(<RecurrenceOptions />)
    
    const intervalInput = screen.getByDisplayValue('1')
    fireEvent.change(intervalInput, { target: { value: '0' } })
    
    expect(mockUpdateState).toHaveBeenCalledWith({ interval: 1 })
  })
})
