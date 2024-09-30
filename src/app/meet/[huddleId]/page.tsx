"use client";

import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function VideoCall() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const endCall = () => {
    console.log("Ending call...");
  };

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-gray-300">
        <div className="flex-grow flex">
          <main className="flex-grow flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
              {isScreenSharing ? (
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl bg-gray-700">
                  Shared Screen Content
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                  Second Person's Video
                </div>
              )}
              {/* Small window for own video */}
              <div className="absolute top-4 right-4 w-1/4 aspect-video bg-gray-600 rounded-lg overflow-hidden">
                <div className="flex items-center justify-center h-full text-white">
                  Your Video
                </div>
              </div>
              {/* Shared screen window (when not full screen) */}
              {isScreenSharing && (
                <div className="absolute bottom-4 left-4 w-1/4 aspect-video bg-gray-600 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full text-white">
                    Second Person's Video
                  </div>
                </div>
              )}
            </div>
          </main>
          {isChatOpen && (
            <div className="my-10 mx-2 min-w-[300px] w-1/4 rounded-xl bg-white shadow-lg flex flex-col z-20">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button
                  onClick={toggleChat}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close chat">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1" />
              <div className="px-4">
                <Editor
                  onSubmit={() => {}}
                  placeholder="Start an Conversation on Meeting..."
                />
              </div>
            </div>
          )}
          {/* {isChatOpen && (
            <div
              className={
                "w-1/4  bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
              }>
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button
                  onClick={toggleChat}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close chat">
                  <X size={24} />
                </button>
              </div>
              <div className="h-full overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${message.sender === "You" ? "text-right" : ""}`}>
                    <span className="font-semibold">{message.sender}: </span>
                    <span>{message.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Send
                  </button>
                </div>
              </form>
            </div>
          )} */}
        </div>
        <footer className="bg-white p-4 flex justify-center space-x-4">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full ${
              isMicOn ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
            }`}
            aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}>
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full ${
              isCameraOn
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
            aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}>
            {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full ${
              isScreenSharing
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
            aria-label={
              isScreenSharing ? "Stop sharing screen" : "Share screen"
            }>
            <Monitor size={24} />
          </button>
          <button
            onClick={toggleChat}
            className={`p-4 rounded-full ${
              isChatOpen
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
            aria-label={isChatOpen ? "Close chat" : "Open chat"}>
            <MessageSquare size={24} />
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="End call">
            <PhoneOff size={24} />
          </button>
        </footer>

        {/* Chat Sidebar */}
      </div>
    </>
  );
}
