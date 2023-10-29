import React from 'react'
import { useState } from 'react';
import { useAddNewTagMutation, useGetUsersQuery } from '../features/api/apiSlice';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText, SelectChangeEvent } from '@mui/material';
import { slugify } from '../utils/slugify';
import { Tag } from '../interfaces';
interface CreateTagProps {
    memberList: Array<string>,
    tagName: string,
    hook: any,
    isLoading: any,
    message: string,
    id: string | undefined,
}
const CreateTagDialog = ({ memberList, tagName, hook, isLoading, message, id }: CreateTagProps) => {
    let createMode: boolean = false
    if (tagName === '' || id === undefined) {
        createMode = true;
    }
    const oldSlug = tagName != '' ? slugify(tagName) : undefined;
    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>()
    const [members, setMembers] = useState<string[]>()
    // const [addNewTag, { isLoading }] = useAddNewTagMutation()
    const {
        data: users = [],
        isSuccess: UserSuccess,
    } = useGetUsersQuery()

    const userList = UserSuccess && users.map((user: any) => {
        console.log(user)
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
                    await hook({ name: name, users: members, slug: slug }).unwrap().then((response: any) => console.log(response))
                    setName('')
                    setMembers([])
                } else {
                    slug = oldSlug
                    await hook({ name: name, users: members, slug: slug, id: id }).unwrap().then((response: any) => console.log(response))
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
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button variant='contained' onClick={handleOpen} sx={{
                marginLeft: "3rem",
                width: "40%",
            }}>{message}</Button>
            <Dialog open={open} onClose={handleCloseCancel} fullWidth PaperProps={{
                sx: {
                    height: '70%',
                    borderRadius : '1rem',
                    backgroundColor : '#262626'
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
                        sx={{backgroundColor : 'white', borderRadius : '1rem'}}
                    />
                    <DialogContentText color='white'>
                        Add some members to your tag
                    </DialogContentText>
                    <Select multiple value={members} onChange={handleMemberChange}>
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
            </Dialog>
        </div>
    )
}

export default CreateTagDialog;
