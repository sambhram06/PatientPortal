import React, { useRef, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
  const fileListRef = useRef();

  const refreshFiles = () => {
    fileListRef.current.fetchFiles();
  };

  // 🔥 Test backend API connection
  useEffect(() => {
    fetch("http://localhost:8080/api/files")
      .then(res => res.json())
      .then(data => console.log("Backend Response:", data))
      .catch(err => console.error("Error connecting to backend:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
          Healthcare Document Portal
        </h1>

        {/* File Upload Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload a PDF</h2>
          <FileUpload onFileUploaded={refreshFiles} />
        </div>

        {/* Uploaded Files Section */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <FileList ref={fileListRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
