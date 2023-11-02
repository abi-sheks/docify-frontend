import React, { useState } from 'react';
import { useAddNewDocMutation, useGetTagsQuery } from '../features/api/apiSlice';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText, SelectChangeEvent, Snackbar, Alert, Typography } from '@mui/material';
import { StyledButton } from '.';
import { slugify } from '../utils/slugify';
import { Doc } from '../interfaces';
import { useSelector } from 'react-redux';
import ErrorAlert from './ErrorAlert';

interface CreateDocProps {
  message: string,
  hook: any,
  isLoading: any,
  mutateErrored: boolean,
  doc: Doc | undefined,
  canEditReaders : boolean,
  canEditWriters : boolean,
}

const CreateDocDialog = ({hook, mutateErrored, isLoading, message, doc, canEditReaders, canEditWriters }: CreateDocProps) => {
  let createMode: boolean = false
  if (!doc) {
    createMode = true;
  }
  if (createMode) {
    canEditWriters = true
    canEditReaders = true
}
  let oldSlug: any
  if (!doc) {
    oldSlug = undefined
  }

  else {
    oldSlug = slugify(doc.title)
  }
  const currentUser = useSelector((state: any) => state.user)
  const [open, setOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [readers, setReaders] = useState<string[]>([])
  const [writers, setWriters] = useState<string[]>([])
  const [mutationErroredState, setMutationErroredState] = useState<boolean>(mutateErrored)

  const titleEmpty = [title].every(Boolean)
  const canSave = titleEmpty && !isLoading

  const {
    data: tags = [],
    isLoading: tagsLoading,
    isFetching,
    isSuccess,
    isError: tagsFetchErrored,
    error: tagsFetchError,
  } = useGetTagsQuery(currentUser.token)

  const tagList = isSuccess && tags.map((tag: any) => {
    return (
      <MenuItem key={tag.id} value={tag.name}>{tag.name}</MenuItem>
    )
  })

  const handleOpen = () => {
    if (!doc) {
      setReaders([])
      setWriters([])
      setTitle('')
    }
    else {
      setReaders(doc.read_tags)
      setWriters(doc.write_tags)
      setTitle(doc.title)
    }
    setOpen(true)
  }
  const handleCloseCancel = () => {
    setOpen(false);
  }
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }
  const handleReadersChange = (e: SelectChangeEvent<string[]>) => {
    const { target: { value } } = e;
    setReaders(typeof value === "string" ? value.split(',') : value);
  }
  const handleWritersChange = (e: SelectChangeEvent<string[]>) => {
    const { target: { value } } = e;
    const currWriters = typeof value === "string" ? value.split(',') : value
    let readersJustAdded: Array<string> = []
    currWriters.forEach((writer: string) => {
      if (readers.indexOf(writer) === -1) {
        readersJustAdded.push(writer)
      }
    })
    let newReaders = [...readers, ...readersJustAdded]
    setWriters(currWriters);
    setReaders(newReaders)
  }
  const handleCloseSubmit = async () => {
    if (canSave) {
      try {
        let slug
        if (createMode) {
          slug = slugify(title)
          await hook({ doc: { title: title, read_tags: readers, write_tags: writers, slug: slug, creator: currentUser.username}, token: currentUser.token }).unwrap().
            then((response: any) => {
              console.log(response)
              setReaders([])
              setWriters([])
            }).catch((error: any) => {
              setMutationErroredState(true)
            })
        } else {
          slug = oldSlug
          //doc? works because doc must exist for this to run
          await hook({ doc: { title: title, read_tags: readers, write_tags: writers, slug: slug, id: doc?.id, creator : doc?.creator}, token: currentUser.token }).unwrap().
            then((response: any) => {
              console.log(response)
              setReaders([])
              setWriters([])
            }).catch((error: any) => {
              setMutationErroredState(true)
            })
        }
      }
      catch (error) {
        console.log(error)
      }
      setOpen(false)
    }
  }

  let readSelectDisplay = canEditReaders ? {display : 'block'} : {display : 'none'}
  let writeSelectDisplay = canEditWriters ? {display : 'block'} : {display : 'none'}
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <StyledButton variant='contained' onClick={handleOpen} sx={{
        // marginLeft: "3rem",
        // marginBottom: "4rem",
        width: "80%",
      }}>{message}</StyledButton>
      <Dialog open={open} onClose={handleCloseCancel} fullWidth PaperProps={{
        sx: {
          height: '70%',
          borderRadius: '1rem',
          backgroundColor: '#dde3ea'
        }
      }}>
        <DialogTitle color='#41474d' sx={{ fontWeight: '300' }}>Create a new doc</DialogTitle>
        <div style={{padding : '1rem'}}>
          <Typography color='#41474d' sx={{ fontWeight: '100' }}>
            Enter the docs title
          </Typography>
          <TextField
            margin='dense'
            id='title'
            label='Title...'
            value={title}
            fullWidth
            variant='outlined'
            onChange={handleTitleChange}
            sx={{ backgroundColor: 'white'}}
          />
          <Typography display={canEditReaders ? 'block' : 'none'} color='#41474d' sx={{ fontWeight: '100' }}>
            Choose which tags have access to read the document
          </Typography>
          <Select multiple value={readers} onChange={handleReadersChange} sx={{ 
            ...readSelectDisplay,
            backgroundColor: 'white'
             }}>
            {tagList}
          </Select>
          <Typography display={canEditWriters ? 'block' : 'none'} color='#41474d' sx={{ fontWeight: '100' }}>
            Choose which tags have access to edit the document
          </Typography>
          <Select multiple value={writers} onChange={handleWritersChange} sx={{
            ...writeSelectDisplay,
             backgroundColor: 'white' }}>
            {tagList}
          </Select>
        </div>
        <DialogActions sx={{
          displat: 'flex',
          justifyContent: 'center',
        }}>
          <StyledButton variant='contained' onClick={handleCloseCancel}>Cancel</StyledButton>
          <StyledButton variant='contained' onClick={handleCloseSubmit}>Submit</StyledButton>
        </DialogActions>
        <Typography textAlign='center' display={titleEmpty ? 'none' : 'block'} color='#ba1a1a'>Please give your doc a name</Typography>
        <Typography textAlign='center' display={tagsFetchErrored ? 'block' : 'none'} color='#ba1a1a'>There was an error fetching the tags</Typography>
      </Dialog>
      <Snackbar open={mutationErroredState} onClose={() => setMutationErroredState(false)}>
        <ErrorAlert severity='error'>
          There was an error creating the doc.
        </ErrorAlert>
      </Snackbar>
    </div>
  )
}

export default CreateDocDialog
