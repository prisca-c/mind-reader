import React from 'react'
import i18n from '~/features/i18n/i18n'
import { Container } from '~/features/utils/components/container'

export const Header = () => {
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

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang)
    document.cookie = `locale=${lang};path=/`
    setLanguage(lang)
  }

  return (
    <Container justify={'end'} direction={'row'} gap={4} className={'absolute top-4 right-4 z-1'}>
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
    </Container>
  )
}
