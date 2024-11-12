import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiCreditCard,
  FiBell,
  FiShield,
  FiTrash2,
} from "react-icons/fi";
import PageWrapper from "../components/PageWrapper";
import { getCurrentUser } from "../lib/supabaseClient";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  subscriptionTier: "free" | "premium" | "pro";
  notificationsEnabled: boolean;
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phoneNumber: "",
    subscriptionTier: "free",
    notificationsEnabled: true,
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setProfile({
            fullName: user.user_metadata.full_name || "",
            email: user.email || "",
            phoneNumber: user.phone || "",
            subscriptionTier: "free",
            notificationsEnabled: true,
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    // TODO: Implement save profile
    console.log("Saving profile...", profile);
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    console.log("Deleting account...");
  };

  const toggleNotifications = () => {
    setProfile((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  return (
    <PageWrapper loading={loading}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

          {/* Profile Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex items-center mb-6">
              <FiUser className="w-6 h-6 text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">
                Profile Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, phoneNumber: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex items-center mb-6">
              <FiCreditCard className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Subscription</h2>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4">
              <p className="text-white font-medium mb-2">
                Current Plan: {profile.subscriptionTier.toUpperCase()}
              </p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiBell className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  Notifications
                </h2>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={profile.notificationsEnabled}
                    onChange={toggleNotifications}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${
                      profile.notificationsEnabled
                        ? "bg-blue-500"
                        : "bg-gray-600"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      profile.notificationsEnabled
                        ? "transform translate-x-6"
                        : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* Privacy & Security Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex items-center mb-6">
              <FiShield className="w-6 h-6 text-green-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">
                Privacy & Security
              </h2>
            </div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Change Password
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-red-500/20">
            <div className="flex items-center mb-6">
              <FiTrash2 className="w-6 h-6 text-red-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Account
            </button>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
