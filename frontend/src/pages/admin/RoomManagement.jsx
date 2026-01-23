import { useState } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaTimes,
    FaUserFriends,
    FaDollarSign,
    FaBed,
    FaCheck,
} from 'react-icons/fa';
import AdminLayout from '../../layouts/AdminLayout';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([
        { id: 1, number: '101', type: 'Deluxe Suite', capacity: 2, price: 450, status: 'Available', floor: 1, beds: '1 King Bed', size: '450 sq ft' },
        { id: 2, number: '102', type: 'Standard Room', capacity: 2, price: 220, status: 'Occupied', floor: 1, beds: '2 Single Beds', size: '300 sq ft' },
        { id: 3, number: '201', type: 'Premium Suite', capacity: 4, price: 680, status: 'Available', floor: 2, beds: '1 King + 1 Queen', size: '600 sq ft' },
        { id: 4, number: '202', type: 'Family Room', capacity: 4, price: 390, status: 'Maintenance', floor: 2, beds: '2 Queen Beds', size: '500 sq ft' },
        { id: 5, number: '301', type: 'Executive Suite', capacity: 2, price: 850, status: 'Available', floor: 3, beds: '1 King Bed', size: '700 sq ft' },
        { id: 6, number: '302', type: 'Standard Room', capacity: 2, price: 220, status: 'Available', floor: 3, beds: '1 Queen Bed', size: '300 sq ft' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        type: 'Standard Room',
        capacity: 2,
        price: 0,
        status: 'Available',
        floor: 1,
        beds: '',
        size: '',
    });

    const roomTypes = ['Standard Room', 'Deluxe Suite', 'Premium Suite', 'Family Room', 'Executive Suite', 'Presidential Suite'];
    const statusOptions = ['Available', 'Occupied', 'Maintenance', 'Reserved'];

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || room.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddRoom = () => {
        if (editingRoom) {
            setRooms(rooms.map(room => room.id === editingRoom.id ? { ...formData, id: room.id } : room));
        } else {
            setRooms([...rooms, { ...formData, id: Date.now() }]);
        }
        resetForm();
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setFormData(room);
        setShowAddModal(true);
    };

    const handleDeleteRoom = (id) => {
        if (confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(room => room.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            number: '',
            type: 'Standard Room',
            capacity: 2,
            price: 0,
            status: 'Available',
            floor: 1,
            beds: '',
            size: '',
        });
        setEditingRoom(null);
        setShowAddModal(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'Occupied': return 'bg-red-100 text-red-700 border-red-300';
            case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'Reserved': return 'bg-blue-100 text-blue-700 border-blue-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const stats = [
        { label: 'Total Rooms', value: rooms.length, color: 'from-blue-500 to-indigo-600' },
        { label: 'Available', value: rooms.filter(r => r.status === 'Available').length, color: 'from-emerald-500 to-teal-600' },
        { label: 'Occupied', value: rooms.filter(r => r.status === 'Occupied').length, color: 'from-red-500 to-pink-600' },
        { label: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, color: 'from-amber-500 to-orange-600' },
    ];


    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Room Management 🛏️
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your hotel rooms and availability
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all border border-gray-100 dark:border-gray-700">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                                    <FaBed className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search rooms by number or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="relative">
                                    <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="pl-12 pr-8 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all appearance-none"
                                    >
                                        <option>All</option>
                                        {statusOptions.map(status => (
                                            <option key={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    Add Room
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Rooms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map((room) => (
                            <div key={room.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                {/* Room Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                                    <FaBed className="h-20 w-20 text-white opacity-50" />
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-bold text-gray-900">
                                        Room {room.number}
                                    </span>
                                    <span className={`absolute top-4 right-4 px-3 py-1 backdrop-blur rounded-full text-xs font-semibold border-2 ${getStatusColor(room.status)}`}>
                                        {room.status}
                                    </span>
                                </div>

                                {/* Room Details */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{room.type}</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <FaUserFriends className="h-5 w-5 text-blue-500" />
                                            <span>{room.capacity} Guests</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <FaBed className="h-5 w-5 text-yellow-500" />
                                            <span>{room.beds} • {room.size}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <FaDollarSign className="h-5 w-5 text-blue-500" />
                                            <span className="text-lg font-bold text-blue-600">${room.price}</span>
                                            <span className="text-gray-500">/ night</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditRoom(room)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Edit Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <h2 className="text-2xl font-bold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                                    <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                                        <FaTimes className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Room Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={formData.number}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                placeholder="e.g., 101"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Floor *
                                            </label>
                                            <input
                                                type="number"
                                                name="floor"
                                                value={formData.floor}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Room Type *
                                            </label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            >
                                                {roomTypes.map(type => (
                                                    <option key={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Status *
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Capacity *
                                            </label>
                                            <input
                                                type="number"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Price per Night *
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Bed Configuration *
                                            </label>
                                            <input
                                                type="text"
                                                name="beds"
                                                value={formData.beds}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                placeholder="e.g., 1 King Bed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Room Size *
                                            </label>
                                            <input
                                                type="text"
                                                name="size"
                                                value={formData.size}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                placeholder="e.g., 450 sq ft"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleAddRoom}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                        >
                                            <FaCheck className="h-5 w-5" />
                                            {editingRoom ? 'Update Room' : 'Add Room'}
                                        </button>
                                        <button
                                            onClick={resetForm}
                                            className="px-6 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default RoomManagement;
