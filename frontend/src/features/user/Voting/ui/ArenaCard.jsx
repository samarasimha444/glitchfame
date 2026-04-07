import ShimmerCard from "../../../../components/ShimmerCard";
import { HeartHandshake } from "lucide-react";
import { useState, useCallback, memo } from "react";
import LoginModal from "../../../../components/LoginModal";
import { useOutletContext } from "react-router-dom";
import { useVoteAction } from "../hooks";
import ContestantItem from "./ContestantItem";

const ArenaCard = memo(({ data, seasonId, isLoading }) => {
  const { profile } = useOutletContext();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingState, setLoadingState] = useState(null);

  const { mutate: voteAction } = useVoteAction({
    seasonId,
    setShowLoginModal,
  });

  const stableVoteAction = useCallback(voteAction, [voteAction]);

  return (
    <section className="w-full px-3 md:px-8 py-6"> {/* 🔥 reduced spacing */}
      <div className="w-full mx-auto">

        <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-red-500/10 p-1.5 rounded-lg">
              <HeartHandshake size={18} className="text-red-500" />
            </div>

            <h2 className="text-sm sm:text-xl font-semibold uppercase text-white">
              Live contestants
            </h2>
          </div>

          <span className="bg-gray-900 text-gray-400 px-2 py-1 rounded-full text-[10px] font-bold border border-gray-800">
            {data?.length || 0} TOTAL
          </span>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <ShimmerCard key={idx} />
            ))}

          {!isLoading &&
            data?.map((user) => (
              <ContestantItem
                key={user.participationId}
                user={user}
                loadingState={loadingState}
                setLoadingState={setLoadingState}
                voteAction={stableVoteAction}
              />
            ))}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal onCancel={() => setShowLoginModal(false)} />
      )}
    </section>
  );
});

export default ArenaCard;