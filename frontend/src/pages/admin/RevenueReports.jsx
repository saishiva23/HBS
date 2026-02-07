import { useState } from 'react';
import {
    FaChartBar,
    FaMoneyBillWave,
    FaArrowUp,
    FaDownload,
    FaCalendarAlt,
    FaFileInvoiceDollar,
} from 'react-icons/fa';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useToast } from '../../contexts/ToastContext';

const RevenueReports = () => {
    const { showToast } = useToast();
    const [timeFrame, setTimeFrame] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(2026);

    const monthlyRevenue = [
        { month: 'Jan', revenue: 45231, bookings: 342, avgRate: 132, occupancy: 78 },
        { month: 'Feb', revenue: 52400, bookings: 389, avgRate: 135, occupancy: 82 },
        { month: 'Mar', revenue: 48900, bookings: 356, avgRate: 137, occupancy: 75 },
        { month: 'Apr', revenue: 61200, bookings: 445, avgRate: 138, occupancy: 85 },
        { month: 'May', revenue: 68500, bookings: 492, avgRate: 139, occupancy: 89 },
        { month: 'Jun', revenue: 72300, bookings: 518, avgRate: 140, occupancy: 92 },
        { month: 'Jul', revenue: 75800, bookings: 542, avgRate: 140, occupancy: 94 },
        { month: 'Aug', revenue: 74200, bookings: 531, avgRate: 140, occupancy: 93 },
        { month: 'Sep', revenue: 65100, bookings: 467, avgRate: 139, occupancy: 87 },
        { month: 'Oct', revenue: 58900, bookings: 425, avgRate: 139, occupancy: 83 },
        { month: 'Nov', revenue: 52700, bookings: 382, avgRate: 138, occupancy: 80 },
        { month: 'Dec', revenue: 69400, bookings: 498, avgRate: 139, occupancy: 91 },
    ];

    const revenueByRoomType = [
        { type: 'Standard', revenue: 150000, bookings: 750, percentage: 25 },
        { type: 'Standard AC', revenue: 180000, bookings: 400, percentage: 30 },
        { type: 'Deluxe', revenue: 200000, bookings: 500, percentage: 30 },
        { type: 'Family', revenue: 134000, bookings: 120, percentage: 15 },
    ];

    const topPerformingMonths = monthlyRevenue
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const totalBookings = monthlyRevenue.reduce((sum, m) => sum + m.bookings, 0);
    const avgOccupancy = monthlyRevenue.reduce((sum, m) => sum + m.occupancy, 0) / monthlyRevenue.length;
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

    const stats = [
        {
            label: 'Total Revenue',
            value: `$${(totalRevenue / 1000).toFixed(0)}K`,
            change: '+15.3%',
            trend: 'up',
            color: 'from-emerald-500 to-teal-600',
            icon: FaMoneyBillWave,
        },
        {
            label: 'Total Bookings',
            value: totalBookings.toLocaleString(),
            change: '+12.7%',
            trend: 'up',
            color: 'from-blue-500 to-indigo-600',
            icon: FaCalendarAlt,
        },
        {
            label: 'Avg Occupancy',
            value: `${avgOccupancy.toFixed(0)}%`,
            change: '+5.2%',
            trend: 'up',
            color: 'from-purple-500 to-pink-600',
            icon: FaChartBar,
        },
        {
            label: 'Revenue/Booking',
            value: `$${(totalRevenue / totalBookings).toFixed(0)}`,
            change: '+2.1%',
            trend: 'up',
            color: 'from-amber-500 to-orange-600',
            icon: FaFileInvoiceDollar,
        },
    ];

    const exportReport = () => {
        console.log('Exporting report...');
        showToast('Report exported successfully!', 'success');
    };

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Revenue & Reports 📈
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Analyze your business performance
                            </p>
                        </div>
                        <button
                            onClick={exportReport}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
                        >
                            <FaDownload className="h-5 w-5" />
                            Export Report
                        </button>
                    </div>

                    {/* Time Frame Selector */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex gap-2">
                                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((frame) => (
                                    <button
                                        key={frame}
                                        onClick={() => setTimeFrame(frame.toLowerCase())}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${timeFrame === frame.toLowerCase()
                                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                            }`}
                                    >
                                        {frame}
                                    </button>
                                ))}
                            </div>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                            >
                                <option>2024</option>
                                <option>2025</option>
                                <option>2026</option>
                            </select>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all border border-gray-100 dark:border-gray-700">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <FaArrowUp className="h-4 w-4" />
                                            <span className="text-sm font-semibold">{stat.change}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Revenue Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Revenue Trend</h2>
                                <FaChartBar className="h-6 w-6 text-gray-400" />
                            </div>

                            <div className="h-80 flex items-end justify-between gap-2 mb-4">
                                {monthlyRevenue.map((data, index) => {
                                    const height = (data.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg shadow-lg hover:shadow-xl transition-all cursor-pointer relative group"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    <div className="font-bold">${(data.revenue / 1000).toFixed(1)}k</div>
                                                    <div>{data.bookings} bookings</div>
                                                    <div>{data.occupancy}% occupied</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                                                {data.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Performing Months */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Months</h2>
                            <div className="space-y-4">
                                {topPerformingMonths.map((month, index) => (
                                    <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                                        'bg-gradient-to-br from-orange-600 to-red-600'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white">{month.month}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                                                <span className="font-bold text-emerald-600">${(month.revenue / 1000).toFixed(1)}k</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Bookings:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{month.bookings}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Occupancy:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{month.occupancy}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Revenue by Room Type */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Revenue by Room Type</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {revenueByRoomType.map((room, index) => (
                                <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{room.type}</h3>
                                        <span className="text-2xl font-bold text-emerald-600">{room.percentage}%</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ${(room.revenue / 1000).toFixed(0)}K
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Bookings</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{room.bookings}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Avg per Booking</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ${(room.revenue / room.bookings).toFixed(0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4 h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                                            style={{ width: `${room.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                            <h2 className="text-xl font-bold text-white">Detailed Monthly Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Month</th>
                                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Revenue</th>
                                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Bookings</th>
                                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Avg Rate</th>
                                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Occupancy</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {monthlyRevenue.map((month, index) => (
                                        <tr key={index} className="hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{month.month}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">${month.revenue.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{month.bookings}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">${month.avgRate}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-24">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                                            style={{ width: `${month.occupancy}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {month.occupancy}%
                                                    </span>
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
        </OwnerLayout>
    );
};

export default RevenueReports;
