export const fetchDataFromDb = async <T>(apiUrl: string): Promise<T> => {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET'
    })
    if (response.ok) {
      const fetchedData = (await response.json()) as T

      return fetchedData
    } else {
      throw new Error('Response not OK')
    }
  } catch (error) {
    console.error('Upload error:', error)

    return [] as T
  }
}
