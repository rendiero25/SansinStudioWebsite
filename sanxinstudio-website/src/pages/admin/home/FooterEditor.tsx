import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const FooterEditor = () => {
  return (
    <SectionWrapper page="home" sectionKey="footer" title="Footer">
      {({ content, updateContent }) => (
        <>
          {/* CTA Section */}
          <div className="cms-card">
            <h3 className="cms-card-title">CTA Area</h3>
            <TextFieldEditor
              label="CTA Heading"
              value={(content.ctaHeading as string) || ""}
              onChange={(val) => updateContent("ctaHeading", val)}
              multiline
              placeholder="Lets create your profitable plan through our discovery map session."
            />
            <ButtonEditor
              label="CTA Button"
              value={
                (content.ctaButton as { text: string; link: string }) || {
                  text: "Get Started",
                  link: "/contact",
                }
              }
              onChange={(val) => updateContent("ctaButton", val)}
            />
          </div>

          {/* Contact Info */}
          <div className="cms-card">
            <h3 className="cms-card-title">Contact Info</h3>
            <TextFieldEditor
              label="Email"
              value={(content.email as string) || ""}
              onChange={(val) => updateContent("email", val)}
              placeholder="reach_us@sanxin.com"
            />
            <TextFieldEditor
              label="Phone"
              value={(content.phone as string) || ""}
              onChange={(val) => updateContent("phone", val)}
              placeholder="+62 xxx xxxx xxxx"
            />
            <TextFieldEditor
              label="Address"
              value={(content.address as string) || ""}
              onChange={(val) => updateContent("address", val)}
              multiline
              placeholder="Office address..."
            />
          </div>

          {/* Footer Logo */}
          <div className="cms-card">
            <h3 className="cms-card-title">Footer Logo</h3>
            <ImageUploader
              label="Logo Image"
              value={content.logo as { url: string; publicId: string } | null}
              onChange={(val) => updateContent("logo", val)}
              folder="sanxinstudio/footer"
            />
          </div>

          {/* Footer Columns */}
          <div className="cms-card">
            <h3 className="cms-card-title">Footer Columns</h3>
            <ItemListEditor
              label="Column Links"
              items={
                (content.columns as Array<{
                  id: string;
                  title: string;
                  links: string;
                }>) || []
              }
              onChange={(items) => updateContent("columns", items)}
              fields={[
                {
                  key: "title",
                  label: "Column Title",
                  type: "text",
                  placeholder: "e.g. Works",
                },
                {
                  key: "links",
                  label: "Links (one per line: label|url)",
                  type: "textarea",
                  placeholder: "Services|/services\nProjects|/projects",
                },
              ]}
            />
          </div>

          {/* Social Links */}
          <div className="cms-card">
            <h3 className="cms-card-title">Social Links</h3>
            <ItemListEditor
              label="Social Media"
              items={
                (content.socialLinks as Array<{
                  id: string;
                  platform: string;
                  url: string;
                  icon: string;
                }>) || []
              }
              onChange={(items) => updateContent("socialLinks", items)}
              fields={[
                {
                  key: "platform",
                  label: "Platform",
                  type: "text",
                  placeholder: "e.g. Instagram",
                },
                {
                  key: "icon",
                  label: "Icon/Emoji",
                  type: "text",
                  placeholder: "📸",
                },
                {
                  key: "url",
                  label: "URL",
                  type: "url",
                  placeholder: "https://instagram.com/...",
                },
              ]}
            />
          </div>

          {/* Copyright */}
          <div className="cms-card">
            <h3 className="cms-card-title">Copyright</h3>
            <TextFieldEditor
              label="Copyright Text"
              value={(content.copyright as string) || ""}
              onChange={(val) => updateContent("copyright", val)}
              placeholder="Copyright©2025 Sanxin Studio. All rights reserved."
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default FooterEditor;
