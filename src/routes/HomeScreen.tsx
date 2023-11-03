//core react import
import { useState } from 'react'

//MUI imports
import { Divider, CssBaseline, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Grid, Container, Snackbar } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import LabelIcon from '@mui/icons-material/Label';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//Redux imports
import { useSelector } from 'react-redux';

//React router imports
import { Outlet, Link, useNavigate } from 'react-router-dom';

//Component imports
import { StyledButton, ErrorAlert } from '../components';


const HomeScreen = () => {
    //selector hook (holds token needed for API requests)
    const currentUser = useSelector((state: any) => state.user)

    //misc hook
    const navigate = useNavigate()

    //state
    const [logoutErroredState, setLogoutErroredState] = useState<boolean>(false)

    //Handlers
    const handleLogout = async () => {
        //weird paradigm, error is not being thrown to catch block? so have to chain fetches.
        fetch('http://localhost:8000/api/logout/', {
            headers: {
                Authorization: `Token ${currentUser.token}`
            },
            method: "POST"
        }).then((response: any) => {
            response.json().then((data: any) => {
                setLogoutErroredState(false)
                navigate('/')
            }).catch((error: any) => {
                console.log(error)
                setLogoutErroredState(true)
            })

        }).catch((error: any) => {
            console.log("Error!")
            setLogoutErroredState(true)
        })

    }


    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
                height: '100%',
                backgroundColor: "#006492",
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: 'space-between',
                width: '25%',
                paddingBottom: '1rem',
            }}>
                <CssBaseline />
                <Container>
                    <Grid container>
                        <Grid item md={4} sx={{
                            paddingTop: '2rem',
                            paddingLeft: '2rem',
                        }}>
                            <AccountCircleIcon />
                        </Grid>
                        <Grid item md={8} sx={{
                            padding: "1rem",
                        }}>
                            <Typography noWrap={true} variant="h6" sx={{ fontWeight: "bolder", color: "white" }}>{currentUser.username}</Typography>
                            <Typography noWrap={true} component="p" sx={{ fontWeight: "light", color: "white" }}>{currentUser.email}</Typography>
                        </Grid>
                    </Grid>
                    <List>
                        <Divider sx={{ backgroundColor: "white" }} />
                        <ListItem>
                            <ListItemButton component={Link} to="docs/">
                                <ListItemIcon>
                                    <ArticleIcon style={{ color: '#ffffff' }} />
                                </ListItemIcon>
                                <ListItemText primary="Docs" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                        <Divider variant="middle" sx={{ backgroundColor: "white" }} />
                        <ListItem>
                            <ListItemButton component={Link} to="tags/">
                                <ListItemIcon>
                                    <LabelIcon style={{ color: '#ffffff' }} />
                                </ListItemIcon>
                                <ListItemText primary="Tags" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                        <Divider variant="middle" sx={{ backgroundColor: "white" }} />
                    </List>
                </Container>
                <StyledButton sx={{
                    backgroundColor: '#d3e5f5',
                    color: "#0c1d29",
                }} variant='contained' onClick={handleLogout}>Logout</StyledButton>
                <Snackbar open={logoutErroredState} onClose={() => setLogoutErroredState(false)}>
                    <ErrorAlert severity="error">
                        There was an error logging out. Please try again.
                    </ErrorAlert>
                </Snackbar>
            </div>
            <Outlet />
        </div>
    )
}

export default HomeScreen
