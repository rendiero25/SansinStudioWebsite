import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";

const Section7Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section7"
      title="Section 7 — Our Real Framework"
    >
      {({ content, updateContent }) => (
        <>
          {/* Title */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Text Content</h3>
            <TextFieldEditor
                className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="Our real framework is our unique brand methodology. You make profit, we also make our reputation."
            />
            <TextFieldEditor
                className="mt-4"
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Additional description..."
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section7Editor;
