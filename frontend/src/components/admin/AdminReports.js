import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, faBook, faUsers, faUserTie, faBookOpen,
  faCalendarAlt, faSync, faArrowUp, faArrowDown, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalBorrowers: 0,
    totalMembers: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    overdueBooks: 0,
    activeLibrarians: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topBorrowers, setTopBorrowers] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Fetch basic counts
      const countsResponse = await fetch(`${process.env.REACT_APP_API_URI}/counts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (countsResponse.ok) {
        const counts = await countsResponse.json();
        setStats(prev => ({
          ...prev,
          totalBooks: counts.books || 0,
          totalAuthors: counts.authors || 0,
          totalBorrowers: counts.borrowers || 0,
          borrowedBooks: counts.booksWithBorrower || 0,
          availableBooks: (counts.books || 0) - (counts.booksWithBorrower || 0)
        }));
      }

      // Fetch members count
      const membersResponse = await fetch(`${process.env.REACT_APP_API_URI}/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (membersResponse.ok) {
        const members = await membersResponse.json();
        setStats(prev => ({
          ...prev,
          totalMembers: members.length || 0
        }));

        // Get top borrowers
        const sortedMembers = members
          .map(m => ({
            name: m.name,
            borrowedCount: m.borrowedBooks?.filter(b => !b.returnedDate).length || 0,
            totalBorrowed: (m.borrowedBooks?.length || 0) + (m.borrowingHistory?.length || 0)
          }))
          .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
          .slice(0, 5);
        setTopBorrowers(sortedMembers);
      }

      // Fetch librarians count
      const librariansResponse = await fetch(`${process.env.REACT_APP_API_URI}/auth/librarians`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (librariansResponse.ok) {
        const librarians = await librariansResponse.json();
        setStats(prev => ({
          ...prev,
          activeLibrarians: librarians.filter(l => l.isActive).length || 0
        }));
      }

      // Fetch borrowed books for recent activity and overdue
      const borrowedResponse = await fetch(`${process.env.REACT_APP_API_URI}/books/borrowed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (borrowedResponse.ok) {
        const borrowedBooks = await borrowedResponse.json();
        
        // Calculate overdue (assuming 14 days loan period)
        const overdueCount = borrowedBooks.filter(book => {
          if (book.borrowedDate) {
            const dueDate = new Date(book.borrowedDate);
            dueDate.setDate(dueDate.getDate() + 14);
            return dueDate < new Date();
          }
          return false;
        }).length;
        
        setStats(prev => ({ ...prev, overdueBooks: overdueCount }));

        // Recent activity
        const recent = borrowedBooks
          .sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate))
          .slice(0, 5)
          .map(book => ({
            type: 'borrow',
            book: book.title,
            borrower: book.borrower?.borrowerName || 'Unknown',
            date: book.borrowedDate
          }));
        setRecentActivity(recent);
      }

    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className={`p-4 sm:p-6 rounded-2xl border transition-all hover:shadow-lg ${
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/20`}>
          <FontAwesomeIcon icon={icon} className={`text-${color}-500 text-xl`} />
        </div>
        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {value}
        </span>
      </div>
      <h3 className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{title}</h3>
      {subtext && (
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{subtext}</p>
      )}
    </div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <FontAwesomeIcon icon={faSync} className="animate-spin text-3xl text-emerald-500" />
        <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <FontAwesomeIcon icon={faChartBar} className="text-emerald-500" />
          Reports & Analytics
        </h1>
        <button
          onClick={fetchReports}
          className={`p-2 rounded-lg transition-all ${
            isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faSync} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Books" value={stats.totalBooks} icon={faBook} color="emerald" />
        <StatCard title="Total Authors" value={stats.totalAuthors} icon={faUserTie} color="cyan" />
        <StatCard title="Registered Members" value={stats.totalMembers} icon={faUsers} color="violet" />
        <StatCard title="Active Librarians" value={stats.activeLibrarians} icon={faUserTie} color="amber" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Available Books" 
          value={stats.availableBooks} 
          icon={faBook} 
          color="green"
          subtext={`${((stats.availableBooks / stats.totalBooks) * 100 || 0).toFixed(1)}% of total`}
        />
        <StatCard 
          title="Borrowed Books" 
          value={stats.borrowedBooks} 
          icon={faBookOpen} 
          color="amber"
          subtext={`${((stats.borrowedBooks / stats.totalBooks) * 100 || 0).toFixed(1)}% of total`}
        />
        <StatCard 
          title="Overdue Books" 
          value={stats.overdueBooks} 
          icon={faExclamationTriangle} 
          color="red"
          subtext="Need attention"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`rounded-2xl border p-6 ${
          isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <FontAwesomeIcon icon={faCalendarAlt} className="text-cyan-500" />
            Recent Borrows
          </h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {activity.book}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Borrowed by {activity.borrower}
                      </p>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {formatDate(activity.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No recent activity
            </p>
          )}
        </div>

        {/* Top Borrowers */}
        <div className={`rounded-2xl border p-6 ${
          isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <FontAwesomeIcon icon={faUsers} className="text-violet-500" />
            Top Members by Borrows
          </h2>
          {topBorrowers.length > 0 ? (
            <div className="space-y-3">
              {topBorrowers.map((borrower, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-500/20 text-amber-500' :
                      index === 1 ? 'bg-slate-400/20 text-slate-400' :
                      index === 2 ? 'bg-orange-500/20 text-orange-500' :
                      isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {borrower.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {borrower.borrowedCount} currently borrowed
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {borrower.totalBorrowed} total
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No borrowing data yet
            </p>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className={`mt-6 rounded-2xl border p-6 ${
        isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Quick Summary
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Book Utilization</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {((stats.borrowedBooks / stats.totalBooks) * 100 || 0).toFixed(1)}%
            </p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Books per Author</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {(stats.totalBooks / stats.totalAuthors || 0).toFixed(1)}
            </p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Members per Librarian</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {(stats.totalMembers / stats.activeLibrarians || 0).toFixed(1)}
            </p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Overdue Rate</p>
            <p className={`text-2xl font-bold ${stats.overdueBooks > 0 ? 'text-red-500' : isDark ? 'text-white' : 'text-slate-800'}`}>
              {((stats.overdueBooks / stats.borrowedBooks) * 100 || 0).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
