import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isTranslating: false
})

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shakti_selected_lang')
      if (saved === 'hi' || saved === 'en') return saved
    } catch { /* ignore */ }
    return 'en'
  })
  const [isTranslating, setIsTranslating] = useState(false)

  // Inject Google Translate script once
  useEffect(() => {
    // Hidden container for Google Translate element
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div')
      div.id = 'google_translate_element'
      div.style.display = 'none'
      document.body.appendChild(div)
    }

    // Google Translate Init callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        )

        // Apply saved language if Hindi
        const saved = localStorage.getItem('shakti_selected_lang')
        if (saved === 'hi') {
          setTimeout(() => applyTranslation('hi'), 500)
        }
      }
    }

    // Add script tag if not already added
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }

    // Inject CSS to hide Google banner/frames for seamless look
    if (!document.getElementById('google-translate-custom-styles')) {
      const style = document.createElement('style')
      style.id = 'google-translate-custom-styles'
      style.innerHTML = `
        /* Hide Google Translate banner, toolbar, and tooltips */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const applyTranslation = (lang: Language) => {
    setIsTranslating(true)

    // Set cookie for Google translate
    const hostname = window.location.hostname
    const cookieVal = lang === 'hi' ? '/en/hi' : '/en/en'
    document.cookie = `googtrans=${cookieVal}; path=/;`
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname}`
    document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname}`

    try {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
      if (select) {
        select.value = lang
        select.dispatchEvent(new Event('change'))
      } else {
        // Fallback: If combo is not ready yet, re-attempt in 300ms
        setTimeout(() => {
          const s = document.querySelector<HTMLSelectElement>('.goog-te-combo')
          if (s) {
            s.value = lang
            s.dispatchEvent(new Event('change'))
          }
        }, 400)
      }
    } catch (e) {
      console.warn('Google translation trigger warning:', e)
    }

    setTimeout(() => {
      setIsTranslating(false)
    }, 600)
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('shakti_selected_lang', lang)
    } catch { /* ignore */ }
    applyTranslation(lang)
  }

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en'
    setLanguage(nextLang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
