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
    if(value === '') {
      setDocState(searched)
    }
    setFilterState(typeof value === "string" ? value.split(',') : value);
  }
  //Bad algorithm, refactor
  const handleFilter = () => {
    if(filterState.length === 0){
      setDocState(docs)
      return;
    }
    let filteredDocs : any = []
    searched.forEach((doc : Doc) => {
      filterState.forEach((filterTag) => {
        if(tagInDoc(doc, filterTag)){
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
    if(newFilterTags.length === 0) {
      setDocState(searched)
    }
    setFilterState(newFilterTags)
  }

  const filterTags = filterState.map((tagName: string) => {
    return (
      <Chip key={tagName} variant='outlined' onDelete={() => handleFilterDelete(tagName)} label={tagName}></Chip>
    )
  })

  const docList = DocSuccess && docState.map((doc: Doc) => {
    return (
      <Card sx={{
        display: 'flex',
        flexDirection: "column",
        alignItems: 'center',
      }} key={doc.id}>
        <CardContent>
          <Typography variant='h5'>
            {doc.title}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant='contained' component={Link} to={doc.id}>
            Edit
          </Button>
          <CreateDocDialog hook={updateDoc} isLoading={DocEditLoading} docTitle={doc.title} readerList={doc.read_tags} writerList={doc.write_tags} id={doc.id} message="Update" />
          <DeleteDocDialog doc={doc} deletionHook={deleteDoc} />
        </CardActions>
      </Card>
      // </Grid>
    )
  })


  return (
    <Grid item xs={12} md={9} sx={{
      display: 'flex',
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <Container>
        <Grid item container>
          <Grid item md={12}  sx={{
          marginBottom : '2rem',
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
                borderRadius: "2rem",
              }}
            />
            <Button variant="contained" onClick={handleSearch}>Go</Button>
]
          </Grid>
          <Grid item>
            <Select multiple value={filterState} renderValue={() => ''} onChange={handleFilterChange}>
              {tagList}
            </Select>
            <Button variant='contained' onClick={handleFilter}>
              Filter by tag
            </Button>
          <Stack direction='row' spacing={2}>
            {filterTags}
          </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{
          paddingTop: "4rem",
          paddingLeft: '10%',
        }}>
          {docList}
        </Grid>
      </Container>
      <CreateDocDialog readerList={[]} writerList={[]} docTitle='' hook={addNewDoc} isLoading={DocMutLoading} message="Create Doc" id={undefined} />
    </Grid>
  )
}

export default DocList
