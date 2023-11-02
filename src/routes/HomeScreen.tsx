import React from 'react'
import { Divider, CssBaseline, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Avatar, Grid, Button, Container } from '@mui/material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import LabelIcon from '@mui/icons-material/Label';
import { useSelector } from 'react-redux';
import { Slide } from 'react-awesome-reveal';

const HomeScreen = () => {
    const navigate = useNavigate()
    const currentUser = useSelector((state: any) => state.user)
    const handleLogout = async () => {
        const response = await fetch('http://localhost:8000/api/logout/', {
            headers: {
                Authorization: `Token ${currentUser.token}`
            },
            method: "POST"
        })
        const data = await response.json()
        //weird paradigm, error is not being thrown to catch block? having to handle manually.
        if (data.error) {
            console.log(data.error)
            return;
        }
        navigate('/')
    }
    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
                height: '100%',
                backgroundColor: "#262626",
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: 'space-between',
                width: '25%',
            }}>
                <CssBaseline />
                <Container>
                    <Grid container>
                        <Grid item md={4} sx={{ padding: "1rem" }}>
                            <Avatar sx={{ bgcolor: "blue" }}>AA</Avatar>
                        </Grid>
                        <Grid item md={8} sx={{ padding: "1rem" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bolder", color: "white" }}>placeholder</Typography>
                            <Typography component="p" sx={{ fontWeight: "light", color: "white" }}>placeholder</Typography>
                        </Grid>
                    </Grid>
                    <List>
                        <Divider sx={{ backgroundColor: "white" }} />
                        <ListItem>
                            <ListItemButton component={Link} to="docs/">
                                <ListItemIcon>
                                    <ArticleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Docs" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                        <Divider variant="middle" sx={{ backgroundColor: "white" }} />
                        <ListItem>
                            <ListItemButton component={Link} to="tags/">
                                <ListItemIcon>
                                    <LabelIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Tags" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                        <Divider variant="middle" sx={{ backgroundColor: "white" }} />
                    </List>
                </Container>
                <Button variant='contained' onClick={handleLogout}>Logout</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default HomeScreen
