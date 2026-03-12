import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";

const Section2Editor = () => {
  return (
    <SectionWrapper page="company" sectionKey="section2" title="Company - Section 2 (Privacy Policy Image)">
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <div className="flex flex-col gap-6">
            <TextFieldEditor
              label="Section Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="e.g. Privacy Policies"
            />
            <ImageUploader
              label="Privacy Policy Image"
              value={(content.image as { url: string; publicId: string }) || null}
              onChange={(val) => updateContent("image", val)}
              folder="sanxinstudio/company/privacy"
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section2Editor;
