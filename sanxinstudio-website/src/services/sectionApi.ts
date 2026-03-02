import api from "./api";

// Get all sections for a page
export const getAllSections = async (page: string) => {
  const response = await api.get(`/api/sections/${page}`);
  return response.data;
};

// Get a single section
export const getSection = async (page: string, sectionKey: string) => {
  const response = await api.get(`/api/sections/${page}/${sectionKey}`);
  return response.data;
};

// Update/create a section
export const updateSection = async (
  page: string,
  sectionKey: string,
  content: Record<string, unknown>,
  order?: number,
) => {
  const response = await api.put(`/api/sections/${page}/${sectionKey}`, {
    content,
    order,
  });
  return response.data;
};

// Upload a file (image or video)
export const uploadFile = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  const response = await api.post("/api/sections/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete a file from Cloudinary
export const deleteFile = async (publicId: string, resourceType?: string) => {
  const response = await api.delete("/api/sections/upload", {
    data: { publicId, resourceType },
  });
  return response.data;
};
