export const WordsList = ({
  title,
  words,
}: {
  title: string
  words: string[]
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  )
}
