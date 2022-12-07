import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Avatar } from 'flowbite-react';
import { BiPowerOff, BiUserCircle } from 'react-icons/bi';
import { GoGear, GoEyeClosed, GoHome } from 'react-icons/go';
import { BsCalendarRangeFill } from 'react-icons/bs';
import { Switch, useDarkreader } from 'react-darkreader';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logOut } from '../store/authSlice';
import logoImg from '../assets/logo.png';
import { settingsOn } from '../store/modalSlice';

export const NavBar = () => {
  const [active, setActive] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { me, isAuthenticated } = useSelector((state) => state.auth);
  const [isDark, { toggle }] = useDarkreader(
    localStorage.getItem('theme') === 'true'
  );

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  useEffect(() => {
    localStorage.setItem('theme', isDark);
  }, [isDark]);

  return (
    <Navbar
      rounded={true}
      className='border-b shadow-md shadow-green-200 cursor-pointer'>
      <Navbar.Brand onClick={() => navigate('/')}>
        <img src={logoImg} className='mr-3 h-6 sm:h-9' alt='Chronos Logo' />
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
          Chronos
        </span>
      </Navbar.Brand>
      <div className='flex items-center md:order-2'>
        <div className='mx-4'>
          <Switch checked={isDark} onChange={toggle} styling='github' />
        </div>
        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt='User avatar'
                img={me.avatar}
                rounded={true}
              />
            }>
            <Dropdown.Header>
              <span className='block text-sm'>{me.fullName}</span>
              <span className='block truncate text-sm font-medium'>
                {me.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item
              className='flex'
              onClick={() => navigate(`/user/${me.id}`)}>
              <BiUserCircle className='mr-2' />
              Profile
            </Dropdown.Item>
            <Dropdown.Item
              className='flex'
              onClick={() => dispatch(settingsOn())}
            >
              <GoGear className='mr-2' />
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className='flex' onClick={() => dispatch(logOut())}>
              <BiPowerOff className='mr-2' />
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <button
            className='p-1 px-3 bg-green-600 rounded-md text-white hover:bg-green-700 animate-pulse hover:animate-none'
            onClick={() => navigate('/auth')}>
            Get Start!
          </button>
        )}
        {isAuthenticated && <Navbar.Toggle />}
      </div>
      {isAuthenticated && (
        <Navbar.Collapse>
          {/* <Navbar.Link
            onClick={() => navigate('/')}
            // active={active === '/'}>
          >
            <span
              className={`flex items-center cursor-pointer p-3 px-5 rounded-md
              border-r hover:bg-gradient-to-l from-gray-100 hover:text-yellow-900 ${
                active === '/' ? 'bg-gradient-to-l from-green-100' : ''
              }`}>
              <BsNewspaper className='mr-2' />
              Main
            </span>
          </Navbar.Link> */}
          <Navbar.Link
            onClick={() => navigate('/home')}
            active={active === 'home'}>
            <span
              className={`flex items-center cursor-pointer p-3 px-5 rounded-md border-r hover:bg-gradient-to-l from-gray-100 hover:text-yellow-900 ${
                active === '/home' ? 'bg-gradient-to-l from-green-100' : ''
              }`}>
              <GoHome className='mr-2' />
              Home
            </span>
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/hidden')}
            active={active === 'hidden'}>
            <span
              className={`flex items-center cursor-pointer p-3 px-5 rounded-md border-r hover:bg-gradient-to-l from-gray-100 hover:text-yellow-900 ${
                active === '/hidden' ? 'bg-gradient-to-l from-green-100' : ''
              }`}>
              <GoEyeClosed className='mr-2' />
              Hidden
            </span>
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/calendar/main')}
            active={active === 'calendar'}>
            <span
              className={`flex items-center cursor-pointer p-3 px-5 rounded-md border-r hover:bg-gradient-to-l from-gray-100 hover:text-yellow-900 ${
                active === '/calendar/main'
                  ? 'bg-gradient-to-l from-green-100'
                  : ''
              }`}>
              <BsCalendarRangeFill className='mr-2' />
              Calendar
            </span>
          </Navbar.Link>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};
