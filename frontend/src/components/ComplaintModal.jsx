import { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import customerAPI from '../services/customerAPI';
import toast from 'react-hot-toast';

const ComplaintModal = ({ booking, onClose, onSuccess }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const complaintCategories = [
        'Room Cleanliness',
        'Staff Behavior',
        'Amenities Not Working',
        'Noise Issues',
        'Safety Concerns',
        'Billing/Payment Issues',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim()) {
            toast.error('Please select or enter a subject');
            return;
        }

        if (!description.trim() || description.length < 20) {
            toast.error('Please provide a detailed description (minimum 20 characters)');
            return;
        }

        setSubmitting(true);
        try {
            await customerAPI.complaints.create({
                hotelId: booking.hotelId,
                bookingId: booking.id,
                subject: subject.trim(),
                description: description.trim()
            });

            toast.success(
                <div>
                    <p className="font-bold">Complaint submitted successfully!</p>
                    <p className="text-sm">The hotel will review it soon. Track status in My Complaints.</p>
                </div>,
                { duration: 5000 }
            );
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error submitting complaint:', error);
            toast.error(error.message || 'Failed to submit complaint');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                            <FaExclamationTriangle className="text-red-500" />
                            File a Complaint
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{booking.hotelName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                    >
                        <FaTimes className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold dark:text-white mb-2">
                            Issue Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="">Select a category...</option>
                            {complaintCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Custom Subject (if "Other") */}
                    {subject === 'Other' && (
                        <div>
                            <label className="block text-sm font-semibold dark:text-white mb-2">
                                Custom Subject
                            </label>
                            <input
                                type="text"
                                value={subject === 'Other' ? '' : subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Describe the issue briefly"
                                className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold dark:text-white mb-2">
                            Detailed Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe the issue in detail so we can address it properly..."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Minimum 20 characters ({description.length}/20)
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <strong>Note:</strong> Your complaint will be reviewed by the hotel management.
                            You'll be notified once it's been addressed.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !subject.trim() || description.length < 20}
                            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintModal;
