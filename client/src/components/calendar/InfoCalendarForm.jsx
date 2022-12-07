import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiFileCopy2Fill, RiMailAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Avatar, Checkbox, Label, Button } from 'flowbite-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Select from 'react-select';

import { useMessage } from '../../hooks/message.hook';
import { Loader } from '../Loader';
import { editCalendarOn, infoCalendarOff } from '../../store/modalSlice';
import { deleteCalendar, updateCalendar } from '../../store/calendarSlice';
import { usersToSelect } from '../../utils/user.utils';

export const InfoCalendarForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useMessage();
  const { calendarLoading, currentCalendar } = useSelector(
    (state) => state.calendar
  );
  const { me } = useSelector((state) => state.auth);
  const { users, isLoading: usersLoading } = useSelector((state) => state.user);
  const [isHidden, setIsHidden] = useState(!!currentCalendar.isHidden);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    setUserOptions(usersToSelect(users));
  }, [usersLoading]);

  useEffect(() => {
    setIsHidden(!!currentCalendar.isHidden);
  }, [currentCalendar.isHidden]);

  if (calendarLoading) return <Loader />;
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
              img={currentCalendar.author ? currentCalendar.author.avatar : ''}
            />
            <p
              className='cursor-pointer'
              onClick={() => {
                navigate(`/user/${currentCalendar.author._id}`);
                dispatch(infoCalendarOff());
              }}>
              {currentCalendar.author ? currentCalendar.author.login : ''}
            </p>
          </dd>
        </div>
        <div className='bg-green-100 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>Name</dt>
          <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {currentCalendar.name}
          </dd>
        </div>
        <div className='bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>Description</dt>
          <dd className='overflow-y-auto max-h-20 mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {currentCalendar.description}
          </dd>
        </div>
        <div className='bg-green-100 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>Type:</dt>
          <dd className='overflow-y-auto max-h-20 mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {currentCalendar.type}
          </dd>
        </div>
        <div className='bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='flex items-center text-sm font-medium text-gray-500'>
            Participants
          </dt>
          <dd className='overflow-y-auto max-h-14 mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
            {currentCalendar.participants
              && !currentCalendar.participants.length
              && 'There are no participants'}
            {currentCalendar.participants
              && currentCalendar.participants.map((participant) => (
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
                      dispatch(infoCalendarOff());
                    }}>
                    {participant.login}
                  </p>
                </div>
              ))}
          </dd>
        </div>
      </dl>
      {currentCalendar.author
        && currentCalendar.author._id === me.id
        && currentCalendar.type !== 'main' && (
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
                value={currentCalendar.inviteLink}
                className='w-9/12 py-3 px-4 text-sm'
              />
              <CopyToClipboard
                text={currentCalendar.inviteLink}
                onCopy={() => message('Invitation link copied')}>
                <button className='w-3/12 flex items-center justify-center text-white rounded-md bg-green-500 hover:bg-green-600 hover:shadow-md hover:shadow-green-400'>
                  <RiFileCopy2Fill color='white' className='mr-3' /> Copy
                </button>
              </CopyToClipboard>
            </div>
          </>
      )}
      {currentCalendar.author && currentCalendar.author._id === me.id && (
        <div className='border-t mt-3 py-3 px-4 border-gray-200'>
          <Checkbox
            disabled={currentCalendar.type === 'main'}
            onChange={() => {
              dispatch(
                updateCalendar({ ...currentCalendar, isHidden: !isHidden })
              );
              setIsHidden(!isHidden);
            }}
            checked={isHidden}
            className='cursor-pointer'
            id='remember'
          />
          <Label className='pl-5 cursor-pointer' htmlFor='remember'>
            Calendar is hidden
          </Label>
          <div className='flex justify-between mt-5'>
            <Button
              disabled={currentCalendar.type === 'main'}
              onClick={() => {
                dispatch(infoCalendarOff());
                dispatch(editCalendarOn());
              }}
              gradientMonochrome='cyan'>
              Edit Calendar
            </Button>
            <Button
              disabled={currentCalendar.type === 'main'}
              onClick={() => {
                dispatch(deleteCalendar({ id: currentCalendar._id }));
                dispatch(infoCalendarOff());
              }}
              gradientMonochrome='failure'>
              Delete Calendar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
