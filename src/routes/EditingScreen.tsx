//React imports
import { useRef, useState, useEffect } from 'react'

//RTK Query imports
import { useGetDocQuery } from '../features/api/apiSlice';

//Redux imports
import { useSelector } from 'react-redux';

//React Router imports
import { useParams, Link } from 'react-router-dom';

//MUI imports 
import { Button, Typography, Container } from '@mui/material';

//quill imports
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'

//yjs imports
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';


const EditingScreen = () => {
    //selector hook (holds token needed for API requests)
    const currentUser = useSelector((state: any) => state.user)

    //params hook and top level logic
    const params = useParams()
    const docId: string | undefined = params.docId
    const access: string | undefined = params.access
    let isReadOnly: boolean = true
    if (access === 'write') {
        isReadOnly = false
    }

    //RTK Query hook
    const { data: doc, isFetching, isSuccess } = useGetDocQuery({ docId: docId as string, token: currentUser.token })

    //Side effects
    const quillRef: any = useRef<number>(0)
    useEffect(() => {

        Quill.register('modules/cursors', QuillCursors);
        
        //hack to fix toolbar duplication
        const actualEditor = document.createElement('div')
        quillRef.current.append(actualEditor)

        //instantiates quill
        const quill = new Quill(actualEditor as string | Element, {
            modules: {
                cursors: true,
            },
            readOnly: isReadOnly,
            theme: 'snow',
            placeholder: "Start editing",
        })

        //creates ydoc and binds to quill instance, communicates document state to peers and server
        const ydoc = new Y.Doc()
        const ytext = ydoc.getText('quill')
        const binding = new QuillBinding(ytext, quill)
        const provider = new WebsocketProvider('ws://127.0.0.1:8000/ws/docs/', `${docId}`, ydoc)

        //runs on unmount
        return () => {
            provider.disconnect();
        }
    }, [])


    return (
        <Container sx={{
            height: '100%',
            backgroundColor: '#ffffff',
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
        }}>
            <Typography variant='h3' color='#1a1c1e' sx={{ fontWeight: '100', marginBottom: '1rem' }}>
                {isSuccess && doc.title}
            </Typography>
            <div style={{
                marginBottom: '1rem',
            }} ref={quillRef} id="editor">
            </div>
            <Button variant='contained' component={Link} to='/home/docs' sx={{
                backgroundColor: '#006492',
                color: '#ffffff'
            }}>Back</Button>
        </Container>
    )
}

export default EditingScreen
