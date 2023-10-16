import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTagQuery } from '../features/api/apiSlice';
import { Card, CardContent, CardActions, Typography, Grid, Button, List, ListItemText, ListItem } from '@mui/material';

const TagDetail = ({ match }: any) => {
    const params = useParams()
    const tagSlug: any = params.tagSlug
    console.log(tagSlug)
    const { data: tag, isFetching, isSuccess } = useGetTagQuery(tagSlug)
    console.log(tag)
    const members = isSuccess && tag.users.map((username: string) => {
        return (
            <ListItem>
                <ListItemText>
                    {username}
                </ListItemText>
            </ListItem>
        )
    })
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
                                {members}
                            </List>
                        </CardContent>
                        <CardActions sx={{
                            marginBottom: "2rem",
                        }}>
                            <Button size='small' variant='contained'>Change name</Button>
                            <Button size='small' variant='contained'>Add members</Button>
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
