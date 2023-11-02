import React, { ChangeEvent, useEffect, useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useGetDocsQuery, useAddNewDocMutation, useEditDocMutation, useDeleteDocMutation, useGetDocSearchesQuery, useGetTagsQuery } from '../features/api/apiSlice'
import { Link } from 'react-router-dom'
import { Grid, Card, CardContent, CardActions, Typography, Button, IconButton, TextField, Container, CircularProgress, Select, MenuItem, SelectChangeEvent, Stack, Chip, Snackbar, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Doc, Tag } from '../interfaces'
import { CreateDocDialog, DeleteDocDialog, DocCard } from '../components'
import { containsText } from '../utils/contains'
import { tagInDoc } from '../utils/tagindoc'
import { Zoom } from 'react-awesome-reveal'
import { useSelector } from 'react-redux'

const DocList = () => {
  const currentUser = useSelector((state: any) => state.user)
  const [docState, setDocState] = useState<Array<Doc>>([])
  const [search, setSearch] = useState<string>('')
  const [filterState, setFilterState] = useState<Array<string>>([])
  const [updateDoc, { isLoading: docUpdateLoading, error: docUpdateError, isError: docUpdateErrored }] = useEditDocMutation()
  const [addNewDoc, { isLoading: docCreateLoading, error: docCreateError, isError: docCreateErrored }] = useAddNewDocMutation()
  const [deleteDoc, { isLoading: DocDeleteLoading, error: docDeleteError, isError: docDeleteErrored }] = useDeleteDocMutation()
  const {
    data: docs = [],
    isLoading,
    isFetching,
    isSuccess: DocSuccess,
    isError: fetchDocsErrored,
    error
  } = useGetDocsQuery(currentUser.token)

  const {
    data: tags = [],
    isSuccess: TagSuccess
  } = useGetTagsQuery(currentUser.token)

  const {
    data: searched = [],
    isLoading: SearchLoading,
    isSuccess: SearchSuccess,
    isError: searchDocsErrored,
    isFetching: SearchFetching,
  } = useGetDocSearchesQuery({ title__contains: search, token: currentUser.token })
  const [fetchDocsErroredState, setFetchDocsErroredState] = useState<boolean>(fetchDocsErrored)
  const [searchDocsErroredState, setSearchDocsErroredState] = useState<boolean>(searchDocsErrored)


  useEffect(() => {
    DocSuccess && setDocState(docs)
  }, [docs])
  useEffect(() => {
    setFetchDocsErroredState(fetchDocsErrored)
  }, [fetchDocsErrored])
  useEffect(() => {
    setSearchDocsErroredState(searchDocsErrored)
  }, [searchDocsErrored])


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
      <DocCard
      //trust me i need this T-T
        allTags={tags}
        doc={doc}
        hook={updateDoc}
        isLoading={docUpdateLoading}
        mutateErrored={docUpdateErrored}
        deletionHook={deleteDoc}
        deletionErrored={docDeleteErrored}
      />
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
                <Select multiple value={filterState} variant='outlined' renderValue={() => ''} onChange={handleFilterChange} sx={{ backgroundColor: 'white' }}>
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
        <CreateDocDialog
          hook={addNewDoc}
          isLoading={docCreateLoading}
          message="Create Doc"
          doc={undefined}
          mutateErrored={docCreateErrored}
          canEditReaders={true}
          canEditWriters={true}
        />
        <Snackbar open={fetchDocsErroredState} onClose={() => setFetchDocsErroredState(false)}>
          <Alert severity="error">
            There was an error fetching the docs. Please try again.
          </Alert>
        </Snackbar>
        <Snackbar open={searchDocsErroredState} onClose={() => setSearchDocsErroredState(false)}>
          <Alert severity="error">
            There was an error fetching the docs by search. Please try again.
          </Alert>
        </Snackbar>
      </Container>
    </div>
  )
}

export default DocList
