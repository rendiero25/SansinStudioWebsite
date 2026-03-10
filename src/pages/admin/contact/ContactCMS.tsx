import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ItemListEditor, {
  type ListItem,
} from "../../../components/cms/ItemListEditor";

const ContactCMS = () => {
  return (
    <SectionWrapper
      page="contact"
      sectionKey="main"
      title="Contact Page Management"
    >
      {({ content, updateContent }) => (
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Header Content
            </h3>
            <div className="flex flex-col gap-6">
              <ImageUploader
                label="Background Image"
                value={
                  content.backgroundImage as {
                    url: string;
                    publicId: string;
                  } | null
                }
                onChange={(val) => updateContent("backgroundImage", val)}
                folder="sanxinstudio/contact"
              />
              <TextFieldEditor
                label="Page Title"
                value={(content.title as string) || ""}
                onChange={(val) => updateContent("title", val)}
                placeholder="e.g. Contact Us"
              />
            </div>
          </div>

          {/* Process Section */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Process Section
            </h3>
            <div className="flex flex-col gap-6">
              <TextFieldEditor
                label="Process Section Title"
                value={(content.processTitle as string) || ""}
                onChange={(val) => updateContent("processTitle", val)}
                placeholder="e.g. Our Process"
              />

              <ItemListEditor
                label="Processes"
                items={(content.processes as ListItem[]) || []}
                onChange={(val) => updateContent("processes", val)}
                fields={[
                  {
                    key: "title",
                    label: "Process Title",
                    type: "text",
                    placeholder: "e.g. Initial Consultation",
                  },
                  {
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Detail of this process...",
                  },
                  {
                    key: "icon",
                    label: "Icon",
                    type: "image",
                    folder: "sanxinstudio/contact/icons",
                  },
                ]}
              />
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Contact Form Section
            </h3>
            <div className="flex flex-col gap-6">
              <TextFieldEditor
                label="Form Title"
                value={(content.formTitle as string) || ""}
                onChange={(val) => updateContent("formTitle", val)}
                placeholder="e.g. Tell us about your project"
              />
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default ContactCMS;
