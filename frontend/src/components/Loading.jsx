import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center">
        {/* Animated Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-2xl border border-purple-500 animate-pulse opacity-40"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {message}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Please wait while we wake up the server...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"></div>
        </div>

        {/* Fun Message */}
        <p className="text-xs text-gray-500">
          Free tier servers need their beauty sleep! 💤
        </p>
      </div>
    </div>
  );
};

export default Loading;