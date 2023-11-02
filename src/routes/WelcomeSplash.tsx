import { CssBaseline, Grid, Typography } from '@mui/material';
import { Fade } from 'react-awesome-reveal';

const WelcomeSplash = () => {
  return (
    <div style={{ height: '100%', flexGrow: 1, backgroundColor: '#fcfcff', paddingTop: '4rem' }}>
      <CssBaseline />
      <Fade>
        <Typography textAlign='center' color='#1a1c1e' variant="h3" sx={{ marginTop: "2rem", marginBottom: "1.5rem", fontWeight: '500' }}>
          Welcome!
        </Typography>
        <Typography textAlign='center' color='#1a1c1e' variant="h4" sx={{ marginTop: "1.5rem", fontWeight: '100' }}>To get started, click on one of the sidebar options</Typography>
      </Fade>
    </div>
  )
}

export default WelcomeSplash
