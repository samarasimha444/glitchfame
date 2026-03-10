const footerData = {
  brand: {
    name: "GlitchFame",
    description:
      "The ultimate playground for the next generation of visual storytellers. Join, snap, and win.",
  },
  platform: ["Active Contests", "Hall of Fame", "Community Guidelines"],
  support: ["Help Center", "Terms of Service", "Privacy"],
  social: ["Instagram", "Linkdin"],
};

const Footer=()=> {
  return (
  <footer className="bg-[#0F141A] border-t border-[#2A323C] text-gray-400">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
    
    
    <div className="col-span-2 md:col-span-1">
      <h2 className="text-white font-semibold text-lg mb-4">
        {footerData.brand.name}
      </h2>
      <p className="text-sm leading-relaxed max-w-sm">
        {footerData.brand.description}
      </p>
    </div>

    

   
    <div className="col-span-2 md:col-span-1">
      <h4 className="text-white font-medium mb-4">STAY SYNCED</h4>
      <div className="flex flex-wrap gap-3">
        {footerData.social.map((item, index) => (
          <button
            key={index}
            className="px-4 py-1 text-sm border border-[#2A323C] rounded-full 
            hover:border-purple-500 hover:text-purple-400 transition"
          >
            {item}
          </button>
        ))}
      </div>
    </div>

  </div>

 
  <div className="border-t border-[#2A323C] py-4 text-center text-sm text-gray-500">
    © 2026 {footerData.brand.name}. All rights reserved. Built for the culture.
  </div>
</footer>
  );
}


export default Footer