"use client";

import App from "./components/App";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="bg-black/30 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-favorit">Live Transcription</h1>
          <a
            href="https://console.deepgram.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#13EF93] to-[#149AFB] text-black font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get API Key
          </a>
        </div>
      </header>

      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <App />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-400">
          Powered by Deepgram
        </div>
      </footer>
    </div>
  );
};

export default Home;