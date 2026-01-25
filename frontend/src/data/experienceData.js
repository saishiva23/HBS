
export const mockComplaints = [
    {
        id: 'CMP001',
        guestName: 'Robert Fox',
        subject: 'AC not working',
        description: 'The AC in room 101 stopped working last night and it was very uncomfortable.',
        status: 'Pending',
        priority: 'High',
        date: '2026-01-24',
        roomNumber: '101'
    },
    {
        id: 'CMP002',
        guestName: 'Jane Cooper',
        subject: 'Slow room service',
        description: 'Ordered breakfast at 8am, arrived at 9:15am. Second time this happened.',
        status: 'In Progress',
        priority: 'Medium',
        date: '2026-01-23',
        roomNumber: '204'
    },
    {
        id: 'CMP003',
        guestName: 'Guy Hawkins',
        subject: 'No hot water',
        description: 'Hot water not available in the shower this morning.',
        status: 'Resolved',
        priority: 'High',
        date: '2026-01-22',
        roomNumber: '305'
    }
];

export const mockPayments = [
    {
        id: 'TXN89123',
        guestName: 'Eleanor Pena',
        amount: 15400,
        status: 'Completed',
        date: '2026-01-25',
        method: 'Credit Card',
        bookingId: 'BK-7890'
    },
    {
        id: 'TXN89124',
        guestName: 'Jenny Wilson',
        amount: 8200,
        status: 'Pending',
        date: '2026-01-25',
        method: 'UPI',
        bookingId: 'BK-7891'
    },
    {
        id: 'TXN89125',
        guestName: 'Devon Lane',
        amount: 12000,
        status: 'Completed',
        date: '2026-01-24',
        method: 'Net Banking',
        bookingId: 'BK-7889'
    },
    {
        id: 'TXN89126',
        guestName: 'Theresa Webb',
        amount: 4500,
        status: 'Failed',
        date: '2026-01-24',
        method: 'Debit Card',
        bookingId: 'BK-7888'
    }
];
