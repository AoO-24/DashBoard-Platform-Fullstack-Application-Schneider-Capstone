import React from 'react';

function WelcomeBanner() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8 rounded-lg shadow-lg overflow-hidden mb-1">
      {/* Background illustration */}
      <div className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block" aria-hidden="true">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-40 transform rotate-6"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-800 opacity-40 transform -rotate-6"></div> */}
        <svg width="319" height="198" xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
            <path id="welcome-a" d="M64 0l64 128-64-20-64 20z" />
            <path id="welcome-e" d="M40 0l40 80-40-12.5L0 80z" />
            <path id="welcome-g" d="M40 0l40 80-40-12.5L0 80z" />
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="welcome-b">
              <stop stopColor="#A5B4FC" offset="0%" />
              <stop stopColor="#818CF8" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="welcome-c">
              <stop stopColor="#4338CA" offset="0%" />
              <stop stopColor="#6366F1" stopOpacity="0" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="rotate(64 36.592 105.604)">
              <mask id="welcome-d" fill="#fff">
                <use xlinkHref="#welcome-a" />
              </mask>
              <use fill="url(#welcome-b)" xlinkHref="#welcome-a" />
              <path fill="url(#welcome-c)" mask="url(#welcome-d)" d="M64-24h80v152H64z" />
            </g>
            <g transform="rotate(-51 91.324 -105.372)">
              <mask id="welcome-f" fill="#fff">
                <use xlinkHref="#welcome-e" />
              </mask>
              <use fill="url(#welcome-b)" xlinkHref="#welcome-e" />
              <path fill="url(#welcome-c)" mask="url(#welcome-f)" d="M40.333-15.147h50v95h-50z" />
            </g>
            <g transform="rotate(44 61.546 392.623)">
              <mask id="welcome-h" fill="#fff">
                <use xlinkHref="#welcome-g" />
              </mask>
              <use fill="url(#welcome-b)" xlinkHref="#welcome-g" />
              <path fill="url(#welcome-c)" mask="url(#welcome-h)" d="M40.333-15.147h50v95h-50z" />
            </g>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl text-white font-bold mb-6 text-center tracking-wider">
          Monthly Performance Update
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 flex flex-col items-center shadow-md transition duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4 transition duration-500 ease-in-out transform hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xl text-white font-semibold tracking-wide">Break Time</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 flex flex-col items-center shadow-md transition duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4 transition duration-500 ease-in-out transform hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xl text-white font-semibold tracking-wide">Driving Adherence</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 flex flex-col items-center shadow-md transition duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4 transition duration-500 ease-in-out transform hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xl text-white font-semibold tracking-wide">Customer Satisfaction</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 flex flex-col items-center shadow-md transition duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-4 transition duration-500 ease-in-out transform hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-xl text-white font-semibold tracking-wide">Salary</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 flex flex-col items-center shadow-md transition duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-4 transition duration-500 ease-in-out transform hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-xl text-white font-semibold tracking-wide">Work Time</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 flex flex-col items-center shadow-md transition duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-4 transition duration-500 ease-in-out transform hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-xl text-white font-semibold tracking-wide">Fuel Consumption</span>
          </div>        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
