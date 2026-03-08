import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import WorksProcessEditor from "../../../components/cms/WorksProcessEditor";
import type { Process } from "../../../components/cms/WorksProcessEditor";

const Section2Editor = () => {
  return (
    <SectionWrapper
      page="works"
      sectionKey="section2"
      title="Works Section 2 — Process Timeline"
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
                placeholder="e.g. The Process"
              />
              <TextFieldEditor
                label="Est. Delivery Time"
                value={(content.deliveryTime as string) || ""}
                onChange={(val) => updateContent("deliveryTime", val)}
                placeholder="e.g. 4-6 Weeks"
              />
            </div>
          </div>

          <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
            <WorksProcessEditor
              processes={(content.processes as Process[]) || []}
              onChange={(procs) => updateContent("processes", procs)}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Section2Editor;
