
import CountdownTimer from "../home/components/CountdownTimer";
import { useSeasonById } from "../home/hooks";

const VotingHeader = ({id}) => {

  
const { data, isLoading, isError } = useSeasonById(id);


   console.log(data)
  const endDate = data?.votingEndDate


  return (
    <section className="w-full  text-white py-6 md:py-4  md:px-16">



      <div className="max-w-350 mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-10">
          <div className="max-w-xl">

            <div className=" hidden md:flex items-center gap-3 text-sm  sm:mb-4">
              <span className="px-3 text-xs md: text-normal py-1 bg-purple-600/20 rounded-full">
                Featured Event
              </span>
             
            </div>

            <h1 className="text-2xl uppercase md:text-5xl font-black">
              {data?.name} <span className="text-primary">2026</span>
            </h1>

            <p className="text-gray-400 w-full max-w-xl sm:flex sm:mt-4 leading-relaxed">
              {data?.seasonDesc} 
              <span className="text-yellow-400 hidden sm:flex font-semibold px-3">
                {" "}
                Rs{data?.prizeMoney} Grand Prize.
              </span>
            </p>
          </div>

       
  
              <CountdownTimer
                endDate={endDate}
                className="font-mono text-lg sm:text-xl font-bold text-white tracking-widest"
              />
           
         
        </div>

        
      </div>

   
    </section>
  );
};

export default VotingHeader;
