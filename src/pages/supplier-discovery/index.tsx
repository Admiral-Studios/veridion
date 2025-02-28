import { SubjectTypes } from 'src/types/acl/subjectTypes'
import SupplierDiscoveryDemoScreen from 'src/views/apps/supplier_discovery/SupplierDiscoveryDemoScreen'

const SupplierDiscoveryDemo = () => {
  return <SupplierDiscoveryDemoScreen />
}

SupplierDiscoveryDemo.acl = {
  action: 'read',
  subject: SubjectTypes.SupplierDiscovery
}

export default SupplierDiscoveryDemo
