import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Tooltip, Alert, Snackbar } from '@mui/material';
import { Doc } from '../interfaces';
import React, { useState } from 'react'
import { useSelector } from "react-redux";

interface DeleteDocProps {
    doc: Doc,
    deletionHook: any,
    deletionErrored: boolean
}
const DeleteDocDialog = ({ doc, deletionHook, deletionErrored }: DeleteDocProps) => {
    const currentUser = useSelector((state : any) => state.user)
    const [open, setOpen] = useState(false)
    const [deletionErroredState, setDeletionErroredState] = useState<boolean>(deletionErrored)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleCloseCancel = () => {
        setOpen(false)
    }
    const handleCloseConfirm = async () => {
        try {
            await deletionHook({docId : doc.id, token : currentUser.token}).unwrap().then((response: any) =>
                console.log(response)
            ).catch((error: any) => {
                console.log(error)
                setDeletionErroredState(true)
            })
        } catch (err) {
            console.error(err)
        }
        setOpen(false)
    }

    let iconDisplay = (doc.creator === currentUser.username) ? {display : 'block'} : {display : 'none'}
    return (
        <div>
            <Tooltip title="Delete">
                <IconButton onClick={handleOpen} sx={{
                    ...iconDisplay,
                     backgroundColor: 'white' 
                     }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>
                            Proceeding will permanently delete this document.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleCloseCancel}>Cancel</Button>
                    <Button variant='contained' onClick={handleCloseConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={deletionErroredState} onClose={() => setDeletionErroredState(false)}>
                <Alert severity="error">
                    There was an error deleting the doc.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default DeleteDocDialog
