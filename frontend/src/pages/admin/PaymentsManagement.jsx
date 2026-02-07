import { useState, useEffect } from 'react';
import {
    FaMoneyBillWave,
    FaFileDownload,
    FaSearch,
    FaFilter,
    FaClock,
    FaTimesCircle,
    FaUniversity,
    FaCreditCard,
    FaMobileAlt
} from 'react-icons/fa';

import OwnerLayout from '../../layouts/OwnerLayout';
import AdminLayout from '../../layouts/AdminLayout';
import { ownerPayment, adminAPI } from '../../services/completeAPI';
import { useHotel } from '../../context/HotelContext';


const PaymentsManagement = () => {
    const { selectedHotel } = useHotel();
    const [searchTerm, setSearchTerm] = useState('');
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedHotel) {
            loadData();
        }
    }, [selectedHotel]);

    const loadData = async () => {
        if (!selectedHotel) return;
        setLoading(true);
        try {
            const [historyData, statsData] = await Promise.all([
                ownerPayment.getHistory(selectedHotel.id),
                ownerPayment.getStats(selectedHotel.id)
            ]);

            setPayments(historyData.data || historyData);
            setStats(statsData.data || statsData);
        } catch (error) {
            console.error('Error loading payments data:', error);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatsDisplay = () => {
        const s = stats || { totalRevenue: 0, pendingPayments: 0, completedTransactions: 0, failedTransactions: 0 };
        return [
            { label: 'Total Revenue', value: `₹${parseFloat(s.totalRevenue || 0).toLocaleString()}`, icon: FaMoneyBillWave, color: 'from-blue-600 to-indigo-600' },
            { label: 'Pending Payments', value: `₹${parseFloat(s.pendingPayments || 0).toLocaleString()}`, icon: FaClock, color: 'from-amber-500 to-orange-600' },
            { label: 'Completed', value: s.completedTransactions || 0, icon: FaUniversity, color: 'from-emerald-500 to-teal-600' },
            { label: 'Failed Trans.', value: s.failedTransactions || 0, icon: FaTimesCircle, color: 'from-red-500 to-pink-600' },
        ];
    };

    const statsCards = getStatsDisplay();

    const filteredPayments = payments.filter(p =>
        (p.transactionId && p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.guestFirstName && p.guestFirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.guestLastName && p.guestLastName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'credit card': return <FaCreditCard className="text-blue-500" />;
            case 'upi': return <FaMobileAlt className="text-purple-500" />;
            case 'net banking': return <FaUniversity className="text-gray-500" />;
            default: return <FaMoneyBillWave className="text-green-500" />;
        }
    };

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Payments & Transactions 💳
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track your earnings, payouts, and transaction history
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsCards.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-indigo-500/10`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Transactions Table Section */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Recent Transactions</h2>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID or Guest..."
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none transition-all dark:text-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all dark:text-white">
                                    <FaFilter className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payments...</p>
                                </div>
                            ) : payments.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-gray-600 dark:text-gray-400">No payments found</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Transaction ID</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Guest</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Method</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{payment.transactionId || payment.id}</span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                            {(payment.user?.firstName || 'G').charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{payment.user?.firstName} {payment.user?.lastName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(payment.checkInDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">₹{parseFloat(payment.totalPrice || 0).toLocaleString()}</span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                        {getMethodIcon(payment.paymentMethod || 'credit card')}
                                                        {payment.paymentMethod || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyle(payment.paymentStatus || 'pending')}`}>
                                                        {payment.paymentStatus || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <button className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline">
                                                        View Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default PaymentsManagement;