import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { useEffect } from 'react'
import { useGetDocQuery } from '../features/api/apiSlice';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import 'quill/dist/quill.bubble.css'
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Box, Button, Typography } from '@mui/material';
import { StyledButton } from '../components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditingScreen = () => {
    const currentUser = useSelector((state: any) => state.user)
    const params = useParams()
    const docId: string | undefined = params.docId
    const access: string | undefined = params.access
    //bad paradigm probably
    let isReadOnly: boolean = true
    if (access === 'write') {
        isReadOnly = false
    }

    const { data: doc, isFetching, isSuccess } = useGetDocQuery({ docId: docId as string, token: currentUser.token })

    // let docId : string = 'new'
    const [value, setValue] = useState<string>('');
    const quillRef: any = useRef<number>(0)
    useEffect(() => {
        Quill.register('modules/cursors', QuillCursors);
        const quill = new Quill(document.getElementById("editor") as string | Element, {
            modules: {
                cursors: true,
            },
            readOnly: isReadOnly,
            theme: 'bubble',
            placeholder: "Start editing",
        })
        const ydoc = new Y.Doc()
        const ytext = ydoc.getText('quill')
        const binding = new QuillBinding(ytext, quill)
        const provider = new WebsocketProvider('ws://127.0.0.1:8000/ws/docs/', `${docId}`, ydoc)

        return () => {
            provider.disconnect();
            // ReactDOM.unmountComponentAtNode(document.getElementById('editor') as Element)
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
            padding : '2rem',
        }}>
            <Typography variant='h3' color='#1a1c1e' sx={{ fontWeight: '100', marginBottom : '1rem' }}>
                {isSuccess && doc.title}
            </Typography>
            <div style={{
                marginBottom : '1rem',
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
