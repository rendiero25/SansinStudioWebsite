import { useState, useEffect } from "react";
import SectionWrapper from "../../../components/cms/SectionWrapper";
import ProjectItemsEditor, { type ProjectItem } from "../../../components/cms/ProjectItemsEditor";
import type { ProjectCategory } from "../../../components/cms/ProjectCategoriesEditor";
import { getSection } from "../../../services/sectionApi";

const Section2Editor = () => {
  const [availableCategories, setAvailableCategories] = useState<ProjectCategory[]>([]);

  // Fetch categories from section1 to populate the dropdown in Section2
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getSection("projects", "section1");
        if (res?.content?.categories) {
          setAvailableCategories(res.content.categories as ProjectCategory[]);
        }
      } catch (error) {
        console.error("Failed to fetch project categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <SectionWrapper
      page="projects"
      sectionKey="section2"
      title="Projects Section 2 — Project Items"
    >
      {({ content, updateContent }) => (
        <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
          <ProjectItemsEditor
            projects={(content.projects as ProjectItem[]) || []}
            onChange={(projects) => updateContent("projects", projects)}
            availableCategories={availableCategories}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section2Editor;
