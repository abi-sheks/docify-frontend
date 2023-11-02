import { Box, TextField, Container, Grid, Button, Typography, CssBaseline } from '@mui/material'
import React, { useState } from 'react'
import { useAddNewUserMutation } from '../features/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice'
const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const navigate = useNavigate();
    const [addNewUser, { isLoading }] = useAddNewUserMutation()
    const dispatch = useDispatch()
    const canSave = [username, password, email].every(Boolean) && !isLoading
    const handleRegister = async () => {
        //handle logic for posting user data to server.
        if (password === rePassword && canSave) {
            try {
                // const dummyResponse = await fetch('http://127.0.0.1:8000/api/auth/register')
                await addNewUser({ username: username, password: password, email: email }).unwrap().then(
                    (response : any) => {
                        console.log(response)
                        setIsError(false)
                        navigate('/')
                    }
                ).catch((error : any) => {
                    console.log(error)
                    console.log("error is being printed.")
                    setErrorMessage(error.data.error)
                    setIsError(true)
                    return;
                })

            }
            catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <>
            <CssBaseline />
            <Grid container>
                <Grid item md={12} sx={{
                    backgroundColor: "black",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Container sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: 'space-evenly',
                        height: '80%',
                        width: '60%',
                        backgroundColor: "white",
                    }}>
                        <Typography variant="h5">Register here</Typography>
                        <TextField
                            margin='dense'
                            id='username'
                            label='Enter your username'
                            value={username}
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='email'
                            label='Enter your Email'
                            value={email}
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Enter your password'
                            value={password}
                            type='password'
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Enter your password'
                            value={rePassword}
                            type='password'
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                        <Button variant='contained' onClick={handleRegister}>Register</Button>
                        <Typography color='red' display={isError ? 'block' : 'none'}>{errorMessage}</Typography>
                    </Container>
                </Grid>
            </Grid>
        </>
    )
}

export default RegisterScreen