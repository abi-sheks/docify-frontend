import React from 'react'
import { useState } from 'react';
import { useAddNewTagMutation, useGetUsersQuery  } from '../features/api/apiSlice';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText } from '@mui/material';
import { slugify } from '../utils/slugify';
const CreateTagDialog = ({memberList, tagName, hook, isLoading, message, id} : any) => {
    let createMode = false
    if(tagName === '' || id === undefined) {
        createMode = true;
    }
    const oldSlug = tagName != '' ? slugify(tagName) : undefined;
    const [open, setOpen] = useState(false)
    console.log(typeof memberList)
    console.log(typeof tagName)
    const [name, setName] = useState<string>()
    const [members, setMembers] = useState<string[]>()
    // const [addNewTag, { isLoading }] = useAddNewTagMutation()
    const {
        data: users = [],
        isSuccess : UserSuccess,
    } = useGetUsersQuery()

    const userList = UserSuccess && users.map((user : any) => {
        return (
            <MenuItem key={user.user.username} value={user.user.username}>
                {user.user.username}
            </MenuItem>
        )
    })
    const canSave = [name, members].every(Boolean) && !isLoading
    const handleOpen = () => {
        setName(tagName)
        setMembers(memberList)
        setOpen(true)
    }
    const handleCloseCancel = () => {
        setOpen(false);
    }
    const handleMemberChange = (e: any) => {
        const { target: { value } } = e;
        setMembers(typeof value === "string" ? value.split(',') : value);
        console.log(members)
    }
    const handleNameChange = (e: any) => {
        setName(e.target.value);
    }
    const handleCloseSubmit = async () => {
        if (canSave) {
            try {
                let slug
                if(createMode) {
                    slug = slugify(name)
                    await hook({ name: name, users: members, slug : slug}).unwrap().then((response : any) => console.log(response)).catch((error : any) => console.log(error))
                    setName('')
                    setMembers([])
                } else {
                    slug = oldSlug
                    await hook({ name: name, users: members, slug : slug, id : id}).unwrap().then((response : any) => console.log(response)).catch((error : any) => console.log(error))
                    setName('')
                    setMembers([])
                }
            } catch (err) {
                console.error(err)
            }
        }
        setOpen(false);
    }
    return (
        <>
            <Button variant='contained' onClick={handleOpen} sx={{
                marginLeft: "3rem",
                marginBottom: "4rem",
                width: "60%",
            }}>{message}</Button>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle>Create a new tag</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of your new tag
                    </DialogContentText>
                    <TextField
                        margin='dense'
                        id='name'
                        label='Name...'
                        fullWidth
                        variant='standard'
                        value={name}
                        onChange={handleNameChange}
                    />
                    <DialogContentText>
                        Add some members to your tag
                    </DialogContentText>
                    <Select multiple value={members} onChange={handleMemberChange}>
                        {userList}
                    </Select>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button variant="contained" onClick={handleCloseCancel} disabled={isLoading}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseSubmit} disabled={isLoading}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreateTagDialog;
