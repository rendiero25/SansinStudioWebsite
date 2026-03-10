import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section1Editor = () => {
  return (
    <SectionWrapper page="company" sectionKey="section1" title="Company - Section 1">
      {({ content, updateContent }) => (
        <div className="flex flex-col gap-6">
          {/* Part 1: Basic Info */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Part 1: Basic Information
            </h3>
            <div className="flex flex-col gap-4">
              <TextFieldEditor
                label="Title"
                value={(content.title as string) || ""}
                onChange={(val) => updateContent("title", val)}
                placeholder="Section Title"
              />
              <TextFieldEditor
                label="Description 1"
                value={(content.description1 as string) || ""}
                onChange={(val) => updateContent("description1", val)}
                multiline
                placeholder="First description paragraph"
              />
              <TextFieldEditor
                label="Description 2"
                value={(content.description2 as string) || ""}
                onChange={(val) => updateContent("description2", val)}
                multiline
                placeholder="Second description paragraph"
              />
              <TextFieldEditor
                label="Vision"
                value={(content.vision as string) || ""}
                onChange={(val) => updateContent("vision", val)}
                multiline
                placeholder="Company Vision"
              />
              <TextFieldEditor
                label="Mission"
                value={(content.mission as string) || ""}
                onChange={(val) => updateContent("mission", val)}
                multiline
                placeholder="Company Mission"
              />
              <ImageUploader
                label="Section Image"
                value={(content.image as { url: string; publicId: string }) || null}
                onChange={(val) => updateContent("image", val)}
                folder="sanxinstudio/company"
              />
            </div>
          </div>

          {/* Part 2: Dynamic Data */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Part 2: Dynamic Data (Icons & Names)
            </h3>
            <ItemListEditor
              label="Items"
              items={(content.items as { id: string; name: string; icon: string; subItems?: { id: string; name: string; icon: string }[] }[]) || []}
              onChange={(items) => updateContent("items", items)}
              fields={[
                {
                  key: "name",
                  label: "Name",
                  type: "text",
                  placeholder: "Item Name",
                },
                {
                  key: "icon",
                  label: "Icon",
                  type: "image",
                  folder: "sanxinstudio/company/icons",
                },
                {
                  key: "subItems",
                  label: "Sub Data",
                  type: "subitems",
                  subFields: [
                    {
                      key: "name",
                      label: "Sub Name",
                      type: "text",
                      placeholder: "Sub Item Name",
                    },
                    {
                      key: "icon",
                      label: "Sub Icon",
                      type: "image",
                      folder: "sanxinstudio/company/icons",
                    },
                    {
                      key: "link",
                      label: "Link",
                      type: "url",
                      placeholder: "https://",
                      condition: (item) =>
                        item.name === "Social Media" ||
                        item.name === "Media Social",
                    },
                    {
                      key: "category",
                      label: "Category",
                      type: "select",
                      options: ["Social media account", "Creative work account"],
                      condition: (item) =>
                        item.name === "Social Media" ||
                        item.name === "Media Social",
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section1Editor;
