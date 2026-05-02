import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Card from "../components/Card/Card";
import Form from "../components/Form/Form";

const Home = () => {
  const newsItems = [
    {
      title:
        "As a Neuroscientist, I Quit These 5 Morning Habits That Destroy Your Brain",
      subtitle:
        "Most people do #1 within 10 minutes of waking (and it sabotages your entire day)",
    },
    {
      title:
        "The Future of AI: Why Large Language Models are Just the Beginning",
      subtitle:
        "Experts predict a shift towards multi-modal agents that can interact with the physical world.",
    },
    {
      title:
        "Apple's Vision Pro: Six Months Later, Is it Still a Game Changer?",
      subtitle:
        "We revisit the spatial computing headset to see if the hype matches the long-term utility.",
    },
  ];

  return (
    <div className="home-page">
      <Header />

      <main className="container" style={{ paddingTop: "2rem" }}>
        <section className="hero-section">
          {newsItems.map((item, index) => (
            <Card key={index} title={item.title} subtitle={item.subtitle} />
          ))}
        </section>

        <section className="newsletter-section">
          <Form />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
