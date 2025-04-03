import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // ✅ Success Message State
  const [error, setError] = useState(null); // ✅ Error Message State

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:5260/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        throw new Error("❌ Failed to send message. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Me</h2>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mt-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mt-2"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mt-2"
        ></textarea>

        {/* ✅ Loading Spinner */}
        {loading && <p className="text-blue-500 mt-2">Sending...</p>}

        {/* ✅ Success Message */}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        {/* ✅ Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded mt-4 transition-transform transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
};

export default Contact;
