import { json } from '@codemirror/lang-json'
import { Alert, IconButton } from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { FC, useState } from 'react'
import Icon from 'src/@core/components/icon'

type Props = {
  jsonRes: string
  onChange: (v: string) => void
}

const NewJsonEditor: FC<Props> = ({ jsonRes, onChange }) => {
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (value: string) => {
    onChange(value)
    validateJson(value)
  }

  const validateJson = (value: string) => {
    try {
      JSON.parse(value)

      setErrorMessage('')
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return (
    <>
      {errorMessage && (
        <Alert
          severity='error'
          sx={{ mb: 4 }}
          action={
            <IconButton size='small' color='inherit' aria-label='close' onClick={() => setErrorMessage('')}>
              <Icon icon='tabler:x' />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      )}

      <CodeMirror
        value={jsonRes}
        height='500px'
        extensions={[json()]}
        theme='light'
        onChange={handleChange}
        basicSetup={{ lineNumbers: true, foldGutter: true }}
        className='json-editor'
        autoFocus
      />
    </>
  )
}

export default NewJsonEditor
