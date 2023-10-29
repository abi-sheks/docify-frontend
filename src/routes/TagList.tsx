import React, { useEffect } from 'react';
import { useState } from 'react';
import { useGetTagsQuery, useAddNewTagMutation } from '../features/api/apiSlice';
import { List, ListItem, ListItemText, Grid, Typography, ListItemButton, Button, Container, CircularProgress, TextField, CssBaseline} from '@mui/material';
import { Link } from 'react-router-dom';
import { CreateTagDialog } from '../components/';
import { Tag } from '../interfaces';
import { containsText } from '../utils/contains';
import {Zoom} from 'react-awesome-reveal'

const TagList = () => {
    const {
        data: tags = [],
        isFetching,
        isSuccess: TagSuccess,
    } = useGetTagsQuery()
    const [addNewTag, { isLoading: MutateLoading }] = useAddNewTagMutation()
    const [search, setSearch] = useState<string>('')
    const [tagState, setTagState] = useState<Array<Tag>>([])

    useEffect(() => {
        TagSuccess && setTagState(tags)
    }, [tags, TagSuccess])
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
            // <Grid item xs={12} md={9} sx={{
            //     display: 'flex',
            //     flexDirection: "column",
            //     justifyContent: "space-between",
            //     paddingTop: "4rem",
            //     paddingLeft: "6rem",
            //     paddingRight: "6rem",
            // }}>
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
                            borderRadius : '1rem',
                            border : '1px solid white'
                        }}>
                            {tagList}
                        </List>
                    </Container>
                </Container>
                <Container sx={{
                    display : 'flex',
                    alignItems  : "center",
                    paddingTop : '1rem',
                }}>
                    <CreateTagDialog id={undefined} tagName='' memberList={[]} hook={addNewTag} isLoading={MutateLoading} message="Create Tag" />
                </Container>
                {/* </Grid> */}
            </div>

        )
    }

    return (
        // <Grid item xs={12} md={9} sx={{
        //     display: 'flex',
        //     flexDirection: "column",
        //     justifyContent: "space-between",
        //     paddingLeft: "6rem",
        //     paddingRight: "6rem",
        // }}>
        <div style={{ flexGrow: 1, backgroundColor: 'black', height: '100%', width : '100%' }}>
            {content}
        </div>
        // </Grid>

    )
}

export default TagList
