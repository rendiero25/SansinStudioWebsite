import SectionWrapper from "../../../components/cms/SectionWrapper";
import ImageUploader from "../../../components/cms/ImageUploader";

const Section3Editor = () => {
  return (
    <SectionWrapper
      page="projects"
      sectionKey="section3"
      title="Projects Section 3 — Footer Background"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
          <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
            Footer Background Image
          </h3>
          <p className="text-[13px] text-white/50 mb-6">
            Upload the background image that will be used for the footer section
            of the Projects page.
          </p>
          <div className="max-w-[500px]">
            <ImageUploader
              label="Background Image"
              value={content.backgroundImage as { url: string; publicId: string } | null}
              onChange={(val) => updateContent("backgroundImage", val)}
              folder="sanxinstudio/projects"
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section3Editor;
