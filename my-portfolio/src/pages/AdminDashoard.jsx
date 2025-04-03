import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";
import ProjectForm from "../components/ProjectForm";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5260/api/projects");
      const data = await response.json();
      console.log("Projects Data:", data);

      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      setProjects([]);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5260/api/users");
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setUsers([]);
    }
  };

  // Delete Project
  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`http://localhost:5260/api/projects/${id}`, { method: "DELETE" });

      if (response.ok) {
        setProjects(projects.filter((project) => project._id !== id));
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Admin Dashboard</h2>

      {/* Project Form */}
      <ProjectForm fetchProjects={fetchProjects} editingProject={editingProject} setEditingProject={setEditingProject} />

      {/* Projects Section */}
      <section className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Manage Projects</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                {project.image && (
                  <img
                    src={`http://localhost:5260${project.image}`} // ✅ Corrected Image Path
                    alt={project.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{project.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                <div className="flex justify-between mt-4">
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    Live Demo
                  </a>
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500">
                    GitHub
                  </a>
                </div>
                <div className="flex justify-between mt-4">
                  <button className="text-red-500" onClick={() => deleteProject(project._id)}>
                    <FaTrash />
                  </button>
                  <button className="text-yellow-500" onClick={() => setEditingProject(project)}>
                    <FaEdit />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No projects available.</p>
          )}
        </div>
      </section>

      {/* Users Section */}
      <section className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Registered Users</h3>
        <div className="mt-4 space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <motion.div key={user._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h4>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No registered users yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
