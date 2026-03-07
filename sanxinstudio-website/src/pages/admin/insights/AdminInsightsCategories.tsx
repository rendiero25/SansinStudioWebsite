import SectionWrapper from "../../../components/cms/SectionWrapper";
import InsightCategoriesEditor, { type InsightCategory } from "../../../components/cms/InsightCategoriesEditor";
import KeywordsEditor from "../../../components/cms/KeywordsEditor";

const AdminInsightsCategories = () => {
  return (
    <SectionWrapper
      page="insights"
      sectionKey="categories"
      title="Insights — Categories"
    >
      {({ content, updateContent }: { content: any, updateContent: any }) => (
        <>
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Category Settings
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <KeywordsEditor
                label="Global SEO Keywords"
                keywords={(content.keywords as string[]) || []}
                onChange={(tags: string[]) => updateContent("keywords", tags)}
                placeholder="Type a keyword and press Enter or Add..."
              />
            </div>
          </div>

          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
            <InsightCategoriesEditor
              categories={(content.categories as InsightCategory[]) || []}
              onChange={(categories: any) => updateContent("categories", categories)}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default AdminInsightsCategories;
