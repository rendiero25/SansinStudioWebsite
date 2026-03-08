import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";

const Section4Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section4"
      title="Section 4 — Got Similar Problems?"
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
              placeholder="Got similar problems? We'll help you to solve it."
            />
            <TextFieldEditor
                className="mt-4"
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Optional description..."
            />
          </div>

          {/* Background */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Background</h3>
            <ImageUploader
              label="Background Image"
              value={
                content.bgImage as { url: string; publicId: string } | null
              }
              onChange={(val) => updateContent("bgImage", val)}
              folder="sanxinstudio/section4"
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section4Editor;
