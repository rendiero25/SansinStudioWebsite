import SectionWrapper from "../../../components/cms/SectionWrapper";
import ImageUploader from "../../../components/cms/ImageUploader";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

const Section1Editor = () => {
  return (
    <SectionWrapper
      page="solution"
      sectionKey="section1"
      title="Section 1 — Hero"
    >
      {({ content, updateContent }) => (
        <>
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Background Image
            </h3>
            <ImageUploader
              label="Background Image"
              value={
                content.bgImage as { url: string; publicId: string } | null
              }
              onChange={(val) => updateContent("bgImage", val)}
              folder="sanxinstudio/solution"
            />
          </div>

          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Brand & Title
            </h3>
            <ImageUploader
              label="Brand Logo"
              value={
                content.brandLogo as { url: string; publicId: string } | null
              }
              onChange={(val) => updateContent("brandLogo", val)}
              folder="sanxinstudio/solution"
            />
            <QuillFieldEditor
              className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="Enter title text..."
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section1Editor;
