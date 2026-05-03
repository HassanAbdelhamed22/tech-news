import "../../styles/Form.css";

const Form = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Subscribed!");
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Weekly Tech Roundup</h3>
      <p className="form-desc">
        Join 50,000+ tech enthusiasts and get the most important news delivered
        to your inbox.
      </p>
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="form-input"
          required
        />
        <button type="submit" className="btn-form">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Form;

