export const handleFileDownload = (file = 'upload_sample_data') => {
  const csvFilePath = `/data_samples/${file}.csv`
  const fileURL = process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL + csvFilePath : csvFilePath
  const downloadLink = document.createElement('a')

  downloadLink.href = fileURL
  downloadLink.download = `${file}.csv`
  downloadLink.click()
}
