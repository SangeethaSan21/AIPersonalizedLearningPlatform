import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./topic.css";
import Header from "../../components/header/header";
import { ArrowRight, LibraryBig, Search, Clock, Brain, Sparkles } from "lucide-react";
import Loader from "../../components/loader/loader";

const TopicPage = () => {
  const suggestionList = [
    "Competitive Programming",
    "Machine Learning",
    "Quantitative Finance",
    "Web Development",
    "Quantum Technology",
  ];
  const colors = [
    "#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  ];

  const [topic, setTopic] = useState("");
  const [timeInput, setTimeInput] = useState(4);
  const [timeUnit, setTimeUnit] = useState("Weeks");
  const [time, setTime] = useState("4 Weeks");
  const [knowledgeLevel, setKnowledgeLevel] = useState("Absolute Beginner");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTime(timeInput + " " + timeUnit);
  }, [timeInput, timeUnit]);

  const Suggestions = ({ list }) => (
    <div className="suggestions_grid">
      {list.map((item, i) => (
        <button
          key={i}
          className="suggestion_pill"
          style={{ "--clr": colors[i % colors.length] }}
          onClick={() => setTopic(item)}
        >
          <span>{item}</span>
          <ArrowRight size={18} strokeWidth={2} className="pill_arrow" />
        </button>
      ))}
    </div>
  );

  const TopicInput = () => {
    const [inputVal, setInputVal] = useState("");
    return (
      <div className="topic_input_wrapper">
        <LibraryBig size={24} color="#6366f1" strokeWidth={1.5} className="input_icon_left" />
        <input
          type="text"
          placeholder="Enter a topic to learn..."
          value={inputVal}
          className="topic_input"
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputVal) setTopic(inputVal);
          }}
        />
        <button
          className="input_submit_btn"
          onClick={() => { if (inputVal) setTopic(inputVal); }}
        >
          {inputVal
            ? <ArrowRight size={22} strokeWidth={2.5} />
            : <Search size={22} strokeWidth={2} />}
        </button>
      </div>
    );
  };

  const SetTopic = () => (
    <div className="page_section">
      <div className="page_hero">
        <div className="hero_badge"><Sparkles size={14} /> AI Powered Learning</div>
        <h1 className="hero_title">What do you want<br />to learn today?</h1>
        <p className="hero_subtitle">Get a personalized roadmap with quizzes and resources tailored just for you.</p>
      </div>
      <TopicInput />
      <p className="suggestions_label">Popular topics</p>
      <Suggestions list={suggestionList} />
    </div>
  );

  const TimeInput = () => (
    <div className="time_input_row">
      <div className="styled_input_wrap">
        <input
          id="timeInput"
          type="number"
          value={timeInput}
          className="styled_input"
          onChange={(e) => {
            if (e.target.value > 100 || e.target.value < 0) return;
            setTimeInput(e.target.value);
          }}
        />
      </div>
      <div className="styled_input_wrap">
        <select
          value={timeUnit}
          className="styled_input"
          onChange={(e) => setTimeUnit(e.target.value)}
        >
          <option value="Weeks">Weeks</option>
          <option value="Months">Months</option>
        </select>
      </div>
    </div>
  );

  const KnowledgeLevelInput = () => (
    <div className="level_options">
      {["Absolute Beginner", "Beginner", "Moderate", "Expert"].map((level) => (
        <button
          key={level}
          className={`level_btn ${knowledgeLevel === level ? "level_active" : ""}`}
          onClick={() => setKnowledgeLevel(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );

  const SubmitButton = () => {
    const navigate = useNavigate();
    return (
      <button
        className="start_btn"
        onClick={() => {
          if (time === "0 Weeks" || time === "0 Months") {
            alert("Please enter a valid time period");
            return;
          }
          setLoading(true);
          let topics = JSON.parse(localStorage.getItem("topics")) || {};
          if (!Object.keys(topics).includes(topic)) {
            let data = { topic, time, knowledge_level: knowledgeLevel };
            axios.defaults.baseURL = "http://localhost:5000";
            axios({
              method: "POST",
              url: "/api/roadmap",
              data,
              withCredentials: false,
              headers: { "Access-Control-Allow-Origin": "*" },
            })
              .then((res) => {
                topics[topic] = { time, knowledge_level: knowledgeLevel };
                localStorage.setItem("topics", JSON.stringify(topics));
                let roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || {};
                roadmaps[topic] = res.data;
                localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
                navigate("/roadmap?topic=" + encodeURI(topic));
              })
              .catch(() => {
                alert("An error occurred while generating the roadmap. Please try again.");
                navigate("/");
              });
          } else {
            navigate("/roadmap?topic=" + encodeURI(topic));
          }
        }}
      >
        <Sparkles size={20} />
        Generate My Roadmap
      </button>
    );
  };

  const SetDetails = () => (
    <div className="page_section details_section">
      <div className="details_topic_label">
        <span className="details_topic_name">{topic}</span>
      </div>

      <div className="detail_card glass_card">
        <div className="detail_card_header">
          <Clock size={20} color="#6366f1" />
          <h3>How much time do you have?</h3>
        </div>
        <TimeInput />
      </div>

      <div className="detail_card glass_card">
        <div className="detail_card_header">
          <Brain size={20} color="#8b5cf6" />
          <h3>Your knowledge level</h3>
        </div>
        <KnowledgeLevelInput />
      </div>

      <SubmitButton />

      <button className="back_btn" onClick={() => setTopic("")}>
        ← Choose a different topic
      </button>
    </div>
  );

  return (
    <div className="topic_wrapper">
      <div className="bg_blob blob1" />
      <div className="bg_blob blob2" />
      <div className="bg_blob blob3" />
      <Loader style={{ display: loading ? "block" : "none" }}>
        Generating Roadmap...
      </Loader>
      <Header />
      {!topic ? <SetTopic /> : <SetDetails />}
    </div>
  );
};

export default TopicPage;