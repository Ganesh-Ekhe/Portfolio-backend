import { useState, useEffect } from "react";
import axios from "axios";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    // Fetch Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("/api/projects");
                setProjects(response.data.projects);  // Store fetched projects in state
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []); // Empty dependency array ensures it runs only once when component mounts

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.length === 0 ? (
                    <p>No projects available</p>
                ) : (
                    projects.map((project) => (
                        <div key={project._id} className="border border-gray-300 p-4 rounded-lg shadow-lg">
                            <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg" />
                            <h3 className="text-xl font-semibold mt-4">{project.title}</h3>
                            <p className="mt-2 text-gray-600">{project.description}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <a
                                    href={project.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Live Demo
                                </a>
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:underline"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Projects;
