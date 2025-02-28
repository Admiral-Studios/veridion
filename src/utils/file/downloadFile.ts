export const downloadFile = (fileName: string, path: string) => {
  const fileURL = process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL + path : path
  const downloadLink = document.createElement('a')

  downloadLink.href = fileURL
  downloadLink.download = fileName
  downloadLink.click()
}
