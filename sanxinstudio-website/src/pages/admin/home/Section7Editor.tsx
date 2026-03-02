import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";

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
          <div className="cms-card">
            <h3 className="cms-card-title">Text Content</h3>
            <TextFieldEditor
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="Our real framework is our unique brand methodology. You make profit, we also make our reputation."
            />
            <TextFieldEditor
              label="Description"
              value={(content.description as string) || ""}
              onChange={(val) => updateContent("description", val)}
              multiline
              placeholder="Additional description..."
            />
          </div>

          {/* Showcase Items */}
          <div className="cms-card">
            <h3 className="cms-card-title">Showcase Items</h3>
            <ItemListEditor
              label="Items"
              items={
                (content.items as Array<{
                  id: string;
                  title: string;
                  description: string;
                  imageUrl: string;
                }>) || []
              }
              onChange={(items) => updateContent("items", items)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "Project title",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Description...",
                },
                {
                  key: "imageUrl",
                  label: "Image URL",
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

export default Section7Editor;
