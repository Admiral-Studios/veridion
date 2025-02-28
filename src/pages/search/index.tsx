import { SubjectTypes } from 'src/types/acl/subjectTypes'
import SearchPageScreen from 'src/views/apps/product_search/ProductSearchScreen'

const SearchPage = () => {
  return <SearchPageScreen />
}

SearchPage.acl = {
  action: 'read',
  subject: SubjectTypes.SearchPage
}

export default SearchPage
