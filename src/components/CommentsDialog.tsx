//Core react imports
import React, { useState, useEffect } from 'react';

//RTK imports
import { useGetCommentsQuery, useAddNewCommentMutation } from '../features/api/apiSlice';

//Redux imports
import { useSelector } from "react-redux";

//MUI imports
import { Dialog, Typography, TextField, List, ListItem, ListItemText, Snackbar, } from '@mui/material';

//Components imports
import { ErrorAlert, StyledButton } from ".";

const CommentsDialog = ({ docID }: any) => {
    //fetches user for token
    const currentUser = useSelector((state: any) => state.user)
    //state
    const [openState, setOpenState] = useState<boolean>(false)
    const [commentBarState, setCommentBarState] = useState<string>('')
    const [commentsState, setCommentsState] = useState<Array<any>>()
    const [commentsFetchErroredState, setCommentsFetchErroredState] = useState<boolean>(false)

    //RTK hooks
    const {
        data: comments = [],
        isSuccess: commentsFetchSuccess,
        isLoading: commentsFetchLoading,
        isError: commentsFetchErrored,
    } = useGetCommentsQuery(currentUser.token)

    const [addNewComment, { isLoading: commentMutateLoading }] = useAddNewCommentMutation()

    //side effects
    useEffect(() => {
        commentsFetchSuccess && setCommentsState(comments)
    }, [comments, commentsFetchSuccess])
    useEffect(() => {
        setCommentsFetchErroredState(commentsFetchErrored)
    }, [commentsFetchErrored])

    //submission check
    const commentBarEmpty = [commentBarState].every(Boolean)
    const canSave = commentBarEmpty && !commentMutateLoading

    //Handlers
    const handleOpen = () => {
        setOpenState(true)
    }
    const handleClose = () => {
        setOpenState(false)
    }
    const handleCommentBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentBarState(e.target.value)
    }
    const handleCommentSubmit = async () => {
        if (canSave) {
            await addNewComment({ comment: { content: commentBarState, commenter: currentUser.username, parent_doc: docID, }, token: currentUser.token }).unwrap().then(
                (response: any) => {
                    console.log(response)
                }
            ).catch((error: any) => {
                console.log(error)
            })
        }
    }

    //List component
    const commentList = commentsFetchSuccess && commentsState?.map((comment: any) => {
        console.log(comment)
        if (comment.commenter === currentUser.username) {
            return (
                <ListItem key={comment.comment_id}>
                    <ListItemText>{comment.commenter}</ListItemText>
                    <ListItemText>{comment.content}</ListItemText>
                </ListItem>
            )
        }
    })


    return (
        <div>
            <StyledButton variant='contained' onClick={handleOpen}>Comment</StyledButton>
            <Dialog open={openState} onClose={handleClose} fullWidth PaperProps={{
                sx: {
                    height: '70%',
                    borderRadius: '1rem',
                    backgroundColor: '#dde3ea',
                    padding: '1rem',
                }
            }} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div>
                    <Typography color='#41474d' variant='h5' sx={{
                        fontWeight: '100'
                    }}>
                        Comments
                    </Typography>
                    <List sx={{
                        maxHeight: '60%',
                        overflow: 'auto',
                    }}>
                        {commentList}
                    </List>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        margin='dense'
                        id='comment'
                        label='Comment...'
                        fullWidth
                        variant='outlined'
                        value={commentBarState}
                        onChange={handleCommentBarChange}
                        sx={{ backgroundColor: 'white', borderRadius: '1rem' }}
                    />
                    <StyledButton variant='contained' onClick={handleCommentSubmit}>Comment</StyledButton>
                </div>
            </Dialog>
            <Snackbar open={commentsFetchErroredState} onClose={() => setCommentsFetchErroredState(false)}>
                <ErrorAlert severity="error">
                    There was an error fetching the comments. Please try again.
                </ErrorAlert>
            </Snackbar>
        </div >
    )
}

export default CommentsDialog
