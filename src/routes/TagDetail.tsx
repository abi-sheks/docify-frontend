import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTagQuery, useEditTagMutation, useDeleteTagMutation } from '../features/api/apiSlice';
import { Card, CardContent, CardActions, Typography, Grid, Button, List, ListItemText, ListItem } from '@mui/material';
import { CreateTagDialog, DeleteTagDialog } from '../components';
import { slugify } from '../utils/slugify';
import { Tag } from '../interfaces';

const TagDetail = () => {
    const params = useParams()
    const [name, setName] = useState<string>('');
    const [members, setMembers] = useState<Array<string>>([]);
    const tagId: string | undefined = params.tagId
    const { data: tag, isFetching, isSuccess } = useGetTagQuery(tagId as string)
    const memberList = isSuccess && tag.users.map((username: string) => {
        return (
            <ListItem>
                <ListItemText sx={{fontWeight : '100', color :'white' }}>
                    {username}
                </ListItemText>
            </ListItem>
        )
    })
    const [updateTag, { isLoading: TagEditLoading }] = useEditTagMutation()
    const [deleteTag, { isLoading: TagDeleteLoading }] = useDeleteTagMutation()
    let content
    if (isFetching) {
        content = "Loading"
    } else {
        content = (
            <div style={{height : '100%', width : '100%', 
            display : 'flex', 
            flexDirection : 'column',
            alignItems : 'center',
            }}>
                <Button variant='contained' component={Link} to='/home/tags/' sx={{
                    marginTop : '2rem',
                }}>Back</Button>
                <Card sx={{
                    marginTop: '2rem',
                    width: "60%",
                    height : '80%',
                    display: 'flex',
                    flexDirection: "column",
                    backgroundColor : '#262626',
                    borderRadius : '1rem',
                    justifyContent: 'space-between',
                }}>
                    <CardContent sx={{
                        marginTop: '2rem',
                        padding : '1rem',
                    }}>
                        <Typography variant="h5" color="white" textAlign="center" sx={{fontWeight : '300'}}>
                            {tag.name}
                        </Typography>
                        <List sx={{borderRadius : '1rem', border : '1px solid white', marginTop : '1rem', padding : '1rem'}}>
                            {memberList}
                        </List>
                    </CardContent>
                    <CardActions sx={{
                        marginBottom: "2rem",
                        display : 'flex',
                        alignItems : 'center',
                        justifyContent : 'space-around',
                    }}>
                        <CreateTagDialog memberList={tag.users} tagName={tag.name} hook={updateTag} isLoading={TagEditLoading} message="Edit tag" id={tag.id} />
                        <DeleteTagDialog tagId={tag.id} deletionHook={deleteTag} />
                    </CardActions>
                </Card>
            </div>
        )
    }
    return (
        <div style={{height: '100%', width : '100%'}}>
            {content}
        </div>
    )
}

export default TagDetail
