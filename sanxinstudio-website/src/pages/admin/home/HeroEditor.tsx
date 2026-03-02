import { useState } from "react";
import SectionWrapper from "../../../components/cms/SectionWrapper";
import TextFieldEditor from "../../../components/cms/TextFieldEditor";
import ImageUploader from "../../../components/cms/ImageUploader";
import VideoUploader from "../../../components/cms/VideoUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";

const HeroEditor = () => {
  const [bgType, setBgType] = useState<"image" | "video">("image");

  return (
    <SectionWrapper page="home" sectionKey="hero" title="Hero Section">
      {({ content, updateContent }) => {
        // Sync bgType from content on load
        if (content.bgType && content.bgType !== bgType) {
          setBgType(content.bgType as "image" | "video");
        }

        return (
          <>
            {/* Headline */}
            <div className="cms-card">
              <h3 className="cms-card-title">Headline Text</h3>
              <TextFieldEditor
                label="Brand Name"
                value={(content.brandName as string) || ""}
                onChange={(val) => updateContent("brandName", val)}
                placeholder="sanxin."
              />
              <TextFieldEditor
                label="Headline"
                value={(content.headline as string) || ""}
                onChange={(val) => updateContent("headline", val)}
                multiline
                placeholder="A branding agency with one objective: To make you profitable."
              />
              <TextFieldEditor
                label="Subtitle (right side text)"
                value={(content.subtitle as string) || ""}
                onChange={(val) => updateContent("subtitle", val)}
                multiline
                placeholder="Small description text..."
              />
            </div>

            {/* Background */}
            <div className="cms-card">
              <h3 className="cms-card-title">Background</h3>
              <div className="cms-field">
                <label className="cms-label">Background Type</label>
                <div className="cms-toggle-group">
                  <button
                    type="button"
                    className={`cms-toggle-btn ${bgType === "image" ? "active" : ""}`}
                    onClick={() => {
                      setBgType("image");
                      updateContent("bgType", "image");
                    }}
                  >
                    🖼️ Image
                  </button>
                  <button
                    type="button"
                    className={`cms-toggle-btn ${bgType === "video" ? "active" : ""}`}
                    onClick={() => {
                      setBgType("video");
                      updateContent("bgType", "video");
                    }}
                  >
                    🎬 Video
                  </button>
                </div>
              </div>

              {bgType === "image" ? (
                <ImageUploader
                  label="Background Image"
                  value={
                    content.bgImage as { url: string; publicId: string } | null
                  }
                  onChange={(val) => updateContent("bgImage", val)}
                  folder="sanxinstudio/hero"
                />
              ) : (
                <VideoUploader
                  label="Background Video"
                  value={
                    content.bgVideo as { url: string; publicId: string } | null
                  }
                  onChange={(val) => updateContent("bgVideo", val)}
                  folder="sanxinstudio/hero"
                />
              )}
            </div>

            {/* CTA Button */}
            <div className="cms-card">
              <h3 className="cms-card-title">CTA Button</h3>
              <ButtonEditor
                label="Button"
                value={
                  (content.ctaButton as { text: string; link: string }) || {
                    text: "see services →",
                    link: "#services",
                  }
                }
                onChange={(val) => updateContent("ctaButton", val)}
              />
            </div>
          </>
        );
      }}
    </SectionWrapper>
  );
};

export default HeroEditor;
