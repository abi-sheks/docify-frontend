import React from 'react'
import { useState } from 'react';
import { useAddNewTagMutation } from '../features/api/apiSlice';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText } from '@mui/material';
const CreateTagDialog = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState<string>('')
    const [members, setMembers] = useState<string[]>([])
    const [addNewTag, { isLoading }] = useAddNewTagMutation()

    const canSave = [name, members].every(Boolean) && !isLoading
    const handleOpen = () => {
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
                await addNewTag({ name: name, users: members }).unwrap().then(response => console.log(response)).catch(error => console.log(error))
                setName('')
                setMembers([])
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
            }}>Create Tag</Button>
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
                        onChange={handleNameChange}
                    />
                    <DialogContentText>
                        Add some members to your tag
                    </DialogContentText>
                    <Select multiple value={members} onChange={handleMemberChange}>
                        <MenuItem key="datboi" value="datboi">datboi </MenuItem>
                        <MenuItem key="Ashwanth" value="Ashwanth">Ashwanth </MenuItem>
                        <MenuItem key="Krithiga" value="Krithiga">Krithiga </MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button variant="contained" onClick={handleCloseCancel}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreateTagDialog;
