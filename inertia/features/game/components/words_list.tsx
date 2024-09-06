export const WordsList = ({ title, words }: { title: string; words: string[] }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {words.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
