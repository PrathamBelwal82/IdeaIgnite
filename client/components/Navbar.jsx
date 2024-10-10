import React from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from './ideaignite.png';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const categories = [
    'Art', 'Comics', 'Crafts', 'Dance', 'Design', 
    'Fashion', 'Film', 'Food', 'Games', 'Journalism', 
    'Music', 'Photography', 'Publishing', 'Technology', 
    'Theater', 'Discover'
  ];

  const handleLogout = () => {
    Cookies.remove('token'); // Remove the token cookie
    setIsLoggedIn(false); // Update the logged-in state
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ maxHeight: '40px' }} />
        </Typography>

        {/* Search bar */}
        <Search>
          <InputBase
            placeholder="Search projects, creators, and categories"
            inputProps={{ 'aria-label': 'search' }}
          />
          <SearchIcon />
        </Search>

        {/* Buttons */}
        {isLoggedIn ? (
          <>
          <Button variant="outlined" color="success" sx={{ ml: 2 }} onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="outlined" color="success" sx={{ ml: 2 }} onClick={() => navigate('/host-event')}>
              Start a project
            </Button>
            <Button variant="text" sx={{ ml: 1 }} onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <Button variant="text" sx={{ ml: 1 }} onClick={() => navigate('/login')}>
            Log in
          </Button>
        )}
      </Toolbar>

      {/* Categories */}
      <Box display="flex" justifyContent="center" mt={1} mb={1}>
        {categories.map((category, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              cursor: 'pointer',
              marginLeft: index > 0 ? 2 : 0,
              marginRight: 2,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => navigate(`/events/category/${category}`)} // Navigate to category events
          >
            {category}
          </Typography>
        ))}
      </Box>
    </AppBar>
  );
};

export default Navbar;
