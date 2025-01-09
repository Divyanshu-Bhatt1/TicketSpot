import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from 'react-slick';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';
import { IconButton, useMediaQuery } from '@mui/material';
import IconArrowBack from '@mui/icons-material/ArrowBack';
import IconArrowForward from '@mui/icons-material/ArrowForward';

// Sample data for popular courses
const data = [
  { id: 1, title: "Course 1", description: "Description for Course 1" },
  { id: 2, title: "Course 2", description: "Description for Course 2" },
  { id: 3, title: "Course 3", description: "Description for Course 3" },
  { id: 4, title: "Course 4", description: "Description for Course 4" },
  { id: 5, title: "Course 5", description: "Description for Course 5" },
];

// CourseCardItem component
const CourseCardItem = ({ item }) => (
  <Box sx={{ padding: 2, border: '1px solid', borderRadius: 2 }}>
    <Typography variant="h6">{item.title}</Typography>
    <Typography variant="body2">{item.description}</Typography>
  </Box>
);

const SliderArrow = ({ onClick, type }) => {
  return (
    <IconButton
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
        bottom: { xs: '-70px !important', md: '-28px !important' },
        right: type === 'prev' ? '60px !important' : '0 !important',
        zIndex: 10,
        boxShadow: 1,
      }}
      onClick={onClick}
    >
      {type === 'next' ? <IconArrowForward sx={{ fontSize: 22 }} /> : <IconArrowBack sx={{ fontSize: 22 }} />}
    </IconButton>
  );
};

const StyledDots = styled('ul')(({ theme }) => ({
  '&.slick-dots': {
    position: 'absolute',
    left: 0,
    bottom: -20,
    paddingLeft: theme.spacing(1),
    textAlign: 'left',
    '& li': {
      marginRight: theme.spacing(2),
      '&.slick-active>div': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
}));

const HomePopularCourse = () => {
  const theme = useTheme();
  const matchMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const sliderConfig = {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: matchMobileView ? 1 : 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <StyledDots>{dots}</StyledDots>,
    customPaging: () => (
      <Box sx={{ height: 8, width: 30, backgroundColor: 'divider', display: 'inline-block', borderRadius: 4 }} />
    ),
  };

  return (
    <Box
      id="popular-course"
      sx={{
        pt: { xs: 6, md: 8 },
        pb: 14,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 } }}>
                Most Popular Courses
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Slider {...sliderConfig}>
              {data.map((item) => (
                <CourseCardItem key={item.id} item={item} />
              ))}
            </Slider>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePopularCourse;
