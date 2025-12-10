import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect
} from "react";

const FileList = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/files", {
        method: "GET",
        mode: "cors"   // ⭐ FIX FOR CORS
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching files: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchFiles() to parent (App.js)
  useImperativeHandle(ref, () => ({
    fetchFiles
  }));

  // runs once on load
  useEffect(() => {
    fetchFiles();
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/files/download/${id}`,
        {
          method: "GET",
          mode: "cors"     // ⭐ Required
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const file = files.find((f) => f.id === id);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading file: " + err.message);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/files/${id}`,
        {
          method: "DELETE",
          mode: "cors"      // ⭐ Required
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      alert("File deleted successfully!");
      fetchFiles();
    } catch (err) {
      alert("Error deleting file: " + err.message);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Uploaded Files
      </h2>

      {loading && (
        <p className="text-center text-gray-500">Loading files...</p>
      )}

      {!loading && (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {file.originalName}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.fileSize / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => downloadFile(file.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition-colors duration-200"
                >
                  Download
                </button>

                <button
                  onClick={() => deleteFile(file.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {files.length === 0 && !loading && (
            <p className="text-gray-500 text-center">
              No files uploaded yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
});

export default FileList;
