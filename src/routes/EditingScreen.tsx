import React, { useState } from 'react'
import { useEffect } from 'react'
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import 'quill/dist/quill.snow.css'





const EditingScreen = () => {
    let docId : string = 'new'
    const [value, setValue] = useState('');
    useEffect(() => {
        Quill.register('modules/cursors', QuillCursors);
        const quill = new Quill(document.getElementById("editor") as string | Element, {
            modules: {
                cursors: true,
            },
            theme: 'snow',
            placeholder: "Start editing",
        })
        const ydoc = new Y.Doc()
        const ytext = ydoc.getText('quill')
        const binding = new QuillBinding(ytext, quill)
        const provider = new WebsocketProvider('ws://127.0.0.1:8000/ws/docs/', `${docId}/`, ydoc)
    }, [docId])
    return (
        <div id="editor">
        </div>
    )
}

export default EditingScreen
