import SectionWrapper from "../../../components/cms/SectionWrapper";
import ItemListEditor from "../../../components/cms/ItemListEditor";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import type { ListItem } from "../../../components/cms/ItemListEditor";

const FAQEditor = () => {
  return (
    <SectionWrapper
      page="faq"
      sectionKey="content"
      title="FAQ — Frequently Asked Questions"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
            Manage Questions & Answers
          </h3>
          <div className="mb-6">
            <TextFieldEditor
              label="FAQ Title"
              value={(content.title as string) || ""}
              onChange={(val) => updateContent("title", val)}
              placeholder="e.g. Frequently Asked Questions"
            />
          </div>
          <ItemListEditor
            label="FAQ Items"
            items={(content.faqs as ListItem[]) || []}
            onChange={(items) => updateContent("faqs", items)}
            fields={[
              {
                key: "question",
                label: "Question",
                type: "text",
                placeholder: "e.g. How much does a website cost?",
              },
              {
                key: "answer",
                label: "Answer",
                type: "textarea",
                placeholder: "Detailed explanation of the answer...",
              },
            ]}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default FAQEditor;
