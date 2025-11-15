import React, { useState } from "react";

const AddPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    address: "",
    photos: [],
  });

  const categories = ["Pothole", "Garbage", "Streetlight", "Other"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length <= 5) {
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode this
          setFormData((prev) => ({
            ...prev,
            address: `${position.coords.latitude}, ${position.coords.longitude}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 font-display">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center bg-white px-4 shadow-sm">
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined text-2xl text-gray-700">
            arrow_back
          </span>
        </button>
        <h1 className="ml-4 text-xl font-bold text-gray-900">
          Report a New Issue
        </h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Describe the Issue Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Describe the Issue
          </h2>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Large Pothole on Main Street"
              className="w-full rounded-xl bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    formData.category === category
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add more details about the issue..."
              rows="5"
              className="w-full rounded-xl bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Set Location Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Set Location</h2>

          {/* Map Preview */}
          <div className="mb-4 rounded-xl overflow-hidden bg-gray-200 aspect-video relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVwDU2LOes8ZSwKq5ORrIprTuURuIFkE72yqrk0dizBVEmW7Utj2DzpJmxdMfEgOkIcSItRoQtfMUMWqeHIdpyiXD1Sh5YMkm13HT6M2aiY-ft28msrSajVsTwUiuQwYrCjR0MPzFTdiOA_fiU3CYkBP-okdvsS2hy0N9D5jA4olfOywxObyTy8CoR3ZYkJLible85Ix6Mb6qsR2b01NmpFjwSF42FnWPOivFBgzzxzzjFL-cLrvs6C6vfyG4UUQgbFqpxosCxiKrf"
              alt="Map preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-gray-700">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "80px" }}
                >
                  location_on
                </span>
              </div>
            </div>
          </div>

          {/* Address Input */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                search
              </span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, Anytown, USA"
                className="w-full rounded-xl bg-gray-50 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Use Current Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="w-full rounded-xl border-2 border-blue-500 bg-white py-3 text-blue-600 font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">
              my_location
            </span>
            Use Current Location
          </button>
        </div>

        {/* Evidence (Photos) Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Evidence (Photos)
          </h2>
          <p className="text-sm text-gray-500 mb-4">Add up to 5 photos.</p>

          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-3">
            {formData.photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={photo.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>
            ))}

            {/* Add Photo Button */}
            {formData.photos.length < 5 && (
              <label className="aspect-square rounded-xl bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-4xl text-gray-400 mb-1">
                  photo_camera
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Add Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-blue-500 py-4 text-white font-semibold text-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default AddPage;
