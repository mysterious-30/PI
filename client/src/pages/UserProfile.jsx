import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchUserProfile, updateUserPreferences, logout } from '../store/slices/userSlice';
import { fetchTools } from '../store/slices/toolsSlice';
import {
  UserIcon,
  CogIcon,
  StarIcon,
  ClockIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon
} from '@heroicons/react/outline';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { items: tools } = useSelector((state) => state.tools);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en'
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchTools());
  }, [dispatch]);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
    dispatch(updateUserPreferences({ [name]: value }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading || !user) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const favoriteTools = tools.filter(tool => user.favorites.includes(tool._id));

  return (
    <>
      <Helmet>
        <title>User Profile - ToolsHub</title>
        <meta name="description" content="Manage your account and preferences" />
      </Helmet>

      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CogIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Preferences
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="mt-1 flex space-x-4">
                <button
                  onClick={() => handlePreferenceChange({ target: { name: 'theme', value: 'light' } })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                    preferences.theme === 'light'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <SunIcon className="h-5 w-5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => handlePreferenceChange({ target: { name: 'theme', value: 'dark' } })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                    preferences.theme === 'dark'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <MoonIcon className="h-5 w-5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
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
          </div>
        </div>

        {/* Favorite Tools */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <StarIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Favorite Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <Link
                key={tool._id}
                to={`/tool/${tool.slug}`}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </Link>
            ))}
            {favoriteTools.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                You haven't favorited any tools yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {user.lastLogin && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Last login
                </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(user.lastLogin).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Account created
              </span>
              <span className="text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <LogoutIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default UserProfile; 