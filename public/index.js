/// Selectors - Getting video elements from HTML
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// WebSocket Connection - This will handle signaling between peers
const websocket = new WebSocket("ws://localhost:3000");

let localStream;
let peerConnection;

// ICE Server Configuration - This helps in NAT traversal for peer-to-peer connection
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

/* ===================================================
   1️⃣ PEER A (Caller) - Get User Media (Camera & Microphone)
   =================================================== */
let initLocalStream = async () => {
  try {
    // Request access to webcam & microphone
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.srcObject = localStream;
    createOffer;
  } catch (error) {
    console.error("Error accessing media devices: ", error);
  }
};

/* ===================================================
   2️⃣ PEER A (Caller) - Create Offer & Start Connection
   =================================================== */
let createOffer = async () => {
  // Create a new PeerConnection instance for Peer A
  peerConnection = new RTCPeerConnection(configuration);

  // 🔹 Add local media tracks (video/audio) to Peer A's connection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // 🔹 Listen for remote media tracks from Peer B (Receiver)
  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0]; // Display Peer B's local stream
  };

  // 🔹 Listen for ICE candidates and send them to the other peer
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      websocket.send(
        JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
      );
    }
  };

  const offer = await peerConnection.createOffer();
  /*
    🔹 setLocalDescription(offer) is necessary because:
       - It tells WebRTC that this is the local session description (SDP) for Peer A.
       - It starts the ICE candidate gathering process.
       - It prepares Peer A to receive an answer from Peer B.
  */
  await peerConnection.setLocalDescription(offer);

  // 🔹 Send the offer via WebSocket signaling server
  websocket.send(JSON.stringify({ type: "offer", offer }));
};

/* ===================================================
   3️⃣ PEER B (Receiver) - Handling Incoming Messages from WebSocket
   =================================================== */
websocket.onmessage = async (message) => {
  const data = JSON.parse(message.data);

  /* ===================================================
     3A️⃣ PEER B (Receiver) - Handle Incoming Offer & Answer
     =================================================== */

  if (data.type === "offer") {
    console.log("Received offer, creating an answer...");

    // Create a new PeerConnection instance for Peer B (Receiver)
    peerConnection = new RTCPeerConnection(configuration);
    /*
      🔹 Add local media tracks to Peer B's connection.
         - This is Peer B's local stream (not Peer A's).
         - This allows Peer A to receive Peer B’s audio/video.
    */
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Display Peer A's local stream which is Peer B's remote stream
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    // 🔹 Handle ICE candidates from Peer B
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        websocket.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    // 🔹 Set the received offer as the remote description
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );

    // 🔹 Create an SDP answer (response to the offer)
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // 🔹 Send the answer back via WebSocket
    websocket.send(JSON.stringify({ type: "answer", answer }));
  } else if (data.type === "answer") {
    /* ===================================================
     3B️⃣ PEER A (Caller) - Handle Incoming Answer
     =================================================== */
    console.log("Received answer, setting remote description...");

    /*
      🔹 setRemoteDescription(answer):
         - This tells Peer A that Peer B has accepted the offer.
         - It completes the WebRTC handshake process.
    */
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
  } else if (data.type === "ice-candidate") {
    /* ===================================================
     3C️⃣ BOTH PEERS - Handle ICE Candidate Exchange
     =================================================== */
    console.log("Received ICE candidate, adding to peer connection...");
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
};

// Start the process by initializing the local stream
initLocalStream();
