import React, { useState, useEffect, useRef } from 'react';
import { Auth, User, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from './Header';

interface ProfileProps {
  auth: Auth;
}

const Profile: React.FC<ProfileProps> = ({ auth }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Get current user from auth
    const currentUser = auth.currentUser;
    setUser(currentUser);
    setLoading(false);
  }, [auth]);
  
  // Format account creation date
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Parse display name into first and last name
  const getNameParts = (displayName: string | null) => {
    if (!displayName) return { firstName: 'User', lastName: '' };
    const parts = displayName.split(' ');
    return {
      firstName: parts[0] || 'User',
      lastName: parts.slice(1).join(' ')
    };
  };
  
  // Trigger file input click when profile picture is clicked
  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection for profile picture update
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;
    
    const file = files[0];
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user profile
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      // Update local user state
      setUser({ ...user, photoURL: downloadURL });
      
      setUploading(false);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
      setUploading(false);
    }
  };
  
  if (loading) {
    return (
      <div>
        <Header auth={auth} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div>
        <Header auth={auth} />
        <div className="container mx-auto px-4 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">No user is currently logged in</h2>
        </div>
      </div>
    );
  }
  
  const { firstName, lastName } = getNameParts(user.displayName);
  const creationDate = formatDate(user.metadata.creationTime ? Date.parse(user.metadata.creationTime) : undefined);
  const lastSignIn = formatDate(user.metadata.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : undefined);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header auth={auth} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 relative group">
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              
              {/* Profile Picture / Avatar */}
              {uploading ? (
                <div className="h-24 w-24 rounded-full flex items-center justify-center border-4 border-green-500 bg-gray-700">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : user.photoURL ? (
                <div 
                  className="cursor-pointer relative"
                  onClick={handleProfilePictureClick}
                >
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full border-4 border-green-500 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div 
                  className="h-24 w-24 rounded-full bg-green-700 flex items-center justify-center text-2xl font-bold border-4 border-green-500 cursor-pointer relative group"
                  onClick={handleProfilePictureClick}
                >
                  {firstName.charAt(0)}{lastName.charAt(0)}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.displayName || 'AI Finance User'}</h1>
              <p className="text-gray-400">{user.email}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start">
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                  Account Since: {creationDate}
                </span>
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm mb-2">
                  Last Login: {lastSignIn}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="flex space-x-8">
            <button 
              className={`pb-4 px-1 ${activeTab === 'overview' 
                ? 'border-b-2 border-green-500 text-green-400 font-medium' 
                : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('overview')}
            >
              Account Overview
            </button>
            <button 
              className={`pb-4 px-1 ${activeTab === 'security' 
                ? 'border-b-2 border-green-500 text-green-400 font-medium' 
                : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button 
              className={`pb-4 px-1 ${activeTab === 'preferences' 
                ? 'border-b-2 border-green-500 text-green-400 font-medium' 
                : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-400">Account Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p>{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">User ID</p>
                      <p className="truncate">{user.uid}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Email Verified</p>
                      <p>{user.emailVerified ? 'Yes' : 'No'}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Account Created</p>
                      <p>{creationDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-400">Account Usage</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Last Sign In</p>
                      <p>{lastSignIn}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Authentication Method</p>
                      <p>{user.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email & Password'}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Account Status</p>
                      <p className="text-green-400">Active</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Connected Accounts</p>
                      <p>{user.providerData.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-700 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Recent Activity</h3>
                <p className="text-gray-400 text-sm mb-4">Your most recent account activity</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-900 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-1-1H4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Successful Sign In</p>
                      <p className="text-gray-400 text-sm">{lastSignIn}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-900 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 10-2 0v1H9a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-gray-400 text-sm">{creationDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Email Verification</h3>
                      <p className="text-gray-400 text-sm mt-1">Verify your email address to secure your account</p>
                    </div>
                    <div>
                      {user.emailVerified ? (
                        <span className="bg-green-900 text-green-400 px-3 py-1 rounded-full text-sm">Verified</span>
                      ) : (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                          Verify Email
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <p className="text-gray-400 text-sm mt-1">Update your password regularly for better security</p>
                    </div>
                    <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
                
                <div className="p-5 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-gray-400 text-sm mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Account Preferences</h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive updates and alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Financial Alerts</p>
                        <p className="text-gray-400 text-sm">Get notified about important account changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Updates</p>
                        <p className="text-gray-400 text-sm">Receive news about new features and offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Currency Display</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>USD - $</option>
                        <option>EUR - €</option>
                        <option>GBP - £</option>
                        <option>JPY - ¥</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Date Format</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-gray-400 text-sm">Use dark theme across the application</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;