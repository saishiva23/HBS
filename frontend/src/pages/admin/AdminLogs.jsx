import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminAPI } from '../../services/completeAPI';
import { 
    FaHistory, 
    FaHotel, 
    FaUser, 
    FaSearch,
    FaFilter
} from 'react-icons/fa';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, hotel, user

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const [users, hotels] = await Promise.all([
                adminAPI.getAllUsers(),
                adminAPI.getAllHotels()
            ]);

            // Map Users to Log Entries
            const userLogs = users.map(u => ({
                id: `u-${u.id}`,
                type: 'user',
                action: 'New Customer Joined',
                entityName: `${u.firstName} ${u.lastName}`,
                details: `Email: ${u.email}`,
                date: u.createdAt || new Date().toISOString(), // Fallback if createdAt missing
                status: 'success'
            }));

            // Map Hotels to Log Entries
            const hotelLogs = hotels.map(h => ({
                id: `h-${h.id}`,
                type: 'hotel',
                action: 'New Hotel Registered',
                entityName: h.name,
                details: `Location: ${h.city}, ${h.state}`,
                date: h.createdAt || new Date().toISOString(),
                status: h.status === 'PENDING' ? 'warning' : h.status === 'APPROVED' ? 'success' : 'danger'
            }));

            // Merge and Sort by Date Descending
            const allLogs = [...userLogs, ...hotelLogs].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );

            setLogs(allLogs);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || log.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <AdminLayout>
             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                            <FaHistory className="text-blue-600" /> System Activity Logs
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Comprehensive record of all platform activities and registrations
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setFilterType('hotel')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filterType === 'hotel' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                            >
                                <FaHotel className="inline mr-2" />
                                Hotels
                            </button>
                            <button 
                                onClick={() => setFilterType('user')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filterType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                            >
                                <FaUser className="inline mr-2" />
                                Users
                            </button>
                        </div>
                    </div>

                    {/* Logs List */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        {loading ? (
                             <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-500">Loading activity...</p>
                            </div>
                        ) : filteredLogs.length > 0 ? (
                            <div className="divide-y dark:divide-gray-700">
                                {filteredLogs.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition flex items-center gap-4">
                                        <div className={`p-3 rounded-full flex-shrink-0 ${
                                            log.type === 'hotel' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                                        }`}>
                                            {log.type === 'hotel' ? <FaHotel /> : <FaUser />}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{log.action}</h3>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(log.date).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{log.entityName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{log.details}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            log.status === 'success' ? 'bg-green-100 text-green-700' :
                                            log.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {log.type === 'user' ? 'Joined' : 
                                             log.status === 'success' ? 'Approved' : 
                                             log.status === 'warning' ? 'Pending' : 'Rejected'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No activity found matching your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminLogs;
