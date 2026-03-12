import SectionWrapper from "../../../components/cms/SectionWrapper";

import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

const Section3Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section3"
      title="Section 3 — Roadblocks"
    >
      {({ content, updateContent }) => (
        <>
          {/* Section Label */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Section Label
            </h3>
            <input
              type="text"
              className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]"
              value={(content.sectionLabel as string) || ""}
              onChange={(e) => updateContent("sectionLabel", e.target.value)}
              placeholder="e.g. SOLUTIONS"
            />
          </div>

          {/* Section Description */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Section Description
            </h3>
            <textarea
              className="px-4 py-3 bg-white/4 border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/6 resize-y min-h-[80px]"
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              placeholder="e.g. See how our solutions maximize your brand/company performance"
            />
          </div>

          {/* Title */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Section Title
            </h3>
            <QuillFieldEditor
              className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="We make it happen for you through our creative solutions"
            />
          </div>

          {/* Action Button */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Action Button
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/50">
                  Button Text
                </label>
                <input
                  type="text"
                  className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]"
                  value={(content.buttonText as string) || ""}
                  onChange={(e) => updateContent("buttonText", e.target.value)}
                  placeholder="e.g. Solutions"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/50">
                  Button Link
                </label>
                <input
                  type="text"
                  className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]"
                  value={(content.buttonLink as string) || ""}
                  onChange={(e) => updateContent("buttonLink", e.target.value)}
                  placeholder="e.g. /solution"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section3Editor;
