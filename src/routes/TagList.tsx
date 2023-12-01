//Core react imports
import React, { useEffect, useState } from 'react';

//RTK Query imports
import { useGetTagsQuery, useAddNewTagMutation } from '../features/api/apiSlice';

//Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';

//MUI imports
import { List, Typography, Container, CircularProgress, TextField, CssBaseline, Snackbar } from '@mui/material';

//component imports
import { StyledButton, ErrorAlert } from '../components/';
import { CreateTagDialog, TagCard } from '../components/';

//interface imports
import { Tag } from '../interfaces';

//utils imports
import { containsText, checkLogin } from '../utils/';


const TagList = () => {
    const dispatch = useDispatch()

    //fetches user state and token
    const currentUser = useSelector((state: any) => state.user)

    //RTK Query hooks
    const {
        data: tags = [],
        isFetching,
        isSuccess: TagSuccess,
        isError: fetchTagsErrored,
    } = useGetTagsQuery(currentUser.token)
    const [addNewTag, { isLoading: MutateLoading, isError: tagCreateErrored }] = useAddNewTagMutation()

    //state (defined below queries as query info is used in state)
    const [search, setSearch] = useState<string>('')
    const [fetchTagsErroredState, setFetchTagsErroredState] = useState<boolean>(fetchTagsErrored)
    const [tagState, setTagState] = useState<Array<Tag>>([])


    //side effects
    //whoami
    useEffect(() => {
        (async () => {

            await checkLogin(dispatch, userAdded)
        }
        )();
    }
        , [])
    useEffect(() => {
        TagSuccess && setTagState(tags)
    }, [tags, TagSuccess])
    useEffect(() => {
        setFetchTagsErroredState(fetchTagsErrored)
    }, [fetchTagsErrored])

    //Handlers
    const handleSearchBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        if (e.target.value === '') {
            setTagState(tags)
        }
    }
    const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        let newTags: Array<Tag> = []
        newTags = tags.filter((tag: Tag) => containsText(tag.name, search))
        setTagState(() => newTags)
    }


    //List component
    const tagList = TagSuccess && tagState.map((tag: Tag) => {

        if (tag.users.indexOf(currentUser.username) !== -1) {
            return <TagCard tag={tag} />
        }
    })

    //content definition to handle loading
    let content
    if (isFetching) {
        content = (
            <Container>
                <CircularProgress />
            </Container>
        )
    }
    else {
        content = (
            <div>
                <CssBaseline />
                <Container sx={{
                    display: "flex",
                    flexDirection: 'column',
                    paddingTop: '2rem',
                    justifyContent: "space-between",
                }}>
                    <Container sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingBottom: '1rem',
                    }}>
                        <TextField
                            margin='dense'
                            id='search'
                            label='Search for tags by name...'
                            value={search}
                            fullWidth
                            variant='outlined'
                            onChange={handleSearchBarChange}
                            sx={{ backgroundColor: 'white', borderRadius: '1rem' }}
                        />
                        <StyledButton variant="contained" onClick={handleSearch} sx={{
                            marginLeft: '1rem'
                        }}>Go</StyledButton>
                    </Container>
                    <Container sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#d3e5f5',
                        padding: '1rem',
                        borderRadius: '1rem',
                    }}>
                        <Typography variant="h4" textAlign="center" color="white" sx={{
                            marginLeft: "2rem",
                            fontWeight: "300",
                            marginBottom: "2rem",
                            color: "#0c1d29",
                        }}>Your tags</Typography>
                        <List sx={{
                            maxHeight: '60vh',
                            overflow: 'auto',
                            borderRadius: '1rem',
                        }}>
                            {tagList}
                        </List>
                    </Container>
                </Container>
                <Container sx={{
                    display: 'flex',
                    alignItems: "center",
                    paddingTop: '1rem',
                }}>
                    <CreateTagDialog
                        hook={addNewTag}
                        isLoading={MutateLoading}
                        message="Create Tag"
                        mutateErrored={tagCreateErrored}
                        canMutate={true}
                        tag={undefined}
                    />
                    <Snackbar open={fetchTagsErroredState} onClose={() => setFetchTagsErroredState(false)}>
                        <ErrorAlert severity="error">
                            There was an error fetching the tags. Please try again.
                        </ErrorAlert>
                    </Snackbar>
                </Container>
            </div>

        )
    }

    return (
        <div style={{ flexGrow: 1, backgroundColor: '#fcfcff', height: '100%', width: '100%' }}>
            {content}
        </div>
    )
}

export default TagList
