//React core imports
import { useState } from 'react'

//MUI imports
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Tooltip, Snackbar } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";

//Redux imports
import { useSelector } from "react-redux";

//Components imports
import { StyledButton, ErrorAlert } from ".";

//interfaces imports
import { DeleteDocProps } from '../interfaces'

const DeleteDocDialog = ({ doc, deletionHook, deletionErrored }: DeleteDocProps) => {

    //fetches user token
    const currentUser = useSelector((state: any) => state.user)

    //state
    const [openState, setOpenState] = useState<boolean>(false)
    const [deletionErroredState, setDeletionErroredState] = useState<boolean>(deletionErrored)

    //Handlers
    const handleOpen = () => {
        setOpenState(true)
    }
    const handleCloseCancel = () => {
        setOpenState(false)
    }
    const handleCloseConfirm = async () => {
        try {
            await deletionHook({ docId: doc.id, token: currentUser.token }).unwrap().then((response: any) => {}
            ).catch((error: any) => {
                console.log(error)
                setDeletionErroredState(true)
            })
        } catch (err) {
            console.error(err)
        }
        setOpenState(false)
    }

    //render condition
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
            <Dialog open={openState} onClose={handleCloseCancel} PaperProps={{
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
