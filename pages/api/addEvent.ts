import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../data/db';

const addEvent = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const events = req.body;

            db.push('/events', events);

            res.status(200).json({ message: 'Events added successfully' });
        } catch (error) {
            console.error('Error saving events:', error);
            res.status(500).json({ error: 'Error saving events' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default addEvent;
