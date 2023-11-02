import React from 'react'
import { useState } from 'react';
import { useAddNewTagMutation, useGetUsersQuery } from '../features/api/apiSlice';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText, SelectChangeEvent, Typography, Snackbar, Alert } from '@mui/material';
import { slugify } from '../utils/slugify';
import { Tag } from '../interfaces';
import { useSelector } from 'react-redux';
//need to refactor these props but its a pain in the ass. bunch of undefined property reads will happen and need to be properly handled.
interface CreateTagProps {
    hook: any,
    isLoading: any,
    message: string,
    mutateErrored: boolean,
    canMutate: boolean,
    tag : Tag | undefined,
}
const CreateTagDialog = ({ canMutate, hook, mutateErrored, isLoading, message, tag }: CreateTagProps) => {
    const currentUser = useSelector((state: any) => state.user)
    let createMode: boolean = false
    if (tag === undefined) {
        createMode = true;
    }
    if (createMode) {
        canMutate = true
    }
    let oldSlug : any
    if(!tag) {
        oldSlug = undefined
    }
    else {
        oldSlug = slugify(tag.name)
    }
    // const oldSlug = tagName != '' ? slugify(tagName) : undefined;
    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>()
    const [members, setMembers] = useState<string[]>()
    const [mutationErroredState, setMutationErroredState] = useState<boolean>(mutateErrored)
    // const [addNewTag, { isLoading }] = useAddNewTagMutation()
    const {
        data: users = [],
        isSuccess: UserSuccess,
        isError: userFetchErrored,
        error: userFetchError,
    } = useGetUsersQuery(currentUser.token)

    const userList = UserSuccess && users.map((user: any) => {
        return (
            <MenuItem key={user.user.username} value={user.user.username}>
                {user.user.username}
            </MenuItem>
        )
    })
    const nameEmpty = [name].every(Boolean)
    const canSave = nameEmpty && !isLoading
    const handleOpen = () => {
        if(!tag){
            setName('')
            setMembers([currentUser.username])
            setOpen(true)
        }
        else
        {
            setName(tag.name)
            setMembers(tag.users)
            setOpen(true)
        }
    }
    const handleCloseCancel = () => {
        setOpen(false);
    }
    const handleMemberChange = (e: SelectChangeEvent<string[]>) => {
        const { target: { value } } = e;
        setMembers(typeof value === "string" ? value.split(',') : value);
        console.log(members)
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    const handleCloseSubmit = async () => {
        if (canSave) {
            try {
                let slug
                if (createMode) {
                    slug = slugify(name)
                    await hook({ tag: { name: name, users: members, slug: slug, creator: currentUser.username }, token: currentUser.token }).unwrap().then(
                        (response: any) => {
                            console.log(response)
                        }
                    ).catch((error: any) => {
                        setMutationErroredState(true)
                    })
                } else {
                    slug = oldSlug
                    //can do tag? because this can only run if tag already exists.
                    await hook({ tag: { name: name, users: members, slug: slug, id: tag?.id, creator: tag?.creator }, token: currentUser.token }).unwrap().then(
                        (response: any) => {
                            console.log(response)
                        }
                    ).catch((error: any) => {
                        setMutationErroredState(true)
                    })
                }
            } catch (err) {
                console.error(err)
            }
            setOpen(false)
        }

    }

    let buttonDisplay = canMutate ? {display : 'block'} : {display : 'none'}
    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button variant='contained' onClick={handleOpen} sx={{
                ...buttonDisplay,
                marginLeft: "3rem",
                width: "40%",
            }} >{message}</Button>
            <Dialog open={open} onClose={handleCloseCancel} fullWidth PaperProps={{
                sx: {
                    height: '70%',
                    borderRadius: '1rem',
                    backgroundColor: '#262626',
                }
            }}>
                <DialogTitle color='white' textAlign='center'>Create a new tag</DialogTitle>
                <DialogContent>
                    <DialogContentText color='white'>
                        Enter the name of your new tag
                    </DialogContentText>
                    <TextField
                        margin='dense'
                        id='name'
                        label='Name...'
                        fullWidth
                        variant='outlined'
                        value={name}
                        onChange={handleNameChange}
                        sx={{ backgroundColor: 'white', borderRadius: '1rem' }}
                    />
                    <DialogContentText color='white'>
                        Add some members to your tag
                    </DialogContentText>
                    <Select multiple value={members} onChange={handleMemberChange} sx={{ backgroundColor: 'white' }}>
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
                    <Button variant="contained" onClick={handleCloseCancel} disabled={isLoading}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseSubmit} disabled={isLoading}>Submit</Button>
                </DialogActions>
                <Typography textAlign='center' display={nameEmpty ? 'none' : 'block'} color='red'>Please give your tag a name</Typography>
                <Typography textAlign='center' display={userFetchErrored ? 'block' : 'none'} color='red'>There was an error fetching the users</Typography>
            </Dialog>
            <Snackbar open={mutationErroredState} onClose={() => setMutationErroredState(false)}>
                <Alert severity="error">
                    There was an error creating the tag.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default CreateTagDialog;
