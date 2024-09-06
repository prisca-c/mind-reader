export function findURLs(message: string) {
  const urlRegex =
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

  message = message.replace(/[\n\r]/g, ' ') // remove new lines
  const words = message.split(' ') // split by space
  const urls = words.filter((word) => urlRegex.test(word)) // filter out urls

  return urls
}

export function replaceURLs(message: string, replaceMessage?: string) {
  const urls = findURLs(message)

  if (!urls.length) return message

  replaceMessage = replaceMessage || '[URL]'

  urls.forEach((url) => {
    message = message.replace(url, replaceMessage)
  })

  return message
}

export function normalizeLatin(string: string) {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
