import { useState, useEffect } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useHotel } from '../../context/HotelContext';
import { ownerRoomManagement } from '../../services/completeAPI';
import { useToast } from '../../contexts/ToastContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  HomeModernIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { FaBed, FaSnowflake, FaFan } from 'react-icons/fa';

const RoomTypeManagement = () => {
  const { selectedHotel } = useHotel();
  const { showToast } = useToast();
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedHotel) {
      fetchRoomTypes();
    }
  }, [selectedHotel]);

  const fetchRoomTypes = async () => {
    setIsLoading(true);
    try {
      const data = await ownerRoomManagement.getRooms(selectedHotel.id);
      setRoomTypes(data.map(rt => ({
        ...rt,
        amenities: typeof rt.amenities === 'string' ? JSON.parse(rt.amenities) : (rt.amenities || []),
      })));
    } catch (error) {
      console.error("Failed to fetch room types", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Standard',
    beds: '2 Single Beds',
    capacity: 2,
    totalRooms: 0,
    amenities: ['WiFi', 'TV', 'Room Service'],
    description: '',
    images: []
  });

  const [imageInput, setImageInput] = useState('');

  const handleAddImage = () => {
    if (imageInput.trim()) {
      // Convert Google Drive link to direct image URL if needed
      let imageUrl = imageInput.trim();
      
      // Handle Google Drive share links
      if (imageUrl.includes('drive.google.com')) {
        const fileIdMatch = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch) {
          imageUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const bedOptions = ['1 King Bed', '2 Single Beds', '4 Beds'];
  const amenityOptions = ['WiFi', 'TV', 'Room Service'];

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({
      name: 'Standard',
      beds: '2 Single Beds',
      capacity: 2,
      totalRooms: 0,
      pricePerNight: '',
      amenities: ['WiFi', 'TV', 'Room Service'],
      description: '',
      images: []
    });
    setImageInput('');
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    const parsedImages = typeof room.images === 'string' ? 
      (room.images ? JSON.parse(room.images) : []) : 
      (room.images || []);
    
    setFormData({
      name: room.name,
      beds: '2 Single Beds',
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      totalRooms: room.totalRooms || 0,
      amenities: room.amenities,
      description: room.description,
      images: parsedImages
    });
    setImageInput('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;

    try {
      const payload = {
        ...formData,
        totalRooms: parseInt(formData.totalRooms),
        capacity: parseInt(formData.capacity),
        pricePerNight: parseFloat(formData.pricePerNight),
        amenities: formData.amenities,
        images: formData.images,
      };

      if (editingRoom) {
        await ownerRoomManagement.updateRoom(selectedHotel.id, editingRoom.id, payload);
      } else {
        await ownerRoomManagement.addRoom(selectedHotel.id, payload);
      }
      await fetchRoomTypes();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save room type", error);
      showToast("Failed to save: " + error.message, 'error');
    }
  };

  const confirmDelete = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const deleteRoom = async () => {
    if (!selectedHotel || !roomToDelete) return;
    try {
      await ownerRoomManagement.deleteRoom(selectedHotel.id, roomToDelete.id);
      await fetchRoomTypes();
      setShowDeleteModal(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Failed to delete room type", error);
      showToast("Failed to delete: " + error.message, 'error');
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const currency = (v) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(v);

  return (
    <OwnerLayout>
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HomeModernIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold dark:text-white">Room Type Management</h1>
                <p className="text-gray-600 dark:text-gray-400">{roomTypes.length} room types configured</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              Add Room Type
            </button>
          </div>

          {/* Room Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomTypes.map((room) => (
              <div key={room.id} className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold dark:text-white">{room.name}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{room.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(room)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(room)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bed Configuration</p>
                      <p className="font-semibold dark:text-white flex items-center gap-1">
                        <FaBed className="text-purple-500" /> {room.beds}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
                      <p className="font-semibold dark:text-white">{room.capacity} Guests</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Rooms</p>
                      <p className="font-semibold dark:text-white">
                        {room.totalRooms}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold dark:text-white">
                  {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <XMarkIcon className="h-5 w-5 dark:text-white" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Name *</label>
                <select
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    let beds = '4 Beds';
                    let capacity = 4;

                    if (name === 'Standard AC') {
                      beds = '2 Single Beds';
                      capacity = 2;
                    } else if (name === 'Deluxe') {
                      beds = '1 King Bed';
                      capacity = 2;
                    } else if (name === 'Family') {
                      beds = '4 Beds';
                      capacity = 4;
                    } else if (name === 'Standard') {
                      beds = '2 Single Beds';
                      capacity = 2;
                    }

                    setFormData({
                      ...formData,
                      name,
                      beds,
                      capacity
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Standard">Standard</option>
                  <option value="Standard AC">Standard AC</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bed Configuration *</label>
                <select
                  disabled
                  value={formData.beds}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                >
                  <option value={formData.beds}>{formData.beds}</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Rooms *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${formData.amenities.includes(amenity)
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URLs Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Images (Google Drive Links)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Paste Google Drive share link or image URL"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tip: Share your image on Google Drive, copy the link, and paste it here
                  </p>
                  
                  {/* Image Preview List */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <img 
                            src={img} 
                            alt={`Room ${index + 1}`} 
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=Image'}
                          />
                          <span className="flex-1 text-sm text-gray-600 dark:text-gray-300 truncate">
                            {img}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="Brief description of the room"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg"
                >
                  {editingRoom ? 'Update Room Type' : 'Add Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && roomToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Delete Room Type</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{roomToDelete.name}</strong>? This will remove all {roomToDelete.total} rooms of this type.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteRoom}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default RoomTypeManagement;
