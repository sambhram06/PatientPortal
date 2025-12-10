Project Overview

This project is a healthcare document management system where users can upload, view, download, and delete PDF files.
The backend is built using Spring Boot, the frontend uses React + Tailwind CSS, and metadata is stored in MySQL.
Uploaded PDFs are stored in a local uploads/ folder, and only valid PDF files are allowed.

How to Run It Locally
1. Start the Backend (Spring Boot)

Clone the backend project

Update application.properties with your MySQL credentials

Create a database (e.g., health_docs)

Run the application

mvn spring-boot:run


Backend will run at:
http://localhost:8080

2. Start the Frontend (React + Tailwind)

Navigate to the frontend folder

Install dependencies

npm install


Start the development server

npm start


Frontend will run at:
http://localhost:3000

3. Create Uploads Folder

Make sure this exists in the backend directory:

/uploads

Example API Calls
1. Upload a PDF
curl -X POST http://localhost:8080/api/files/upload \
  -F "file=@sample.pdf"

2. List All Files
curl http://localhost:8080/api/files

3. Download a File
curl -O http://localhost:8080/api/files/1/download

4. Delete a File
curl -X DELETE http://localhost:8080/api/files/1
