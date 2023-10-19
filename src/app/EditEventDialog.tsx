'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
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
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { EventInput } from '@fullcalendar/core';

interface EditEventDialogProps {
    open: boolean;
    onClose: () => void;
    onEditEvent: (event: EventInput) => void;
    onDeleteEvent: () => void;
    eventToEdit: EventInput | null;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({
    open,
    onClose,
    onEditEvent,
    onDeleteEvent,
    eventToEdit,
}) => {
    const [title, setTitle] = useState<string>(eventToEdit?.title ?? '');
    const startDateRef = useRef<HTMLInputElement | null>(null);
    const endDateRef = useRef<HTMLInputElement | null>(null);
    const [eventType, setEventType] = useState(
        eventToEdit?.extendedProps?.type ?? ''
    );

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title as string);
            setEventType(eventToEdit.extendedProps?.type);
            if (startDateRef.current) {
                startDateRef.current.value = dayjs(
                    eventToEdit.start as Date
                ).format('DD/MM/YYYY');
            }

            if (endDateRef.current) {
                endDateRef.current.value = dayjs(
                    eventToEdit.end as Date
                ).format('DD/MM/YYYY');
            }
        }
    }, [eventToEdit]);

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

    const handleSaveEvent = () => {
        const startDateString = startDateRef.current
            ? startDateRef.current.value
            : '';
        const endDateString = endDateRef.current
            ? endDateRef.current.value
            : '';

        const startDateValue = dayjs(startDateString, 'DD/MM/YYYY').toDate();
        const endDateValue = dayjs(endDateString, 'DD/MM/YYYY').toDate();
        const editedEvent: EventInput = {
            ...eventToEdit,
            title,
            start: startDateValue,
            end: endDateValue,
            extendedProps: {
                type: eventType,
            },
            backgroundColor: eventTypeColors[eventType],
            borderColor: eventTypeColors[eventType],
        };

        onEditEvent(editedEvent);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Event</DialogTitle>
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
                            defaultValue={dayjs(eventToEdit?.start as Date)}
                            inputRef={startDateRef}
                        />
                        <DatePicker
                            label="Event End Date"
                            defaultValue={dayjs(eventToEdit?.end as Date)}
                            inputRef={endDateRef}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="event-type-label">Event Type</InputLabel>
                    <Select
                        labelId="event-type-label"
                        id="event-type"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as string)}
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
                <Button onClick={onDeleteEvent} color="error">
                    Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSaveEvent}>Save Event</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEventDialog;
