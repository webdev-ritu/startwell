import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import PitchRoomList from '../components/pitch/PitchRoomList';
import ActivePitchRoom from '../components/pitch/ActivePitchRoom';
import '../styles/main.css';

export default function PitchRoom() {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUser?.uid) {
          throw new Error('Authentication required');
        }

        // Verify user is authenticated before querying
        if (!currentUser || !currentUser.uid) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const roomsRef = collection(db, 'pitchRooms');
        const q = query(
          roomsRef, 
          where('participants', 'array-contains', currentUser.uid),
          where('isActive', '==', true) // Added safety check
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setRooms([]);
          setLoading(false);
          return;
        }

        const roomsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Validate required room fields
          if (!data.participants || !Array.isArray(data.participants)) {
            console.warn(`Invalid room data for document ${doc.id}`);
            return null;
          }
          return {
            id: doc.id,
            ...data,
            // Ensure participants array exists
            participants: data.participants || []
          };
        }).filter(room => room !== null); // Filter out invalid rooms

        setRooms(roomsData);
        
        // Auto-select first valid room
        if (roomsData.length > 0 && !activeRoom) {
          const firstValidRoom = roomsData.find(room => 
            room.participants.includes(currentUser.uid)
          );
          if (firstValidRoom) {
            setActiveRoom(firstValidRoom);
          }
        }

      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError(err.code === 'permission-denied' 
          ? "You don't have permission to view these rooms" 
          : err.message || "Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    if (currentUser?.uid) {
      fetchRooms();
    } else {
      setLoading(false);
      setError('Please login to access pitch rooms');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!activeRoom?.id || !currentUser?.uid) return;

    let unsubscribe;
    const setupMessageListener = async () => {
      try {
        const messagesRef = collection(db, 'pitchRooms', activeRoom.id, 'messages');
        
        unsubscribe = onSnapshot(messagesRef, 
          (snapshot) => {
            const newMessages = snapshot.docs
              .map(doc => {
                const data = doc.data();
                // Validate message structure
                if (!data.senderId || !data.timestamp) {
                  console.warn(`Invalid message format in document ${doc.id}`);
                  return null;
                }
                return {
                  id: doc.id,
                  ...data
                };
              })
              .filter(msg => msg !== null)
              .sort((a, b) => a.timestamp - b.timestamp);
            
            setMessages(newMessages);
          },
          (err) => {
            console.error("Message listener error:", err);
            setError("Failed to load messages. Please refresh the page.");
          }
        );
      } catch (err) {
        console.error("Error setting up listener:", err);
        setError("Failed to initialize chat. Please try again later.");
      }
    };

    setupMessageListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [activeRoom, currentUser]);

  const handleSendMessage = async (message) => {
    if (!activeRoom?.id || !currentUser?.uid || !message.trim()) {
      setError('Invalid message or missing room data');
      return;
    }

    try {
      // Additional validation
      if (!activeRoom.participants.includes(currentUser.uid)) {
        throw new Error('You are no longer a participant in this room');
      }

      await addDoc(collection(db, 'pitchRooms', activeRoom.id, 'messages'), {
        text: message,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        timestamp: new Date(),
        // Additional metadata
        roomId: activeRoom.id,
        status: 'delivered'
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message. Please try again.");
      
      // Refresh room data if permission error
      if (error.code === 'permission-denied') {
        const roomsRef = collection(db, 'pitchRooms');
        const q = query(roomsRef, where('participants', 'array-contains', currentUser.uid));
        const snapshot = await getDocs(q);
        const updatedRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(updatedRooms);
        
        // Reset active room if no longer participant
        if (!updatedRooms.some(room => room.id === activeRoom.id)) {
          setActiveRoom(null);
        }
      }
    }
  };

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser) return <div className="error">Please login to access pitch rooms</div>;

  return (
    <div className="pitch-room-page">
      <h1>Pitch Room</h1>
      {error && <div className="error-banner">{error}</div>}
      
      <div className="pitch-room-container">
        <div className="room-list">
          <PitchRoomList 
            rooms={rooms} 
            activeRoom={activeRoom} 
            onSelectRoom={(room) => {
              if (room.participants.includes(currentUser.uid)) {
                setActiveRoom(room);
                setError(null);
              } else {
                setError("You no longer have access to this room");
              }
            }} 
          />
        </div>
        
        <div className="active-room">
          {activeRoom ? (
            <ActivePitchRoom 
              room={activeRoom} 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              userId={currentUser.uid}
              onError={setError}
            />
          ) : (
            <div className="no-room-selected">
              {rooms.length === 0 ? (
                <p>No pitch rooms available. Create one or wait for an invitation.</p>
              ) : (
                <p>Please select a room from the list</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}