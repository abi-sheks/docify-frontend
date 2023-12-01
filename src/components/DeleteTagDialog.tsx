//React core imports
import { useState, useEffect } from 'react'

//Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';

//React router imports
import { Link } from 'react-router-dom';

//MUI imports
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Tooltip, Snackbar } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";

//Components imports
import { StyledButton, ErrorAlert } from ".";

//interfaces imports
import { DeleteTagProps } from '../interfaces'

//utils
import { checkLogin } from '../utils';


const DeleteTagDialog = ({ tag, deletionHook, deletionErrored }: DeleteTagProps) => {
    const dispatch = useDispatch()

    //fetch user token
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
            await deletionHook({ tagId: tag.id }).unwrap()
                .then((response: any) => { })
                .catch((error: any) => {
                    setDeletionErroredState(true)
                })

        } catch (err) {
            console.error(err)
        }
        setOpenState(false)
    }

    //whoami
    useEffect(() => {
        (async () => {

            await checkLogin(dispatch, userAdded)
        }
        )();
    }
        , [])

    //render conditions
    let iconDisplay = (tag.creator === currentUser.username) ? { display: 'block' } : { display: 'none' }


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="Delete">
                <IconButton onClick={handleOpen} sx={{
                    ...iconDisplay,
                    color: '#201634',
                }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={openState} onClose={handleCloseCancel} PaperProps={{
                sx: {
                    backgroundColor: '#dde3ea',
                    borderRadius: '1rem',
                }
            }}>
                <DialogTitle color="#41474d">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText color="#41474d">
                        <Typography>
                            Proceeding will permanently delete this tag.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <StyledButton variant='contained' onClick={handleCloseCancel}>Cancel</StyledButton>
                    <Button variant='contained' component={Link} to='/home/tags' onClick={handleCloseConfirm} sx={{
                        backgroundColor: '#006492',
                        color: '#ffffff'
                    }}>Confirm</Button>
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

export default DeleteTagDialog