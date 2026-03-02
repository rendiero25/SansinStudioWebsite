import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section2Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section2"
      title="Section 2 — Technical Breakthrough"
    >
      {({ content, updateContent }) => (
        <>
          {/* Title */}
          <div className="cms-card">
            <h3 className="cms-card-title">Title & Description</h3>
            <TextFieldEditor
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="Turn your technical breakthrough into a high growth asset."
            />
            <TextFieldEditor
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Optional description text..."
            />
          </div>

          {/* Items */}
          <div className="cms-card">
            <h3 className="cms-card-title">Feature Items</h3>
            <ItemListEditor
              label="Items"
              items={
                (content.items as Array<{
                  id: string;
                  icon: string;
                  title: string;
                  description: string;
                }>) || []
              }
              onChange={(items) => updateContent("items", items)}
              fields={[
                {
                  key: "icon",
                  label: "Icon/Emoji",
                  type: "text",
                  placeholder: "📊",
                },
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "e.g. SIP",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Description text...",
                },
              ]}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section2Editor;
