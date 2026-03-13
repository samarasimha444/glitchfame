import React from 'react'

const Error = () => {
  return (
      <section className="flex flex-col items-center justify-center min-h-[50dvh] text-center px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        ⚡ Arena is Empty
      </h2>

      <p className="text-gray-400 max-w-md">
       Nothing to display here — no contestants found.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2 rounded-md bg-[#B45ADB] hover:bg-purple-700  font-semibold text-black transition"
      >
        Reload Arena
      </button>
    </section>
  )
}

export default Error

  
