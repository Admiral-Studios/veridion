export function addThousandsDelimiter(number: number) {
  const numStr = number.toString()

  const numArray = numStr.split('')

  let result = ''

  for (let i = 0; i < numArray.length; i++) {
    result += numArray[i]

    if ((numArray.length - i - 1) % 3 === 0 && i !== numArray.length - 1) {
      result += ','
    }
  }

  return result
}
