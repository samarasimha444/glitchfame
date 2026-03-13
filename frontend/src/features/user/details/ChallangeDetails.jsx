export const ChallangeDetails = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center">

      <div className="w-full max-w-[1200px]">

        {/* HERO + MAIN SECTION */}
        <div className="flex flex-col md:flex-row">

          {/* HERO IMAGE */}
          <div className="relative md:w-1/2 h-[260px] md:h-[420px]">
            <img
              src="https://media.istockphoto.com/id/2062707084/photo/gold-star-as-a-reward-top-performance-award-winner-certificate-first-place-in-a-computer-game.jpg?s=2048x2048&w=is&k=20&c=9TRWAK2dRxbevw4luOFKBhb-rMvqpbpcCQuEfUWMtmk="
              className="w-full h-full object-cover"
              alt="about-us"
            />

            <span className="absolute top-4 left-4 bg-purple-600 text-xs px-3 py-1 rounded-full">
              FAIR & FUN
            </span>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="md:w-1/2 px-5 md:px-10 py-6 space-y-5">

            {/* TAGS */}
            <div className="flex gap-2 text-xs text-gray-300">
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">
                Voting
              </span>
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">
                Prizes
              </span>
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">
                Fairness
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold">
              Welcome to GlitchFame
            </h1>


            <p className="text-sm md:text-base text-gray-400">
              GlitchFame is a modern voting platform where your voice truly matters. 
              Users can participate, vote, and win prizes in a safe, transparent, 
              and completely fair environment. No cheating, no manipulations — just 
              pure competition and rewards for genuine engagement.
            </p>

          
            <div className="flex gap-4">

              <div className="flex-1 bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
                <p className="text-xs text-gray-400">ACTIVE USERS</p>
                <p className="text-lg md:text-xl font-bold">1K+</p>
              </div>

              <div className="flex-1 bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
                <p className="text-xs text-gray-400">PRIZES AWARDED</p>
                <p className="text-lg md:text-xl font-bold">$120K+</p>
              </div>

            </div>

           
            <div className="space-y-2">

              <p className="text-sm text-gray-400">
                Our Core Principles
              </p>

              <div className="flex gap-3">

                {["Fair Voting", "Transparent Results", "Secure", "Rewarding"].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#0f0f0f] border border-gray-800 w-[70px] md:w-[80px] py-3 rounded-lg text-center"
                  >
                    <p className="text-lg font-bold">✔</p>
                    <p className="text-xs text-gray-400">{item}</p>
                  </div>
                ))}

              </div>

            </div>

            {/* JOIN BUTTON */}
            <button className="w-full md:w-fit bg-purple-600 px-8 py-3 rounded-lg font-semibold">
              Join Us Now
            </button>

          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 px-5 md:px-10">

          <div className="flex border-b border-gray-800 text-sm max-w-[600px]">

            <button className="flex-1 py-3 text-purple-500 border-b-2 border-purple-500">
              About
            </button>

            <button className="flex-1 py-3 text-gray-400">
              How It Works
            </button>

            <button className="flex-1 py-3 text-gray-400">
              FAQ
            </button>

          </div>

        </div>

        
        <div className="px-5 md:px-10 py-6 max-w-[700px] space-y-4">

          <h2 className="text-lg font-semibold">
            ⚡ About GlitchFame
          </h2>

          <p className="text-gray-400 text-sm md:text-base">
            Our mission is simple: empower users to participate in fair voting competitions and be rewarded for their engagement. 
            Every vote counts, and every prize is earned legitimately. Whether you're competing or just exploring, you can trust 
            that our platform is built for integrity and transparency.
          </p>

          <div className="space-y-3">

            <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                Transparent Voting
              </p>
              <p className="text-xs text-gray-400">
                Every vote is recorded fairly, with results visible to all participants.
              </p>
            </div>

            <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                Rewarding Experience
              </p>
              <p className="text-xs text-gray-400">
                Win prizes for your active participation in competitions and challenges.
              </p>
            </div>

            <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                Anti-Cheating Measures
              </p>
              <p className="text-xs text-gray-400">
                Advanced mechanisms ensure no one can manipulate votes or results.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChallangeDetails;