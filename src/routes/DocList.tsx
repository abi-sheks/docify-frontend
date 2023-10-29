import React, { ChangeEvent, useEffect, useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useGetDocsQuery, useAddNewDocMutation, useEditDocMutation, useDeleteDocMutation, useGetDocSearchesQuery, useGetTagsQuery } from '../features/api/apiSlice'
import { Link } from 'react-router-dom'
import { Grid, Card, CardContent, CardActions, Typography, Button, IconButton, TextField, Container, CircularProgress, Select, MenuItem, SelectChangeEvent, Stack, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Doc, Tag } from '../interfaces'
import { CreateDocDialog, DeleteDocDialog } from '../components'
import { containsText } from '../utils/contains'
import { tagInDoc } from '../utils/tagindoc'
import { Zoom } from 'react-awesome-reveal'

const DocList = () => {
  const [docState, setDocState] = useState<Array<Doc>>([])
  const [search, setSearch] = useState<string>('')
  const [filterState, setFilterState] = useState<Array<string>>([])
  const [updateDoc, { isLoading: DocEditLoading }] = useEditDocMutation()
  const [addNewDoc, { isLoading: DocMutLoading }] = useAddNewDocMutation()
  const [deleteDoc, { isLoading: DocDeleteLoading }] = useDeleteDocMutation()
  const {
    data: docs = [],
    isLoading,
    isFetching,
    isSuccess: DocSuccess,
    isError,
    error
  } = useGetDocsQuery()

  const {
    data: tags = [],
    isSuccess: TagSuccess
  } = useGetTagsQuery()

  const {
    data: searched = [],
    isLoading: SearchLoading,
    isSuccess: SearchSuccess,
    isError: SearchError,
    isFetching: SearchFetching,
  } = useGetDocSearchesQuery(search)

  useEffect(() => {
    DocSuccess && setDocState(docs)
  }, [docs])


  const handleFilterChange = (e: SelectChangeEvent<string[]>) => {
    const { target: { value } } = e;
    console.log(value)
    if (value === '') {
      setDocState(searched)
    }
    setFilterState(typeof value === "string" ? value.split(',') : value);
  }
  //Bad algorithm, refactor
  const handleFilter = () => {
    if (filterState.length === 0) {
      setDocState(docs)
      return;
    }
    let filteredDocs: any = []
    searched.forEach((doc: Doc) => {
      filterState.forEach((filterTag) => {
        if (tagInDoc(doc, filterTag)) {
          filteredDocs = [...filteredDocs, doc]
        }
      })
    })
    setDocState(filteredDocs)
  }
  const handleSearchBarChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch((e.target).value)
    if ((e.target).value === '') {
      setDocState(docs)
    }
  }
  const handleSearch = () => {
    let newDocs: Array<Doc> = []
    docs.forEach((doc: Doc) => {
      searched.forEach((searchedDoc: Doc) => {
        if (searchedDoc.id === doc.id) {
          newDocs = [...newDocs, doc]
        }
      }
      )
    })
    setDocState(() => newDocs)
  }
  const tagList = TagSuccess && tags.map((tag: any) => {
    return (
      <MenuItem key={tag.id} value={tag.name}>{tag.name}</MenuItem>
    )
  })
  const handleFilterDelete = (tagName: string) => {
    // const tagName = 
    // console.log(tagName)
    const newFilterTags: Array<string> = filterState.filter((filterTag) => filterTag !== tagName)
    if (newFilterTags.length === 0) {
      setDocState(searched)
    }
    setFilterState(newFilterTags)
  }

  const filterTags = filterState.map((tagName: string) => {
    return (
      <Chip key={tagName} variant='outlined' onDelete={() => handleFilterDelete(tagName)} label={tagName} sx={{
        backgroundColor: "#262626",
        color: 'white'
      }}></Chip>
    )
  })

  const docList = DocSuccess && docState.map((doc: Doc) => {
    return (
      <Grid item key={doc.id}>
        <Zoom>
          <Card sx={{
            display: 'flex',
            flexDirection: "column",
            alignItems: 'center',
            backgroundColor: '#262626',
            borderRadius: '1rem',
            padding: '1rem',
          }}>
            <CardContent>
              <Typography variant='h5' color="white">
                {doc.title}
              </Typography>
            </CardContent>
            <CardActions sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Button variant='contained' component={Link} to={doc.id} sx={{ marginRight: '0.5rem' }}>
                Edit
              </Button>
              <CreateDocDialog hook={updateDoc} isLoading={DocEditLoading} docTitle={doc.title} readerList={doc.read_tags} writerList={doc.write_tags} id={doc.id} message="Update" />
              <DeleteDocDialog doc={doc} deletionHook={deleteDoc} />
            </CardActions>
          </Card>
        </Zoom >
      </Grid>
    )
  })


  return (
    <div style={{
      display: 'flex',
      flexDirection: "column",
      width: '100%',
      height: '100%',
      padding: '2rem',
      justifyContent: 'space-between',
      alignItems: "center",
      flexGrow: 1,
    }}>
      <Container>
        <Container>
          <Grid container>
            <Grid item md={12} sx={{
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
            }}>
              <TextField
                margin='dense'
                id='search'
                label='Search for docs by title...'
                value={search}
                fullWidth
                variant='outlined'
                onChange={handleSearchBarChange}
                sx={{
                  borderRadius: "1rem",
                  backgroundColor: 'white',
                }}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ marginLeft: '1rem' }}>Go</Button>
            </Grid>
            <Grid item>
              <Container sx={{
                marginBottom: '1rem',
              }}>
                <Select multiple value={filterState} renderValue={() => ''} onChange={handleFilterChange} sx={{ backgroundColor: '#262626' }}>
                  {tagList}
                </Select>
                <Button variant='contained' onClick={handleFilter} sx={{ marginLeft: '1rem', }}>
                  Filter by tag
                </Button>
              </Container>
              <Stack direction='row' spacing={2}>
                {filterTags}
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{
            paddingTop: "4rem",
            paddingLeft: '2rem',
            overflow: 'auto',
            maxHeight: '60vh',
          }}>
            {docList}
          </Grid>
        </Container>
      </Container>
      <Container sx={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <CreateDocDialog readerList={[]} writerList={[]} docTitle='' hook={addNewDoc} isLoading={DocMutLoading} message="Create Doc" id={undefined} />
      </Container>
    </div>
  )
}

export default DocList
