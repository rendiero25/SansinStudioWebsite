import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";

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
          <div className="cms-card">
            <h3 className="cms-card-title">Text Content</h3>
            <TextFieldEditor
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="Got similar problems? We'll help you to solve it."
            />
            <TextFieldEditor
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Optional description..."
            />
          </div>

          {/* Background */}
          <div className="cms-card">
            <h3 className="cms-card-title">Background</h3>
            <ImageUploader
              label="Background Image"
              value={
                content.bgImage as { url: string; publicId: string } | null
              }
              onChange={(val) => updateContent("bgImage", val)}
              folder="sanxinstudio/section4"
            />
          </div>

          {/* Button */}
          <div className="cms-card">
            <h3 className="cms-card-title">Button</h3>
            <ButtonEditor
              label="CTA Button"
              value={
                (content.ctaButton as { text: string; link: string }) || {
                  text: "Contact Us",
                  link: "/contact",
                }
              }
              onChange={(val) => updateContent("ctaButton", val)}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section4Editor;
