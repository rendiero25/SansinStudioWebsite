import { useState, useEffect } from "react";
import SectionWrapper from "../../../components/cms/SectionWrapper";
import InsightsItemsEditor, { type InsightItem } from "../../../components/cms/InsightsItemsEditor";
import type { InsightCategory } from "../../../components/cms/InsightCategoriesEditor";
import { getSection } from "../../../services/sectionApi";

const AdminInsightsPosts = () => {
  const [availableCategories, setAvailableCategories] = useState<InsightCategory[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<string[]>([]);

  // Fetch categories and keywords from section1 (Categories)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSection("insights", "categories");
        if (res?.content) {
          if (res.content.categories) {
            setAvailableCategories(res.content.categories as InsightCategory[]);
          }
          if (res.content.keywords) {
            setAvailableKeywords(res.content.keywords as string[]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch insight global data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <SectionWrapper
      page="insights"
      sectionKey="posts"
      title="Insights — Posts & News"
    >
      {({ content, updateContent }: { content: any, updateContent: any }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
          <InsightsItemsEditor
            insights={(content.insights as InsightItem[]) || []}
            onChange={(insights: any) => updateContent("insights", insights)}
            availableCategories={availableCategories}
            availableKeywords={availableKeywords}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default AdminInsightsPosts;
