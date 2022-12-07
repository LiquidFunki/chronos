import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Checkbox, Label, Button } from 'flowbite-react';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiFileCopy2Fill, RiMailAddLine } from 'react-icons/ri';
import { useMessage } from '../../hooks/message.hook';
import { usersToSelect } from '../../utils/user.utils';

import { Loader } from '../Loader';
import { deleteEvent, updateEvent } from '../../store/eventSlice';
import { editEventOn, infoEventOff } from '../../store/modalSlice';

export const InfoEventForm = () => {
  const dispatch = useDispatch();
  const message = useMessage();
  const navigate = useNavigate();

  const { users, isLoading: usersLoading } = useSelector((state) => state.user);
  const { eventLoading, event } = useSelector((state) => state.event);
  const { me } = useSelector((state) => state.auth);
  const [isPerformed, setIsPerformed] = useState(!!event.isPerformed);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    setUserOptions(usersToSelect(users));
  }, [usersLoading]);

  useEffect(() => {
    setIsPerformed(!!event.isPerformed);
  }, [event.isPerformed]);

  if (eventLoading) return <Loader />;
  return (
    <div className='overflow-hidden bg-white animate-appear sm:rounded-lg'>
      <dl>
        <div className=' bg-white px-4 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='flex items-center text-sm font-medium text-gray-500'>
            Author
          </dt>
          <dd className='flex items-center mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            <Avatar
              className='pr-3'
              alt='User settings'
              img={event.author ? event.author.avatar : ''}
            />
            <p
              className='cursor-pointer'
              onClick={() => {
                navigate(`/user/${event.author._id}`);
                dispatch(infoEventOff());
              }}>
              {event.author ? event.author.login : ''}
            </p>
          </dd>
        </div>
        <div className='bg-green-100 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>Name</dt>
          <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {event.name}
          </dd>
        </div>
        <div className='bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>Type</dt>
          <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {event.type}
          </dd>
        </div>
        <div className='bg-green-100 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='flex items-center text-sm font-medium text-gray-500'>
            Description
          </dt>
          <dd className='overflow-y-auto max-h-20 mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {event.description}
          </dd>
        </div>
        <div className='bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='flex items-center text-sm font-medium text-gray-500'>
            Participants
          </dt>
          <dd className='overflow-y-auto max-h-14 mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {event.sharedParticipants
              && !event.sharedParticipants.length
              && 'There are no participants'}
            {event.sharedParticipants
              && event.sharedParticipants.map((participant) => (
                <div
                  key={participant.login}
                  className='flex items-center mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  <Avatar
                    className='pr-3'
                    alt='User settings'
                    img={participant.avatar}
                  />
                  <p
                    className='cursor-pointer'
                    onClick={() => {
                      navigate(`/user/${participant._id}`);
                      dispatch(infoEventOff());
                    }}>
                    {participant.login}
                  </p>
                </div>
              ))}
          </dd>
        </div>
        <div className='bg-green-100 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>
            Start {event.allDay ? 'at' : '- End'}
          </dt>
          <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {new Date(event.startEvent).toLocaleString()} -{' '}
            {event.allDay ? (
              <b>( Event lasts all day )</b>
            ) : (
              new Date(event.endEvent).toLocaleString()
            )}
          </dd>
        </div>
      </dl>
      {event.author
        && event.author._id === me.id
        && event.type !== 'holiday' && (
          <>
            <div className='border-t my-3'></div>
            <div className='flex'>
              <Select
                className='basic-single w-9/12 p-0 pt-2 m-0'
                classNamePrefix='select'
                isClearable
                isSearchable
                isMulti
                name='categories'
                options={userOptions}
                placeholder='Type user login to invite.'
              />
              <button className='w-3/12 flex items-center justify-center text-white rounded-md bg-green-500 hover:bg-green-600 hover:shadow-md hover:shadow-green-400'>
                <RiMailAddLine color='white' className='mr-3' /> Send invite
              </button>
            </div>
            <div className='w-full  mt-3 flex border rounded-md border-green-200'>
              <input
                disabled
                value={event.inviteLink}
                className='w-9/12 py-3 px-4 text-sm'
              />
              <CopyToClipboard
                text={event.inviteLink}
                onCopy={() => message('Invitation link copied')}>
                <button className='w-3/12 flex items-center justify-center text-white rounded-md bg-green-500 hover:bg-green-600 hover:shadow-md hover:shadow-green-400'>
                  <RiFileCopy2Fill color='white' className='mr-3' /> Copy
                </button>
              </CopyToClipboard>
            </div>
          </>
      )}
      {event.author && event.author._id === me.id && (
        <div className='border-t mt-3 py-3 px-4 border-gray-200'>
          <Checkbox
            disabled={event.type === 'holiday'}
            onChange={() => {
              dispatch(updateEvent({ ...event, isPerformed: !isPerformed }));
              setIsPerformed(!isPerformed);
            }}
            checked={isPerformed}
            className='cursor-pointer'
            id='remember'
          />
          <Label className='pl-5 cursor-pointer' htmlFor='remember'>
            Event is performed
          </Label>
          <div className='flex justify-between mt-5'>
            <Button
              disabled={event.type === 'holiday'}
              onClick={() => {
                dispatch(infoEventOff());
                dispatch(editEventOn());
              }}
              gradientMonochrome='cyan'>
              Edit Event
            </Button>
            <Button
              disabled={event.type === 'holiday'}
              onClick={() => {
                dispatch(deleteEvent({ id: event._id }));
                dispatch(infoEventOff());
              }}
              gradientMonochrome='failure'>
              Delete Event
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
