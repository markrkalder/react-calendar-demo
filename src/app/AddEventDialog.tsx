'use client';

import React, { useRef, useState } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import 'dayjs/locale/en-gb';
import { EventInput } from '@fullcalendar/core';
import dayjs from 'dayjs';

interface AddEventDialogProps {
    open: boolean;
    onClose: () => void;
    onAddEvent: (event: EventInput) => void;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({
    open,
    onClose,
    onAddEvent,
}) => {
    const [title, setTitle] = useState('');
    const startDateRef = useRef<HTMLInputElement | null>(null);
    const endDateRef = useRef<HTMLInputElement | null>(null);
    const [eventType, setEventType] = useState('');

    type EventTypeColors = {
        [key: string]: string;
    };

    const eventTypeColors: EventTypeColors = {
        education: 'lightsalmon',
        theatre: 'yellowgreen',
        meeting: 'pink',
        training: 'red',
        joint: 'indianred',
        class: 'sandybrown',
        learning: 'mediumaquamarine',
        other: 'mediumturquoise',
        holiday: 'red',
    };

    const handleAddEvent = () => {
        const startDateString = startDateRef.current?.value || '';
        const endDateString = endDateRef.current?.value || '';

        const startDateValue = dayjs(startDateString, 'DD/MM/YYYY').toDate();
        const endDateValue = dayjs(endDateString, 'DD/MM/YYYY').toDate();

        if (startDateValue > endDateValue) {
            alert('Start date should be equal or smaller than end date.');
            return;
        }

        const newEvent: EventInput = {
            title: title,
            start: startDateValue,
            end: endDateValue,
            allDay: true,
            extendedProps: {
                type: eventType,
            },
            backgroundColor: eventTypeColors[eventType],
            borderColor: eventTypeColors[eventType],
        } as unknown as EventInput;

        onAddEvent(newEvent);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Event </DialogTitle>
            <DialogContent>
                <TextField
                    label="Event Title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en-gb"
                >
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                            label="Event Start Date"
                            inputRef={startDateRef}
                        />
                        <DatePicker
                            label="Event End Date"
                            inputRef={endDateRef}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="event-type-label"> Event Type </InputLabel>
                    <Select
                        labelId="event-type-label"
                        id="event-type"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        label="Event Type"
                    >
                        <MenuItem value="education">Education project</MenuItem>
                        <MenuItem value="theatre">Theatre/Concert</MenuItem>
                        <MenuItem value="meeting">Meeting</MenuItem>
                        <MenuItem value="training">Training</MenuItem>
                        <MenuItem value="joint">Joint event</MenuItem>
                        <MenuItem value="class">Class event</MenuItem>
                        <MenuItem value="learning">Learning activity</MenuItem>
                        <MenuItem value="other">Other event</MenuItem>
                        <MenuItem value="holiday">Public holidays</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}> Cancel </Button>
                <Button onClick={handleAddEvent}> Add Event </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEventDialog;
