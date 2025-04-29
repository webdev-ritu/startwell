import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import StartupForm from '../components/profile/StartupForm';
import PitchDeckUpload from '../components/profile/PitchDeckUpload';
import '../styles/main.css';

export default function StartupProfile() {
  const { currentUser } = useAuth();
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const fetchStartupData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const docRef = doc(db, 'startups', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setStartupData(docSnap.data());
          } else {
            setStartupData({
              companyName: '',
              vision: '',
              productDescription: '',
              marketSize: '',
              businessModel: '',
              pitchDeckUrl: ''
            });
          }
        } catch (error) {
          console.error("Error fetching startup data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStartupData();
  }, [currentUser]);

  const handleSubmit = async (data) => {
    try {
      await setDoc(doc(db, 'startups', currentUser.uid), data, { merge: true });
      setStartupData(data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating startup profile: ", error);
    }
  };

  const handlePitchDeckUpload = async (file) => {
    if (!file || !currentUser?.uid) {
      setUploadError('No file selected or user not authenticated');
      return;
    }

    // Validate file type and size (under 10MB)
    const validTypes = ['application/pdf', 'application/x-pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are allowed');
      return;
    }

    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    try {
      setUploadError(null);
      setUploadProgress(0);

      // Create storage reference with sanitized filename
      const sanitizedName = file.name.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
      const timestamp = Date.now();
      const filename = `pitchdeck_${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, `pitch-decks/${currentUser.uid}/${filename}`);

      // Start upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadError(`Upload failed: ${error.message}`);
          setUploadProgress(0);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedData = {
              ...startupData,
              pitchDeckUrl: downloadURL,
              pitchDeckName: file.name,
              pitchDeckUpdated: new Date().toISOString()
            };
            
            await setDoc(doc(db, 'startups', currentUser.uid), updatedData, { merge: true });
            setStartupData(updatedData);
          } catch (dbError) {
            console.error('Database error:', dbError);
            setUploadError(`Failed to save URL: ${dbError.message}`);
          } finally {
            setUploadProgress(100);
          }
        }
      );
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="startup-profile">
      <div className="profile-header">
        <h1>Startup Profile</h1>
        <button 
          onClick={() => setEditMode(!editMode)} 
          className="btn btn-outline"
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editMode ? (
        <StartupForm 
          initialData={startupData} 
          onSubmit={handleSubmit} 
        />
      ) : (
        <div className="profile-view">
          <div className="card">
            <h2>{startupData.companyName || 'Your Startup Name'}</h2>
            <div className="profile-section">
              <h3>Company Vision</h3>
              <p>{startupData.vision || 'Not specified'}</p>
            </div>
            <div className="profile-section">
              <h3>Product Description</h3>
              <p>{startupData.productDescription || 'Not specified'}</p>
            </div>
            <div className="profile-section">
              <h3>Market Size</h3>
              <p>{startupData.marketSize || 'Not specified'}</p>
            </div>
            <div className="profile-section">
              <h3>Business Model</h3>
              <p>{startupData.businessModel || 'Not specified'}</p>
            </div>
          </div>

          <PitchDeckUpload 
            currentDeck={startupData.pitchDeckUrl} 
            currentDeckName={startupData.pitchDeckName}
            onUpload={handlePitchDeckUpload}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
          />
        </div>
      )}
    </div>
  );
}