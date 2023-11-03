//React imports
import React, {useState} from 'react'

//RTK query imports
import { useGetUsersQuery } from '../features/api/apiSlice';

//Redux imports
import { useSelector } from 'react-redux';

//MUI imports
import { Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText, SelectChangeEvent, Typography, Snackbar } from '@mui/material';

//Components imports
import { StyledButton, ErrorAlert } from '.';

//utils imports
import { slugify } from '../utils';

//interface imports
import { CreateTagProps } from '../interfaces'


const CreateTagDialog = ({ canMutate, hook, mutateErrored, isLoading, message, tag }: CreateTagProps) => {

    //fetches token state
    const currentUser = useSelector((state: any) => state.user)

    //silly top level logic
    let createMode: boolean = false
    if (tag === undefined) {
        createMode = true;
    }
    if (createMode) {
        canMutate = true
    }
    let oldSlug: string | undefined
    if (!tag) {
        oldSlug = undefined
    }
    else {
        oldSlug = slugify(tag.name)
    }

    //RTK Query hooks
    const {
        data: users = [],
        isSuccess: UserSuccess,
        isError: userFetchErrored,
    } = useGetUsersQuery(currentUser.token)

    //state
    const [openState, setOpenState] = useState<boolean>(false)
    const [nameState, setNameState] = useState<string>()
    const [membersState, setMembersState] = useState<string[]>()
    const [mutationErroredState, setMutationErroredState] = useState<boolean>(mutateErrored)

    //submission check
    const nameEmpty = [nameState].every(Boolean)
    const canSave = nameEmpty && !isLoading

    //Handlers
    const handleOpen = () => {
        if (!tag) {
            setNameState('')
            setMembersState([currentUser.username])
            setOpenState(true)
        }
        else {
            setNameState(tag.name)
            setMembersState(tag.users)
            setOpenState(true)
        }
    }
    const handleCloseCancel = () => {
        setOpenState(false);
    }
    const handleMemberChange = (e: SelectChangeEvent<string[]>) => {
        const { target: { value } } = e;
        setMembersState(typeof value === "string" ? value.split(',') : value);
        console.log(membersState)
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameState(e.target.value);
    }
    const handleCloseSubmit = async () => {
        if(canSave) {
            try {
                let slug

                if (createMode) {

                    slug = slugify(nameState)
                    await hook({ tag: { name: nameState, users: membersState, slug: slug, creator: currentUser.username }, token: currentUser.token }).unwrap().then(
                        (response: any) => {
                        }
                    ).catch((error: any) => {
                        setMutationErroredState(true)
                    })

                } else {

                    slug = oldSlug
                    //can do tag? because this can only run if tag already exists.
                    await hook({ tag: { name: nameState, users: membersState, slug: slug, id: tag?.id, creator: tag?.creator }, token: currentUser.token }).unwrap().then(
                        (response: any) => {
                        }
                    ).catch((error: any) => {
                        setMutationErroredState(true)
                    })

                }
            } catch (err) {
                console.error(err)
            }
            setOpenState(false)
        }

    }

    let buttonDisplay = canMutate ? { display: 'block' } : { display: 'none' }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <StyledButton variant='contained' onClick={handleOpen} sx={{
                ...buttonDisplay,
                marginLeft: "3rem",
                width: "40%",
            }} >{message}</StyledButton>
            <Dialog open={openState} onClose={handleCloseCancel} fullWidth PaperProps={{
                sx: {
                    height: '70%',
                    borderRadius: '1rem',
                    backgroundColor: '#dde3ea',
                    padding: '1rem',
                }
            }}>
                <DialogTitle color='#41474d' textAlign='center'>Create a new tag</DialogTitle>
                <DialogContent>
                    <DialogContentText color='#41474d'>
                        Enter the name of your new tag
                    </DialogContentText>
                    <TextField
                        margin='dense'
                        id='name'
                        label='Name...'
                        fullWidth
                        variant='outlined'
                        value={nameState}
                        onChange={handleNameChange}
                        sx={{ backgroundColor: 'white', borderRadius: '1rem' }}
                    />
                    <DialogContentText color='#41474d'>
                        Add some members to your tag
                    </DialogContentText>
                    <Select multiple value={membersState} onChange={handleMemberChange} sx={{ backgroundColor: 'white' }}>
                        {UserSuccess && users.map((user: any) => {
                            return (
                                <MenuItem key={user.user.username} value={user.user.username}>
                                    {user.user.username}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <StyledButton variant="contained" onClick={handleCloseCancel} disabled={isLoading}>Cancel</StyledButton>
                    <StyledButton variant="contained" onClick={handleCloseSubmit} disabled={isLoading}>Submit</StyledButton>
                </DialogActions>
                <Typography textAlign='center' display={nameEmpty ? 'none' : 'block'} color='#ba1a1a'>Please give your tag a name</Typography>
                <Typography textAlign='center' display={userFetchErrored ? 'block' : 'none'} color='#ba1a1a'>There was an error fetching the users</Typography>
            </Dialog>
            <Snackbar open={mutationErroredState} onClose={() => setMutationErroredState(false)}>
                <ErrorAlert severity="error">
                    There was an error creating the tag.
                </ErrorAlert>
            </Snackbar>
        </div>
    )
}

export default CreateTagDialog;
