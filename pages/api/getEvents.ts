import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../data/db';

const getEvents = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const eventsData = await db.getData('/events');
            res.status(200).json({ events: eventsData });
        } catch (error) {
            console.error('Error reading events from the database:', error);
            res.status(500).json({ error: 'Error saving event' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default getEvents;
