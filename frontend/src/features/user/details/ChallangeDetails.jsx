import { Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const howToPlaySteps = [
  {
    id: "01",
    title: "Build Your Identity",
    desc: "Mint your Survivor Profile. Customize your avatar, link your social graph, and define your talent niche.",
  },
  {
    id: "02",
    title: "Enter The Stream",
    desc: "Go live in the Arena. Showcase your skill—whether it's gaming, art, music, or pure personality.",
  },
  {
    id: "03",
    title: "Survive the Glitch",
    desc: "Face daily elimination rounds. Only the top-rated performers based on community 'Energy' survive to the next day.",
  },
  {
    id: "04",
    title: "Claim The Fame",
    desc: "Reach the Season Finale to win the massive Prize Pool and be inducted into the Hall of Fame.",
  },
];

const faqData = [
  {
    question: "What is a 'Glitch'?",
    answer:
      "A 'Glitch' is a random platform event that doubles voting energy or triggers instant elimination rounds. You have to stay ready at all times!",
  },
  {
    question: "How do I get paid?",
    answer:
      "Prizes are distributed automatically to your linked wallet within 24 hours of a challenge finale.",
  },
  {
    question: "Is it free to join?",
    answer:
      "Yes! Creating a profile and exploring is free. Some premium challenges may require specific passes.",
  },
];

const features = [
  {
    title: "Transparent Voting",
    desc: "Every vote is recorded fairly and visible to all participants in real-time.",
  },
  {
    title: "Rewarding Experience",
    desc: "Win prizes for your active participation in competitions and daily challenges.",
  },
  {
    title: "Anti-Cheating Measures",
    desc: "Advanced mechanisms ensure no one can manipulate votes or platform results.",
  },
];

export const ChallangeDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("About");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="w-full pt-16 md:pt-24 min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row border-b border-gray-900 pb-10 md:pb-16 gap-8 md:gap-12">
          {/* Image Container */}
          <div className="relative w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[60vh] lg:h-[65vh]">
            <img
              src="/trophy.webp"
              className="w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl"
              alt="Challenge Trophy"
            />
            <span className="absolute top-4 left-4 bg-primary text-black text-[9px] sm:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Fair & Fun
            </span>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="flex flex-wrap gap-2">
              {["Voting", "Prizes", "Fairness"].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#111] border border-gray-800 text-[10px] sm:text-xs text-gray-400 px-3 py-1 rounded-full uppercase font-bold tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mobile-h2 sm:home-h2 ">
              Welcome to <span className="text-primary ">GlitchFame</span>
            </h1>

            <p className="small-text">
              A modern voting platform where your voice truly matters.
              Participate, vote, and win prizes in a safe, transparent
              environment built for genuine engagement.
            </p>

            <button
              onClick={() => navigate("/arena")}
              className="w-full md:w-fit bg-primary text-black px-10 py-3 sm:py-4 rounded-xl font-black text-sm uppercase tracking-widest md:transition-all md:hover:brightness-110 md:hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] md:active:scale-95"
            >
              Join Us Now
            </button>
          </div>
        </div>

        {/* MOBILE TABS NAVIGATION (Hidden on Desktop) */}
        <div className="mt-8 md:hidden">
          <div className="flex border-b border-gray-800 text-[11px] font-black uppercase  tracking-[0.2em]  overflow-x-auto scrollbar-hide">
            {["About", "how", "faq"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[100px] py-4 transition-all whitespace-nowrap ${
                  activeTab === tab ?
                    "text-primary border-b-2 uppercase border-primary"
                  : "text-gray-500 border-b-2 border-transparent"
                }`}
              >
                {tab === "how" ?
                  "How it works"
                : tab === "faq" ?
                  "Questions"
                : tab}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN GRID LAYOUT (Desktop: 2 Columns | Mobile: Toggled) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 py-12 md:py-20">
          {/* LEFT COLUMN: About & How It Works */}
          <div
            className={`md:col-span-7 space-y-16 lg:space-y-24 ${activeTab === "faq" && "hidden md:block"}`}
          >
            {/* ABOUT */}
            <section
              className={`${activeTab !== "About" && "hidden md:block"} space-y-8 sm:animate-in fade-in duration-500`}
            >
              <h2 className="text-xl sm:text-2xl font-black border-l-4 border-primary pl-4 uppercase tracking-tighter">
                About GlitchFame
              </h2>
              <p className="small-text">
                Our mission is simple: empower users to participate in fair
                voting competitions. Every vote counts, and every prize is
                earned legitimately through pure competition and community
                merit.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="bg-[#080808] border border-gray-800/50 p-6 rounded-2xl hover:border-primary/40 transition-all group"
                  >
                    <p className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {f.title}
                    </p>
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest sm:text-base sm:normal-case sm:tracking-normal">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section
              className={`${activeTab !== "how" && "hidden md:block"} space-y-12 animate-in fade-in duration-500`}
            >
              <div className="flex items-center gap-3">
                <span className="text-primary text-2xl lg:text-3xl">
                  <Zap />
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
                  How To Play
                </h2>
              </div>

              <div className="relative space-y-12 pl-4">
                {/* Visual Connector Line */}
                <div className="absolute left-[23px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-primary/60 via-gray-800 to-transparent"></div>

                {howToPlaySteps.map((step) => (
                  <div
                    key={step.id}
                    className="relative flex gap-8 items-start group"
                  >
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary bg-black flex items-center justify-center text-primary font-black text-xs sm:text-sm transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                      {step.id}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p
                        className="text-gray-400 text-[9px] sm:text-[11px] 
                      md:text-[14px] uppercase tracking-widest sm:text-base sm:normal-case sm:tracking-normal"
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Questions (FAQ) */}
          <div
            className={`md:col-span-5 ${activeTab !== "faq" && "hidden md:block"} animate-in fade-in duration-500`}
          >
            <div className="md:sticky md:top-28 space-y-10">
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                  Questions
                  <span className="text-[10px] text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 font-black">
                    FAQ
                  </span>
                </h2>
                <p className=" text-gray-400 text-[11px] uppercase tracking-widest sm:text-base sm:normal-case sm:tracking-normal md:text-[13px]">
                  Quick answers to common arena queries.
                </p>
              </div>

              <div className="bg-[#080808] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                {faqData.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-800 last:border-none"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                      className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-white/[0.03] transition-all"
                    >
                      <span className="text-sm sm:text-base font-bold pr-6 text-gray-200">
                        {item.question}
                      </span>
                      <div
                        className={`transition-all duration-500 ${openFaq === index ? "rotate-180 text-primary" : "text-gray-600"}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 sm:px-7 pb-7 text-gray-400 text-[11px] uppercase tracking-widest sm:text-base sm:normal-case sm:tracking-normal md:text-[13px]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Support CTA Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-black border border-gray-800 flex flex-col items-center text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl border border-primary/20 shadow-inner">
                  ✉
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-white">
                    Need more help?
                  </p>
                  <p className="small-text">
                    Our support masters are available around the clock to assist
                    your journey.
                  </p>
                </div>
                <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-primary/30 pb-1">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallangeDetails;
