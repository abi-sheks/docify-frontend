import React from 'react'
import { Box, Typography, CssBaseline, Button } from '@mui/material'
import { Link } from 'react-router-dom'


const ErrorPage = () => {
    return (
        <div style={{backgroundColor : '#262626', height : '100vh'}}>   
            <CssBaseline />
            <Box sx={{
                paddingTop : '4rem',
                backgroundColor: '#262626',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <Typography variant='h3' color='white'>{`:( Couldn't find the page you requested`}</Typography>
                <Typography variant='h5' color='white' sx={{
                    fontWeight: '100'
                }}>Go back to charted territory. Bye.</Typography>
                <Button component={Link} to='/'>Click here to get back</Button>
            </Box>
        </div>
    )
}

export default ErrorPage
