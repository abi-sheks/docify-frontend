import React, {useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTagQuery, useEditTagMutation, useDeleteTagMutation } from '../features/api/apiSlice';
import { Card, CardContent, CardActions, Typography, Grid, Button, List, ListItemText, ListItem } from '@mui/material';
import { CreateTagDialog, DeleteTagDialog} from '../components';
import { slugify } from '../utils/slugify';

const TagDetail = () => {
    const params = useParams()
    const [name, setName] = useState('');
    const [members, setMembers] = useState([]);
    const tagId: any = params.tagId
    const { data: tag, isFetching, isSuccess } = useGetTagQuery(tagId)
    console.log(tag)
    const memberList = isSuccess && tag.users.map((username: string) => {
        return (
            <ListItem>
                <ListItemText>
                    {username}
                </ListItemText>
            </ListItem>
        )
    })
    const [updateTag, {isLoading : TagEditLoading}] = useEditTagMutation()
    const [deleteTag, {isLoading : TagDeleteLoading}] = useDeleteTagMutation()
    let content
    if (isFetching) {
        content = <div>
            Loading
        </div>
    } else {
        content = (
            <Grid container>
                <Grid item md={1}>
                    <Button variant='outlined' component={Link} to='/home/tags/' sx={{
                        marginLeft : "2rem",
                        marginTop : "2rem",
                    }}>Back</Button>
                </Grid>
                <Grid item md={11} sx={{
                    display:'flex',
                    justifyContent : "center",
                }}>
                    <Card sx={{
                        marginTop : '2rem',
                        width: "60%",
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <CardContent sx={{
                            marginTop: '2rem',
                        }}>
                            <Typography variant="h5">
                                {tag.name}
                            </Typography>
                            <List>
                                {memberList}
                            </List>
                        </CardContent>
                        <CardActions sx={{
                            marginBottom: "2rem",
                        }}>
                            <CreateTagDialog memberList = {tag.users} tagName={tag.name} hook={updateTag} isLoading={TagEditLoading} message="Edit tag" id={tag.id} />
                            <DeleteTagDialog tagSlug={tag.id} deletionHook={deleteTag} />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        )
    }
    return (
        <Grid item xs={12} md={9}>
            {content}
        </Grid>
    )
}

export default TagDetail
