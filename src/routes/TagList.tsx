import React from 'react';
import { useState } from 'react';
import { useGetTagsQuery, useAddNewTagMutation } from '../features/api/apiSlice';
import { List, ListItem, ListItemText, Grid, Typography, ListItemButton, Skeleton, Button, Container } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Select, MenuItem, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import CreateTagDialog from './CreateTagDialog'; 



const TagList = () => {
    const {
        data: tags = [],
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetTagsQuery()

    console.log(tags)
    let content;
    const tagList = tags.map((tag: any) => {
        return (
            <ListItem key={tag.name}>
                <ListItemButton component={Link} to={tag.slug}>
                    <ListItemText primary={tag.name} />
                </ListItemButton>
            </ListItem>
        )
    })

    return (
        <Grid item xs={12} md={9} sx={{
            display: 'flex',
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: "4rem",
            paddingLeft: "6rem",
            paddingRight: "6rem",
        }}>
            <Container>
                <Typography variant="h4" sx={{
                    marginLeft: "2rem",
                    fontWeight: "bold",
                    marginBottom: "2rem",
                }}>Your tags</Typography>
                <List>
                    {tagList}
                </List>
            </Container>
            <CreateTagDialog />
        </Grid>
    )
}

export default TagList
