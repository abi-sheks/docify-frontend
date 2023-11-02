import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Tooltip, Snackbar, Alert } from '@mui/material';
import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Tag } from "../interfaces";

interface DeleteTagProps {
    tag: Tag,
    deletionHook: any,
    deletionErrored : boolean
}

const DeleteTagDialog = ({ tag, deletionHook, deletionErrored }: DeleteTagProps) => {
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
            await deletionHook({ tagId : tag.id, token : currentUser.token}).unwrap()
            .then((response: any) => console.log(response))
            .catch((error : any) => {
                setDeletionErroredState(true)
            })

        } catch (err) {
            console.error(err)
        }
        setOpen(false)
    }
    let iconDisplay = (tag.creator === currentUser.username) ? {display : 'block'} : {display : 'none'}

    return (
        <div style={{display : 'flex',alignItems : 'center', justifyContent : 'center'}}>
            <Tooltip title="Delete">
                <IconButton onClick={handleOpen} sx={{
                    ...iconDisplay,
                    backgroundColor : 'white',
                }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>
                            Proceeding will permanently delete this tag.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleCloseCancel}>Cancel</Button>
                    <Button variant='contained' component={Link} to='/home/tags' onClick={handleCloseConfirm}>Confirm</Button>
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

export default DeleteTagDialog