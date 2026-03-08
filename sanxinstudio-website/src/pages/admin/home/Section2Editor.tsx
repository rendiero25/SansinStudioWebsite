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
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Title & Description</h3>
            <TextFieldEditor
                className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="Turn your technical breakthrough into a high growth asset."
            />
            <div style={{ marginTop: '16px' }}>
              <TextFieldEditor
                className="mt-4"
                label="Description"
                value={(content.description as string) || ""}
                onChange={(val) => updateContent("description", val)}
                multiline
                placeholder="Optional description text..."
              />
            </div>
          </div>

          {/* Items */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Feature Items</h3>
            <ItemListEditor
              label="Items"
              items={
                (content.items as Array<{
                  id: string;
                  title: string;
                }>) || []
              }
              onChange={(items) => updateContent("items", items)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "e.g. SIP",
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
