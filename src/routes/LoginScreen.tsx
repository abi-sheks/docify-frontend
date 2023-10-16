import React from 'react'
import { Typography, CssBaseline, Grid, Container, Button} from '@mui/material';
import {Link} from 'react-router-dom';



const LoginScreen = () => {
    return (
        <div>
            <CssBaseline />
            <Grid container sx={{ height: '100vh' }}>

                <Grid item xs={0} md={7} sx={{
                    backgroundColor: 'black',
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Container sx={{
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginBottom : "2rem",
                    }}>
                        <Typography variant='h3' color='white'>Docify</Typography>
                        <Typography variant='h5' color='white'>The one stop solution for all your document editing needs</Typography>
                    </Container>
                    <Typography variant='h5' sx={{ color: 'white', fontWeight: "bold" }}>Get started today.</Typography>
                </Grid>

                <Grid item xs={12} md={5} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent : "center",
                }}>
                    <Container sx={{
                        height : "20%",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems : "center",
                    }}>
                    <Typography variant='h5' sx={{fontWeight : "bolder", marginBottom : "4rem"}}>Get started with Channeli</Typography>
                    <Button component={Link} to='/home' variant='contained'>Connect your Channeli account</Button>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}


export default LoginScreen;
