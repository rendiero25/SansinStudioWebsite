import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section3Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section3"
      title="Section 3 — Roadblocks"
    >
      {({ content, updateContent }) => (
        <>
          {/* Title */}
          <div className="cms-card">
            <h3 className="cms-card-title">Title</h3>
            <TextFieldEditor
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="Most companies might face these specific roadblocks for years."
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
              folder="sanxinstudio/section3"
            />
          </div>

          {/* Roadblock Cards */}
          <div className="cms-card">
            <h3 className="cms-card-title">Roadblock Cards</h3>
            <ItemListEditor
              label="Cards"
              items={
                (content.cards as Array<{
                  id: string;
                  title: string;
                  description: string;
                  imageUrl: string;
                }>) || []
              }
              onChange={(items) => updateContent("cards", items)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "e.g. Customer bounce rate",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Description text...",
                },
                {
                  key: "imageUrl",
                  label: "Image URL (upload via Media)",
                  type: "url",
                  placeholder: "https://...",
                },
              ]}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section3Editor;
