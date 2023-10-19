'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import Icon from '@mdi/react';
import Button from '@mui/material/Button';
import {
    mdiAccountGroup,
    mdiApplication,
    mdiBookVariant,
    mdiBullhorn,
    mdiCalendar,
    mdiCalendarClock,
    mdiCalendarStar,
    mdiCheckCircle,
    mdiCheckCircleOutline,
    mdiFileDocument,
    mdiFood,
    mdiHelpCircle,
    mdiImage,
    mdiMessage,
    mdiPoll,
    mdiViewDashboard,
} from '@mdi/js';
import AddEventDialog from './AddEventDialog';
import EditEventDialog from './EditEventDialog';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './calendar.css';

type Props = {
    color: string;
    label: string;
    path?: string;
};

const EventTypeIcon: React.FC<Props> = ({
    color,
    label,
    path = mdiCheckCircle,
}) => (
    <div className="flex flex-row mt-1">
        <Icon path={path} size={1.5} color={color} />
        <label className="text-xl mt-1 ml-2">{label}</label>
    </div>
);

const eventTypeData = [
    { color: 'lightsalmon', label: 'Education project' },
    { color: 'yellowgreen', label: 'Theatre/Concert' },
    { color: 'pink', label: 'Meeting' },
    { color: 'red', label: 'Training' },
    { color: 'indianred', label: 'Joint event' },
    { color: 'sandybrown', label: 'Class event' },
    { color: 'mediumaquamarine', label: 'Learning Activity' },
    { color: 'mediumturquoise', label: 'Other event' },
    { color: 'red', label: 'Public holidays', path: mdiCheckCircleOutline },
];

export default function Home() {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [eventToEdit, setEventToEdit] = useState<EventInput | null>(null);
    const [latestEventId, setLatestEventId] = useState<number>(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('api/getEvents', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEvents(data.events || []);
                    if (data.events) {
                        data.events.forEach((e: EventInput) => {
                            if (e.id) {
                                const eventIdInt = parseInt(e.id);
                                if (eventIdInt > latestEventId) {
                                    setLatestEventId(eventIdInt + 1);
                                }
                            }
                        });
                    }
                } else {
                    console.error(
                        'Error getting events from the database:',
                        response.statusText
                    );
                }
            } catch (error) {
                console.error('Error getting events from the database:', error);
            }
        };

        fetchData();
    });

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleAddEvent = (event: EventInput) => {
        setLatestEventId(latestEventId + 1);
        event.id = latestEventId.toString();
        setEvents((prevEvents) => {
            const updatedEvents = [...prevEvents, event];
            updateDatabase(updatedEvents);
            return updatedEvents;
        });
    };

    const updateDatabase = async (eventsToPush: EventInput[]) => {
        try {
            const response = await fetch('api/addEvent', {
                method: 'POST',
                body: JSON.stringify(eventsToPush),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                console.log('New event added to the database.');
            } else {
                console.error('Error adding event:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const handleOpenEditDialog = (event: EventInput) => {
        setEventToEdit(event);
        setIsEditDialogOpen(true);
    };

    const handleEditEvent = (editedEvent: EventInput) => {
        const updatedEvents = events.map((event) =>
            event.id === editedEvent.id ? editedEvent : event
        );
        updateDatabase(updatedEvents);
        setEvents(updatedEvents);
        setIsEditDialogOpen(false);
    };

    const handleDeleteEvent = () => {
        const updatedEvents = events.filter(
            (event) => event.id !== eventToEdit?.id
        );
        updateDatabase(updatedEvents);
        setEvents(updatedEvents);
        setIsEditDialogOpen(false);
    };

    const menuItems = {
        Dashboard: mdiViewDashboard,
        Diary: mdiBookVariant,
        Plans: mdiCalendar,
        Messages: mdiMessage,
        Announcements: mdiBullhorn,
        'Work schedule': mdiCalendarClock,
        Events: mdiCalendarStar,
        Gallery: mdiImage,
        Documents: mdiFileDocument,
        'Food menu': mdiFood,
        Applications: mdiApplication,
        Contacts: mdiAccountGroup,
        Surveys: mdiPoll,
        Help: mdiHelpCircle,
    };

    const headerIcons = [
        mdiFileDocument,
        mdiFood,
        mdiApplication,
        mdiAccountGroup,
        mdiPoll,
    ];

    return (
        <div>
            <div
                id="header-bar"
                className="h-16 flex items-center pl-5 py-12 justify-between border-b-2"
            >
                <img
                    src={'https://eliis.eu/img/eliis_logo.e14f91e1.png'}
                    alt="Logo"
                    className="h-12 w-30"
                />
                <div className="flex flew-row items-center pr-3">
                    <div className="pr-3">
                        {headerIcons.map((item, index) => (
                            <Button
                                className="rounded-full bg-orange-300 mx-1 min-w-[48px] max-w-[48px] h-12 p-0 align-middle"
                                variant="contained"
                                key={index}
                            >
                                <Icon path={item} size={1} />
                            </Button>
                        ))}
                    </div>
                    <div className="border-l-2 pl-5 pr-3 flex flex-col align-middle">
                        <label className="text-xl font-bold">
                            {' '}
                            Eliis Õpetaja{' '}
                        </label>
                        <label className="text-xl text-lime-500/75 pt-1">
                            {' '}
                            Lasteaed ELIIS{' '}
                        </label>
                    </div>
                    <Button
                        className="h-16 w-16 rounded-full bg-lime-500"
                        variant="contained"
                    >
                        <text className="text-3xl font-normal"> EÕ </text>
                    </Button>
                </div>
            </div>
            <div className="flex flex-row" id="main-container">
                <div
                    id="side-bar"
                    className="flex flex-col ml-5 pt-3 w-50 pr-5 border-r-2"
                >
                    {Object.entries(menuItems).map(
                        ([label, iconClass], index) => (
                            <Button
                                className="justify-start text-sm my-1.5 rounded-md pl-1 w-96 h-14"
                                key={index}
                                variant="contained"
                                style={{
                                    background:
                                        'linear-gradient(#fff, #f0f0f0, #fff)',
                                    border: '1px solid #ccc',
                                    color: 'rgba(45,36,36,0.7)',
                                }}
                            >
                                <div
                                    style={{
                                        background: 'lightsalmon',
                                        borderRadius: '15%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '10px',
                                        marginLeft: '2px',
                                    }}
                                >
                                    <Icon
                                        path={iconClass}
                                        size={1.2}
                                        color="#ffffff"
                                    />
                                </div>
                                {label}
                            </Button>
                        )
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="ml-4 my-6">
                        <label className="text-4xl font-medium">
                            {' '}
                            Event calendar{' '}
                        </label>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-row">
                            <div className="flex flex-col pr-24 pl-3 border-r-2 border-gray-300 h-screen">
                                <label className="font-bold text-lg pl-0.5 py-1">
                                    {' '}
                                    TYPES{' '}
                                </label>
                                {eventTypeData.map((type, index) => (
                                    <EventTypeIcon
                                        key={index}
                                        color={type.color}
                                        label={type.label}
                                        path={type.path}
                                    />
                                ))}
                            </div>
                            <div className="flex pl-5">
                                <div className="w-[69vw]">
                                    <FullCalendar
                                        customButtons={{
                                            createNewEventButton: {
                                                text: 'Create new event',
                                                click: handleOpenDialog,
                                            },
                                        }}
                                        plugins={[dayGridPlugin]}
                                        initialView="dayGridMonth"
                                        events={events}
                                        eventClick={(info) =>
                                            handleOpenEditDialog(
                                                info.event.toPlainObject()
                                            )
                                        }
                                        headerToolbar={{
                                            start: 'createNewEventButton',
                                            center: 'title',
                                            end: 'prev next',
                                        }}
                                        firstDay={1}
                                        height={'100%'}
                                    />
                                </div>

                                <AddEventDialog
                                    open={isDialogOpen}
                                    onClose={() => setIsDialogOpen(false)}
                                    onAddEvent={handleAddEvent}
                                />
                                <EditEventDialog
                                    open={isEditDialogOpen}
                                    onClose={() => setIsEditDialogOpen(false)}
                                    onEditEvent={handleEditEvent}
                                    onDeleteEvent={handleDeleteEvent}
                                    eventToEdit={eventToEdit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
