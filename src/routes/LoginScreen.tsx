import React, { useState } from 'react'
import { Typography, CssBaseline, Grid, Container, Button, TextField } from '@mui/material';
import { StyledButton } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';
import { useAddNewUserMutation } from '../features/api/apiSlice';
import { Fade } from 'react-awesome-reveal';



const LoginScreen = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [addNewUser, { isLoading }] = useAddNewUserMutation();
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const dispatch = useDispatch()
    const canSave = [username, password, email].every(Boolean) && !isLoading

    const handleLogin = async () => {
        if (canSave) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'mode': 'no-cors',
                    },
                    body: JSON.stringify({ username: username, email: email, password: password })
                })
                const data = await response.json()
                //weird paradigm, error is not being thrown to catch block? having to handle manually.
                if (data.error) {
                    setIsError(true)
                    setErrorMessage(data.error)
                    return;
                }

                console.log(data)
                // await addNewUser({username : username, password : password, email : email}).unwrap()
                // .then((response : any) => console.log(response))
                setUsername('')
                setPassword('')
                setEmail('')
                dispatch(
                    userAdded({
                        username: data.username,
                        email: data.email,
                        token : data.token,
                    })
                )
                setIsError(false)
                navigate('/home')
            } catch (error: any) {
                console.log(error)
            }
        }
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
                    backgroundColor: '#006492',
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
                    backgroundColor: '#fcfcff',
                    padding : '2rem',
                }}>
                    {/* <Container sx={{
                        height: "20%",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                    }}> */}
                        <Typography variant='h5' color='#1a1c1e' sx={{ fontWeight: "bolder", marginBottom: "4rem" }}>Get started with Channeli</Typography>
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
                            type='password'
                            variant='outlined'
                            onChange={handlePasswordChange}
                        />
                        <StyledButton
                            // component={Link} to='/home' variant='contained'
                            sx={{
                                marginTop : '1rem',
                                marginBottom : '1rem',
                            }}
                            variant='contained' onClick={handleLogin}
                        >Login here</StyledButton>
                        <Button component={Link} to='/register' variant='outlined' sx={{
                            backgroundColor : '#ffffff',
                            color : '#006492',
                        }}>New? Register here</Button>
                        <Typography color='#ba1a1a' display={isError ? 'block' : 'none'}>{errorMessage}</Typography>
                    {/* </Container> */}
                </Grid>
            </Grid>
        </div>
    )
}


export default LoginScreen;
