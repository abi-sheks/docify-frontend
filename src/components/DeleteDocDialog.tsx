import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import React, { useState } from 'react'

const DeleteDocDialog = ({ doc, deletionHook }: any) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleCloseCancel = () => {
        setOpen(false)
    }
    const handleCloseConfirm = async () => {
        try {
            await deletionHook(doc.slug).unwrap().then((response : any) => console.log(response)).catch((error : any) => console.log(error))
        } catch (err) {
            console.error(err)
        }
        setOpen(false)
    }
    return (
        <>
            <IconButton onClick={handleOpen}>
                <DeleteIcon />
            </IconButton>
            <Dialog open ={open} onClose={handleCloseCancel}>
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
        </>
    )
}

export default DeleteDocDialog
