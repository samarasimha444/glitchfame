import ShimmerCard from "../../../../components/ShimmerCard";
import toast from "react-hot-toast";
import Error from "../../../../components/Error";
import { Heart } from "lucide-react";
import { ContestantCard } from "./ContestantCards";

const ArenaCard = ({ data, seasonId, isLoading, isError }) => {
  

  const handleVote = async (participationId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login required!");

    try {
      const res = await fetch("http://localhost:3000/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participationId, seasonId }),
      });

      if (!res.ok) throw new Error("Vote failed");

      const data = await res.json();
      toast.success("Vote recorded!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <section className="flex flex-col w-full  sm:px-6 md:pb-20">
      <div className="w-full  mx-auto">
        <div className="flex items-center justify-between sm:mt-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart size={18} strokeWidth={2} />
            <span className="text-[18px] font-semibold text-white">
              Current Participants
            </span>
          </div>

          <span className="text-xs text-center text-gray-400 font-semibold">
            42 TOTAL
          </span>
        </div>

        {isError || (!isLoading && data.length === 0) ?
          <Error />
        : <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8">
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex w-full justify-center">
                  <ShimmerCard />
                </div>
              ))}

            {!isLoading &&
              data?.map((user) => (
                <div
                  key={user.participationId}
                  className="flex flex-col items-center"
                >
                  <ContestantCard user={user} />

                  <button
                    onClick={() => handleVote(user.participationId)}
                    className="mt-2 w-35 sm:w-full sm:text-base bg-[#9DE2E2] text-[12px] text-black font-semibold py-2 rounded-md hover:opacity-90 transition"
                  >
                    Vote Now
                  </button>
                </div>
              ))}
          </div>
        }
      </div>
    </section>
  );
};

export default ArenaCard;
