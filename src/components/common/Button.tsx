import React from 'react'
import { Link } from 'react-router-dom'
import s from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  fullWidth?: boolean
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

/**
 * Reusable Button Component (Shakti Sabha Design System)
 * Primary: Crimson filled with subtle glow & elevation on hover
 * Secondary: Crisp neutral outline with dark text
 * Ghost: Subtle background on hover
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  fullWidth = false,
  children,
  className = '',
  icon,
  iconPosition = 'right',
  ...rest
}: ButtonProps) {
  const combinedClass = [
    s.btn,
    s[variant],
    s[size],
    fullWidth ? s.fullWidth : '',
    className
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className={s.iconLeft}>{icon}</span>}
      <span className={s.label}>{children}</span>
      {icon && iconPosition === 'right' && <span className={s.iconRight}>{icon}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={combinedClass}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={combinedClass} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <button className={combinedClass} {...rest}>
      {content}
    </button>
  )
}
