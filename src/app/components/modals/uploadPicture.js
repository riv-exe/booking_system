"use client";

import { useState } from "react";

export default function UploadProofModal({ isOpen, setIsOpen, onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  async function uploadImage() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "payment_proof");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhn2slftx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!data.secure_url) {
      alert("Upload failed");
      return;
    }

    onUpload(data.secure_url);
    setIsOpen(false);
  }

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-[var(--background)] w-full max-w-3xl h-[500px] rounded-2xl border border-gray-700 flex overflow-hidden">

        <div className="w-1/2 p-5 border-r border-gray-700 flex flex-col gap-4">

          <h2 className="text-xl font-bold">Payment Details</h2>

          <div className="text-sm text-gray-300">
            Send payment via GCash before uploading proof
          </div>

          <div className="bg-black/20 p-3 rounded-xl">
            <p className="text-xs text-gray-400">GCash Number</p>
            <p className="text-lg font-bold">0917 123 4567</p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GCash-09171234567"
              alt="QR"
              className="rounded-lg border border-gray-700"
            />
          </div>

          <p className="text-xs text-gray-500 mt-auto">
            Make sure payment is correct before uploading.
          </p>

        </div>

        <div className="w-1/2 p-5 flex flex-col gap-4">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Upload Proof</h2>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-gray-700 rounded-lg"
          />

          <div className="flex-1 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="max-h-[200px] object-contain rounded-lg border border-gray-700"
              />
            ) : (
              <p className="text-gray-500 text-sm">No image selected</p>
            )}
          </div>

          <button
            onClick={uploadImage}
            disabled={!file || loading}
            className="bg-[var(--primary)] p-3 rounded-xl font-semibold hover:opacity-90"
          >
            {loading ? "Uploading..." : "Upload Proof"}
          </button>

        </div>

      </div>
    </div>
  );
}