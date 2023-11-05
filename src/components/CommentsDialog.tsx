//Core react imports
import React, { useState, useEffect } from 'react';

//RTK imports
import { useGetCommentsQuery, useAddNewCommentMutation } from '../features/api/apiSlice';

//Redux imports
import { useSelector } from "react-redux";

//MUI imports
import { Dialog, Typography, TextField, List, ListItem, Snackbar, } from '@mui/material';

//Components imports
import { ErrorAlert, StyledButton } from ".";
import { Zoom } from 'react-awesome-reveal';

//interface imports
import { Comment } from '../interfaces';

const CommentsDialog = ({ docID }: any) => {
    //fetches user for token
    const currentUser = useSelector((state: any) => state.user)
    //state
    const [openState, setOpenState] = useState<boolean>(false)
    const [commentBarState, setCommentBarState] = useState<string>('')
    const [commentsState, setCommentsState] = useState<Array<Comment>>()
    const [commentsFetchErroredState, setCommentsFetchErroredState] = useState<boolean>(false)

    //RTK hooks
    const {
        data: comments = [],
        isSuccess: commentsFetchSuccess,
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
                    setCommentBarState('')
                }
            ).catch((error: any) => {
                console.log(error)
            })
        }
    }

    //List component
    const commentList = commentsFetchSuccess && commentsState?.map((comment: Comment) => {
        console.log(comment)
        if (comment.parent_doc === docID) {
            return (
                <ListItem key={comment.comment_id} sx={{
                    display : 'flex',
                    flexDirection : 'column',
                    alignItems : 'flex-start',
                    width : '100%',
                }}>
                    <Zoom>
                    <Typography textAlign='left' sx={{fontWeight : '500'}}>{comment.commenter}</Typography>
                    <Typography textAlign='left' sx={{fontWeight : '300'}}>{comment.content}</Typography>
                    </Zoom>
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
                justifyContent: 'space-between',
            }}>
                <div style={{height : '80%'}}>
                    <Typography color='#41474d' variant='h5' sx={{
                        fontWeight: '100'
                    }}>
                        Comments
                    </Typography>
                    <List sx={{
                        maxHeight: '80%',
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
