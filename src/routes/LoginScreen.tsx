import React, { useState } from 'react'
import { Typography, CssBaseline, Grid, Container, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userAdded } from '../features/users/userSlice';
import { useAddNewUserMutation } from '../features/api/apiSlice';
import { Fade } from 'react-awesome-reveal';



const LoginScreen = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [addNewUser, { isLoading }] = useAddNewUserMutation();
    const dispatch = useDispatch()
    const canSave = [username, password, email].every(Boolean) && !isLoading

    const handleLogin = async () => {
        // if(canSave) {
        try {
            // await addNewUser({username : username, password : password, email : email}).unwrap()
            // .then((response : any) => console.log(response))
            // setUsername('')
            // setPassword('')
            // setEmail('')
            // dispatch(
            //     userAdded({
            //         username : username,
            //         email : email,
            //     })
            // )
            navigate('/home')
        } catch (error) {
            console.log(error)
        }
        // }
    }
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
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
                        marginBottom: "2rem",
                    }}>
                        <Fade>
                            <Typography variant='h3' color='white'>Docify</Typography>
                            <Typography variant='h5' color='white'>The one stop solution for all your document editing needs</Typography>
                        </Fade>
                    </Container>
                    <Fade>
                        <Typography variant='h5' sx={{ color: 'white', fontWeight: "bold" }}>Get started today.</Typography>
                    </Fade>
                </Grid>

                <Grid item xs={12} md={5} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: "center",
                    backgroundColor: 'white',
                }}>
                    <Container sx={{
                        height: "20%",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                    }}>
                        <Typography variant='h5' sx={{ fontWeight: "bolder", marginBottom: "4rem" }}>Get started with Channeli</Typography>
                        <TextField
                            margin='dense'
                            id='username'
                            label='Username...'
                            value={username}
                            fullWidth
                            variant='outlined'
                            onChange={handleUsernameChange}
                        />
                        <TextField
                            margin='dense'
                            id='email'
                            label='Email...'
                            value={email}
                            fullWidth
                            variant='outlined'
                            onChange={handleEmailChange}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Password...'
                            value={password}
                            fullWidth
                            variant='outlined'
                            onChange={handlePasswordChange}
                        />
                        <Button
                            // component={Link} to='/home' variant='contained'
                            variant='contained' onClick={handleLogin}
                        >Connect your Channeli account</Button>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}


export default LoginScreen;
