import React from 'react'
import { useGetDocsQuery, useAddNewDocMutation, useEditDocMutation, useDeleteDocMutation } from '../features/api/apiSlice'
import { Link } from 'react-router-dom'
import { Grid, Card, CardContent, CardActions, Typography, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateDocDialog, DeleteDocDialog } from '../components'

const DocList = () => {
  const {
    data: docs = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error
  } = useGetDocsQuery()
  const [updateDoc, {isLoading : DocEditLoading}] = useEditDocMutation()
  const [addNewDoc, { isLoading : DocMutLoading }] = useAddNewDocMutation()
  const [deleteDoc, {isLoading : DocDeleteLoading}] = useDeleteDocMutation()
  console.log(docs)
  const docList = isSuccess && docs.map((doc: any) => {
    return (
      // <Grid item key={doc.id} sx={{
      //   width: '40%',
      //   height: "40%",
      // }}>
        <Card sx={{
          display: 'flex',
          flexDirection: "column",
          alignItems: 'center',
          // width: "100%",
          // height: "100%",
        }}>
          <CardContent>
            <Typography variant='h5'>
              {doc.title}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' component={Link} to={doc.id}>
              Edit
            </Button>
            <CreateDocDialog hook = {updateDoc} isLoading={DocEditLoading} docTitle={doc.title} readerList={doc.read_tags} writerList = {doc.write_tags} message="Update"/>
            <DeleteDocDialog doc={doc} deletionHook={deleteDoc}/>
          </CardActions>
        </Card>
      // </Grid>
    )
  })
  return (
    <Grid item xs={12} md={9} sx={{
      display: 'flex',
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <Grid container spacing={4} sx={{
        paddingTop: "4rem",
        paddingLeft: '10%',
      }}>
        {docList}
      </Grid>
        <CreateDocDialog readerList = {[]} writerList={[]} docTitle = '' hook={addNewDoc} isLoading={DocMutLoading} message="Create Doc"/>
    </Grid>

  )
}

export default DocList
