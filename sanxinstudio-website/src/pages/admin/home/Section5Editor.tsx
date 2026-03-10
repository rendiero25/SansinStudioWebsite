import SectionWrapper from "../../../components/cms/SectionWrapper";
import ButtonEditor from "../../../components/cms/ButtonEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

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
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Text Content
            </h3>
            <QuillFieldEditor
              className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="Yes, we can make it happen for you, the future leading company"
            />
            <div style={{ marginTop: "16px" }}>
              <ButtonEditor
                label="Section Label"
                value={
                  (content.label as { text: string; link: string }) || {
                    text: "Solutions",
                    link: "#",
                  }
                }
                onChange={(val) => updateContent("label", val)}
              />
            </div>
          </div>

          {/* Solution Items */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Solution Items
            </h3>
            <ItemListEditor
              label="Solutions"
              items={
                (content.solutions as Array<{
                  id: string;
                  icon: { url: string; publicId: string } | null;
                  title: string;
                  subItems: Array<{
                    id: string;
                    icon: { url: string; publicId: string } | null;
                    description: string;
                  }>;
                }>) || []
              }
              onChange={(items) => updateContent("solutions", items)}
              fields={[
                {
                  key: "icon",
                  label: "Icon",
                  type: "image",
                  folder: "sanxinstudio/section5",
                },
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "e.g. Foundation",
                },
                {
                  key: "subItems",
                  label: "Sub Items",
                  type: "subitems",
                  subFields: [
                    {
                      key: "icon",
                      label: "Icon",
                      type: "image",
                      folder: "sanxinstudio/section5",
                    },
                    {
                      key: "description",
                      label: "Description",
                      type: "textarea",
                      placeholder: "Brief description...",
                    },
                  ],
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
