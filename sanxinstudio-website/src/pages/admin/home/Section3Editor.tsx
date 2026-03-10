import SectionWrapper from "../../../components/cms/SectionWrapper";
import ImageUploader from "../../../components/cms/ImageUploader";
import ItemListEditor from "../../../components/cms/ItemListEditor";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

const Section3Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section3"
      title="Section 3 — Roadblocks"
    >
      {({ content, updateContent }) => (
        <>
          {/* Title */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Title
            </h3>
            <QuillFieldEditor
              className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="Most companies might face these specific roadblocks for years."
            />
          </div>

          {/* Background */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Background
            </h3>
            <ImageUploader
              label="Background Image"
              value={
                content.bgImage as { url: string; publicId: string } | null
              }
              onChange={(val) => updateContent("bgImage", val)}
              folder="sanxinstudio/section3"
            />
          </div>

          {/* Roadblock Cards */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Roadblock Cards
            </h3>
            <ItemListEditor
              label="Cards"
              items={
                (content.cards as Array<{
                  id: string;
                  category: string;
                  title: string;
                  description: string;
                  image: { url: string; publicId: string } | null;
                }>) || []
              }
              onChange={(items) => updateContent("cards", items)}
              fields={[
                {
                  key: "category",
                  label: "Category",
                  type: "text",
                  placeholder: "e.g. Marketing",
                },
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "e.g. Customer bounce rate",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Description text...",
                },
                {
                  key: "image",
                  label: "Image",
                  type: "image",
                  folder: "sanxinstudio/section3",
                },
              ]}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section3Editor;
