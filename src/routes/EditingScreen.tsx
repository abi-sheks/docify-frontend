import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { useEffect } from 'react'
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import 'quill/dist/quill.bubble.css'
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';



const EditingScreen = () => {
    const params = useParams()
    const docId : any = params.docId
    // let docId : string = 'new'
    const [value, setValue] = useState('');
    const quillRef : any = useRef(0)
    useEffect(() => {
        Quill.register('modules/cursors', QuillCursors);
        const quill = new Quill(document.getElementById("editor") as string | Element, {
            modules: {
                cursors: true,
            },
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
            height : '80%',
        }}>
            <div ref={quillRef} id="editor">
            </div>
        </Container>
    )
}

export default EditingScreen
