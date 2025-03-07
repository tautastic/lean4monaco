import { useEffect, useRef, useContext, useState } from 'react'
import { LeanMonacoEditor } from 'lean4monaco'
import { LeanMonacoContext } from './LeanMonaco'
import { RpcConnectParams } from '@leanprover/infoview'

function LeanMonacoEditorComponent({fileName, value}: {fileName: string, value: string}) {
  const codeviewRef = useRef<HTMLDivElement>(null)
  const leanMonaco = useContext(LeanMonacoContext)
  const [editor, setEditor] = useState<LeanMonacoEditor|null>(null)

  // You can start multiple `LeanMonacoEditor` instances
  useEffect(() => {
    if (leanMonaco) {
      const leanMonacoEditor = new LeanMonacoEditor()

      ;(async () => {
        await leanMonaco!.whenReady
        console.debug('[demo]: starting editor')
        await leanMonacoEditor.start(codeviewRef.current!, fileName, value)
        console.debug('[demo]: editor started')
        setEditor(leanMonacoEditor)
      })()

      return () => {
        leanMonacoEditor.dispose()
      }
    }
  }, [leanMonaco])

  return <>
    <div className='codeview' ref={codeviewRef}></div>
    <button onClick={() => {
      const uri = editor?.editor.getModel()?.uri?.toString()
      if (uri) {
        const client = leanMonaco?.clientProvider?.getClients()?.[0]
        client?.sendNotification('lean4monaco/test', { uri })
        client?.sendRequest('lean4monaco/test', { uri }).catch(
          reason => { console.log(`Request is not implemented: ${reason}`)}
        )
      } else {console.log('uri is not defined yet.')}
    }}>
      Sample Rpc Notification
    </button>

  </>
}

export default LeanMonacoEditorComponent
