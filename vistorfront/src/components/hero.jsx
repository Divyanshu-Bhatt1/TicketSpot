import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link as ScrollLink } from 'react-scroll';

const exps = [
  {
    label: 'Monuments',
    value: '50+',
  },
  {
    label: 'Available Tours',
    value: '100+',
  },
  {
    label: 'Happy Visitors',
    value: '1M+',
  },
];

const ExpItem = ({ item }) => {
  const { value, label } = item;
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
      <Typography
        sx={{ color: 'secondary.main', mb: { xs: 1, md: 2 }, fontSize: { xs: 34, md: 44 }, fontWeight: 'bold' }}
      >
        {value}
      </Typography>
      <Typography color="text.secondary" variant="h5">
        {label}
      </Typography>
    </Box>
  );
};

const HomeHero = () => {
  return (
    <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ flexDirection: { xs: 'column', md: 'unset' } }}>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: 40, md: 72 },
                    letterSpacing: 1.5,
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                  }}
                >
                  Explore Historic Monuments
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: 40, md: 72 },
                    letterSpacing: 1.5,
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                  }}
                >
                  Book Your Tickets Now
                </Typography>
              </Box>
              <Box sx={{ mb: 4, width: { xs: '100%', md: '70%' } }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Discover the beauty of historical monuments with our easy ticket booking platform. Book guided tours, explore ancient architectures, and dive deep into history. Choose your preferred monument and enjoy a seamless experience.
                </Typography>
              </Box>
              <Box sx={{ '& button': { mr: 2 } }}>
                <ScrollLink to="monument-section" spy={true} smooth={true} offset={0} duration={350}>
                  {/* <StyledButton color="primary" size="large" variant="contained"> */}
                    Book Now
                  {/* </StyledButton> */}
                </ScrollLink>
                <ScrollLink to="video-section" spy={true} smooth={true} offset={0} duration={350}>
                  {/* <StyledButton color="primary" size="large" variant="outlined" startIcon={<PlayArrowIcon />}> */}
                    Watch Monument Highlights
                  {/* </StyledButton> */}
                </ScrollLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ position: 'relative' }}>
            {/* Certificate Badge */}
            {/* <Box
              sx={{
                position: 'absolute',
                bottom: 30,
                left: { xs: 0, md: -150 },
                boxShadow: 1,
                borderRadius: 3,
                px: 2,
                py: 1.4,
                zIndex: 1,
                backgroundColor: 'background.paper',
                display: 'flex',
                alignItems: 'flex-start',
                width: 280,
              }}
            > */}
              {/* <Box
                sx={{
                  boxShadow: 1,
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  '& img': { width: '32px !important', height: 'auto' },
                }}
              > */}
              {/* </Box> */}
              
            {/* </Box> */}
            <Box sx={{ lineHeight: 0 }}>
              <img src="https://www.mistay.in/travel-blog/content/images/2020/07/travel-4813658_1920.jpg" alt="Monument Hero" style={{ width: '775px', height: 'auto', borderRadius: "10px", marginTop:"5vw"}} />
            </Box>
          </Grid>
        </Grid>

        {/* Experience */}
        <Box sx={{ boxShadow: 2, py: 4, px: 7, borderRadius: 4 }}>
          <Grid container spacing={2}>
            {exps.map((item) => (
              <Grid key={item.value} item xs={12} md={4}>
                <ExpItem item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeHero;
