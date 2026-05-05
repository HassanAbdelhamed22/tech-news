import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useNews } from "../../context/NewsContext";
import { useAuth } from "../../context/AuthContext";
import { validateField } from "../../utils/validate";
import { Type, Tag, FileText, ImageIcon, User, Send, X, Globe } from "lucide-react";
import "../../styles/AddNewsForm.css";
import toast from "react-hot-toast";

const AddNewsForm = ({ onComplete }) => {
  const { addNews } = useNews();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    author: user?.fullName || "",
    // Arabic optional fields
    title_ar: "",
    subtitle_ar: "",
    description_ar: "",
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
      toast.error(t("toast.fixErrors"));
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Only include Arabic fields if they have content
    const payload = {
      ...formData,
      title_ar: formData.title_ar.trim() || undefined,
      subtitle_ar: formData.subtitle_ar.trim() || undefined,
      description_ar: formData.description_ar.trim() || undefined,
    };

    const success = await addNews(payload);
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
    if (window.confirm(t("addNews.confirmClear"))) {
      setFormData({
        title: "",
        category: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        author: user?.fullName || "",
        title_ar: "",
        subtitle_ar: "",
        description_ar: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="creation-workspace">
      {/* Editor Section */}
      <div className="editor-pane glass">
        <div className="editor-header">
          <div className="editor-badge">{t("addNews.draft")}</div>
          <button className="reset-link" onClick={handleReset}>
            <X size={14} /> {t("addNews.clearForm")}
          </button>
        </div>

        <form className="modern-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Type size={16} /> {t("addNews.titleLabel")}</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder={t("addNews.titlePlaceholder")}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-hint">{errors.title}</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><Tag size={16} /> {t("addNews.categoryLabel")}</label>
              <select
                name="category"
                onChange={handleChange}
                value={formData.category}
                className={errors.category ? 'error' : ''}
              >
                <option value="">{t("addNews.categoryPlaceholder")}</option>
                <option>AI</option>
                <option>Web Dev</option>
                <option>Gadgets</option>
                <option>Future Tech</option>
                <option>Programming</option>
              </select>
              {errors.category && <span className="error-hint">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label><User size={16} /> {t("addNews.authorLabel")}</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                placeholder={t("addNews.authorPlaceholder")}
                onChange={handleChange}
                className={errors.author ? 'error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label><FileText size={16} /> {t("addNews.subtitleLabel")}</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              placeholder={t("addNews.subtitlePlaceholder")}
              onChange={handleChange}
              className={errors.subtitle ? 'error' : ''}
            />
            {errors.subtitle && <span className="error-hint">{errors.subtitle}</span>}
          </div>

          <div className="form-group">
            <label><ImageIcon size={16} /> {t("addNews.imageLabel")}</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              placeholder={t("addNews.imagePlaceholder")}
              onChange={handleChange}
              className={errors.imageUrl ? 'error' : ''}
            />
            {errors.imageUrl && <span className="error-hint">{errors.imageUrl}</span>}
          </div>

          <div className="form-group">
            <label><FileText size={16} /> {t("addNews.descriptionLabel")}</label>
            <textarea
              rows="6"
              name="description"
              value={formData.description}
              placeholder={t("addNews.descriptionPlaceholder")}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <span className="error-hint">{errors.description}</span>}
          </div>

          {/* Arabic Optional Fields */}
          <div className="arabic-section">
            <div className="arabic-section-header">
              <Globe size={16} />
              <span>{t("addNews.arabicSectionTitle")}</span>
            </div>

            <div className="form-group">
              <label>{t("addNews.titleArLabel")}</label>
              <input
                type="text"
                name="title_ar"
                value={formData.title_ar}
                placeholder={t("addNews.titleArPlaceholder")}
                onChange={handleChange}
                dir="rtl"
              />
            </div>

            <div className="form-group">
              <label>{t("addNews.subtitleArLabel")}</label>
              <input
                type="text"
                name="subtitle_ar"
                value={formData.subtitle_ar}
                placeholder={t("addNews.subtitleArPlaceholder")}
                onChange={handleChange}
                dir="rtl"
              />
            </div>

            <div className="form-group">
              <label>{t("addNews.descriptionArLabel")}</label>
              <textarea
                rows="6"
                name="description_ar"
                value={formData.description_ar}
                placeholder={t("addNews.descriptionArPlaceholder")}
                onChange={handleChange}
                dir="rtl"
              ></textarea>
            </div>
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
                {t("addNews.publish")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewsForm;
