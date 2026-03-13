export default function NeonLoader() {
  return (
    <div className="flex items-center justify-center w-full min-h-[50vh] sm:min-h-[60vh]">
      <div className="relative flex flex-col items-center">

        <div className="absolute w-14 h-14 rounded-full border-2 border-blue-500/40 animate-ping"></div>

        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent shadow-[0_0_12px_#3b82f6] animate-spin"></div>

        <div className="mt-3 text-center">
          <p className="text-blue-400 text-xs font-semibold tracking-widest">
            LOADING
          </p>
        </div>

      </div>
    </div>
  );
}