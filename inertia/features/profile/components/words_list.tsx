import { GameNormalized } from '#shared/types/game_normalized'
import { useTranslation } from 'react-i18next'

interface WordsListProps {
  game: GameNormalized
}

export const WordsList = (props: WordsListProps) => {
  const { game } = props
  const { t } = useTranslation()

  const roleHint = (role: string, gameRole: string) => {
    if (role === gameRole) {
      return `(${t('global.you')})`
    }
    return ''
  }

  return (
    <div>
      <p>{t('profile.game.wordsList')}</p>
      <div className={'grid grid-cols-2'}>
        <div>
          <p className={'font-bold'}>
            {t('global.hintGiver')} {roleHint('hintGiver', game.role)}
          </p>
          {game.wordsList.hintGiver.map((word, index) => (
            <p key={`${game.id}-hintGiver-${index}`}>{word}</p>
          ))}
        </div>
        <div>
          <p className={'font-bold'}>
            {t('global.guesser')} {roleHint('guesser', game.role)}
          </p>
          {game.wordsList.guesser.map((word, index) => (
            <p key={`${game.id}-guesser-${index}`}>{word}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
