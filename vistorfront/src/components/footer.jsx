import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const pageMenu = [
  { label: 'Home', path: '/' },
  { label: 'Monuments', path: '/monuments' },
  { label: 'My Tickets', path: '/my-tickets' },
  { label: 'Contact Us', path: '/contact' },
];

const companyMenu = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Support', path: '/support' },
];

const exploreMenu = [
  { label: 'Upcoming Events', path: '/events' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Gift Cards', path: '/gift-cards' },
];

const socialLinks = [
  { name: 'Instagram', icon: <InstagramIcon />, link: '#' },
  { name: 'YouTube', icon: <YouTubeIcon />, link: '#' },
  { name: 'Twitter', icon: <TwitterIcon />, link: '#' },
  { name: 'Facebook', icon: <FacebookIcon />, link: '#' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'var(--footer-bg-color)', /* Use the variable for background */
        color: 'var(--footer-text-color)', /* Use the variable for text color */
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ justifyContent: 'space-around' }}>
          <Grid item xs={12} md={3} sx={{ backgroundColor: 'var(--footer-bg-color)', padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--background-color)' }}>
              Monument Ticket Booking
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Explore, discover, and book tickets to iconic monuments around the world.
            </Typography>
            <Box>
              {socialLinks.map((item) => (
                <IconButton
                  key={item.name}
                  aria-label={item.name}
                  color="inherit"
                  component="a"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ '&:hover': { color: 'var(--secondary-color)' } }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={2} sx={{ backgroundColor: 'var(--footer-bg-color)', padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--background-color)' }}>
              Menu
            </Typography>
            {pageMenu.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}
              >
                <Typography sx={{ '&:hover': { color: 'var(--secondary-color)' } }}>
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} md={2} sx={{ backgroundColor: 'var(--footer-bg-color)', padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--background-color)' }}>
              Company
            </Typography>
            {companyMenu.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}
              >
                <Typography sx={{ '&:hover': { color: 'var(--secondary-color)' } }}>
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} md={2} sx={{ backgroundColor: 'var(--footer-bg-color)', padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--background-color)' }}>
              Explore More
            </Typography>
            {exploreMenu.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}
              >
                <Typography sx={{ '&:hover': { color: 'var(--secondary-color)' } }}>
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="body2" align="center" sx={{ color: 'var(--text-color)' }}>
            © {new Date().getFullYear()} Monument Ticket Booking. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
