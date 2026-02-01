import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faSearch, faSync, faEdit, faTrash, faEye, 
  faCheck, faTimes, faBook, faCalendarAlt, faEnvelope, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const MembersTable = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const { isDark } = useTheme();
  const { token, isAdmin } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/${selectedMember._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Member updated successfully');
        fetchMembers();
        setSelectedMember(null);
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Member deleted successfully');
        fetchMembers();
        setSelectedMember(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const handleToggleActive = async (member) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/${member._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !member.isActive })
      });

      if (response.ok) {
        toast.success(`Member ${member.isActive ? 'deactivated' : 'activated'} successfully`);
        fetchMembers();
      }
    } catch (error) {
      console.error('Error toggling member status:', error);
      toast.error('Failed to update member status');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentBorrowedCount = (member) => {
    return member.borrowedBooks?.filter(b => !b.returnedDate).length || 0;
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <FontAwesomeIcon icon={faUsers} className="text-emerald-500" />
          Members Management
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <FontAwesomeIcon 
              icon={faSearch} 
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className={`w-full pl-12 pr-4 py-2 rounded-xl border ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          <button
            onClick={fetchMembers}
            className={`p-2 rounded-xl transition-all ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <FontAwesomeIcon icon={faSync} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Members Count */}
      <div className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Total: {filteredMembers.length} members
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faSync} className="animate-spin text-3xl text-emerald-500" />
          <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading members...</p>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Member</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Contact</th>
                  <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Books</th>
                  <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</th>
                  <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {filteredMembers.map((member) => (
                  <tr 
                    key={member._id}
                    className={isDark ? 'bg-slate-800/30 hover:bg-slate-700/30' : 'bg-white hover:bg-slate-50'}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {member.name}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            @{member.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <p className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                          {member.email}
                        </p>
                        {member.phone && (
                          <p className="flex items-center gap-2 mt-1">
                            <FontAwesomeIcon icon={faPhone} className="text-xs" />
                            {member.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        getCurrentBorrowedCount(member) > 0
                          ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                          : isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <FontAwesomeIcon icon={faBook} />
                        {getCurrentBorrowedCount(member)} borrowed
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(member)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                          member.isActive
                            ? isDark ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-100 text-green-600 hover:bg-green-200'
                            : isDark ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <FontAwesomeIcon icon={member.isActive ? faCheck : faTimes} />
                        {member.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setIsEditing(false);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                          }`}
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setEditData({
                              name: member.name,
                              email: member.email,
                              phone: member.phone || '',
                              address: member.address || '',
                              isActive: member.isActive
                            });
                            setIsEditing(true);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            isDark ? 'hover:bg-amber-500/20 text-amber-400' : 'hover:bg-amber-100 text-amber-600'
                          }`}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {isAdmin() && (
                          <button
                            onClick={() => handleDeleteMember(member._id)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                            }`}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan="5" className={`px-4 py-12 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <FontAwesomeIcon icon={faUsers} className="text-4xl mb-4 opacity-50" />
                      <p>No members found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {isEditing ? 'Edit Member' : 'Member Details'}
                </h2>
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setIsEditing(false);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdateMember}
                      className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selectedMember.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {selectedMember.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        @{selectedMember.username}
                      </p>
                    </div>
                  </div>

                  <div className={`space-y-3 mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faEnvelope} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span>{selectedMember.email}</span>
                    </div>
                    {selectedMember.phone && (
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faPhone} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span>{selectedMember.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span>Member since {formatDate(selectedMember.membershipDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faBook} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span>{getCurrentBorrowedCount(selectedMember)} books currently borrowed</span>
                    </div>
                  </div>

                  {/* Currently Borrowed Books */}
                  {getCurrentBorrowedCount(selectedMember) > 0 && (
                    <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h4 className={`font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Currently Borrowed
                      </h4>
                      <div className="space-y-2">
                        {selectedMember.borrowedBooks
                          ?.filter(b => !b.returnedDate)
                          .map((item, index) => (
                            <div key={index} className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              • {item.book?.title || 'Unknown Book'}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setEditData({
                        name: selectedMember.name,
                        email: selectedMember.email,
                        phone: selectedMember.phone || '',
                        address: selectedMember.address || '',
                        isActive: selectedMember.isActive
                      });
                      setIsEditing(true);
                    }}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
                  >
                    Edit Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersTable;
