import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this file contains the new styles

const API_BASE_URL = 'http://127.0.0.1:5000';

function App() {
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [showAll, setShowAll] = useState(false); // State to toggle visibility of all images

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/images`);
                setImages(response.data || []);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload`, formData);
            setImages([response.data.filename, ...images]);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleDownload = (img) => {
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}/download/${img}`;
        link.setAttribute('download', img);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="app-container">
            <img src="/logo.png" alt="Logo" className="app-logo" /> {/* Add this line */}
            <h1 className="app-title">Upload Image</h1>
            <div className="upload-card">
                <form onSubmit={handleSubmit} className="upload-form" encType="multipart/form-data">
                    <div className="file-input-container">
                        <input
                            type="file"
                            name="image"
                            className="file-input"
                            onChange={handleFileChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <button type="submit" className="upload-button">Upload</button>
                </form>
            </div>

            <h2 className="gallery-title">Gallery</h2>
            <div className="gallery-grid">
                {(showAll ? images : images.slice(0, 1)).map((img, index) => (
                    <div className="image-card" key={index}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownload(img);
                            }}
                            className="download-link"
                        >
                            <img
                                src={`${API_BASE_URL}/static/uploads/${img}`}
                                alt={img}
                                className="image"
                            />
                        </a>
                    </div>
                ))}
            </div>
            {images.length > 1 && (
                <div className="toggle-button-container">
                    <button className="toggle-button" onClick={toggleShowAll}>
                        {showAll ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
