export function WhatIsFrameRights() {
  return (
    <section className="px-6 py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24">
          {/* IS */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              What FrameRights Is
            </h3>
            <ul className="space-y-4">
              {[
                "Documentation-first",
                "Plain-language license record pages",
                "Shareable link + print-friendly",
                "Neutral, factual, professional",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-900 font-medium"
                >
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* IS NOT */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              What FrameRights Is Not
            </h3>
            <ul className="space-y-4">
              {[
                "DRM or image watermarking",
                "Automated takedowns",
                "Internet-wide crawling",
                "Social scraping",
                "Legal threat generator",
                "Blockchain/NFT",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-500">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
