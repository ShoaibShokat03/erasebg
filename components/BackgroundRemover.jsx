'use client';

import { useState, useRef, useEffect } from 'react';
import { appConfig } from '../config';

export default function BackgroundRemover() {
    const [view, setView] = useState('upload'); // 'upload', 'loading', 'result'
    const [filesData, setFilesData] = useState([]);
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [activeFormat, setActiveFormat] = useState('png');
    
    // Listen for background removal success to send a notification
    useEffect(() => {
        const handleSuccess = async (e) => {
            const count = e.detail?.count || 0;
            try {
                // Fetch IP and Location info from a permissive public API without strict rate-limits or CORS blockage
                let ipInfo = { ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown' };
                try {
                    const res = await fetch('https://ipapi.co/json/');
                    if (res.ok) {
                        const data = await res.json();
                        ipInfo = { ip: data.ip, city: data.city, region: data.region, country: data.country_name };
                    } else {
                        throw new Error('Fallback triggered');
                    }
                } catch (fallbackErr) {
                    // Fallback to ip-api if ipapi.co fails (due to adblockers or strict CORS)
                    const fallbackRes = await fetch('https://demo.ip-api.com/json/');
                    const fallbackData = await fallbackRes.json();
                    ipInfo = { ip: fallbackData.query, city: fallbackData.city, region: fallbackData.regionName, country: fallbackData.country };
                }
                
                const message = `🎉 Success: User removed background!
IP Address: ${ipInfo.ip}
Location: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}
Files Converted: ${count}`;

                // Send notification to ntfy to avoid direct processing delays
                await fetch(appConfig.ntfyUrl, {
                    method: 'POST',
                    body: message,
                    headers: { 'Title': 'New BG Removal Usage' }
                });
            } catch (err) {
                console.error('Failed to send background removal notification:', err);
            }
        };

        window.addEventListener('background_removed_success', handleSuccess);
        return () => window.removeEventListener('background_removed_success', handleSuccess);
    }, []);
    
    // Convert base64 safely back to a blob on the client for ZIP or manual download
    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {type: contentType});
    };

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;
        
        let validFiles = Array.from(files).filter(file => file.type.match('image.*'));
        if (validFiles.length === 0) {
            alert('Please select valid image files (PNG, JPG, WEBP).');
            return;
        }

        if (validFiles.length > appConfig.maxImagesLimit) {
            alert(`Maximum ${appConfig.maxImagesLimit} images allowed at once. Only the first ${appConfig.maxImagesLimit} will be processed.`);
            validFiles = validFiles.slice(0, appConfig.maxImagesLimit);
        }

        const oversized = validFiles.some(file => file.size > appConfig.maxImageSizeMB * 1024 * 1024);
        if (oversized) {
            alert(`One or more files exceed the ${appConfig.maxImageSizeMB}MB limit.`);
            return;
        }

        setView('loading');

        try {
            const formData = new FormData();
            validFiles.forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch('/api/remove-bg', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to process images');
            }

            const responseData = await response.json();
            
            // Enrich with preview blob
            const enriched = responseData.map(file => {
                const bBlob = b64toBlob(file.base64, file.mimeType);
                return {
                    ...file,
                    previewUrl: URL.createObjectURL(bBlob),
                    blob: bBlob
                };
            });

            setFilesData(enriched);
            setView('result');

            // Dispatch event to trigger the notification listener securely on the client side
            const event = new CustomEvent('background_removed_success', {
                detail: { count: enriched.length }
            });
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Error processing images:', error);
            
            // Log to server-side errors.txt
            fetch('/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: error.message, 
                    stack: error.stack, 
                    context: 'CLIENT_REMOVE_BG' 
                })
            }).catch(e => console.error('Failed to report error to server:', e));

            alert(`Error: ${error.message}. Please try again.`);
            setView('upload');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };
    
    const triggerDownload = (blob, originalName, suffix) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        a.download = `${nameWithoutExt}-no-bg${suffix}.${activeFormat}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    const downloadZip = async () => {
        if (typeof window === 'undefined' || !window.JSZip) return;
        
        const zip = new window.JSZip();
        for (const item of filesData) {
            const nameWithoutExt = item.originalName.substring(0, item.originalName.lastIndexOf('.')) || item.originalName;
            zip.file(`${nameWithoutExt}.${activeFormat}`, item.blob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${appConfig.name}-Collection.${activeFormat}.zip`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <>
            {/* Main App Container */}
            <div className={`app-container glass-panel ${view === 'result' ? 'hidden-view' : ''}`}>
                <section className="workspace">
                    {/* Upload Area */}
                    {view === 'upload' && (
                        <div 
                            className={`upload-area ${dragActive ? 'dragover' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                accept="image/png, image/jpeg, image/jpg, image/webp" 
                                multiple 
                                hidden 
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                            <div className="upload-content">
                                <div className="upload-icon-container">
                                    <i className="fa-solid fa-images"></i>
                                </div>
                                <h2>Upload up to {appConfig.maxImagesLimit} images</h2>
                                <p>Drag & Drop or click to browse (PNG, JPG, WEBP)</p>
                                <button className="btn btn-primary mt-4">
                                    <i className="fa-solid fa-plus"></i> Select Images
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {view === 'loading' && (
                        <div className="loading-area" style={{ display: 'flex' }}>
                            <div className="loader-container">
                                <div className="spinner"></div>
                            </div>
                            <h3 className="accent-text">Processing images...</h3>
                            <p>Running high-precision AI model.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Result Card: Download List */}
            {view === 'result' && (
                <div className="result-card glass-panel" style={{ display: 'flex' }}>
                    <div className="gallery-header">
                        <h3>Processed Images (<span>{filesData.length}</span>)</h3>
                    </div>
                    
                    <div className="table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Preview</th>
                                    <th>File Name</th>
                                    <th>Original Size</th>
                                    <th>Download Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filesData.map((file, idx) => (
                                    <tr key={idx}>
                                        <td><img src={file.previewUrl} alt="preview" className="img-preview" /></td>
                                        <td>{file.originalName}</td>
                                        <td>{formatBytes(file.originalSize)}</td>
                                        <td>
                                            <div className="btn-group">
                                                <select 
                                                    className="format-select" 
                                                    value={activeFormat}
                                                    onChange={(e) => setActiveFormat(e.target.value)}
                                                >
                                                    <option value="png">.PNG</option>
                                                    <option value="webp">.WEBP</option>
                                                </select>
                                                <button 
                                                    className="btn btn-small btn-primary"
                                                    onClick={() => triggerDownload(file.blob, file.originalName, '')}
                                                >
                                                    <i className="fa-solid fa-download"></i> Download Max
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="action-buttons">
                        {filesData.length > 1 && (
                            <button className="btn btn-primary" onClick={downloadZip}>
                                <i className="fa-solid fa-file-zipper"></i> Download All
                            </button>
                        )}
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => {
                                setView('upload');
                                setFilesData([]);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                        >
                            <i className="fa-solid fa-trash-can"></i> Clear List
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
