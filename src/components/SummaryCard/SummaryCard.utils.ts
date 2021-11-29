export const truncateDecimals = (text: string, decimals = 2): string => {
  if (!text) return ''

  const dotPlace = text.indexOf('.')

  if (dotPlace < 0) return text

  const lengthOfText = dotPlace + decimals + 1

  if (decimals <= 0) {
    return text.slice(0, dotPlace + 1)
  }

  if (text.length > lengthOfText) {
    return text.slice(0, lengthOfText)
  }

  if (text.length < lengthOfText) {
    return text.padEnd(lengthOfText, '0')
  }
  return text
}

export const addThousandSeparators = (text: string): string => {
  return text.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

export const getRepresentativeValue = (text: string, decimals = 2): string => {
  const truncatedText = truncateDecimals(text, decimals)
  return addThousandSeparators(truncatedText)
}
