import { useState } from "react";
import { useNavigate } from "react-router";
import { useNews } from "../../context/NewsContext";
import { useAuth } from "../../context/AuthContext";
import { validateField } from "../../utils/validate";
import { Type, Tag, FileText, ImageIcon, User, Send, X } from "lucide-react";
import "../../styles/AddNewsForm.css";
import toast from "react-hot-toast";

const AddNewsForm = ({ onComplete }) => {
  const { addNews } = useNews();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    author: user?.fullName || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, category, subtitle, description, imageUrl, author } = formData;

    const newErrors = {
      title: validateField("title", title),
      category: validateField("category", category),
      subtitle: validateField("subtitle", subtitle),
      description: validateField("description", description),
      imageUrl: validateField("imageUrl", imageUrl),
      author: validateField("author", author),
    };

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setErrors(newErrors);
      toast.error("Please fix the errors before posting.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const success = await addNews(formData);
    setIsSubmitting(false);

    if (success) {
      if (onComplete) {
        onComplete();
      } else {
        navigate("/feed");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      setFormData({
        title: "",
        category: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        author: user?.fullName || "",
      });
      setErrors({});
    }
  };

  return (
    <div className="creation-workspace">
      {/* Editor Section */}
      <div className="editor-pane glass">
        <div className="editor-header">
          <div className="editor-badge">Draft</div>
          <button className="reset-link" onClick={handleReset}>
            <X size={14} /> Clear Form
          </button>
        </div>

        <form className="modern-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Type size={16} /> Article Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Give your story a powerful title..."
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-hint">{errors.title}</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><Tag size={16} /> Category</label>
              <select
                name="category"
                onChange={handleChange}
                value={formData.category}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                <option>AI</option>
                <option>Web Dev</option>
                <option>Gadgets</option>
                <option>Future Tech</option>
                <option>Programming</option>
              </select>
              {errors.category && <span className="error-hint">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label><User size={16} /> Author Display</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                placeholder="Author Name"
                onChange={handleChange}
                className={errors.author ? 'error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label><FileText size={16} /> Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              placeholder="What is this article about in one sentence?"
              onChange={handleChange}
              className={errors.subtitle ? 'error' : ''}
            />
            {errors.subtitle && <span className="error-hint">{errors.subtitle}</span>}
          </div>

          <div className="form-group">
            <label><ImageIcon size={16} /> Cover Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              placeholder="Paste Unsplash or direct image link..."
              onChange={handleChange}
              className={errors.imageUrl ? 'error' : ''}
            />
            {errors.imageUrl && <span className="error-hint">{errors.imageUrl}</span>}
          </div>

          <div className="form-group">
            <label><FileText size={16} /> Full Description</label>
            <textarea
              rows="6"
              name="description"
              value={formData.description}
              placeholder="Tell the full story here..."
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <span className="error-hint">{errors.description}</span>}
          </div>

          <button
            type="submit"
            className="publish-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-white"></span>
            ) : (
              <>
                <Send size={18} />
                Publish to Feed
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewsForm;

