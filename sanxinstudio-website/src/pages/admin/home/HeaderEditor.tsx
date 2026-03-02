import SectionWrapper from "../../../components/cms/SectionWrapper";
import ImageUploader from "../../../components/cms/ImageUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";

const HeaderEditor = () => {
  return (
    <SectionWrapper page="home" sectionKey="header" title="Header / Navigation">
      {({ content, updateContent }) => (
        <>
          {/* Logo */}
          <div className="cms-card">
            <h3 className="cms-card-title">Logo</h3>
            <ImageUploader
              label="Logo Image"
              value={content.logo as { url: string; publicId: string } | null}
              onChange={(val) => updateContent("logo", val)}
              folder="sanxinstudio/header"
            />
          </div>

          {/* CTA Button */}
          <div className="cms-card">
            <h3 className="cms-card-title">CTA Button</h3>
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
