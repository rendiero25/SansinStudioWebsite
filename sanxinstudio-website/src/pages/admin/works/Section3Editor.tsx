import SectionWrapper from "../../../components/cms/SectionWrapper";
import ButtonEditor from "../../../components/cms/ButtonEditor";

const Section3Editor = () => {
  return (
    <SectionWrapper
      page="works"
      sectionKey="section3"
      title="Works Section 3 — Action Buttons"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
            Call to Action Buttons
          </h3>
          <div className="flex flex-col gap-8">
            {/* Button 1: Name only (no link) */}
            <div className="pb-6 border-b border-white/10">
              <h4 className="text-sm font-medium text-white/70 mb-3">
                Button 1 (Text Only)
              </h4>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/50">
                  Button Label
                </label>
                <input
                  type="text"
                  className="px-4 py-3 bg-white/4 border border-white/10 rounded-[10px] text-white text-sm outline-none transition-colors w-full focus:border-indigo-500/50"
                  value={(content.button1Name as string) || ""}
                  onChange={(e) => updateContent("button1Name", e.target.value)}
                  placeholder="e.g. Schedule a Call"
                />
              </div>
            </div>

            {/* Button 2: Name + Link */}
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-3">
                Button 2 (With Link)
              </h4>
              <ButtonEditor
                label=""
                value={
                  (content.button2 as { text: string; link: string }) || {
                    text: "Start Project",
                    link: "/contact",
                  }
                }
                onChange={(val) => updateContent("button2", val)}
              />
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section3Editor;
