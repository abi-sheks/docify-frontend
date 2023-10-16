import React from 'react'
import { Divider, CssBaseline, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Avatar, Grid } from '@mui/material';
import {Outlet, Link} from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import LabelIcon from '@mui/icons-material/Label';

const HomeScreen = () => {
    return (
        <>
            <CssBaseline />
            <div id="sidebar">
                <Grid container sx={{ height: "100vh" }}>
                    <Grid item xs={0} md={3} sx={{ backgroundColor: "black" }}>
                        <Grid container>
                            <Grid item md={4} sx={{ padding: "1rem" }}>
                                <Avatar sx={{ bgcolor: "blue" }}>AA</Avatar>
                            </Grid>
                            <Grid item md={8} sx={{ padding: "1rem" }}>
                                <Typography variant="h6" sx={{ fontWeight: "bolder", color: "white" }}>Abishek Arun</Typography>
                                <Typography component="p" sx={{ fontWeight: "light", color: "white" }}>abishek.arun2017@gmail.com</Typography>
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
                    </Grid>
                    <Outlet />
                </Grid>
            </div>
        </>
    )
}

export default HomeScreen
