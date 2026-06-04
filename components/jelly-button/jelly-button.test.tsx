import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JellyButton } from './jelly-button'

describe('JellyButton', () => {
  it('renders correctly with children', () => {
    render(<JellyButton>Click Me</JellyButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies disabled state correctly', () => {
    render(<JellyButton disabled>Disabled</JellyButton>)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
    expect(button.style.opacity).toBe('0.5')
    expect(button.style.cursor).toBe('not-allowed')
  })

  it('handles click events', () => {
    const onClick = vi.fn()
    render(<JellyButton onClick={onClick}>Click Me</JellyButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('changes style on hover', () => {
    render(<JellyButton>Hover Me</JellyButton>)
    const button = screen.getByRole('button')
    
    // Hover
    fireEvent.mouseEnter(button)
    expect(button.style.transform).toBe('scaleX(1.06) scaleY(0.94)')
    
    // Mouse leave
    fireEvent.mouseLeave(button)
    expect(button.style.transform).toBe('none')
  })

  it('changes style on press', () => {
    render(<JellyButton>Press Me</JellyButton>)
    const button = screen.getByRole('button')
    
    fireEvent.mouseDown(button)
    expect(button.style.transform).toBe('scaleX(0.94) scaleY(1.06)')
    
    fireEvent.mouseUp(button)
    expect(button.style.transform).not.toBe('scaleX(0.94) scaleY(1.06)')
  })
})
