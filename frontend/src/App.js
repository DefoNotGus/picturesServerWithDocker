import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this file contains the new styles

const API_BASE_URL = 'http://127.0.0.1:5000';

function App() {
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [showAll, setShowAll] = useState(false); // State to toggle visibility of all images

    useEffect(() => {
        const fetchImages = () => {
            axios.get(`${API_BASE_URL}/images`)
                .then(response => {
                    const data = Array.isArray(response.data) ? response.data : [];
                    setImages(data.reverse()); // Sort images from newest to oldest
                })
                .catch(error => {
                    console.error("Error fetching images:", error);
                    setImages([]);
                });
        };

        fetchImages();
        const interval = setInterval(fetchImages, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);

        axios.post(`${API_BASE_URL}/upload`, formData)
            .then(response => {
                console.log('Image uploaded successfully');
                setImages([response.data.filename, ...images]); // Add new image to the start
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };

    const handleDownload = (img) => {
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}/static/uploads/${img}`;
        link.download = img; // Use the image filename as the download name
        link.click();
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="app-container">
            <img src="/logo.png" alt="App Logo" className="logo" /> {/* Use public/logo.png */}
            <div className="container py-5">
                <h1 className="text-center mb-4">Upload Image</h1>
                <div className="card p-4 shadow-sm">
                    <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center" encType="multipart/form-data">
                        <div className="mb-3 w-100">
                            <input
                                type="file"
                                name="image"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </form>
                </div>

                <h2 className="text-center mt-5">Gallery</h2>
                <div className="row mt-4">
                    {(showAll ? images : images.slice(0, 1)).map((img, index) => ( // Show only the last image by default
                        <div
                            className="col-md-4 col-sm-6 col-12 mb-4"
                            key={index}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card shadow-sm image-card" onClick={() => handleDownload(img)}>
                                <img
                                    src={`${API_BASE_URL}/static/uploads/${img}`}
                                    alt={img}
                                    className="card-img-top"
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                />
                                <div className="overlay">
                                    <span>View</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {images.length > 3 && (
                    <div className="text-center mt-3">
                        <button className="btn btn-secondary" onClick={toggleShowAll}>
                            {showAll ? 'Show Less' : 'Show More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
