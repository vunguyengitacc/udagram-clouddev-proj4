import { useAuth0 } from '@auth0/auth0-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Form, Input } from 'semantic-ui-react'
import { getTodoById, getUploadUrl, patchTodo, uploadFile } from '../api/todos-api'
import { RenderItem } from './RenderItem'

const UploadState = {
  NoUpload: 'NoUpload',
  FetchingPresignedUrl: 'FetchingPresignedUrl',
  UploadingFile: 'UploadingFile'
}

export function EditTodo() {

  function renderButton() {
    return (
      <div>
        {uploadState === UploadState.FetchingPresignedUrl && (
          <p>"Uploading image metadata"</p>
        )}
        {uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button loading={uploadState !== UploadState.NoUpload} type="submit">
          Upload
        </Button>
      </div>
    )
  }

  function handleFileChange(event) {
    const files = event.target.files
    if (!files) return

    setFile(files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      if (!file) {
        alert('File should be selected')
        return
      }

      setUploadState(UploadState.FetchingPresignedUrl)
      const accessToken = await getAccessTokenSilently({
        audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        scope: 'write:todos'
      })
      const uploadUrl = await getUploadUrl(accessToken, todoId)

      setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      setUploadState(UploadState.NoUpload)
    }
  }


  const [file, setFile] = useState(undefined)
  const [uploadState, setUploadState] = useState(UploadState.NoUpload)
  const { getAccessTokenSilently } = useAuth0()
  const { todoId } = useParams()
  const [todo, setTodo] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function foo() {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
          scope: 'read:todos'
        })
        console.log('Access token: ' + accessToken)
        const todoItem = await getTodoById(accessToken, todoId)
        setTodo(todoItem)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
        alert(`Failed to fetch todos: ${e.message}`)
      }
    }
    foo()
  }, [todoId])

  const handleEdit = useCallback(async () => {
    try {
      setIsLoading(true)
      const accessToken = await getAccessTokenSilently({
        audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        scope: 'write:todos'
      })
      await patchTodo(accessToken, todo.todoId, todo)      
      console.log(todo)
      alert('Update successfully')
    } catch (e) {
      alert('Could not update event: ' + e.message)
    } finally {
      setIsLoading(false)
    }


  }, [todo])

  return (
    <>
      <div style={{marginTop: 50}}>
        <h1>Edit task information</h1>
        {isLoading ?
          <RenderItem />
          :
          <Form onSubmit={handleEdit} style={{marginBottom: 50}}>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'edit',
                content: 'Task Name'
              }}
              fluid
              actionPosition="left"
              name='name'
              type='text'
              placeholder={todo.name}
              onChange={e => setTodo({ ...todo, name: e.target.value })} />
            <br />
            <Input
              action={{
                color: 'green',
                labelPosition: 'left',
                icon: 'check',
                content: 'Is Done'
              }}
              fluid
              actionPosition="left"
              name='done'
              type='checkbox'
              checked={todo.done}
              onChange={e => setTodo({ ...todo, done: e.target.checked })}
            />
            <br />
            <Input
              action={{
                color: 'orange',
                labelPosition: 'left',
                icon: 'check',
                content: 'Due Date'
              }}
              fluid
              actionPosition="left"
              name='done'
              type='date'
              value={todo.dueDate}
              onChange={e => setTodo({ ...todo, dueDate: e.target.value })}
            />
            <br/>
            <Button type="submit" >
              Update
            </Button>
          </Form>}
      </div>
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={handleFileChange}
            />
          </Form.Field>

          {renderButton()}
        </Form>
      </div>
    </>
  )
}
