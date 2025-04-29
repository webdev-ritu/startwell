import '../../styles/main.css';

export default function PitchRoomList({ rooms, activeRoom, onSelectRoom }) {
  return (
    <div className="pitch-room-list">
      <h3>Available Rooms</h3>
      
      {rooms.length === 0 ? (
        <p>No active pitch rooms. Create one or wait for an invitation.</p>
      ) : (
        <ul>
          {rooms.map(room => (
            <li 
              key={room.id} 
              className={activeRoom?.id === room.id ? 'active' : ''}
              onClick={() => onSelectRoom(room)}
            >
              <div className="room-name">{room.name}</div>
              <div className="room-meta">
                <span>{room.participants.length} participants</span>
                <span>{room.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}