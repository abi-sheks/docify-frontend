import React from 'react'
import { Doc, Tag } from '../interfaces'
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Zoom } from 'react-awesome-reveal';
import { useSelector } from 'react-redux';
import { StyledButton, DeleteDocDialog, CreateDocDialog } from '.';

interface DocCardProps {
    doc: Doc,
    deletionHook: any,
    hook: any,
    isLoading: boolean,
    deletionErrored: boolean,
    mutateErrored: boolean,
    allTags: any
}

const DocCard = ({ doc, deletionHook, hook, isLoading, deletionErrored, mutateErrored, allTags }: DocCardProps) => {
    const currentUser = useSelector((state: any) => state.user)
    let canEditReaders: boolean = false
    let canEditWriters: boolean = false
    allTags.forEach((tag: Tag) => {
        if ((doc.read_tags.indexOf(tag.name) !== -1 && tag.users.indexOf(currentUser.username)) || doc.creator === currentUser.username) {
            canEditReaders = true
        }
        if ((doc.write_tags.indexOf(tag.name) !== -1 && tag.users.indexOf(currentUser.username)) || doc.creator === currentUser.username) {
            canEditWriters = true
        }
    })
    let editAccess = 'read'
    if (canEditWriters) {
        editAccess = 'write'
    }
    return (
        <Grid item key={doc.id}>
            <Zoom>
                <Card sx={{
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: 'center',
                    backgroundColor: '#65597b',
                    borderRadius: '1rem',
                    padding: '1rem',
                }}>
                    <CardContent>
                        <Typography variant='h5' color="#ffffff">
                            {doc.title}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Button variant='contained' component={Link} to={`${doc.id}/${editAccess}`} sx={{
                            marginRight: '0.5rem',
                            backgroundColor: '#006492',
                            color: '#ffffff'
                        }}>
                            {canEditWriters ? 'Edit' : 'View'}
                        </Button>
                        <CreateDocDialog
                            canEditReaders={canEditReaders}
                            canEditWriters={canEditWriters}
                            hook={hook}
                            isLoading={isLoading}
                            doc={doc}
                            message="Update"
                            mutateErrored={mutateErrored}
                        />
                        <DeleteDocDialog
                            doc={doc}
                            deletionHook={deletionHook}
                            deletionErrored={deletionErrored}
                        />
                    </CardActions>
                </Card>
            </Zoom >
        </Grid>
    )
}

export default DocCard
