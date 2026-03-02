import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section5Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section5"
      title="Section 5 — Solutions"
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
              placeholder="Yes, we can make it happen for you, the future leading company"
            />
            <TextFieldEditor
              label="Section Label"
              value={(content.label as string) || ""}
              onChange={(val) => updateContent("label", val)}
              placeholder="Solutions"
            />
          </div>

          {/* Solution Items */}
          <div className="cms-card">
            <h3 className="cms-card-title">Solution Items</h3>
            <ItemListEditor
              label="Solutions"
              items={
                (content.solutions as Array<{
                  id: string;
                  icon: string;
                  title: string;
                  description: string;
                }>) || []
              }
              onChange={(items) => updateContent("solutions", items)}
              fields={[
                {
                  key: "icon",
                  label: "Icon/Emoji",
                  type: "text",
                  placeholder: "⚙️",
                },
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "e.g. Foundation",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Brief description...",
                },
              ]}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section5Editor;
