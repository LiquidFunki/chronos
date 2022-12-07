/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarCreateForm } from '../components/calendar/CalendarCreateForm';
import { EditCalendarForm } from '../components/calendar/EditCalendarForm';
import { InfoCalendarForm } from '../components/calendar/InfoCalendarForm';
import { CreateEventForm } from '../components/event/CreateEventForm';
import { EditEventForm } from '../components/event/EditEventForm';
import { InfoEventForm } from '../components/event/InfoEventForm';
import { ModalWin } from '../components/ModalWin';
import { ProfileSettings } from '../components/user/ProfileSettings';
import {
  inviteOff,
  createEventOff,
  createCalendarOff,
  editCalendarOff,
  editEventOff,
  infoEventOff,
  settingsOff,
  infoCalendarOff,
} from '../store/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();
  const {
    createCalendar,
    editCalendar,
    createEvent,
    editEvent,
    invite,
    infoEvent,
    infoCalendar,
    settings,
  } = useSelector((state) => state.modal);

  return (
    <div>
      <ModalWin
        show={settings}
        header={'Profile settings'}
        onHide={() => dispatch(settingsOff())}>
        <ProfileSettings />
      </ModalWin>
      <ModalWin show={invite} onHide={() => dispatch(inviteOff())}>
        <div>
          <h1>INVITE</h1>
        </div>
      </ModalWin>
      <ModalWin
        show={createCalendar}
        header={'Calendar creation'}
        onHide={() => dispatch(createCalendarOff())}>
        <CalendarCreateForm />
      </ModalWin>
      <ModalWin
        show={createEvent}
        header={'Event creation'}
        onHide={() => dispatch(createEventOff())}>
        <CreateEventForm />
      </ModalWin>
      <ModalWin show={editCalendar} header={'Calendar edition'} onHide={() => dispatch(editCalendarOff())}>
        <EditCalendarForm />
      </ModalWin>
      <ModalWin show={editEvent} header={'Event edition'} onHide={() => dispatch(editEventOff())}>
        <EditEventForm />
      </ModalWin>
      <ModalWin
        show={infoEvent}
        header={
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Event Information
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Details about event
            </p>
          </div>
        }
        onHide={() => dispatch(infoEventOff())}>
        <InfoEventForm />
      </ModalWin>
      <ModalWin
        show={infoCalendar}
        header={
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Calendar Information
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Details about calendar
            </p>
          </div>
        }
        onHide={() => dispatch(infoCalendarOff())}>
        <InfoCalendarForm />
      </ModalWin>
    </div>
  );
};
