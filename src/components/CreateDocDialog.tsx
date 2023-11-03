//React import
import React, { useState } from 'react';

//RTK Query import
import { useGetTagsQuery } from '../features/api/apiSlice';

//Redux imports
import { useSelector } from 'react-redux';

//MUI import
import { Dialog, DialogTitle, DialogActions, TextField, Select, MenuItem, SelectChangeEvent, Snackbar, Typography, FormControl, FormGroup, FormControlLabel, Switch } from '@mui/material';

//components imports
import { StyledButton, ErrorAlert } from '.';

//utils import
import { slugify } from '../utils';

//interfaces import
import { CreateDocProps } from '../interfaces'


const CreateDocDialog = ({ hook, mutateErrored, isLoading, message, doc, canEditReaders, canEditWriters }: CreateDocProps) => {

  //user state for token
  const currentUser = useSelector((state: any) => state.user)

  //silly top level logic
  let createMode: boolean = false

  if (!doc) {
    createMode = true;
  }
  if (createMode) {
    canEditWriters = true
    canEditReaders = true
  }

  let oldSlug: string | undefined
  if (!doc) {
    oldSlug = undefined
  }
  else {
    oldSlug = slugify(doc.title)
  }

  //state
  const [openState, setOpenState] = useState<boolean>(false)
  const [isRestrictedState, setIsRestrictedState] = useState<boolean>()
  const [titleState, setTitleState] = useState<string>('')
  const [readersState, setReadersState] = useState<string[]>([])
  const [writersState, setWritersState] = useState<string[]>([])
  const [mutationErroredState, setMutationErroredState] = useState<boolean>(mutateErrored)

  //RTK Query hooks
  const {
    data: tags = [],
    isSuccess,
    isError: tagsFetchErrored,
  } = useGetTagsQuery(currentUser.token)

  //Submission check
  const titleEmpty = [titleState].every(Boolean)
  const canSave = titleEmpty && !isLoading

  //List component
  const tagList = isSuccess && tags.map((tag: any) => {
    return (
      <MenuItem key={tag.id} value={tag.name}>{tag.name}</MenuItem>
    )
  })

  //Handlers
  const handleOpen = () => {
    if (!doc) {
      setReadersState([])
      setWritersState([])
      setTitleState('')
      setIsRestrictedState(true)
    }
    else {
      setReadersState(doc.read_tags)
      setWritersState(doc.write_tags)
      setTitleState(doc.title)
      setIsRestrictedState(doc.restricted)
    }
    setOpenState(true)
  }
  const handleCloseCancel = () => {
    setOpenState(false);
  }
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleState(e.target.value);
  }
  const handleReadersChange = (e: SelectChangeEvent<string[]>) => {
    const { target: { value } } = e;
    setReadersState(typeof value === "string" ? value.split(',') : value);
  }
  const handleWritersChange = (e: SelectChangeEvent<string[]>) => {
    const { target: { value } } = e;
    const currWriters: Array<string> = typeof value === "string" ? value.split(',') : value
    let readersJustAdded: Array<string> = []
    currWriters.forEach((writer: string) => {
      if (readersState.indexOf(writer) === -1) {
        readersJustAdded.push(writer)
      }
    })
    let newReaders = [...readersState, ...readersJustAdded]
    setWritersState(currWriters);
    setReadersState(newReaders)
  }
  const handleRestrictedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRestrictedState(e.target.checked)
  }
  const handleCloseSubmit = async () => {
    if (canSave) {
      try {
        let slug
        if (createMode) {

          slug = slugify(titleState)
          await hook({ doc: { title: titleState, read_tags: readersState, write_tags: writersState, slug: slug, creator: currentUser.username }, token: currentUser.token, restricted: isRestrictedState }).unwrap().
            then((response: any) => {
              setReadersState([])
              setWritersState([])
            }).catch((error: any) => {
              setMutationErroredState(true)
            })
        } else {

          slug = oldSlug
          //doc? works because doc must exist for this to run
          await hook({ doc: { title: titleState, read_tags: readersState, write_tags: writersState, slug: slug, id: doc?.id, creator: doc?.creator, restricted: isRestrictedState }, token: currentUser.token }).unwrap().
            then((response: any) => {
              console.log(response)
              setReadersState([])
              setWritersState([])
            }).catch((error: any) => {
              setMutationErroredState(true)
            })
        }
      }
      catch (error) {
        console.log(error)
      }
      setOpenState(false)
    }
  }

  //Component display check
  let restrictionDisplay : boolean = true
  if(!createMode) 
  {
    //i.e doc is not undefined
    console.log("Hit")
     restrictionDisplay = currentUser.username === doc?.creator 
  }
  let readSelectDisplay = canEditReaders ? { display: 'block' } : { display: 'none' }
  let writeSelectDisplay = canEditWriters ? { display: 'block' } : { display: 'none' }


  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <StyledButton variant='contained' onClick={handleOpen} sx={{
        // marginLeft: "3rem",
        // marginBottom: "4rem",
        width: "80%",
      }}>{message}</StyledButton>
      <Dialog open={openState} onClose={handleCloseCancel} fullWidth PaperProps={{
        sx: {
          height: '70%',
          borderRadius: '1rem',
          backgroundColor: '#dde3ea'
        }
      }}>
        <DialogTitle color='#41474d' sx={{ fontWeight: '300' }}>Create a new doc</DialogTitle>
        <div style={{ padding: '1rem' }}>
          <Typography color='#41474d' sx={{ fontWeight: '100' }}>
            Enter the docs title
          </Typography>
          <TextField
            margin='dense'
            id='title'
            label='Title...'
            value={titleState}
            fullWidth
            variant='outlined'
            onChange={handleTitleChange}
            sx={{ backgroundColor: 'white' }}
          />
          <FormControl>
            <FormGroup>
              <FormControlLabel control={
                <Switch disabled={!restrictionDisplay} checked={isRestrictedState} onChange={handleRestrictedChange} name='restricted' />
              }
                label="Restrict access to everyone but yourself"
              />
            </FormGroup>
          </FormControl>
          <Typography display={!canEditReaders || isRestrictedState ? 'none' : 'block'} color='#41474d' sx={{ fontWeight: '100' }}>
            Choose which tags have access to read the document
          </Typography>
          <Select disabled={isRestrictedState} multiple value={readersState} onChange={handleReadersChange} sx={{
            ...readSelectDisplay,
            backgroundColor: 'white'
          }}>
            {tagList}
          </Select>
          <Typography display={!canEditWriters || isRestrictedState ? 'none' : 'block'} color='#41474d' sx={{ fontWeight: '100' }}>
            Choose which tags have access to edit the document
          </Typography>
          <Select disabled={isRestrictedState} multiple value={writersState} onChange={handleWritersChange} sx={{
            ...writeSelectDisplay,
            backgroundColor: 'white'
          }}>
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
