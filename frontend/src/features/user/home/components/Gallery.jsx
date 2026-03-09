import React from "react";
import { useWinners } from "../hooks";

const Gallery = () => {

  const { data: winners, isLoading, isError, error } = useWinners();

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (isError) return <p className="text-red-500">{error.message}</p>;

  const champion = winners?.[0];
  const runnerUps = winners?.slice(1);

  return (
    <>


<div className="w-full sm:hidden min-h-screen mt-12 bg-gradient-to-b text-white flex justify-center">

  <div className="w-full max-w-[420px] px-4 py-8 space-y-6">

    <div>
      <h1 className="text-3xl font-bold">
        PAST <span className="text-purple-500">WINNERS</span>
      </h1>
    </div>

{/* GRAND CHAMPION */}

{champion && (
<div>

<p className="text-xs text-yellow-400 tracking-widest mb-3">
🏆 GRAND CHAMPION
</p>

<div className="relative h-[350px] rounded-xs overflow-hidden">

<img
src={champion.photoUrl}
alt={champion.contestantName}
className="w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/>

<div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
1ST
</div>

<div className="absolute bottom-4 left-4">
<p className="text-xs text-gray-300">{champion.seasonName}</p>

<h3 className="text-xl font-bold">
{champion.contestantName}
</h3>

<p className="text-xs text-gray-400">
Prize ₹{champion.prizeMoney}
</p>
</div>

</div>
</div>
)}

{/* RUNNER UPS */}

<div>

<div className="flex justify-between items-center mb-3">
<p className="text-xs text-gray-400 tracking-widest">
RUNNER UPS
</p>
</div>

<div className="flex gap-4 mt-3 overflow-x-auto scroll-smooth pb-2">

{runnerUps?.map((item, index) => (

<div
key={item.contestantId}
className="min-w-[250px] h-[300px] rounded-xl overflow-hidden relative"
>

<img
src={item.photoUrl}
className="w-full h-full object-cover"
alt={item.contestantName}
/>

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/>

<div className="absolute top-4 right-4 bg-gray-300 text-black px-3 py-1 rounded-full text-xs font-bold">
{index === 0 ? "2ND" : "3RD"}
</div>

<div className="absolute bottom-4 left-4">
<p className="text-xs text-gray-300">
{item.seasonName}
</p>

<h4 className="text-sm font-semibold">
{item.contestantName}
</h4>
</div>

</div>

))}

</div>

</div>

</div>

</div>


{/* ---------------- DESKTOP VIEW ---------------- */}

<div className="w-full hidden sm:block text-white px-6 md:px-20 py-20">

<div className="flex justify-between items-start sm:mb-14">

<div>
<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
PAST <span className="text-gray-500">WINNERS</span>
</h1>

<p className="text-gray-400 mt-4 max-w-xl text-sm">
Celebrating the top-tier creators who defined the standards
of the GlitchFame community.
</p>

</div>

</div>

<div className="flex justify-center items-end gap-8 mb-16">

{winners?.map((item, index) => {

const size = index === 0 ? "large" : "small";

return (

<div
key={item.contestantId}
className={`relative rounded-2xl overflow-hidden border border-[#2A323C] bg-[#111418]
${size === "large" ? "w-[420px] h-[520px]" : "w-[320px] h-[420px]"}
`}
>

<img
src={item.photoUrl}
alt={item.contestantName}
className="w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"/>

<div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">

{index === 0 ? "1ST" : index === 1 ? "2ND" : "3RD"}

</div>

<div className="absolute bottom-6 left-6">

<p className="text-sm text-gray-300 mb-2">
{item.seasonName}
</p>

<h3 className="text-lg font-semibold tracking-wide">
{item.contestantName}
</h3>

<p className="text-gray-400 text-xs mt-2">
Prize ₹{item.prizeMoney}
</p>

</div>

</div>

);

})}

</div>

<div className="flex justify-between items-center border-t border-[#2A323C] pt-6">

<div className="flex items-center gap-2 text-sm text-gray-400">

<span className="w-2 h-2 bg-green-500 rounded-full"></span>

New season coming soon.

</div>

<button className="bg-[#BE5EED] text-black px-6 py-2 rounded-xs text-sm font-semibold hover:opacity-90 transition">
View All Winners
</button>

</div>

</div>

</>
  );
};

export default Gallery;