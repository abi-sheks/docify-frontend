//Core React imports
import { ChangeEvent, useEffect, useState } from 'react'

//RTK Query imports
import { useGetDocsQuery, useAddNewDocMutation, useEditDocMutation, useDeleteDocMutation, useGetDocSearchesQuery, useGetTagsQuery } from '../features/api/apiSlice'

//Redux imports
import { useSelector } from 'react-redux'

//MUI imports
import { Grid, TextField, Container, Select, MenuItem, SelectChangeEvent, Stack, Snackbar } from '@mui/material'

//Component imports
import { StyledButton, ErrorAlert } from '../components'
import { CreateDocDialog, DocCard, FilterChip } from '../components'

//utils imports
import { tagInDoc } from '../utils'

//interfaces imports
import { Doc } from '../interfaces'
import { useNavigate } from 'react-router-dom'


const DocList = () => {
  const navigate = useNavigate()

  //selector hook (holds token needed for API requests)
  const currentUser = useSelector((state: any) => state.user)

  //RTK Query hooks
  const [updateDoc, { isLoading: docUpdateLoading, isError: docUpdateErrored }] = useEditDocMutation()
  const [addNewDoc, { isLoading: docCreateLoading, isError: docCreateErrored }] = useAddNewDocMutation()
  const [deleteDoc, { isError: docDeleteErrored }] = useDeleteDocMutation()
  const {
    data: docs = [],
    isSuccess: DocSuccess,
    isError: fetchDocsErrored,
  } = useGetDocsQuery(currentUser.token)
  const {
    data: tags = [],
    isSuccess: TagSuccess
  } = useGetTagsQuery(currentUser.token)

  //state
  const [docState, setDocState] = useState<Array<Doc>>([])
  const [searchState, setSearchState] = useState<string>('')
  const [filterState, setFilterState] = useState<Array<string>>([])
  const [fetchDocsErroredState, setFetchDocsErroredState] = useState<boolean>(fetchDocsErrored)

  //Particular hook requires state to update and rerun
  const {
    data: searched = [],
    isError: searchDocsErrored,
  } = useGetDocSearchesQuery({ contenttext__contains: searchState, token: currentUser.token })

  //particular state requires error from above hook to setState
  const [searchDocsErroredState, setSearchDocsErroredState] = useState<boolean>(searchDocsErrored)

  //useEffects
  useEffect(() => {
    DocSuccess && setDocState(docs)
  }, [docs])
  useEffect(() => {
    setFetchDocsErroredState(fetchDocsErrored)
  }, [fetchDocsErrored])
  useEffect(() => {
    setSearchDocsErroredState(searchDocsErrored)
  }, [searchDocsErrored])

  //event handlers

  const handleFilterChange = (e: SelectChangeEvent<string[]>) => {
    const { target: { value } } = e;
    if (value === '') {
      setDocState(docs)
    }
    //handles case where only one value is selected, Select value is then string.
    setFilterState(typeof value === "string" ? value.split(',') : value);
  }
  const handleFilter = () => {
    if (filterState.length === 0) {
      setDocState(docs)
      return;
    }
    //Bad algorithm, refactor
    //checks if every tag is in every doc, and also if the doc has already been added to filteredDocs to avoid duplication
    let filteredDocs: Array<Doc> = []
    docs.forEach((doc: Doc) => {
      let match: boolean = true
      filterState.forEach((filterTag) => {
        if (!tagInDoc(doc, filterTag) || filteredDocs.indexOf(doc) !== -1) {
          match = false
        }
      })
      if (match) {
        filteredDocs = [...filteredDocs, doc]
      }
    })
    setDocState(filteredDocs)
  }
  const handleFilterDelete = (tagName: string) => {
    const newFilterTags: Array<string> = filterState.filter((filterTag: string) => filterTag !== tagName)
    //handles when all tags are deleted, resets to default state.
    if (newFilterTags.length === 0) {
      setDocState(docs)
    }
    setFilterState(newFilterTags)
  }
  const handleSearchBarChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchState((e.target).value)
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

  //List components
  const filterTags = filterState.map((tagName: string) => {
    return (
      <FilterChip
        tagName={tagName}
        handleFilterDelete={handleFilterDelete}
      />
    )
  })
  const tagList = TagSuccess && tags.map((tag: any) => {
    return (
      <MenuItem key={tag.id} value={tag.name}>
        {tag.name}
      </MenuItem>
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
      backgroundColor: "#fcfcff",
      flexGrow: 1,
    }}>
      <Container>
        <Container>
          <Grid container sx={{
            paddingBottom: '2rem',
          }}>
            <Grid item md={12} sx={{
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
            }}>
              <TextField
                margin='dense'
                id='search'
                label='Search for docs by keyword...'
                value={searchState}
                fullWidth
                variant='outlined'
                onChange={handleSearchBarChange}
                sx={{
                  borderRadius: "1rem",
                  backgroundColor: 'white',
                }}
              />
              <StyledButton variant="contained" onClick={handleSearch} sx={{ marginLeft: '1rem' }}>Go</StyledButton>
            </Grid>
            <Grid item>
              <Container sx={{
                marginBottom: '1rem',
              }}>
                <Select multiple value={filterState} variant='outlined' renderValue={() => ''} onChange={handleFilterChange} sx={{ backgroundColor: 'white' }}>
                  {tagList}
                </Select>
                <StyledButton variant='contained' onClick={handleFilter} sx={{ marginLeft: '1rem', }}>
                  Filter by tag
                </StyledButton>
              </Container>
              <Stack direction='row' spacing={2}>
                {filterTags}
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{
            padding: "2rem",
            overflow: 'auto',
            maxHeight: '70vh',
            backgroundColor: '#d3e5f5',
          }}>
            {docList}
          </Grid>
        </Container>
      </Container>
      <Container sx={{
        display: 'flex',
        paddingTop: '1rem',
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
          <ErrorAlert severity="error">
            There was an error fetching the docs. Please try again.
          </ErrorAlert>
        </Snackbar>
        <Snackbar open={searchDocsErroredState} onClose={() => setSearchDocsErroredState(false)}>
          <ErrorAlert severity="error">
            There was an error fetching the docs by search. Please try again.
          </ErrorAlert>
        </Snackbar>
      </Container>
    </div>
  )
}

export default DocList
