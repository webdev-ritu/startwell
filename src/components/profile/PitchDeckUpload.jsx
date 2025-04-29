import { useState } from 'react';
import { uploadPitchDeck } from '../../services/startupService';
import '../../styles/main.css';

export default function PitchDeckUpload({ 
  currentDeck, 
  currentDeckName,
  userId, 
  onUpload,
  uploadProgress = 0,
  uploadError = null
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(''); // Reset error on new file selection
    
    if (!selectedFile) return;

    // Validate file type
    const isPDF = selectedFile.type === 'application/pdf' || 
                 selectedFile.name.toLowerCase().endsWith('.pdf');
    
    // Validate file size (10MB max)
    const isWithinSizeLimit = selectedFile.size <= 10 * 1024 * 1024;

    if (!isPDF) {
      setError('Only PDF files are allowed');
      return;
    }

    if (!isWithinSizeLimit) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      setError('No file selected or user not authenticated');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const result = await uploadPitchDeck(userId, file, (progress) => {
        // Optional: handle progress updates if needed
      });
      
      if (result?.downloadURL) {
        onUpload({
          downloadURL: result.downloadURL,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString()
        });
        setFile(null);
      } else {
        throw new Error('Upload failed - no download URL received');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload pitch deck');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pitch-deck-upload">
      <h3>Pitch Deck</h3>
      
      {currentDeck ? (
        <div className="current-deck">
          <a 
            href={currentDeck} 
            target="_blank" 
            rel="noopener noreferrer"
            className="deck-link"
          >
            {currentDeckName || 'View Current Pitch Deck'}
          </a>
          <span className="file-info">
            {currentDeckName?.replace('.pdf', '')}
          </span>
        </div>
      ) : (
        <p className="no-deck">No pitch deck uploaded yet</p>
      )}
      
      <div className="upload-section">
        <div className="file-input-wrapper">
          <input 
            type="file" 
            id="pitch-deck-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
          />
          <label htmlFor="pitch-deck-upload" className="file-label">
            {file ? (
              <>
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </>
            ) : (
              'Choose PDF File'
            )}
          </label>
        </div>
        
        {file && (
          <div className="upload-actions">
            <button 
              onClick={() => setFile(null)} 
              className="btn btn-cancel"
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="btn btn-upload"
            >
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Pitch Deck'}
            </button>
          </div>
        )}
      </div>
      
      {(error || uploadError) && (
        <div className="error-message">
          {error || uploadError}
        </div>
      )}

      {uploading && uploadProgress > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}