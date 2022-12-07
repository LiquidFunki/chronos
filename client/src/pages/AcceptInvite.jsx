import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import { acceptCalendarInvite } from '../store/calendarSlice';
import { acceptEventInvite } from '../store/eventSlice';

export const AcceptInvite = ({ isEvent }) => {
  const { key } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEvent) {
      dispatch(acceptEventInvite({ key }));
      navigate('/home');
    } else {
      dispatch(acceptCalendarInvite({ key }));
      navigate('/home');
    }
  }, []);
  return <div></div>;
};
