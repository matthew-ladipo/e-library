"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  Image, 
  File, 
  Tag, 
  Type, 
  FileText, 
  AlertCircle,
  Loader2,
  X,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

const ACCEPTED_CATEGORIES = [
  "Books", 
  "Research Papers", 
  "Articles", 
  "Journals", 
  "Magazines", 
  "Documents", 
  "Theses",
  "Presentations"
];

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  async function toBase64(file: File) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title || !coverFile || !dataFile) {
      setError("Please provide title, cover image and file.");
      return;
    }

    const finalCategory = showCustomCategory ? customCategory : category;
    if (!finalCategory) {
      setError("Please select or enter a category.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const [coverData, fileData] = await Promise.all([
        toBase64(coverFile),
        toBase64(dataFile)
      ]);

      const payload = {
        title,
        description,
        category: finalCategory,
        coverName: coverFile.name,
        coverData,
        fileName: dataFile.name,
        fileData,
      };

      const res = await fetch(`/api/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body?.error ?? "Upload failed");
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        router.push("/dashboard/my-collections");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      clearInterval(progressInterval);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setCoverFile(f);
    if (f) {
      if (f.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Cover image must be less than 5MB");
        setCoverFile(null);
        setPreview(null);
        return;
      }
      setPreview(URL.createObjectURL(f));
      setError(null);
    } else {
      setPreview(null);
    }
  }

  function handleDataChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setDataFile(f);
    if (f && f.size > 100 * 1024 * 1024) { // 100MB limit
      setError("File must be less than 100MB");
      setDataFile(null);
      return;
    }
    setError(null);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setCategory(value);
    setShowCustomCategory(value === "custom");
    if (value !== "custom") {
      setCustomCategory("");
    }
  }

  function removeCover() {
    setCoverFile(null);
    setPreview(null);
  }

  function removeFile() {
    setDataFile(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Collection</h1>
          <p className="text-gray-600">
            Share your knowledge with the community. Upload books, research papers, or documents.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Upload Successful!</h3>
                <p className="text-green-700 text-sm">
                  Your collection has been uploaded and is pending approval. Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {loading && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Type className="h-4 w-4" />
                  Collection Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your collection"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your collection. What content does it include? Who is it for?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="h-4 w-4" />
                  Category
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  {ACCEPTED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">Custom category</option>
                </select>
                
                {showCustomCategory && (
                  <div className="mt-3">
                    <input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Two Column Layout for File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Image className="h-4 w-4" />
                    Cover Image
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${coverFile ? 'border-blue-300 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
                    onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        handleCoverChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {preview ? (
                      <div className="relative">
                        <img 
                          src={preview} 
                          alt="cover preview" 
                          className="mx-auto h-48 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeCover}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Image className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {!coverFile && (
                    <p className="text-xs text-gray-500 mt-2">Recommended: 16:9 ratio, 1200x675px</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <File className="h-4 w-4" />
                    Collection File
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dataFile ? 'border-green-300 bg-green-50/50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/30'}`}
                    onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        handleDataChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {dataFile ? (
                      <div className="relative">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FolderOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="font-medium text-gray-900 truncate">{dataFile.name}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {(dataFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <File className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, ZIP up to 100MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="application/pdf,application/zip"
                      onChange={handleDataChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Upload Successful!
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Upload Collection
                    </>
                  )}
                </button>
              </div>

              {/* Form Help Text */}
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                <p className="mb-1">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <p>
                  After upload, your collection will be reviewed by our team before being published.
                  You can track the status in "My Collections".
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}