import { SubjectTypes } from 'src/types/acl/subjectTypes'
import VeridionInExcel from 'src/views/apps/veridion-in-excel/VeridionInExcel'

const VeridionInExcelPage = () => {
  return <VeridionInExcel />
}

VeridionInExcelPage.acl = {
  action: 'read',
  subject: SubjectTypes.VeridionInExcel
}

export default VeridionInExcelPage
