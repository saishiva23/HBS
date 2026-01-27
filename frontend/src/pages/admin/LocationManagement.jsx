import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminLocationManagement } from '../../services/completeAPI';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    city: '',
    state: '',
    country: 'India'
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await adminLocationManagement.getAll();
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc => 
    loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingLocation(null);
    setFormData({ city: '', state: '', country: 'India' });
    setShowModal(true);
  };

  const openEditModal = (location) => {
    setEditingLocation(location);
    setFormData({
      city: location.city,
      state: location.state,
      country: location.country
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await adminLocationManagement.update(editingLocation.id, formData);
      } else {
        await adminLocationManagement.add(formData);
      }
      fetchLocations();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save location:', error);
      alert('Failed to save location');
    }
  };

  const confirmDelete = (location) => {
    setLocationToDelete(location);
    setShowDeleteModal(true);
  };

  const deleteLocation = async () => {
    try {
      await adminLocationManagement.delete(locationToDelete.id);
      fetchLocations();
      setShowDeleteModal(false);
      setLocationToDelete(null);
    } catch (error) {
      console.error('Failed to delete location:', error);
      alert('Failed to delete location');
    }
  };

  const totalHotels = locations.reduce((sum, loc) => sum + loc.hotelCount, 0);

  return (
    <AdminLayout>
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <MapPinIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold dark:text-white">Location Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {locations.length} locations • {totalHotels} hotels total
                </p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              Add Location
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Locations</p>
                  <p className="text-2xl font-bold dark:text-white">{locations.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Hotels</p>
                  <p className="text-2xl font-bold dark:text-white">{totalHotels}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Locations Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">City</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">State</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Hotels</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Added Date</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {filteredLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <MapPinIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="font-semibold dark:text-white">{location.city}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{location.state}</td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{location.hotelCount}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{location.addedDate}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(location)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(location)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold dark:text-white">
                  {editingLocation ? 'Edit Location' : 'Add New Location'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <XMarkIcon className="h-5 w-5 dark:text-white" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400"
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
                  {editingLocation ? 'Update' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && locationToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Delete Location</h3>
            </div>
            
            {locationToDelete.hotelCount > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-400 text-sm font-medium">
                  ⚠️ Warning: This location has {locationToDelete.hotelCount} hotels. Deleting this location will affect all hotels registered here.
                </p>
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{locationToDelete.city}, {locationToDelete.state}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteLocation}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Delete Location
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LocationManagement;
