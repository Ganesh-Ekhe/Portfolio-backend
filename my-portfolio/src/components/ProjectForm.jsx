import { useState, useEffect } from "react";

const ProjectForm = ({ fetchProjects, editingProject, setEditingProject }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [image, setImage] = useState(null); // Image File
  const [preview, setPreview] = useState(""); // Preview Image

  // ✅ If Editing, Set Previous Data
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description);
      setTechStack(editingProject.techStack);
      setLiveLink(editingProject.liveLink);
      setGithubLink(editingProject.githubLink);
      setPreview(editingProject.image || ""); // Existing Image Preview
    }
  }, [editingProject]);

  // ✅ Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show Image Preview
  };

  // ✅ Handle Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = editingProject ? editingProject.image : ""; // Default to existing image

    // ✅ If a new image is uploaded, send it to backend
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const imageResponse = await fetch("http://localhost:5260/api/upload", {
          method: "POST",
          body: formData,
        });
        const imageData = await imageResponse.json();
        if (!imageData.success) throw new Error("Image upload failed");
        imageUrl = imageData.imageUrl; // Get new uploaded image URL
      } catch (error) {
        console.error("Image Upload Error:", error);
        return;
      }
    }

    // ✅ Send Request for Add or Update
    const requestData = {
      title,
      description,
      techStack,
      image: imageUrl, // Use uploaded or existing image URL
      liveLink,
      githubLink,
    };

    try {
      let response;
      if (editingProject) {
        // ✅ Update Existing Project
        response = await fetch(`http://localhost:5260/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
      } else {
        // ✅ Create New Project
        response = await fetch("http://localhost:5260/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
      }

      const result = await response.json();
      if (!result.success) throw new Error("Failed to save project");

      fetchProjects(); // Refresh Projects List
      setEditingProject(null); // Reset Editing
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{editingProject ? "Edit Project" : "Add Project"}</h2>

      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" required className="w-full p-2 border rounded" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project Description" required className="w-full p-2 border rounded mt-2"></textarea>
      <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Tech Stack" required className="w-full p-2 border rounded mt-2" />
      <input type="text" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="Live Demo Link" className="w-full p-2 border rounded mt-2" />
      <input type="text" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="GitHub Link" className="w-full p-2 border rounded mt-2" />

      {/* ✅ Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded mt-2" />
      {preview && <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">{editingProject ? "Update Project" : "Save Project"}</button>
    </form>
  );
};

export default ProjectForm;
