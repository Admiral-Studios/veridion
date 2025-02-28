import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import SavedProducts from 'src/views/apps/saved_products/SavedProducts'

const SavedProductsPage = () => {
  return <SavedProducts />
}

SavedProductsPage.acl = {
  action: 'read',
  subject: SubjectTypes.SavedProductsPage
}

export default SavedProductsPage
