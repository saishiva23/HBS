import { useState, useEffect } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaTimes,
    FaBed,
    FaCheck,
} from 'react-icons/fa';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useHotel } from '../../context/HotelContext';
import { ownerRoomManagement } from '../../services/completeAPI';
import { useToast } from '../../contexts/ToastContext';

const RoomManagement = () => {
    const { selectedHotel } = useHotel();
    const { showToast } = useToast();
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomTypeId: '',
        isActive: true,
        status: 'AVAILABLE',
    });

    useEffect(() => {
        if (selectedHotel) {
            fetchRooms();
            fetchRoomTypes();
            fetchRoomStats();
        }
    }, [selectedHotel]);

    const fetchRooms = async () => {
        if (!selectedHotel) return;
        setIsLoading(true);
        try {
            const data = await ownerRoomManagement.getRoomsList(selectedHotel.id);
            setRooms(data);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
            showToast('Failed to load rooms: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoomTypes = async () => {
        if (!selectedHotel) return;
        try {
            const data = await ownerRoomManagement.getRooms(selectedHotel.id);
            setRoomTypes(data);
        } catch (error) {
            console.error('Failed to fetch room types', error);
        }
    };

    const fetchRoomStats = async () => {
        if (!selectedHotel) return;
        try {
            const response = await ownerRoomManagement.getRoomStats(selectedHotel.id);
            const statsData = response.data || response;

            setStats([
                { label: 'Total Rooms', value: statsData.totalRooms || 0, color: 'from-blue-500 to-blue-600' },
                { label: 'Available', value: statsData.availableRooms || 0, color: 'from-green-500 to-green-600' },
                { label: 'Occupied', value: statsData.occupiedRooms || 0, color: 'from-yellow-500 to-yellow-600' },
                { label: 'Maintenance', value: statsData.maintenanceRooms || 0, color: 'from-red-500 to-red-600' }
            ]);
        } catch (error) {
            console.error('Failed to fetch room stats', error);
            // Fall back to static calculation if API fails
            const fallbackStats = [
                { label: 'Total Rooms', value: rooms.length, color: 'from-blue-500 to-blue-600' },
                { label: 'Available', value: rooms.filter(r => r.status === 'AVAILABLE').length, color: 'from-green-500 to-green-600' },
                { label: 'Occupied', value: rooms.filter(r => r.status === 'OCCUPIED').length, color: 'from-yellow-500 to-yellow-600' },
                { label: 'Maintenance', value: rooms.filter(r => r.status === 'MAINTENANCE').length, color: 'from-red-500 to-red-600' }
            ];
            setStats(fallbackStats);
        }
    };

    const [stats, setStats] = useState([
        { label: 'Total Rooms', value: 0, color: 'from-blue-500 to-blue-600' },
        { label: 'Available', value: 0, color: 'from-green-500 to-green-600' },
        { label: 'Occupied', value: 0, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Maintenance', value: 0, color: 'from-red-500 to-red-600' }
    ]);

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || room.status === filterStatus.toUpperCase();
        return matchesSearch && matchesFilter;
    });

    const getRoomTypeName = (room) => {
        return room.roomTypeName || 'Unknown';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-green-500/90 text-white border-green-400';
            case 'OCCUPIED':
                return 'bg-yellow-500/90 text-white border-yellow-400';
            case 'MAINTENANCE':
                return 'bg-red-500/90 text-white border-red-400';
            case 'RESERVED':
                return 'bg-blue-500/90 text-white border-blue-400';
            default:
                return 'bg-gray-500/90 text-white border-gray-400';
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setFormData({
            roomNumber: room.roomNumber,
            roomTypeId: room.roomTypeId || '',
            isActive: room.isActive,
            status: room.status || 'AVAILABLE',
        });
        setShowAddModal(true);
    };

    const handleDeleteRoom = async (room) => {
        if (!window.confirm(`Delete room ${room.roomNumber}?`)) return;
        if (!selectedHotel) return;

        try {
            await ownerRoomManagement.deleteRoomFromList(selectedHotel.id, room.id);
            await fetchRooms();
            showToast('Room deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete room', error);
            showToast('Failed to delete: ' + error.message, 'error');
        }
    };

    const handleAddRoom = async () => {
        if (!selectedHotel) {
            showToast('No hotel selected!', 'warning');
            return;
        }

        if (!formData.roomNumber || !formData.roomTypeId) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        try {
            const payload = {
                roomNumber: formData.roomNumber,
                roomTypeId: parseInt(formData.roomTypeId),
                isActive: formData.isActive,
                status: formData.status,
            };

            if (editingRoom) {
                await ownerRoomManagement.updateRoomInList(selectedHotel.id, editingRoom.id, payload);
                showToast('Room updated successfully', 'success');
            } else {
                await ownerRoomManagement.addRoomToList(selectedHotel.id, payload);
                showToast('Room added successfully', 'success');
            }

            await fetchRooms();
            resetForm();
        } catch (error) {
            console.error('Failed to save room', error);
            showToast('Failed to save: ' + error.message, 'error');
        }
    };

    const resetForm = () => {
        setShowAddModal(false);
        setEditingRoom(null);
        setFormData({
            roomNumber: '',
            roomTypeId: '',
            isActive: true,
            status: 'AVAILABLE',
        });
    };

    if (!selectedHotel) {
        return (
            <OwnerLayout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center">
                    <p className="text-xl text-gray-600 dark:text-gray-400">Please select a hotel first</p>
                </div>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout>
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
                                    placeholder="Search rooms by number..."
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
                                        <option>Available</option>
                                        <option>Occupied</option>
                                        <option>Maintenance</option>
                                        <option>Reserved</option>
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
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">Loading rooms...</p>
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                            <FaBed className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">No rooms found</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Add your first room to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRooms.map((room) => (
                                <div key={room.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                    {/* Room Image Placeholder */}
                                    <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                                        <FaBed className="h-20 w-20 text-white opacity-50" />
                                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-bold text-gray-900">
                                            Room {room.roomNumber}
                                        </span>
                                        <span className={`absolute top-4 right-4 px-3 py-1 backdrop-blur rounded-full text-xs font-semibold border-2 ${getStatusColor(room.status)}`}>
                                            {room.status || 'AVAILABLE'}
                                        </span>
                                    </div>

                                    {/* Room Details */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {getRoomTypeName(room)}
                                        </h3>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <FaBed className="h-5 w-5 text-blue-500" />
                                                <span>{room.roomTypeName || 'N/A'}</span>
                                            </div>
                                            {room.roomTypeUsed != null && room.roomTypeLimit != null && (
                                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                                    {room.roomTypeUsed} / {room.roomTypeLimit} rooms of this type
                                                </div>
                                            )}
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
                                                onClick={() => handleDeleteRoom(room)}
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
                    )}

                    {/* Add/Edit Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <h2 className="text-2xl font-bold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                                    <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                                        <FaTimes className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Room Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="roomNumber"
                                            value={formData.roomNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            placeholder="e.g., 101"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Room Type *
                                        </label>
                                        <select
                                            name="roomTypeId"
                                            value={formData.roomTypeId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Select a room type...</option>
                                            {roomTypes.map(type => {
                                                const usedCount = rooms.filter(r => r.roomTypeId === type.id).length;
                                                const isLimitReached = usedCount >= type.totalRooms;
                                                return (
                                                    <option key={type.id} value={type.id} disabled={isLimitReached}>
                                                        {type.name} ({usedCount}/{type.totalRooms}) {isLimitReached ? ' - Limit Reached' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>

                                        {/* Show warning if limit is reached */}
                                        {formData.roomTypeId && (() => {
                                            const selectedType = roomTypes.find(rt => rt.id == formData.roomTypeId);
                                            const usedCount = rooms.filter(r => r.roomTypeId == formData.roomTypeId).length;
                                            const canAdd = !selectedType || usedCount < selectedType.totalRooms;
                                            return !canAdd ? (
                                                <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                                                    ⚠️ Room limit reached for this type. Please increase the total rooms in Room Types section first.
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Room Status *
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option value="AVAILABLE">Available</option>
                                            <option value="OCCUPIED">Occupied</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="RESERVED">Reserved</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Room is active
                                            </span>
                                        </label>
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
        </OwnerLayout>
    );
};

export default RoomManagement;
