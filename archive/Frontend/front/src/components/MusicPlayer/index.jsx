import React, { useState, useEffect } from "react";
import "./MusicPlayer.css";

const MusicPlayer = () => {
  const playlistIds = [
    "766mddgfXafITzzNjXfcCb",
    "43D4PYzsJn1IME1xZshVu4",
    "5jpkSit5EmTBtqOQwYRas5",
  ];
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  useEffect(() => {
    updatePlaylist();
  }, []);

  const updatePlaylist = () => {
    setCurrentPlaylistIndex((currentPlaylistIndex + 1) % playlistIds.length);
  };

  const playlistSrc = `https://open.spotify.com/embed/playlist/${playlistIds[currentPlaylistIndex]}?utm_source=generator`;

  return (
    <div className="center-content">
      <iframe
        id="spotify-iframe"
        style={{ borderRadius: "12px" }}
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        src={playlistSrc}
      ></iframe>
      <button id="change-playlist-btn" onClick={updatePlaylist}>
        Change the Playlist
      </button>
    </div>
  );
};

export default MusicPlayer;
