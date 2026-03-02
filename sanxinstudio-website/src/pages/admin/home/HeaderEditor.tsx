import SectionWrapper from "../../../components/cms/SectionWrapper";
import ImageUploader from "../../../components/cms/ImageUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";

const HeaderEditor = () => {
  return (
    <SectionWrapper page="home" sectionKey="header" title="Header / Navigation">
      {({ content, updateContent }) => (
        <>
          {/* Logo */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Logo</h3>
            <ImageUploader
              label="Logo Image"
              value={content.logo as { url: string; publicId: string } | null}
              onChange={(val) => updateContent("logo", val)}
              folder="sanxinstudio/header"
            />
          </div>

          {/* CTA Button */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">CTA Button</h3>
            <ButtonEditor
              label="Contact Button"
              value={
                (content.ctaButton as { text: string; link: string }) || {
                  text: "Contact Us",
                  link: "/contact",
                }
              }
              onChange={(val) => updateContent("ctaButton", val)}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default HeaderEditor;
