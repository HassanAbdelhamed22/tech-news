import AddNewsForm from "../components/Form/AddNewsForm";

export default function AddNews() {
  return (
    <div className="add-news-page container section">
      <div className="section-header-flex">
        <div>
          <h2 className="section-title">Share Your Tech Story</h2>
          <p className="section-subtitle">Contributing to the future of tech, one story at a time.</p>
        </div>
      </div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AddNewsForm />
      </div>
    </div>
  );
}
