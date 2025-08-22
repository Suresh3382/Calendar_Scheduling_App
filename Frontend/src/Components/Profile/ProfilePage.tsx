import React, { useState, useRef, useContext } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Clock,
  Languages,
  Edit,
  Save,
  X,
  Camera,
  Check,
  ChevronDown,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: string;
  profilePic?: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  country: string;
  timeZone: string;
  language: string;
}

function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    age: "",
    profilePic: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    country: "",
    timeZone: "",
    language: "",
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    setTempProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempProfile((prev) => ({
          ...prev,
          profilePic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-sm flex items-center">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          Profile updated successfully
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your personal information
                </p>
              </div>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {tempProfile.profilePic ? (
                    <img
                      src={tempProfile.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {editMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {tempProfile.name}
                </h2>
                <p className="text-sm text-gray-500">{tempProfile.email}</p>
                <div className="flex items-center mt-1 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tempProfile.city}{tempProfile.country}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={tempProfile.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={tempProfile.email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={tempProfile.phone}
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={tempProfile.age}
                        onChange={(e) =>
                          handleFieldChange("age", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                        placeholder="Enter your age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      <select
                        value={tempProfile.gender}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors appearance-none bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={tempProfile.dob}
                        onChange={(e) =>
                          handleFieldChange("dob", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Preferences */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Location & Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={tempProfile.address}
                        onChange={(e) =>
                          handleFieldChange("address", e.target.value)
                        }
                        disabled={!editMode}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                        placeholder="Enter your street address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={tempProfile.city}
                          onChange={(e) =>
                            handleFieldChange("city", e.target.value)
                          }
                          disabled={!editMode}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={tempProfile.country}
                          onChange={(e) =>
                            handleFieldChange("country", e.target.value)
                          }
                          disabled={!editMode}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        <select
                          value={tempProfile.timeZone}
                          onChange={(e) =>
                            handleFieldChange("timeZone", e.target.value)
                          }
                          disabled={!editMode}
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors appearance-none bg-white"
                        >
                          <option value="GMT-12:00">
                            GMT-12:00 (Baker Island)
                          </option>
                          <option value="GMT-08:00">GMT-08:00 (PST)</option>
                          <option value="GMT-05:00">GMT-05:00 (EST)</option>
                          <option value="GMT+00:00">GMT+00:00 (UTC)</option>
                          <option value="GMT+05:30">GMT+05:30 (IST)</option>
                          <option value="GMT+08:00">GMT+08:00 (CST)</option>
                          <option value="GMT+09:00">GMT+09:00 (JST)</option>
                          <option value="GMT+10:00">GMT+10:00 (AEST)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <div className="relative">
                        <Languages className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={tempProfile.language}
                          onChange={(e) =>
                            handleFieldChange("language", e.target.value)
                          }
                          disabled={!editMode}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                          placeholder="Enter preferred language"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
