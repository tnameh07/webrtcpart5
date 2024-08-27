import React, { useState, useEffect, useRef } from 'react';
import './Video.css'; // Import the external CSS file

const Video = (props) => {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [videoVisible, setVideoVisible] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (props.videoStream) {
      videoRef.current.srcObject = props.videoStream;
    }
  }, [props.videoStream]);

  useEffect(() => {
    if (props.videoType === 'remoteVideo' && props.videoStream) {
      const videoTrack = props.videoStream.getVideoTracks();
      if (videoTrack && videoTrack.length) {
        videoTrack[0].onmute = () => {
          setVideoVisible(false);
          props.videoMuted(props.videoStream);
        };

        videoTrack[0].onunmute = () => {
          setVideoVisible(true);
          props.videoMuted(props.videoStream);
        };
      }

      const audioTrack = props.videoStream.getAudioTracks();
      if (audioTrack && audioTrack.length) {
        audioTrack[0].onmute = () => {
          alert('muted');
          setMic(false);
          props.videoMuted(props.videoStream);
        };

        audioTrack[0].onunmute = () => {
          setMic(true);
          props.videoMuted(props.videoStream);
        };
      }
    }
  }, [props.videoType, props.videoStream, props.videoMuted]);

  useEffect(() => {
    if (props.videoStream) {
      videoRef.current.srcObject = props.videoStream;
      
      // Check if audio is playing
      const audioTrack = props.videoStream.getAudioTracks()[0];
      if (audioTrack) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(props.videoStream);
        const analyser = audioContextRef.current.createAnalyser();
        source.connect(analyser);

        const checkAudio = () => {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          const sum = data.reduce((a, b) => a + b, 0);
          
          if (sum === 0) {
            setAudioPlaying(false);
            console.log("Audio not playing");
          } else {
            setAudioPlaying(true);
          }
        };

        const intervalId = setInterval(checkAudio, 1000);

        return () => {
          clearInterval(intervalId);
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
        };
      }
    }
  }, [props.videoStream]);

  const muteMic = () => {
    const stream = videoRef.current.srcObject.getTracks().filter(track => track.kind === 'audio');
    setMic(prevMic => {
      if (stream && stream.length > 0) stream[0].enabled = !prevMic;
      return !prevMic;
    });
  };

  const muteCamera = () => {
    const stream = videoRef.current.srcObject.getTracks().filter(track => track.kind === 'video');
    setCamera(prevCamera => {
      if (stream && stream.length > 0) stream[0].enabled = !prevCamera;
      return !prevCamera;
    });
  };

  return (
    <div className="video-container">
      <video
        id={props.id}
        muted={props.muted}
        autoPlay
        className="video-element"
        ref={videoRef}
        style={props.videoStyles}
      ></video>
      {props.showMuteControls && (
        <div className="mute-controls">
          <i onClick={muteMic} className={`material-icons mic-icon ${mic ? 'mic-on' : 'mic-off'}`}>
            {mic ? 'mic' : 'mic_off'}
          </i>
          <i onClick={muteCamera} className={`material-icons camera-icon ${camera ? 'camera-on' : 'camera-off'}`}>
            {camera ? 'videocam' : 'videocam_off'}
          </i>
        </div>
      )}
      {!audioPlaying && <div className="audio-warning">Audio not playing</div>}
    </div>
  );
};

export default Video;
