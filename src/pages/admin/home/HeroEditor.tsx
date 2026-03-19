import { useState } from "react";
import SectionWrapper from "../../../components/cms/SectionWrapper";
import ImageUploader from "../../../components/cms/ImageUploader";
import VideoUploader from "../../../components/cms/VideoUploader";
import ButtonEditor from "../../../components/cms/ButtonEditor";
import QuillFieldEditor from "../../../components/cms/QuillFieldEditor";

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
            <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
              <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
                Main Content
              </h3>
              <QuillFieldEditor
                className="mt-4"
                label="Headline"
                value={(content.headline as string) || ""}
                onChange={(val) => updateContent("headline", val)}
                placeholder="Your Growth Isn't a Goal."
              />
              <QuillFieldEditor
                className="mt-4"
                label="Description"
                value={(content.subtitle as string) || ""}
                onChange={(val) => updateContent("subtitle", val)}
                placeholder="A branding agency with one objective: To make you profitable."
              />
            </div>

            {/* Background */}
            <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
              <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
                Background
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
                  Background Type
                </label>
                <div className="flex gap-1 p-1 bg-white/4 rounded-[10px] border border-white/6 mb-4">
                  <button
                    type="button"
                    className={`flex-1 px-6 py-2 border-none rounded-lg text-[15px] font-medium cursor-pointer transition-all duration-200 font-[IBM_Plex_Sans,sans-serif] ${bgType === "image" ? "bg-indigo-500/20 text-purple-400" : "bg-transparent text-white/50"}`}
                    onClick={() => {
                      setBgType("image");
                      updateContent("bgType", "image");
                    }}
                  >
                    🖼️ Image
                  </button>
                  <button
                    type="button"
                    className={`flex-1 px-6 py-2 border-none rounded-lg text-[15px] font-medium cursor-pointer transition-all duration-200 font-[IBM_Plex_Sans,sans-serif] ${bgType === "video" ? "bg-indigo-500/20 text-purple-400" : "bg-transparent text-white/50"}`}
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

            {/* Buttons */}
            <div className="p-6 bg-white/3 border border-white/6 rounded-2xl">
              <h3 className="text-[15px] font-semibold text-white/80 m-0 mb-4">
                Buttons
              </h3>
              <ButtonEditor
                label="Primary Button"
                value={
                  (content.ctaButton as { text: string; link: string }) || {
                    text: "Get Started",
                    link: "/solutions",
                  }
                }
                onChange={(val) => updateContent("ctaButton", val)}
              />
              <div className="mt-4">
                <ButtonEditor
                  label="Secondary Button"
                  value={
                    (content.secondaryButton as { text: string; link: string }) || {
                      text: "Projects",
                      link: "/projects",
                    }
                  }
                  onChange={(val) => updateContent("secondaryButton", val)}
                />
              </div>
            </div>
          </>
        );
      }}
    </SectionWrapper>
  );
};

export default HeroEditor;
