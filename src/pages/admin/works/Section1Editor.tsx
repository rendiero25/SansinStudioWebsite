import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

const Section1Editor = () => {
  return (
    <SectionWrapper page="works" sectionKey="section1" title="Works Section 1">
      {({ content, updateContent }) => (
        <>
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Text Content
            </h3>
            <QuillFieldEditor
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="e.g. Our Works"
            />
            <TextFieldEditor
              className="mt-4"
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Brief description of the works section..."
            />
          </div>

          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Images
            </h3>
            <div className="flex flex-col gap-6">
              <ImageUploader
                label="Brand Logo"
                value={
                  content.brandLogo as { url: string; publicId: string } | null
                }
                onChange={(val) => updateContent("brandLogo", val)}
                folder="sanxinstudio/works"
              />
              <ImageUploader
                label="Main Image"
                value={
                  content.mainImage as { url: string; publicId: string } | null
                }
                onChange={(val) => updateContent("mainImage", val)}
                folder="sanxinstudio/works"
              />
              <ImageUploader
                label="Background Image"
                value={
                  content.bgImage as { url: string; publicId: string } | null
                }
                onChange={(val) => updateContent("bgImage", val)}
                folder="sanxinstudio/works"
              />
            </div>
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section1Editor;
