
import CountdownTimer from "../home/components/CountdownTimer";
import { useSeasonById } from "../home/hooks";

const VotingHeader = ({id}) => {

  
const { data, isLoading, isError } = useSeasonById(id);


   console.log(data)
  const endDate = data?.votingEndDate


  return (
    <section className="w-full  text-white py-6 md:py-4 px-1 md:px-16">



      <div className="max-w-350 mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="max-w-xl">

            <div className=" hidden md:flex items-center gap-3 text-sm text-purple-400 mb-4">
              <span className="px-3 text-xs md: text-normal py-1 bg-purple-600/20 rounded-full">
                Featured Event
              </span>
             
            </div>

            <h1 className="text-2xl uppercase md:text-5xl font-bold">
              {data?.name} <span className="text-purple-400">2026</span>
            </h1>

            <p className="text-gray-400 w-full max-w-xl hidden sm:flex mt-4 leading-relaxed">
              {data?.seasonDesc} 
              <span className="text-yellow-400 font-semibold px-3">
                {" "}
                Rs{data?.prizeMoney} Grand Prize.
              </span>
            </p>
          </div>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-purple-400/80">
              Voting Ends In
            </span>

            <div className="flex items-center gap-1.5">
              <CountdownTimer
                endDate={endDate}
                className="font-mono text-lg sm:text-xl font-bold text-white tracking-widest"
              />
            </div>
          </div>
        </div>

        
      </div>

   
    </section>
  );
};

export default VotingHeader;
