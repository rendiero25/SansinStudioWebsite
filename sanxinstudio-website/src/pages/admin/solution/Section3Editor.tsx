import SectionWrapper from "../../../components/cms/SectionWrapper";
import ItemListEditor from "../../../components/cms/ItemListEditor";
import type { ListItem } from "../../../components/cms/ItemListEditor";

const Section3Editor = () => {
  return (
    <SectionWrapper
      page="solution"
      sectionKey="section3"
      title="Section 3 — Features List"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
            Features List
          </h3>
          <ItemListEditor
            label="Features"
            items={(content.features as ListItem[]) || []}
            onChange={(items) => updateContent("features", items)}
            fields={[
              {
                key: "icon",
                label: "Icon",
                type: "image",
                folder: "sanxinstudio/solution/icons",
              },
              {
                key: "title",
                label: "Title",
                type: "text",
                placeholder: "e.g. Speed Optimization",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Detailed description of feature...",
              },
              {
                key: "keywords",
                label: "Keywords",
                type: "text",
                placeholder: "e.g. fast, reliable, secure",
              },
            ]}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section3Editor;
