import React from 'react'
import { useLanguage } from '../../lib/LanguageContext'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './LanguageSwitcher.module.css'

interface LanguageSwitcherProps {
  floating?: boolean
  className?: string
}

export default function LanguageSwitcher({ floating = false, className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage, isTranslating } = useLanguage()

  const content = (
    <div className={`${s.switcher} ${isTranslating ? s.translating : ''} ${className}`} title="Translate website between English and Hindi">
      <button type="button" className={s.iconWrap} onClick={toggleLanguage} title="Toggle language translation" aria-label="Toggle between English and Hindi">
        <GoogleIcon name="translate" size={15} />
      </button>
      <button
        type="button"
        className={`${s.btn} ${language === 'en' ? s.btnActive : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="Switch language to English"
      >
        EN
      </button>
      <div className={s.divider} />
      <button
        type="button"
        className={`${s.btn} ${language === 'hi' ? s.btnActive : ''}`}
        onClick={() => setLanguage('hi')}
        aria-label="हिन्दी में अनुवाद करें"
      >
        हिन्दी
      </button>
    </div>
  )

  if (floating) {
    return (
      <div className={s.floatingWrapper} data-lenis-prevent="true">
        {content}
      </div>
    )
  }

  return content
}
