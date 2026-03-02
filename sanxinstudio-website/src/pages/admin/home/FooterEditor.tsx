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
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">CTA Area</h3>
            <TextFieldEditor
              className="mt-4 mb-4"
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
            <div style={{ marginTop: '16px' }}>
              <TextFieldEditor
                className="mt-4"
                label="Note"
                value={(content.ctaNote as string) || ""}
                onChange={(val) => updateContent("ctaNote", val)}
                multiline
                placeholder="Additional note text..."
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Contact Info</h3>
            <TextFieldEditor
                className="mt-4"
              label="Title"
              value={(content.contactTitle as string) || ""}
              onChange={(val) => updateContent("contactTitle", val)}
              placeholder="Contact Us"
            />
            <TextFieldEditor
                className="mt-4"
              label="Email"
              value={(content.email as string) || ""}
              onChange={(val) => updateContent("email", val)}
              placeholder="reach_us@sanxin.com"
            />
          </div>

          {/* Footer Logo */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Footer Logo</h3>
            <ImageUploader
              label="Logo Image"
              value={content.logo as { url: string; publicId: string } | null}
              onChange={(val) => updateContent("logo", val)}
              folder="sanxinstudio/footer"
            />
          </div>

          {/* Social Links */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Social Links</h3>
            <TextFieldEditor
                className="mt-4 mb-4"
              label="Title"
              value={(content.socialTitle as string) || ""}
              onChange={(val) => updateContent("socialTitle", val)}
              placeholder="Follow Us"
            />
            <ItemListEditor
              label="Social Media"
              items={
                (content.socialLinks as Array<{
                  id: string;
                  platform: string;
                  url: string;
                  icon: { url: string; publicId: string } | null;
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
                  label: "Icon",
                  type: "image",
                  folder: "sanxinstudio/footer/social",
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
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Copyright</h3>
            <TextFieldEditor
                className="mt-4"
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
