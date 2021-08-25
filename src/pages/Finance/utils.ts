export function capitalise_first(string: string | undefined) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1)
  else return ''
}

export function capitalise_words(string: string | undefined) {
  if (string)
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  else return ''
}
