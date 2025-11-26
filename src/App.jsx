import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';

// Backend integration (Claude does NOT modify this)
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
   apiKey: "AIzaSyC2uS-fcWCYzMyQqCy72EkBl8CWdoLCpus",
  authDomain: "collab-editor-44d5f.firebaseapp.com",
  databaseURL: "https://collab-editor-44d5f-default-rtdb.firebaseio.com",
  projectId: "collab-editor-44d5f",
  storageBucket: "collab-editor-44d5f.firebasestorage.app",
  messagingSenderId: "679361511798",
  appId: "1:679361511798:web:ad5885e20b9784cebd7a57"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function initializeRealtimeSync(editor, roomId) {
  const docRef = ref(db, `documents/${roomId}`);

  onValue(docRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.content !== editor.getValue()) {
      const position = editor.getPosition();
      editor.setValue(data.content);
      editor.setPosition(position);
    }
  });

  editor.onDidChangeModelContent(() => {
    const content = editor.getValue();
    set(docRef, { content });
  });
}

// Utility function to generate random session ID
const generateSessionId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// Landing Page Component
function LandingPage() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="mb-12">
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CollabCode
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 tracking-tight">
          Collaborate. Code. Create.
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-400 text-center max-w-3xl mb-16 leading-relaxed">
          A real-time collaborative code editor built for speed, simplicity, and teamwork.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => navigate('/host')}
            className="px-10 py-5 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl shadow-white/20"
          >
            Host a Coding Session
          </button>
          <button
            onClick={() => navigate('/join')}
            className="px-10 py-5 bg-gray-800 text-white rounded-2xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 border border-gray-700"
          >
            Join a Session
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <a href="https://github.com" className="hover:text-gray-300 transition-colors">
          GitHub
        </a>
      </footer>
    </div>
  );
}

// Host Page Component
function HostPage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const regenerateId = () => {
    setSessionId(generateSessionId());
  };

  const enterEditor = () => {
    navigate(`/editor/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
      <div className={`max-w-2xl w-full transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Back link */}
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-12">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">Host a Session</h1>
        <p className="text-xl text-gray-400 mb-12">
          Share this session ID with others so they can join.
        </p>

        {/* Session ID Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 mb-8 shadow-2xl">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Your Session ID
          </label>
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl font-mono font-bold tracking-wider text-blue-400">
              {sessionId}
            </div>
          </div>
          <button
            onClick={regenerateId}
            className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Regenerate ID
          </button>
        </div>

        {/* Enter Button */}
        <button
          onClick={enterEditor}
          className="w-full px-10 py-5 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl shadow-white/20"
        >
          Enter Editor
        </button>
      </div>
    </div>
  );
}

// Join Page Component
function JoinPage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (sessionId.trim()) {
      navigate(`/editor/${sessionId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
      <div className={`max-w-2xl w-full transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Back link */}
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-12">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">Join a Session</h1>
        <p className="text-xl text-gray-400 mb-12">
          Enter the session ID shared with you to start collaborating.
        </p>

        {/* Join Form */}
        <form onSubmit={handleJoin} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-2xl">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full px-6 py-4 bg-gray-950 border border-gray-700 rounded-xl text-3xl font-mono tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={sessionId.length < 6}
            className="w-full px-10 py-5 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
}

// Editor Page Component
function EditorPage() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleEditorMount = (editor) => {
    initializeRealtimeSync(editor, roomId);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaveSession = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CollabCode
          </div>
        </div>

        {/* Room ID */}
        <div className="flex items-center gap-4">
          <div className="text-gray-400 text-sm">Session ID:</div>
          <div className="px-4 py-2 bg-gray-800 rounded-lg font-mono text-blue-400 font-semibold">
            {roomId}
          </div>
          <button
            onClick={copyRoomId}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>

        {/* Leave Button */}
        <button
          onClick={leaveSession}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Leave Session
        </button>
      </nav>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Start coding together!\n\n"
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: true },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}