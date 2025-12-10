import React, { useState } from 'react';

export default function FileUpload({ onFileUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);

  // Validate file selection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Upload file to backend
  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        body: formData,
        mode: "cors",                   // ⭐ required for Spring Boot CORS
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Uploaded:", data);

      alert("File uploaded successfully!");

      // Refresh file list in parent
      if (onFileUploaded) {
        onFileUploaded();
      }

      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="w-full sm:w-auto p-3 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white px-6 py-3 rounded-md shadow 
                   hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto"
      >
        Upload PDF
      </button>
    </div>
  );
}
