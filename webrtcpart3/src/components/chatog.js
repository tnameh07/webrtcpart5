import React, { useState, useEffect, useRef } from "react";
import DragDrop from "./dragDrop.js";

const Chat = ({ user, messages, sendMessage }) => {
  const [message, setMessage] = useState("");
  // const [user, setUser] = useState({ uid: 0, })
  const [imageZoom, setImageZoom] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
    // setUser({ uid: props.user.uid, })
  }, [messages]);

  // const sendMessage = (msg) => {
  //   props.sendMessage(msg);
  //   scrollToBottom()
  // }

  const handleSubmit = (event) => {
    if (message === "") return;
    event.preventDefault();
    console.log(user);

    sendMessage({
      type: "text",
      message: {
        id: user.uid,
        sender: { uid: user.uid, username: user.username },
        data: { text: message },
      },
    });
    setMessage("");
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const renderMessage = (userType, data) => {
    const {
      sender,
      data: { text, image },
    } = data.message;
    console.log("===========", data);
    const message = data.message;

    console.log(message);
    console.log(data);

    const msgDiv = (data.type === "text" && (
      <div className="msg">
        {/* <p>{message.sender.uid}</p> */}
        <p>{sender.username || sender.uid}</p>
        <div className="message"> {message.data.text}</div>
      </div>
    )) || (
      <div className="msg">
        <p>{sender.username}</p>
        <img
          onClick={() => {
            setImageZoom(true);
            setSelectedImage(message.data);
          }}
          className="message"
          style={{
            width: 200,
            // height: 100
            cursor: "pointer",
          }}
          src={message.data}
        />
      </div>
    );

    return <li className={userType}>{msgDiv}</li>;
  };

  const showEnlargedImage = (data) => {
    return (
      <img
        src={data}
        style={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 100,
          display: "block",
          cursor: "pointer",
          marginLeft: "auto",
          marginRight: "auto",
          padding: 20,
          borderRadius: 20,
        }}
        onClick={() => setImageZoom(false)}
      />
    );
  };

  return (
    <div>
      {imageZoom && showEnlargedImage(selectedImage)}

      <div
        className="chatWindow"
        style={{
          zIndex: 10,
          position: "absolute",
          right: 5,
          top: 190,
          bottom: 50,
          width: 500,
          // height: 650,
        }}
      >
        <ul className="chat" id="chatList">
          {messages.map((data) => (
            <div key={data.id}>
              {user.uid === data.message.sender.uid
                ? renderMessage("self", data)
                : renderMessage("other", data)}
            </div>
          ))}
        </ul>
        <DragDrop
          className="chatInputWrapper"
          sendFiles={(files) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const maximumMessageSize = 262118; //65535 <=== 64KiB // 16384 <=== 16KiB to be safe
              if (e.target.result.length <= maximumMessageSize)
                sendMessage({
                  type: "image",
                  message: {
                    id: user.uid,
                    sender: { uid: user.uid },
                    data: e.target.result,
                  },
                });
              else alert("Message exceeds Maximum Message Size!");
            };

            reader.readAsDataURL(files[0]);
          }}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <input
                className="textarea input"
                type="text"
                placeholder="Enter your message..."
                onChange={handleChange}
                value={message}
              />
            </form>
          </div>
        </DragDrop>
      </div>
    </div>
  );
};

export default Chat;
