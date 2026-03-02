import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section8Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section8"
      title="Section 8 — Beautiful Burden (Slideshow)"
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
              placeholder="The Beautiful Burden of Brilliance..."
            />
            <TextFieldEditor
              label="Subtitle"
              value={(content.subtitle as string) || ""}
              onChange={(val) => updateContent("subtitle", val)}
              multiline
              placeholder="Why Complexity is the Silent Killer of All Evaluations."
            />
          </div>

          {/* Slideshow Items */}
          <div className="cms-card">
            <h3 className="cms-card-title">Slideshow Items</h3>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                margin: "0 0 16px",
              }}
            >
              Use the arrow buttons to reorder slides. First item is shown
              first.
            </p>
            <ItemListEditor
              label="Slides"
              items={
                (content.slides as Array<{
                  id: string;
                  title: string;
                  description: string;
                  imageUrl: string;
                }>) || []
              }
              onChange={(items) => updateContent("slides", items)}
              fields={[
                {
                  key: "imageUrl",
                  label: "Image URL",
                  type: "url",
                  placeholder: "https://...",
                },
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "Slide title",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Slide description...",
                },
              ]}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section8Editor;
