import { FC, memo } from 'react'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

const JsonEditor: FC<{ handleChange: (v: string) => void; placeholder: any }> = memo(
  ({ handleChange, placeholder }) => {
    return (
      <JSONInput
        id='json-editor'
        locale={locale}
        placeholder={placeholder}
        onKeyPressUpdate={false}
        height='550px'
        width='100%'
        colors={{
          background: '#fff',
          default: '#000',
          string: '#000',
          keys: '#FBB03B'
        }}
        style={{
          container: {
            borderRadius: '8px'
          }
        }}
        onChange={(e: any) => {
          if (e.json && e.jsObject) {
            handleChange(e.json)
          } else {
            handleChange(JSON.stringify({}))
          }
        }}
      />
    )
  }
)

export default JsonEditor
