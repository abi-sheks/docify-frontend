import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Tooltip, Alert, Snackbar } from '@mui/material';
import { Doc } from '../interfaces';
import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { StyledButton } from ".";
import ErrorAlert from "./ErrorAlert";

interface DeleteDocProps {
    doc: Doc,
    deletionHook: any,
    deletionErrored: boolean
}
const DeleteDocDialog = ({ doc, deletionHook, deletionErrored }: DeleteDocProps) => {
    const currentUser = useSelector((state: any) => state.user)
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
            await deletionHook({ docId: doc.id, token: currentUser.token }).unwrap().then((response: any) =>
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

    let iconDisplay = (doc.creator === currentUser.username) ? { display: 'block' } : { display: 'none' }
    return (
        <div>
            <Tooltip title="Delete">
                <IconButton onClick={handleOpen} sx={{
                    ...iconDisplay,
                    color: '#ffffff',
                }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleCloseCancel} PaperProps={{
                sx: {
                    borderRadius: '1rem',
                    backgroundColor: '#dde3ea'
                }
            }}>
                <DialogTitle color="#41474d">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText color="#41474d">
                        <Typography>
                            Proceeding will permanently delete this document.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <StyledButton variant='contained' onClick={handleCloseCancel}>Cancel</StyledButton>
                    <StyledButton variant='contained' onClick={handleCloseConfirm}>Confirm</StyledButton>
                </DialogActions>
            </Dialog>
            <Snackbar open={deletionErroredState} onClose={() => setDeletionErroredState(false)}>
                <ErrorAlert severity="error">
                    There was an error deleting the doc.
                </ErrorAlert>
            </Snackbar>
        </div>
    )
}

export default DeleteDocDialog
