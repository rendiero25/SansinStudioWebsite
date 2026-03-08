import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";

const Section2Editor = () => {
  return (
    <SectionWrapper page="company" sectionKey="section2" title="Company - Section 2">
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <div className="flex flex-col gap-4">
            <TextFieldEditor
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="Section Title"
            />
            <TextFieldEditor
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Section Description"
            />
            <ImageUploader
              label="Section Image"
              value={(content.image as { url: string; publicId: string }) || null}
              onChange={(val) => updateContent("image", val)}
              folder="sanxinstudio/company"
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section2Editor;
