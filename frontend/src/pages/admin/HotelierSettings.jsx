import { useState } from 'react';
import {
    UserCircleIcon,
    BellIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    GlobeAltIcon,
    KeyIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';

const HotelierSettings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [settings, setSettings] = useState({
        // Account Settings
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@grandluxury.com',
        phone: '+1 (555) 123-4567',
        role: 'Hotel Manager',

        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        newBookingAlert: true,
        cancellationAlert: true,
        reviewAlert: true,
        paymentAlert: true,
        weeklyReport: true,
        monthlyReport: true,

        // Security Settings
        twoFactorAuth: false,
        sessionTimeout: '30',

        // Payment Settings
        bankName: 'Chase Bank',
        accountNumber: '****1234',
        routingNumber: '****5678',
        taxId: '****9012',

        // Preferences
        language: 'English',
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleSettingChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const saveSettings = () => {
        console.log('Saving settings:', settings);
        alert('Settings saved successfully!');
    };

    const changePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Changing password...');
        alert('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: UserCircleIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon },
        { id: 'payment', label: 'Payment', icon: CreditCardIcon },
        { id: 'preferences', label: 'Preferences', icon: GlobeAltIcon },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Hotelier Settings ⚙️
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your account and preferences
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                        {/* Account Settings */}
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>

                                {/* Profile Picture */}
                                <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {settings.firstName.charAt(0)}{settings.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all mb-2">
                                            Upload Photo
                                        </button>
                                        <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.firstName}
                                            onChange={(e) => handleSettingChange('firstName', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.lastName}
                                            onChange={(e) => handleSettingChange('lastName', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <EnvelopeIcon className="h-5 w-5 inline mr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.email}
                                            onChange={(e) => handleSettingChange('email', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <PhoneIcon className="h-5 w-5 inline mr-2" />
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={settings.phone}
                                            onChange={(e) => handleSettingChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.role}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Change Password */}
                                <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={changePassword}
                                        className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

                                {/* Channels */}
                                <div className="pb-6 border-b border-gray-200 dark:border-slate-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Channels</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                                                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                                                className={`relative w-14 h-8 rounded-full transition-colors ${settings.emailNotifications ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'transform translate-x-6' : ''
                                                    }`}></div>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <PhoneIcon className="h-6 w-6 text-blue-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">SMS Notifications</p>
                                                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSettingChange('smsNotifications', !settings.smsNotifications)}
                                                className={`relative w-14 h-8 rounded-full transition-colors ${settings.smsNotifications ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.smsNotifications ? 'transform translate-x-6' : ''
                                                    }`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Alert Types */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Alert Types</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { key: 'newBookingAlert', label: 'New Bookings', desc: 'Get notified of new reservations' },
                                            { key: 'cancellationAlert', label: 'Cancellations', desc: 'Get notified when bookings are cancelled' },
                                            { key: 'reviewAlert', label: 'New Reviews', desc: 'Get notified of new guest reviews' },
                                            { key: 'paymentAlert', label: 'Payments', desc: 'Get notified of payment transactions' },
                                            { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly performance summary' },
                                            { key: 'monthlyReport', label: 'Monthly Reports', desc: 'Receive monthly analytics report' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleSettingChange(item.key, !settings[item.key])}
                                                    className={`ml-4 relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${settings[item.key] ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key] ? 'transform translate-x-6' : ''
                                                        }`}></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-600 rounded-xl">
                                                <ShieldCheckIcon className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">Two-Factor Authentication</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                                            className={`relative w-16 h-9 rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <div className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full transition-transform flex items-center justify-center ${settings.twoFactorAuth ? 'transform translate-x-7' : ''
                                                }`}>
                                                {settings.twoFactorAuth ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                                                ) : (
                                                    <XCircleIcon className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Session Timeout (minutes)
                                        </label>
                                        <select
                                            value={settings.sessionTimeout}
                                            onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                                            className="w-full md:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Bank Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.bankName}
                                            onChange={(e) => handleSettingChange('bankName', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.accountNumber}
                                            onChange={(e) => handleSettingChange('accountNumber', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Routing Number
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.routingNumber}
                                            onChange={(e) => handleSettingChange('routingNumber', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Tax ID
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.taxId}
                                            onChange={(e) => handleSettingChange('taxId', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Application Preferences</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <GlobeAltIcon className="h-5 w-5 inline mr-2" />
                                            Language
                                        </label>
                                        <select
                                            value={settings.language}
                                            onChange={(e) => handleSettingChange('language', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option>English</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                            <option>Chinese</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Timezone
                                        </label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => handleSettingChange('currency', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="JPY">JPY (¥)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Date Format
                                        </label>
                                        <select
                                            value={settings.dateFormat}
                                            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 flex gap-4">
                            <button
                                onClick={saveSettings}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                            >
                                Save Changes
                            </button>
                            <button className="px-8 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default HotelierSettings;
