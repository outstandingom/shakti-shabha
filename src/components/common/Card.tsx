import React from 'react'
import s from './Card.module.css'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  accentColor?: string
  hoverLift?: boolean
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

/**
 * Reusable Card Component (Shakti Sabha Design System)
 * Clean white surface, 1px subtle border, rounded corners, top accent strip, hover lift
 */
export default function Card({
  children,
  accentColor,
  hoverLift = true,
  className = '',
  padding = 'md',
  ...rest
}: CardProps) {
  return (
    <div
      className={`${s.card} ${s[padding]} ${hoverLift ? 'card-hover' : ''} ${className}`}
      {...rest}
    >
      {accentColor && (
        <div className={s.accentBar} style={{ background: accentColor }} />
      )}
      {children}
    </div>
  )
}
