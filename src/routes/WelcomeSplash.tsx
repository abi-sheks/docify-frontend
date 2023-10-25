import React from 'react'
import {Grid, Typography} from '@mui/material';

const WelcomeSplash = () => {
  return (
    <Grid item xs={12} md={9} sx={{
        display: "flex",
        flexDirection: "column",
        alignItems : "center",
    }}>
        <Typography variant="h3" sx={{marginTop : "2rem", marginBottom : "1.5rem"}}>
            Welcome!
        </Typography>
        <Typography variant="h5" sx={{marginTop : "1.5rem"}}>To get started, click on one of the sidebar options</Typography>
    </Grid>
  )
}

export default WelcomeSplash
