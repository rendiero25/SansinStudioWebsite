import SectionWrapper from "../../../components/cms/SectionWrapper";
import ButtonEditor from "../../../components/cms/ButtonEditor";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

/* Inner component so useEffect stays inside a proper React component */
const Section6Content = ({
  content,
  updateContent,
}: {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}) => {
  return (
    <>
      {/* Title */}
      <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Text Content
        </h3>
        <QuillFieldEditor
          className="mt-4"
          label="Title"
          value={(content.title as string) || ""}
          onChange={(val) => updateContent("title", val)}
          placeholder="How will we achieve it through our framework"
        />
      </div>

      {/* Button */}
      <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Button
        </h3>
        <ButtonEditor
          label="CTA Button"
          value={
            (content.ctaButton as { text: string; link: string }) || {
              text: "Get Started",
              link: "/contact",
            }
          }
          onChange={(val) => updateContent("ctaButton", val)}
        />
      </div>
    </>
  );
};

const Section6Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section6"
      title="Section 6 — Framework"
    >
      {({ content, updateContent }) => (
        <Section6Content content={content} updateContent={updateContent} />
      )}
    </SectionWrapper>
  );
};

export default Section6Editor;
