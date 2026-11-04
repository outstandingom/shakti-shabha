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

  // Sync html attributes and classes for Hindi typographic anti-overlap styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
      document.documentElement.setAttribute('data-lang', language)
      if (language === 'hi') {
        document.documentElement.classList.add('shakti-hindi-mode')
        document.body.classList.add('shakti-hindi-mode')
      } else {
        document.documentElement.classList.remove('shakti-hindi-mode')
        document.body.classList.remove('shakti-hindi-mode')
      }
    }
  }, [language])

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

    // Inject CSS to hide Google banner/frames for seamless look & ensure Hindi font styling
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

        /* ── Comprehensive Hindi / Devanagari Translation Anti-Overlap Engine ── */
        html.translated-ltr,
        html.translated-rtl,
        html[data-lang="hi"],
        html[lang="hi"],
        .shakti-hindi-mode {
          font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        /* Prevent Google Translate font tags from breaking word boundaries, lines or letter spacing */
        html.translated-ltr font,
        html.translated-rtl font,
        html[data-lang="hi"] font,
        html[lang="hi"] font,
        .shakti-hindi-mode font {
          display: inline !important;
          vertical-align: baseline !important;
          white-space: inherit !important;
          letter-spacing: 0 !important;
          word-spacing: normal !important;
          text-transform: none !important;
          color: inherit !important;
          -webkit-text-fill-color: currentColor !important;
          font-family: inherit !important;
          line-height: inherit !important;
        }

        /* Fix adjacent <font> tags lacking whitespace, causing words to collide and overlap horizontally */
        html.translated-ltr font + font,
        html.translated-rtl font + font,
        html[data-lang="hi"] font + font,
        .shakti-hindi-mode font + font {
          margin-left: 0.22em !important;
        }

        /* Eliminate negative letter spacing and uppercase which deform Hindi conjuncts and matras */
        html.translated-ltr *,
        html.translated-rtl *,
        html[data-lang="hi"] *,
        html[lang="hi"] *,
        .shakti-hindi-mode * {
          letter-spacing: normal !important;
          text-transform: none !important;
        }

        /* Headings & Hero Titles - Provide ample vertical line height so upper and lower matras never overlap */
        html.translated-ltr h1, html.translated-ltr h2, html.translated-ltr h3,
        html.translated-ltr h4, html.translated-ltr h5, html.translated-ltr h6,
        html.translated-ltr [class*="title"], html.translated-ltr [class*="Title"],
        html.translated-ltr [class*="heading"], html.translated-ltr [class*="Heading"],
        html.translated-ltr [class*="heroTitle"], html.translated-ltr [class*="HeroTitle"],
        html.translated-ltr [class*="headline"], html.translated-ltr [class*="Headline"],
        html.translated-ltr [class*="prefix"], html.translated-ltr [class*="Prefix"],
        html[data-lang="hi"] h1, html[data-lang="hi"] h2, html[data-lang="hi"] h3,
        html[data-lang="hi"] h4, html[data-lang="hi"] h5, html[data-lang="hi"] h6,
        html[data-lang="hi"] [class*="title"], html[data-lang="hi"] [class*="Title"],
        html[data-lang="hi"] [class*="heading"], html[data-lang="hi"] [class*="Heading"],
        html[data-lang="hi"] [class*="heroTitle"], html[data-lang="hi"] [class*="HeroTitle"],
        html[data-lang="hi"] [class*="headline"], html[data-lang="hi"] [class*="Headline"],
        html[data-lang="hi"] [class*="prefix"], html[data-lang="hi"] [class*="Prefix"],
        .shakti-hindi-mode h1, .shakti-hindi-mode h2, .shakti-hindi-mode h3,
        .shakti-hindi-mode h4, .shakti-hindi-mode h5, .shakti-hindi-mode h6,
        .shakti-hindi-mode [class*="title"], .shakti-hindi-mode [class*="Title"],
        .shakti-hindi-mode [class*="heading"], .shakti-hindi-mode [class*="Heading"],
        .shakti-hindi-mode [class*="heroTitle"], .shakti-hindi-mode [class*="HeroTitle"],
        .shakti-hindi-mode [class*="headline"], .shakti-hindi-mode [class*="Headline"] {
          line-height: 1.42 !important;
          height: auto !important;
          min-height: fit-content !important;
          max-height: none !important;
          overflow: visible !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        /* Body Copy, Paragraphs, List Items, Subtitles and Quotes */
        html.translated-ltr p, html.translated-ltr li, html.translated-ltr dd,
        html.translated-ltr blockquote, html.translated-ltr [class*="sub"],
        html.translated-ltr [class*="Sub"], html.translated-ltr [class*="desc"],
        html.translated-ltr [class*="Desc"], html.translated-ltr [class*="text"],
        html.translated-ltr [class*="body"], html.translated-ltr [class*="quote"],
        html.translated-ltr [class*="excerpt"],
        html[data-lang="hi"] p, html[data-lang="hi"] li, html[data-lang="hi"] dd,
        html[data-lang="hi"] blockquote, html[data-lang="hi"] [class*="sub"],
        html[data-lang="hi"] [class*="Sub"], html[data-lang="hi"] [class*="desc"],
        html[data-lang="hi"] [class*="Desc"], html[data-lang="hi"] [class*="text"],
        html[data-lang="hi"] [class*="body"], html[data-lang="hi"] [class*="quote"],
        html[data-lang="hi"] [class*="excerpt"],
        .shakti-hindi-mode p, .shakti-hindi-mode li, .shakti-hindi-mode dd,
        .shakti-hindi-mode blockquote, .shakti-hindi-mode [class*="sub"],
        .shakti-hindi-mode [class*="desc"], .shakti-hindi-mode [class*="text"],
        .shakti-hindi-mode [class*="body"], .shakti-hindi-mode [class*="quote"] {
          line-height: 1.72 !important;
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }

        /* Buttons, Badges, Tabs, Pills & Navigation Links - Never cut off or overlap adjacent buttons */
        html.translated-ltr button,
        html.translated-ltr a,
        html.translated-ltr [role="button"],
        html.translated-ltr [class*="btn"],
        html.translated-ltr [class*="Button"],
        html.translated-ltr [class*="pill"],
        html.translated-ltr [class*="Pill"],
        html.translated-ltr [class*="badge"],
        html.translated-ltr [class*="Badge"],
        html.translated-ltr [class*="tag"],
        html.translated-ltr [class*="Tag"],
        html.translated-ltr [class*="chip"],
        html.translated-ltr [class*="tab"],
        html.translated-ltr [class*="Tab"],
        html.translated-ltr [class*="link"],
        html.translated-ltr [class*="navItem"],
        html[data-lang="hi"] button,
        html[data-lang="hi"] a,
        html[data-lang="hi"] [role="button"],
        html[data-lang="hi"] [class*="btn"],
        html[data-lang="hi"] [class*="Button"],
        html[data-lang="hi"] [class*="pill"],
        html[data-lang="hi"] [class*="Pill"],
        html[data-lang="hi"] [class*="badge"],
        html[data-lang="hi"] [class*="Badge"],
        html[data-lang="hi"] [class*="tag"],
        html[data-lang="hi"] [class*="Tag"],
        html[data-lang="hi"] [class*="chip"],
        html[data-lang="hi"] [class*="tab"],
        html[data-lang="hi"] [class*="Tab"],
        html[data-lang="hi"] [class*="link"],
        html[data-lang="hi"] [class*="navItem"],
        .shakti-hindi-mode button,
        .shakti-hindi-mode a,
        .shakti-hindi-mode [role="button"],
        .shakti-hindi-mode [class*="btn"],
        .shakti-hindi-mode [class*="Button"],
        .shakti-hindi-mode [class*="pill"],
        .shakti-hindi-mode [class*="badge"],
        .shakti-hindi-mode [class*="tag"],
        .shakti-hindi-mode [class*="tab"] {
          white-space: normal !important;
          height: auto !important;
          min-height: fit-content !important;
          line-height: 1.45 !important;
          overflow: visible !important;
          text-overflow: unset !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Cards, Boxes, Articles & Container items - Expand vertically without spilling or overlapping */
        html.translated-ltr [class*="card"], html.translated-ltr [class*="Card"],
        html.translated-ltr [class*="box"], html.translated-ltr [class*="Box"],
        html.translated-ltr [class*="item"], html.translated-ltr [class*="Item"],
        html.translated-ltr [class*="content"], html.translated-ltr [class*="Content"],
        html.translated-ltr [class*="column"], html.translated-ltr [class*="Column"],
        html.translated-ltr [class*="section"], html.translated-ltr [class*="Section"],
        html[data-lang="hi"] [class*="card"], html[data-lang="hi"] [class*="Card"],
        html[data-lang="hi"] [class*="box"], html[data-lang="hi"] [class*="Box"],
        html[data-lang="hi"] [class*="item"], html[data-lang="hi"] [class*="Item"],
        html[data-lang="hi"] [class*="content"], html[data-lang="hi"] [class*="Content"],
        html[data-lang="hi"] [class*="column"], html[data-lang="hi"] [class*="Column"],
        html[data-lang="hi"] [class*="section"], html[data-lang="hi"] [class*="Section"],
        .shakti-hindi-mode [class*="card"], .shakti-hindi-mode [class*="Card"],
        .shakti-hindi-mode [class*="box"], .shakti-hindi-mode [class*="Box"],
        .shakti-hindi-mode [class*="item"], .shakti-hindi-mode [class*="Item"],
        .shakti-hindi-mode [class*="content"], .shakti-hindi-mode [class*="Content"] {
          height: auto !important;
          min-height: fit-content !important;
          max-height: none !important;
          overflow: visible !important;
        }

        /* Allow flex rows to wrap so elements don't crush horizontally */
        html.translated-ltr [class*="links"],
        html.translated-ltr [class*="linksBox"],
        html.translated-ltr [class*="bar"],
        html.translated-ltr [class*="toolbar"],
        html.translated-ltr [class*="navBar"],
        html[data-lang="hi"] [class*="links"],
        html[data-lang="hi"] [class*="linksBox"],
        html[data-lang="hi"] [class*="bar"],
        html[data-lang="hi"] [class*="toolbar"],
        html[data-lang="hi"] [class*="navBar"],
        .shakti-hindi-mode [class*="links"],
        .shakti-hindi-mode [class*="linksBox"],
        .shakti-hindi-mode [class*="bar"],
        .shakti-hindi-mode [class*="toolbar"],
        .shakti-hindi-mode [class*="navBar"] {
          flex-wrap: wrap !important;
          height: auto !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const applyTranslation = (lang: Language) => {
    setIsTranslating(true)

    const hostname = window.location.hostname
    if (lang === 'hi') {
      const cookieVal = '/en/hi'
      document.cookie = `googtrans=${cookieVal}; path=/;`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname}`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname}`
    } else {
      // Reverting to English
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`
      document.cookie = `googtrans=/en/en; path=/;`
      document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`
      document.cookie = `googtrans=/en/en; path=/; domain=.${hostname}`
    }

    const triggerCombo = () => {
      try {
        const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
        if (select) {
          const options = Array.from(select.options)
          let targetVal = lang
          if (lang === 'en') {
            // Source language option might be empty string or 'en'
            const hasEn = options.some(o => o.value === 'en')
            targetVal = hasEn ? 'en' : ('' as any)
          }
          select.value = targetVal
          select.dispatchEvent(new Event('change', { bubbles: true }))
          select.dispatchEvent(new Event('input', { bubbles: true }))
          if (typeof (select as any).onchange === 'function') {
            (select as any).onchange(new Event('change'))
          }
          return true
        }
      } catch (e) {
        console.warn('Google translation trigger warning:', e)
      }
      return false
    }

    // Try immediately, or retry if widget is still initializing
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const success = triggerCombo()
      if (success || attempts >= 15) {
        clearInterval(interval)
        setIsTranslating(false)
        window.dispatchEvent(new CustomEvent('shakti_language_changed', { detail: { language: lang } }))
      }
    }, 150)
  }

  const setLanguage = (lang: Language) => {
    if (lang === language) return

    setLanguageState(lang)
    try {
      localStorage.setItem('shakti_selected_lang', lang)
    } catch { /* ignore */ }

    const hostname = window.location.hostname
    if (lang === 'hi') {
      const cookieVal = '/en/hi'
      document.cookie = `googtrans=${cookieVal}; path=/;`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname}`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname}`
    } else {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`
      document.cookie = `googtrans=/en/en; path=/;`
      document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`
      document.cookie = `googtrans=/en/en; path=/; domain=.${hostname}`
    }

    // Automatically reload so all text nodes re-evaluate and render in Hindi/English
    window.location.reload()
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
