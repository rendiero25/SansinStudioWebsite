import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ButtonEditor from "../../../components/cms/ButtonEditor";

const Section8Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section8"
      title="Section 8 — Beautiful Burden"
    >
      {({ content, updateContent }) => (
        <>
          {/* Title */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Text Content</h3>
            <TextFieldEditor
                className="mt-4"
              label="Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              multiline
              placeholder="The Beautiful Burden of Brilliance..."
            />
          </div>

          {/* Button */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Button</h3>
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

          {/* Email Subscription Fields */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">Email Section</h3>
            <TextFieldEditor
              className="mt-4 mb-4"
              label="Title"
              value={(content.emailTitle as string) || ""}
              onChange={(val) => updateContent("emailTitle", val)}
              placeholder="SUBSCRIBE NEWSLETTER"
            />
            <TextFieldEditor
              className="mt-4 mb-4"
              label="Email Placeholder"
              value={(content.emailPlaceholder as string) || ""}
              onChange={(val) => updateContent("emailPlaceholder", val)}
              placeholder="Email..."
            />
            <TextFieldEditor
              className="mt-4 mb-4"
              label="Button Name"
              value={(content.emailBtnText as string) || ""}
              onChange={(val) => updateContent("emailBtnText", val)}
              placeholder="Get free guidebook"
            />
            <TextFieldEditor
              className="mt-4"
              label="Email Address"
              value={(content.targetEmail as string) || ""}
              onChange={(val) => updateContent("targetEmail", val)}
              placeholder="workspace.rendy@gmail.com"
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section8Editor;
