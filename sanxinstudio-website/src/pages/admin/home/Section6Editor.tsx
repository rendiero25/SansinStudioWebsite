import { useState } from "react";
import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

/* Inner component so useEffect stays inside a proper React component */
const Section6Content = ({
  content,
  updateContent,
}: {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}) => {
  const initialPan =
    content.imagePanPosition !== undefined
      ? (content.imagePanPosition as number)
      : 50;
  const [panPosition, setPanPosition] = useState(initialPan);

  const imageData = content.sideImage as {
    url: string;
    publicId: string;
  } | null;

  return (
    <>
      {/* Title */}
      <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Text Content
        </h3>
        <QuillFieldEditor
          className="mt-4"
          label="Title"
          value={(content.title as string) || ""}
          onChange={(val) => updateContent("title", val)}
          placeholder="How will we achieve it through our framework"
        />
      </div>

      {/* Side Image with Pan */}
      <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Side Image (with horizontal pan)
        </h3>
        <ImageUploader
          label="Image"
          value={imageData}
          onChange={(val) => updateContent("sideImage", val)}
          folder="sanxinstudio/section6"
        />

        {imageData?.url && (
          <div className="relative rounded-[14px] overflow-hidden border border-white/[0.08]">
            <div className="w-full h-[250px] overflow-hidden relative">
              <img
                src={imageData.url}
                alt="Side"
                className="h-full absolute top-0 transition-[left] duration-300 ease-out"
                style={{ left: `${-panPosition}%` }}
              />
            </div>
            <div className="py-3 px-4 bg-black/50 flex items-center gap-3">
              <label className="text-xs text-white/50 whitespace-nowrap">
                Pan Position:
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={panPosition}
                className="flex-1 accent-purple-500"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPanPosition(val);
                  updateContent("imagePanPosition", val);
                }}
              />
              <span className="text-white/50 text-xs min-w-9">
                {panPosition}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
          Button
        </h3>
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
    </>
  );
};

const Section6Editor = () => {
  return (
    <SectionWrapper
      page="home"
      sectionKey="section6"
      title="Section 6 — Framework"
    >
      {({ content, updateContent }) => (
        <Section6Content content={content} updateContent={updateContent} />
      )}
    </SectionWrapper>
  );
};

export default Section6Editor;
