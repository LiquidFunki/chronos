import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'flowbite-react';
import {
  MdEventNote,
  MdEdit,
  MdInfo,
  MdDelete,
  MdLock,
  MdLockOpen,
  MdPeople,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { deleteCalendar, deleteParticipant, getCalendar } from '../../store/calendarSlice';
import { editCalendarOn, infoCalendarOn } from '../../store/modalSlice';
import { getAllUsers } from '../../store/userSlice';

export const CalendarCard = ({ calendar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.auth);
  return (
    <div className='flex flex-col border cursor-pointer w-5/12 lg:w-1/5 mx-3 my-5 border-green-400 rounded-lg p-1 pb-3 hover:shadow-md hover:shadow-green-400 animate-appear'>
      <div className='flex self-end'>
        <Tooltip content='More info'>
          <MdInfo
            onClick={() => {
              dispatch(getCalendar({ id: calendar._id }));
              dispatch(getAllUsers());
              dispatch(infoCalendarOn());
            }}
            color='green'
            className='mx-1'
          />
        </Tooltip>
        {calendar.type !== 'main' && me.id === calendar.author && (
          <Tooltip content='Edit calendar'>
            <MdEdit
              onClick={() => {
                dispatch(getCalendar({ id: calendar._id }));
                dispatch(editCalendarOn());
              }}
              color='green'
              className='mx-1'
            />
          </Tooltip>
        )}
        {calendar.type !== 'main' && me.id === calendar.author && (
          <Tooltip content='Delete calendar'>
            <MdDelete
              onClick={() => dispatch(deleteCalendar({ id: calendar._id }))}
              color='green'
              className='mx-1'
            />
          </Tooltip>
        )}
        {calendar.participants.includes(me.id) && (
          <Tooltip content='Remove me from this calendar'>
            <MdDelete
              onClick={() => dispatch(deleteParticipant({ id: calendar._id }))}
              color='green'
              className='mx-1'
            />
          </Tooltip>
        )}
      </div>
      <div
        onClick={() => navigate(`/calendar/${calendar._id}`)}
        className='flex flex-col'>
        <span className='flex items-center font-bold mb-2 mt-1 w-full justify-center text-xl'>
          {calendar.name}
        </span>
        <span className='flex items-center w-full lg:px-5 justify-start text-lg'>
          <MdEventNote color='green' className='mx-3' />
          {calendar.events.length} Events
        </span>
        <span className='flex items-center w-full lg:px-5 justify-start text-lg'>
          {calendar.isPublic ? (
            <MdLockOpen color='green' className='mx-3' />
          ) : (
            <MdLock color='green' className='mx-3' />
          )}

          {calendar.isPublic ? 'Public' : 'Private'}
        </span>
        <span className='flex items-center w-full lg:px-5 justify-start text-lg'>
          <MdPeople color='green' className='mx-3' />
          {calendar.participants.length} members
        </span>
      </div>
    </div>
  );
};
