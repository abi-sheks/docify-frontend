import React, { useEffect } from 'react';
import { useState } from 'react';
import { useGetTagsQuery, useAddNewTagMutation } from '../features/api/apiSlice';
import { List, ListItem, ListItemText, Grid, Typography, ListItemButton, Skeleton, Button, Container, CircularProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Select, MenuItem, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { CreateTagDialog } from '../components/';
import { Tag } from '../interfaces';
import { containsText } from '../utils/contains';

const TagList = () => {
    const {
        data: tags = [],
        isLoading,
        isFetching,
        isSuccess: TagSuccess,
        isError,
        error
    } = useGetTagsQuery()
    const [addNewTag, { isLoading: MutateLoading }] = useAddNewTagMutation()
    const [search, setSearch] = useState<string>('')
    const [tagState, setTagState] = useState<Array<Tag>>([])

    useEffect(() => {
        TagSuccess && setTagState(tags)
    }, [tags])
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
                    <ListItemText primary={tag.name}/>
                </ListItemButton>
            </ListItem>
        )
    })

    let content

       if(isFetching){
                content =  (
                    <Container>
                    <CircularProgress />
                    </Container>
                )
            }
            else {
                content =  (
                    <Grid item xs={12} md={9} sx={{
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingTop: "4rem",
                        paddingLeft: "6rem",
                        paddingRight: "6rem",
                    }}>
                        <Container sx={{
                            display : "flex",
                            flexDirection : 'column',
                            justifyContent : "space-between",
                        }}>
                            <Container sx ={{
                                border : '1px solid black',
                                marginBottom : '2rem',
                            }}>
                                <TextField
                                    margin='dense'
                                    id='search'
                                    label='Search for tags by name...'
                                    value={search}
                                    fullWidth
                                    variant='outlined'
                                    onChange={handleSearchBarChange}
                                    />
                                <Button variant="contained" onClick={handleSearch}>Go</Button>
                            </Container>
                            <Container >
                            <Typography variant="h4" sx={{
                                marginLeft: "2rem",
                                fontWeight: "bold",
                                marginBottom: "2rem",
                            }}>Your tags</Typography>
                            <List>
                                {tagList}
                            </List>
                        </Container>
                        </Container>
                        <CreateTagDialog id={undefined} tagName='' memberList={[]} hook={addNewTag} isLoading={MutateLoading} message="Create Tag" />
                    </Grid>

                )
            }

    return (
            <Grid item xs={12} md={9} sx={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: "space-between",
                paddingLeft: "6rem",
                paddingRight: "6rem",
            }}>
                {content}
            </Grid>
        
    )
}

export default TagList
