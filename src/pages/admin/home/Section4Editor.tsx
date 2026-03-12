import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";

const Section4Content = ({
  content,
  updateContent,
}: {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}) => {
  const imageData = content.sideImage as {
    url: string;
    publicId: string;
  } | null;

  return (
    <>
      {/* Title & Description */}
      <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Text Content
        </h3>
        <QuillFieldEditor
          className="mt-4"
          label="Title"
          value={(content.title as string) || ""}
          onChange={(val) => updateContent("title", val)}
          placeholder="Got similar problems? We'll help you to solve it."
        />
        <QuillFieldEditor
          className="mt-4"
          label="Description"
          value={(content.description as string) || ""}
          onChange={(val) => updateContent("description", val)}
          placeholder="Optional description..."
        />
      </div>

      {/* Side Image with Pan */}
      <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Side Image
        </h3>
        <QuillFieldEditor
          className="mb-4"
          label="Side Image Title"
          value={(content.sideImageTitle as string) || ""}
          onChange={(val) => updateContent("sideImageTitle", val)}
          placeholder="Title above the image..."
        />
        <ImageUploader
          label="Image"
          value={imageData}
          onChange={(val) => updateContent("sideImage", val)}
          folder="sanxinstudio/section6"
        />

        {imageData?.url && (
          <div className="relative rounded-[14px] overflow-hidden border border-white/[0.08] mt-4">
            <div className="w-full h-[250px] overflow-hidden relative">
              <img
                src={imageData.url}
                alt="Side"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Button 1 */}
      <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Button 1
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldEditor
            label="Button 1 Text"
            value={(content.button1Text as string) || ""}
            onChange={(val) => updateContent("button1Text", val)}
            placeholder="e.g. Get Started"
          />
          <TextFieldEditor
            label="Button 1 Link"
            value={(content.button1Link as string) || ""}
            onChange={(val) => updateContent("button1Link", val)}
            placeholder="e.g. /contact"
          />
        </div>
      </div>

      {/* Button 2 */}
      <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Button 2
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldEditor
            label="Button 2 Text"
            value={(content.button2Text as string) || ""}
            onChange={(val) => updateContent("button2Text", val)}
            placeholder="e.g. Learn More"
          />
          <TextFieldEditor
            label="Button 2 Link"
            value={(content.button2Link as string) || ""}
            onChange={(val) => updateContent("button2Link", val)}
            placeholder="e.g. /about"
          />
        </div>
      </div>
    </>
  );
};

const Section4Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section4"
      title="Section 4 — Got Similar Problems?"
    >
      {({ content, updateContent }) => (
        <Section4Content content={content} updateContent={updateContent} />
      )}
    </SectionWrapper>
  );
};

export default Section4Editor;
