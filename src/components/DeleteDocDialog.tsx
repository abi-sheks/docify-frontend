import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Tooltip } from '@mui/material';
import { Doc } from '../interfaces';
import React, { useState } from 'react'

interface DeleteDocProps {
    doc: Doc,
    deletionHook: any,
}
const DeleteDocDialog = ({ doc, deletionHook }: DeleteDocProps) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleCloseCancel = () => {
        setOpen(false)
    }
    const handleCloseConfirm = async () => {
        try {
            await deletionHook(doc.id).unwrap().then((response: any) => console.log(response)).catch((error: any) => console.log(error))
        } catch (err) {
            console.error(err)
        }
        setOpen(false)
    }
    return (
        <div>
            <Tooltip title="Delete">
                <IconButton onClick={handleOpen} sx={{backgroundColor : 'white'}}>
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
        </div>
    )
}

export default DeleteDocDialog
