//Core react imports
import React, { useState } from 'react'

//Redux imports
import { useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';

//React Router imports
import { Link, useNavigate } from 'react-router-dom';

//MUI imports
import { Typography, CssBaseline, Grid, Container, Button, TextField } from '@mui/material';

//Components imports
import { StyledButton } from '../components';

//Misc imports
import { Fade } from 'react-awesome-reveal';



const LoginScreen = () => {

    //misc hooks
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //state
    const [usernameState, setUsernameState] = useState<string>('')
    const [passwordState, setPasswordState] = useState<string>('')
    const [emailState, setEmailState] = useState<string>('')
    const [errorMessageState, setErrorMessageState] = useState<string>('')
    const [isErrorState, setIsErrorState] = useState<boolean>(false)

    const canSave = [usernameState, passwordState, emailState].every(Boolean)

    //Handlers
    const handleLogin = async () => {

        if (canSave) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'mode': 'no-cors',
                    },
                    body: JSON.stringify({ username: usernameState, email: emailState, password: passwordState })
                })
                const data = await response.json()

                //weird paradigm, error is not being thrown to catch block? having to handle manually.
                if (data.error) {
                    console.log(data.error)
                    setIsErrorState(true)
                    setErrorMessageState(data.error)
                    return;
                }

                setUsernameState('')
                setPasswordState('')
                setEmailState('')
                dispatch(
                    userAdded({
                        username: data.username,
                        email: data.email,
                        token: data.token,
                    })
                )
                setIsErrorState(false)
                navigate('/home')

            } catch (error: any) {
                console.log(error)
            }
        }
    }
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameState(e.target.value)
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordState(e.target.value)
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailState(e.target.value)
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
                    padding: '2rem',
                }}>
                    <Typography variant='h5' color='#1a1c1e' sx={{ fontWeight: "bolder", marginBottom: "4rem" }}>Get started with Channeli</Typography>
                    <TextField
                        margin='dense'
                        id='username'
                        label='Username...'
                        value={usernameState}
                        fullWidth
                        variant='outlined'
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        margin='dense'
                        id='email'
                        label='Email...'
                        value={emailState}
                        fullWidth
                        variant='outlined'
                        onChange={handleEmailChange}
                    />
                    <TextField
                        margin='dense'
                        id='password'
                        label='Password...'
                        value={passwordState}
                        fullWidth
                        type='password'
                        variant='outlined'
                        onChange={handlePasswordChange}
                    />
                    <StyledButton
                        sx={{
                            marginTop: '1rem',
                            marginBottom: '1rem',
                        }}
                        variant='contained' onClick={handleLogin}
                    >Login here</StyledButton>
                    <Button component={Link} to='/register' variant='outlined' sx={{
                        backgroundColor: '#ffffff',
                        color: '#006492',
                    }}>New? Register here</Button>
                    <Typography color='#ba1a1a' display={isErrorState ? 'block' : 'none'}>{errorMessageState}</Typography>
                </Grid>
            </Grid>
        </div>
    )
}


export default LoginScreen;
