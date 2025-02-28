export const getNumberOfCompaniesToReturn = (role: string) => {
  switch (role) {
    case 'veridioner':
      return [10, 50, 100, 500, 1000, 5000]
    case 'admin':
      return [10, 50, 100, 500, 1000, 5000]
    default:
      return [10, 20, 30, 40, 50]
  }
}
