import React from 'react'
import i18n from '~/services/i18n'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = React.useState<string>('en')

  React.useEffect(() => {
    const locale = document.cookie.split(';').find((cookie) => cookie.includes('locale'))
    if (locale) {
      const cookieLang = locale.split('=')[1]
      i18n.changeLanguage(cookieLang)
      setLanguage(cookieLang)
    } else {
      i18n.changeLanguage('en')
      document.cookie = 'locale=en;path=/'
      setLanguage('en')
    }
  }, [])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    document.cookie = `locale=${lang};path=/`
    setLanguage(lang)
  }

  return (
    <div className={'relative flex justify-center items-center h-screen w-screen'}>
      <div className={'absolute top-4 right-4 flex items-center'}>
        {language === 'en' ? (
          <img
            src={'/images/flags/united-states-of-america-flag.svg'}
            alt={'United States flag'}
            className={'h-[10px] w-auto'}
          />
        ) : (
          <img
            src={'/images/flags/france-flag.svg'}
            alt={'Drapeau français'}
            className={'h-[10px] w-auto'}
          />
        )}
        <select className={'p-2'} onChange={(e) => changeLanguage(e.target.value)} value={language}>
          <option value={'en'}>🇺🇸</option>
          <option value={'fr'}>🇫🇷</option>
        </select>
      </div>
      {children}
    </div>
  )
}
