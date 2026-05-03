import { useState } from "react";
import "../../styles/AddNewsForm.css";
import axios from "axios";
import toast from "react-hot-toast";
import { validateField } from "../../utils/validate";

const AddNewsForm = ({ refreshNews }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    author: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, category, subtitle, description, imageUrl, author } = formData;

    // Validate all fields
    const newErrors = {
      title: validateField("title", title),
      category: validateField("category", category),
      subtitle: validateField("subtitle", subtitle),
      description: validateField("description", description),
      imageUrl: validateField("imageUrl", imageUrl),
      author: validateField("author", author),
    };

    // Check if there are any error messages
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const news = {
      ...formData,
      date: new Date().toLocaleDateString(),
    };

    try {
      await axios.post("http://localhost:5000/news", news);
      refreshNews();

      setFormData({
        title: "",
        category: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        author: "",
      });
      setIsSubmitting(false);
      toast.success("News added successfully");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(`Failed to add news: ${err.message || err}`);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <div className="add-news-container glass">
      <h2 className="section-title">Share Your Story</h2>
      <p className="add-news-desc">
        Have a piece of news? Fill out the form below to share it with the
        world.
      </p>

      <form className="add-news-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label>Article Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="e.g. The Future of Quantum Computing"
              onChange={handleChange}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          <div className="form-field">
            <label>Category</label>
            <select
              name="category"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="">Select a category</option>
              <option>AI</option>
              <option>Web Dev</option>
              <option>Gadgets</option>
              <option>Future Tech</option>
              <option>Programming</option>
            </select>
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>
        </div>

        <div className="form-field">
          <label>Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            placeholder="A brief catchphrase for your article"
            onChange={handleChange}
          />
          {errors.subtitle && (
            <span className="error-text">{errors.subtitle}</span>
          )}
        </div>

        <div className="form-field">
          <label>Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            placeholder="Deep dive into the details..."
            onChange={handleChange}
          ></textarea>
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              placeholder="https://images.unsplash.com/..."
              onChange={handleChange}
            />
            {errors.imageUrl && (
              <span className="error-text">{errors.imageUrl}</span>
            )}
          </div>
          <div className="form-field">
            <label>Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              placeholder="Your Name"
              onChange={handleChange}
            />
            {errors.author && (
              <span className="error-text">{errors.author}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Article"}
        </button>
      </form>
    </div>
  );
};

export default AddNewsForm;

