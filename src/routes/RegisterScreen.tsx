//MUI imports
import { TextField, Container, Grid, Typography, CssBaseline } from '@mui/material'

//React core imports
import { useState } from 'react'

//RTK Query imports
import { useAddNewUserMutation } from '../features/api/apiSlice';

//Components imports
import { StyledButton } from '../components';

//React router imports
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {

    //misc hooks
    const navigate = useNavigate();

    //state
    const [usernameState, setUsernameState] = useState<string>('');
    const [emailState, setEmailState] = useState<string>('');
    const [passwordState, setPasswordState] = useState<string>('');
    const [rePasswordState, setRePasswordState] = useState<string>('');
    const [errorMessageState, setErrorMessageState] = useState<string>('')
    const [isErrorState, setIsErrorState] = useState<boolean>(false)

    //RTK Query hooks
    const [addNewUser, { isLoading }] = useAddNewUserMutation()

    const canSave = [usernameState, passwordState, emailState].every(Boolean) && !isLoading

    //Handlers
    const handleRegister = async () => {
        //handle logic for posting user data to server.
        if (passwordState === rePasswordState && canSave) {
            try {
                await addNewUser({ username: usernameState, password: passwordState, email: emailState }).unwrap().then(
                    (response : any) => {
                        setIsErrorState(false)
                        navigate('/')
                    }
                ).catch((error : any) => {
                    console.log(error.data.error)
                    setErrorMessageState(error.data.error)
                    setIsErrorState(true)
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
                    backgroundColor: "#006492",
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
                        backgroundColor: "#fcfcff",
                    }}>
                        <Typography color="#1a1c1e" variant="h5">Register here</Typography>
                        <TextField
                            margin='dense'
                            id='username'
                            label='Enter your username'
                            value={usernameState}
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setUsernameState(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='email'
                            label='Enter your Email'
                            value={emailState}
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setEmailState(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Enter your password'
                            value={passwordState}
                            type='password'
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setPasswordState(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Enter your password'
                            value={rePasswordState}
                            type='password'
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setRePasswordState(e.target.value)}
                        />
                        <StyledButton variant='contained' onClick={handleRegister}>Register</StyledButton>
                        <Typography color='#ba1a1a' display={isErrorState ? 'block' : 'none'}>{errorMessageState}</Typography>
                    </Container>
                </Grid>
            </Grid>
        </>
    )
}

export default RegisterScreen