import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserPreferences, logout } from '../store/slices/userSlice';
import { fetchTools } from '../store/slices/toolsSlice';
import {
  UserCircleIcon,
  CogIcon,
  BellIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);
  const { items: tools } = useSelector((state) => state.tools);
  const [activeTab, setActiveTab] = useState('favorites');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'system',
    notifications: true,
    emailUpdates: true,
    language: 'en'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserProfile());
    dispatch(fetchTools());
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setPreferences(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSavePreferences = async () => {
    try {
      await dispatch(updateUserPreferences(preferences)).unwrap();
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Error loading profile
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const favoriteTools = tools.filter(tool => user?.favoriteTools?.includes(tool._id));

  return (
    <>
      <Helmet>
        <title>Profile - ToolsHub</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Profile Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6 py-4">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`${
                  activeTab === 'favorites'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <StarIcon className="h-5 w-5 inline-block mr-2" />
                Favorites
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`${
                  activeTab === 'preferences'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <CogIcon className="h-5 w-5 inline-block mr-2" />
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`${
                  activeTab === 'notifications'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <BellIcon className="h-5 w-5 inline-block mr-2" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'favorites' && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Favorite Tools
                </h2>
                {favoriteTools.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't favorited any tools yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favoriteTools.map((tool) => (
                      <div
                        key={tool._id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {tool.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Preferences
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="theme"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={preferences.theme}
                      onChange={handlePreferenceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={preferences.notifications}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="notifications"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Enable notifications
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={preferences.emailUpdates}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="emailUpdates"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Email updates
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePreferences}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notification Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Tool Updates
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when your favorite tools are updated
                      </p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        New Tools
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when new tools are added
                      </p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Account
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile; 