import SectionWrapper from "../../../components/cms/SectionWrapper";
import CategorySolutionsEditor from "../../../components/cms/CategorySolutionsEditor";
import type { Category } from "../../../components/cms/CategorySolutionsEditor";

const Section2Editor = () => {
  return (
    <SectionWrapper
      page="solution"
      sectionKey="section2"
      title="Section 2 — Categories"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
          <CategorySolutionsEditor
            categories={(content.categories as Category[]) || []}
            onChange={(cats) => updateContent("categories", cats)}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section2Editor;
