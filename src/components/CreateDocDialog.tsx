import React, { useState } from 'react';
import { useAddNewDocMutation, useGetTagsQuery } from '../features/api/apiSlice';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText, SelectChangeEvent } from '@mui/material';
import { slugify } from '../utils/slugify';
import { Doc } from '../interfaces';

interface CreateDocProps {
  readerList : Array<string>,
  writerList : Array<string>,
  docTitle : string,
  id : string | undefined,
  message : string,
  hook : any,
  isLoading : any
}

const CreateDocDialog = ({ readerList, writerList, docTitle, id, hook, isLoading, message }: CreateDocProps) => {
  let createMode : boolean = false
  if (docTitle === '' || id === undefined) {
    createMode = true;
  }
  const oldSlug = docTitle != '' ? slugify(docTitle) : undefined;
  // const oldSlug = slugify(docTitle)
  const [open, setOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [readers, setReaders] = useState<string[]>([])
  const [writers, setWriters] = useState<string[]>([])


  const canSave = [title].every(Boolean) && !isLoading

  const {
    data: tags = [],
    isLoading: TagLoading,
    isFetching,
    isSuccess,
    isError,
    error
  } = useGetTagsQuery()

  const tagList = isSuccess && tags.map((tag: any) => {
    return (
      <MenuItem key={tag.id} value={tag.name}>{tag.name}</MenuItem>
    )
  })

  const handleOpen = () => {
    setReaders(readerList)
    setWriters(writerList)
    setTitle(docTitle)
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
    setWriters(currWriters);
  }
  const handleCloseSubmit = async () => {
    if (canSave) {
      try {
        let slug
        if (createMode) {
          slug = slugify(title)
          await hook({ title: title, read_tags: readers, write_tags: writers, slug: slug}).unwrap().
            then((response : any) => console.log(response))
          setTitle('')
          setReaders([])
          setWriters([])
        } else {
          slug = oldSlug
          await hook({ title: title, read_tags: readers, write_tags: writers, slug: slug, id: id }).unwrap().
            then((response: any) => console.log(response))
          setTitle('')
          setReaders([])
          setWriters([])
        }
      }
      catch (error) {
        console.log(error)
      }
      setOpen(false)
    }
  }
  return (
    <>
      <Button variant='contained' onClick={handleOpen} sx={{
        // marginLeft: "3rem",
        // marginBottom: "4rem",
        width: "80%",
      }}>{message}</Button>
      <Dialog open={open} onClose={handleCloseCancel}>
        <DialogTitle>Create a new doc</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the docs title
          </DialogContentText>
          <TextField
            margin='dense'
            id='title'
            label='Title...'
            value={title}
            fullWidth
            variant='standard'
            onChange={handleTitleChange}
          />
          <DialogContentText>
            Choose which tags have access to read the document
          </DialogContentText>
          <Select multiple value={readers} onChange={handleReadersChange}>
            {tagList}
          </Select>
          <DialogContentText>
            Choose which tags have access to edit the document
          </DialogContentText>
          <Select multiple value={writers} onChange={handleWritersChange}>
            {tagList}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleCloseCancel}>Cancel</Button>
          <Button variant='contained' onClick={handleCloseSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateDocDialog
