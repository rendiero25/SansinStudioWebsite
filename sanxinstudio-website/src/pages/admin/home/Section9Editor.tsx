import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section9Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section9"
      title="Section 9 — Industry Insights"
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
              placeholder="Discover our industry news & creative insights"
            />
          </div>

          {/* Article Cards */}
          <div className="cms-card">
            <h3 className="cms-card-title">Article / Insight Cards</h3>
            <ItemListEditor
              label="Articles"
              items={
                (content.articles as Array<{
                  id: string;
                  title: string;
                  category: string;
                  imageUrl: string;
                  link: string;
                }>) || []
              }
              onChange={(items) => updateContent("articles", items)}
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
                  placeholder: "Article title",
                },
                {
                  key: "category",
                  label: "Category",
                  type: "text",
                  placeholder: "e.g. Design, Branding",
                },
                {
                  key: "link",
                  label: "Link",
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

export default Section9Editor;
