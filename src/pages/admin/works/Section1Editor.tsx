import SectionWrapper from "../../../components/cms/SectionWrapper";

const Section1Editor = () => {
  return (
    <SectionWrapper page="works" sectionKey="section1" title="Works Section 1">
      {() => (
        <div className="p-12 text-center text-white/20 font-primary italic">
          This section content has been removed.
        </div>
      )}
    </SectionWrapper>
  );
};

export default Section1Editor;
