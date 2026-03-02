import { useState, useEffect } from "react";
import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import ItemListEditor from "../../../components/cms/ItemListEditor";

const Section6Editor = () => {
  const [panPosition, setPanPosition] = useState(50);

  return (
    <SectionWrapper
      page="home"
      sectionKey="section6"
      title="Section 6 — Framework"
    >
      {({ content, updateContent }) => {
        // Sync pan position from saved content
        useEffect(() => {
          if (content.imagePanPosition !== undefined) {
            setPanPosition(content.imagePanPosition as number);
          }
        }, [content.imagePanPosition]);

        const imageData = content.sideImage as {
          url: string;
          publicId: string;
        } | null;

        return (
          <>
            {/* Title */}
            <div className="cms-card">
              <h3 className="cms-card-title">Text Content</h3>
              <TextFieldEditor
                label="Title"
                value={(content.title as string) || ""}
                onChange={(val) => updateContent("title", val)}
                multiline
                placeholder="How will we achieve it through our framework"
              />
            </div>

            {/* Side Image with Pan */}
            <div className="cms-card">
              <h3 className="cms-card-title">
                Side Image (with horizontal pan)
              </h3>
              <ImageUploader
                label="Image"
                value={imageData}
                onChange={(val) => updateContent("sideImage", val)}
                folder="sanxinstudio/section6"
              />

              {imageData?.url && (
                <div className="cms-image-pan">
                  <div className="cms-image-pan-frame">
                    <img
                      src={imageData.url}
                      alt="Side"
                      style={{ left: `${-panPosition}%` }}
                    />
                  </div>
                  <div className="cms-image-pan-slider">
                    <label>Pan Position:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={panPosition}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPanPosition(val);
                        updateContent("imagePanPosition", val);
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                        minWidth: "36px",
                      }}
                    >
                      {panPosition}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Framework Steps */}
            <div className="cms-card">
              <h3 className="cms-card-title">Framework Steps</h3>
              <ItemListEditor
                label="Steps"
                items={
                  (content.steps as Array<{
                    id: string;
                    icon: string;
                    title: string;
                    description: string;
                  }>) || []
                }
                onChange={(items) => updateContent("steps", items)}
                fields={[
                  {
                    key: "icon",
                    label: "Icon/Emoji",
                    type: "text",
                    placeholder: "🎯",
                  },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    placeholder: "e.g. Core development & ideation",
                  },
                  {
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Description...",
                  },
                ]}
              />
            </div>
          </>
        );
      }}
    </SectionWrapper>
  );
};

export default Section6Editor;
