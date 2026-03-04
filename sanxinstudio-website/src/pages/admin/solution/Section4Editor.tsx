import SectionWrapper from "../../../components/cms/SectionWrapper";
import ButtonEditor from "../../../components/cms/ButtonEditor";

const Section4Editor = () => {
  return (
    <SectionWrapper
      page="solution"
      sectionKey="section4"
      title="Section 4 — CTA Button"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
            Call to Action Button
          </h3>
          <ButtonEditor
            label="Button"
            value={
              (content.ctaButton as { text: string; link: string }) || {
                text: "Discuss with us →",
                link: "/contact",
              }
            }
            onChange={(val) => updateContent("ctaButton", val)}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section4Editor;
