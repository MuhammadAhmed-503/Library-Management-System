import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrash, faToggleOn, faToggleOff, faSync, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const LibrariansTable = () => {
  const [librarians, setLibrarians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { isDark } = useTheme();

  const fetchLibrarians = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/auth/librarians`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLibrarians(data);
      } else {
        toast.error('Failed to fetch librarians');
      }
    } catch (error) {
      console.error('Fetch librarians error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, [token]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/auth/librarians/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        toast.success(`Librarian ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchLibrarians();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete librarian "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/auth/librarians/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Librarian deleted successfully');
        fetchLibrarians();
      } else {
        toast.error('Failed to delete librarian');
      }
    } catch (error) {
      console.error('Delete librarian error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
            isDark 
              ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' 
              : 'bg-gradient-to-br from-indigo-400 to-indigo-600'
          }`}>
            <FontAwesomeIcon icon={faUserShield} className="text-xl text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Manage Librarians
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {librarians.length} librarian(s) registered
            </p>
          </div>
        </div>
        <button
          onClick={fetchLibrarians}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600 text-white' 
              : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
          }`}
        >
          <FontAwesomeIcon icon={faSync} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-emerald-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : librarians.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <FontAwesomeIcon icon={faUsers} className="text-4xl mb-4 opacity-50" />
          <p>No librarians found. Add your first librarian!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Name
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Username
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-center text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {librarians.map((librarian) => (
                <tr 
                  key={librarian._id} 
                  className={`border-b transition-colors ${
                    isDark 
                      ? 'border-slate-700/50 hover:bg-slate-800/50' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <td className={`px-4 py-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {librarian.name}
                  </td>
                  <td className={`px-4 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {librarian.username}
                  </td>
                  <td className={`px-4 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {librarian.email}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      librarian.isActive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {librarian.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={`px-4 py-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {new Date(librarian.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(librarian._id, librarian.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          librarian.isActive
                            ? 'text-amber-400 hover:bg-amber-500/20'
                            : 'text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        title={librarian.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <FontAwesomeIcon icon={librarian.isActive ? faToggleOn : faToggleOff} className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(librarian._id, librarian.name)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LibrariansTable;
