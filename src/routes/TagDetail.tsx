//React router imports
import { useParams, Link } from 'react-router-dom';

//RTK Query imports
import { useGetTagQuery, useEditTagMutation, useDeleteTagMutation } from '../features/api/apiSlice';

//Redux imports
import { useSelector } from 'react-redux';

//MUI imports
import { Card, CardContent, CardActions, Typography, Button, List, ListItemText, ListItem } from '@mui/material';

//Component imports
import { CreateTagDialog, DeleteTagDialog } from '../components';

interface OwnerTypographyProps {
    username: string,
}

const OwnerTypography = ({ username }: OwnerTypographyProps) => {
    return (
        <Typography color='#201634' sx={{ fontWeight: '500' }}>
        {`${username} : owner`}
        </Typography>
    )
}
const TagDetail = () => {

    //misc hooks
    const params = useParams()
    const tagId: string | undefined = params.tagId

    //fetches user state and token
    const currentUser = useSelector((state: any) => state.user)

    //RTK Query hooks
    const { data: tag, isFetching, isSuccess } = useGetTagQuery({ tagId: tagId as string, token: currentUser.token })
    const [updateTag, { isLoading: tagUpdateLoading, isError: tagUpdateErrored }] = useEditTagMutation()
    const [deleteTag, { isError: tagDeleteErrored }] = useDeleteTagMutation()


    //list component
    const memberList = isSuccess && tag.users.map((username: string) => {
        let nameText = username === tag.creator ? <OwnerTypography username={username} /> : <Typography color="#201634">{`${username}`}</Typography>

        return (

            <ListItem>
                <ListItemText sx={{ fontWeight: '100', color: 'white' }}>
                    {nameText}
                </ListItemText>
            </ListItem>
            
        )
    })

    //content definition to handle loading
    let content
    if (isFetching) {
        content = "Loading"
    } else {
        content = (
            <div style={{
                height: '100%', width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Button variant='contained' component={Link} to='/home/tags/' sx={{
                    marginTop: '2rem',
                    backgroundColor: '#006492',
                    color: '#ffffff'
                }}>Back</Button>
                <Card sx={{
                    marginTop: '2rem',
                    width: "60%",
                    height: '80%',
                    display: 'flex',
                    flexDirection: "column",
                    backgroundColor: '#eaddff',
                    borderRadius: '1rem',
                    justifyContent: 'space-between',
                }}>
                    <CardContent sx={{
                        marginTop: '2rem',
                        padding: '1rem',
                    }}>
                        <Typography variant="h5" color="#201634" textAlign="center" sx={{ fontWeight: '300' }}>
                            {tag.name}
                        </Typography>
                        <List sx={{ borderRadius: '1rem', border: '1px solid white', marginTop: '1rem', padding: '1rem' }}>
                            {memberList}
                        </List>
                    </CardContent>
                    <CardActions sx={{
                        marginBottom: "2rem",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                    }}>
                        <CreateTagDialog
                            hook={updateTag}
                            isLoading={tagUpdateLoading}
                            message="Edit tag"
                            mutateErrored={tagUpdateErrored}
                            canMutate={tag.admins.indexOf(currentUser.username) !== -1}
                            tag={tag}
                        />
                        <DeleteTagDialog
                            tag={tag}
                            deletionHook={deleteTag}
                            deletionErrored={tagDeleteErrored}
                        />
                    </CardActions>
                </Card>
            </div>
        )
    }
    return (
        <div style={{ height: '100%', width: '100%', backgroundColor: "#fcfcff" }}>
            {content}
        </div>
    )
}

export default TagDetail
