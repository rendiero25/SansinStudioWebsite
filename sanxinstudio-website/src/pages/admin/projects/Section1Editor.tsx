import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ProjectCategoriesEditor, { type ProjectCategory } from "../../../components/cms/ProjectCategoriesEditor";

const Section1Editor = () => {
  return (
    <SectionWrapper
      page="projects"
      sectionKey="section1"
      title="Projects Section 1 — Title & Categories"
    >
      {({ content, updateContent }) => (
        <>
          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
            <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
              Global Section Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFieldEditor
                label="Section Title"
                value={(content.sectionTitle as string) || ""}
                onChange={(val) => updateContent("sectionTitle", val)}
                placeholder="e.g. Our Works / Projects"
              />
            </div>
          </div>

          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl mb-6">
            <ProjectCategoriesEditor
              categories={(content.categories as ProjectCategory[]) || []}
              onChange={(categories) => updateContent("categories", categories)}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section1Editor;
