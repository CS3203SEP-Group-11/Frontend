import React from 'react';

const VideoPlayer = ({ 
  src, 
  width = "100%", 
  height = "auto", 
  className = "",
  disableDownload = true,
  disableRightClick = true,
  disableFullscreen = false
}) => {
  const handleContextMenu = (e) => {
    if (disableRightClick) {
      e.preventDefault();
    }
  };

  // Build controlsList based on what features to disable
  const buildControlsList = () => {
    const controls = [];
    if (disableDownload) controls.push("nodownload");
    if (disableFullscreen) controls.push("nofullscreen");
    if (disableDownload) controls.push("noremoteplayback");
    return controls.length > 0 ? controls.join(" ") : undefined;
  };

  return (
    <video
      src={src}
      controls
      controlsList={buildControlsList()}
      disablePictureInPicture={disableDownload}
      width={width}
      height={height}
      className={`rounded-lg shadow-lg ${className}`}
      preload="metadata"
      onContextMenu={handleContextMenu}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
