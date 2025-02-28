export const uploadFile = async (file: File, expectedHeaders?: string[]) => {
  const formData = new FormData()
  formData.append('csvFile', file)

  const response = await fetch(
    expectedHeaders ? `/api/utils/upload_file?expected=${expectedHeaders.join(',')}` : '/api/utils/upload_file',
    {
      method: 'POST',
      body: formData
    }
  )

  return response
}
