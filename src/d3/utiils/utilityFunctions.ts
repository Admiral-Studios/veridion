//convert string to valid html id
export function toId(str: string) {
  if (str) {
    return str.toLowerCase().replace(/\W/g, '_')
  } else {
    return ''
  }
}

export function getAllPossibleCouples<T>(arr: T[]): [T, T][] {
  const couples: [T, T][] = []

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j) {
        couples.push([arr[i], arr[j]])
      }
    }
  }

  return couples
}
