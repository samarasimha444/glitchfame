import React from "react";

const participants = [
  {
    id: 1,
    name: "Luna Void",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: 2,
    name: "Cyborg Ken",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    id: 3,
    name: "Neon Pixie",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
  {
    id: 4,
    name: "Drake Glitch",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
];

const ArenaCard = () => {
  return (
    <section className="bg-black px-6 pb-20">
      <div className="max-w-screen w-full  mx-auto">
        <h2 className="text-white text-xl font-semibold mb-8">
          Current Participants
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {participants.map((user) => (
            <div
              key={user.id}
              className="relative w-full max-w-77.5 h-97 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition"
            >
             
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />

           
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

             
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="text-white font-semibold text-lg">
                  {user.name}
                </h3>

                <button className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md text-black font-semibold hover:opacity-90 transition">
                  VOTE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArenaCard;
