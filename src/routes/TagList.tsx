import React, { useEffect } from 'react';
import { useState } from 'react';
import { useGetTagsQuery, useAddNewTagMutation } from '../features/api/apiSlice';
import { List, ListItem, ListItemText, Grid, Typography, ListItemButton, Button, Container, CircularProgress, TextField, CssBaseline, Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { CreateTagDialog } from '../components/';
import { Tag } from '../interfaces';
import { containsText } from '../utils/contains';
import { Zoom } from 'react-awesome-reveal'
import { useSelector } from 'react-redux';

const TagList = () => {
    const currentUser = useSelector((state: any) => state.user)
    const {
        data: tags = [],
        isFetching,
        isSuccess: TagSuccess,
        isError: fetchTagsErrored,
    } = useGetTagsQuery(currentUser.token)
    const [addNewTag, { isLoading: MutateLoading, isError: tagCreateErrored, error: tagCreateError }] = useAddNewTagMutation()
    const [search, setSearch] = useState<string>('')
    const [fetchTagsErroredState, setFetchTagsErroredState] = useState<boolean>(fetchTagsErrored)
    const [tagState, setTagState] = useState<Array<Tag>>([])

    useEffect(() => {
        TagSuccess && setTagState(tags)
    }, [tags, TagSuccess])
    useEffect(() => {
        setFetchTagsErroredState(fetchTagsErrored)
    }, [fetchTagsErrored])
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

    const tagList = TagSuccess && tagState.map((tag: Tag) => {
        if (tag.users.indexOf(currentUser.username) !== -1) {
            return (
                <ListItem key={tag.id}>
                    <ListItemButton component={Link} to={tag.id}>
                        <CssBaseline />
                        <Zoom>
                            <ListItemText sx={{ fontWeight: '100', color: 'white' }} primary={tag.name} />
                        </Zoom>
                    </ListItemButton>
                </ListItem>
            )
        }
    })

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
                        marginBottom: '2rem',
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
                        <Button variant="contained" onClick={handleSearch} sx={{
                            marginLeft: '1rem'
                        }}>Go</Button>
                    </Container>
                    <Container sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography variant="h4" textAlign="center" color="white" sx={{
                            marginLeft: "2rem",
                            fontWeight: "500",
                            marginBottom: "2rem",
                        }}>Your tags</Typography>
                        <List sx={{
                            maxHeight: '60vh',
                            overflow: 'auto',
                            borderRadius: '1rem',
                            border: '1px solid white'
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
                        <Alert severity="error">
                            There was an error fetching the tags. Please try again.
                        </Alert>
                    </Snackbar>
                </Container>
            </div>

        )
    }

    return (
        <div style={{ flexGrow: 1, backgroundColor: 'black', height: '100%', width: '100%' }}>
            {content}
        </div>
    )
}

export default TagList
