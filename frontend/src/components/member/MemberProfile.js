import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faMapMarkerAlt, faCalendarAlt,
  faEdit, faSave, faTimes, faLock, faKey
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const MemberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();
  const { token, user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Profile updated successfully');
        setProfile({ ...profile, ...data.user });
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Password changed successfully');
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 mx-auto border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            My Profile
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className={`rounded-2xl border p-6 mb-6 ${
          isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
              isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {profile.name}
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                @{profile.username}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              }`}>
                Member since {formatDate(profile.membershipDate)}
              </span>
            </div>
          </div>

          {/* Profile Fields */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Email
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Phone
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Address
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: profile.name,
                      email: profile.email,
                      phone: profile.phone || '',
                      address: profile.address || ''
                    });
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faEnvelope} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Email</p>
                  <p className={isDark ? 'text-white' : 'text-slate-800'}>{profile.email}</p>
                </div>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faPhone} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Phone</p>
                    <p className={isDark ? 'text-white' : 'text-slate-800'}>{profile.phone}</p>
                  </div>
                </div>
              )}
              {profile.address && (
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={`w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Address</p>
                    <p className={isDark ? 'text-white' : 'text-slate-800'}>{profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className={`rounded-2xl border p-6 ${
          isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <FontAwesomeIcon icon={faKey} className="text-amber-500" />
              Security
            </h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Current Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  New Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
