import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./roadmap.css";
import Header from "../../components/header/header";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";
import {
  ChevronRight, FolderSearch, Bot, Clock, BookOpen, Zap,
} from "lucide-react";
import Markdown from "react-markdown";
import ConfettiExplosion from "react-confetti-explosion";

const RoadmapPage = () => {
  const [resources, setResources] = useState(null);
  const [resourceParam, setResourceParam] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [roadmap, setRoadmap] = useState({});
  const [topicDetails, setTopicDetails] = useState({ time: "-", knowledge_level: "-" });
  const [quizStats, setQuizStats] = useState({});
  const [confettiExplode, setConfettiExplode] = useState(false);
  const navigate = useNavigate();
  const topic = searchParams.get("topic");

  if (!topic) navigate("/");

  useEffect(() => {
    const topics = JSON.parse(localStorage.getItem("topics")) || {};
    setTopicDetails(topics[topic]);
    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || {};
    setRoadmap(roadmaps[topic]);
    const stats = JSON.parse(localStorage.getItem("quizStats")) || {};
    setQuizStats(stats[topic] || {});
    if (!Object.keys(roadmaps).includes(topic) || !Object.keys(topics).includes(topic)) {
      navigate("/");
    }
  }, [topic]);

  const colors = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899"];

  const Subtopic = ({ subtopic, number, style, weekNum, quizStats }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topic = searchParams.get("topic");
    const adjustedTime = (
      parseFloat(subtopic.time.replace(/^\D+/g, "")) *
      (parseFloat(localStorage.getItem("hardnessIndex")) || 1)
    ).toFixed(1);
    const timeUnit = subtopic.time.replace(/[0-9]/g, "");

    return (
      <div className="subtopic glass_card" style={style}>
        <div className="subtopic_number">{String(number).padStart(2, "0")}</div>
        <div className="subtopic_content">
          <h3 className="subtopic_title">{subtopic.subtopic}</h3>
          <p className="subtopic_desc">{subtopic.description}</p>
          <div className="subtopic_meta">
            <span className="time_badge">
              <Clock size={13} /> {adjustedTime} {timeUnit}
            </span>
            <span
              className="hardness_link"
              onClick={() => {
                let hardness = prompt("Rate Hardness 1-10 (5 = perfect)");
                if (hardness) {
                  let hi = parseFloat(localStorage.getItem("hardnessIndex")) || 1;
                  hi = hi + (hardness - 5) / 10;
                  localStorage.setItem("hardnessIndex", hi);
                  window.location.reload();
                }
              }}
            >
              <Zap size={13} /> Rate Hardness
            </span>
          </div>
        </div>
        <div className="subtopic_actions">
          <button
            className="action_btn outline_btn"
            onClick={() => {
              setModalOpen(true);
              setResourceParam({
                subtopic: subtopic.subtopic,
                description: subtopic.description,
                time: subtopic.time,
                course: topic,
                knowledge_level: topicDetails.knowledge_level,
              });
            }}
          >
            <BookOpen size={15} /> Resources
          </button>
          {quizStats.timeTaken ? (
            <div className="quiz_score">
              ✅ {((quizStats.numCorrect * 100) / quizStats.numQues).toFixed(1)}% in {(quizStats.timeTaken / 1000).toFixed(0)}s
            </div>
          ) : (
            <button
              className="action_btn primary_btn"
              onClick={() => navigate(`/quiz?topic=${topic}&week=${weekNum}&subtopic=${number}`)}
            >
              <Zap size={15} /> Start Quiz
            </button>
          )}
        </div>
      </div>
    );
  };

  const TopicBar = ({ week, topic, color, subtopics, style, weekNum, quizStats }) => {
    const [open, setOpen] = useState(false);
    const completed = subtopics?.filter((_, i) => quizStats[i + 1]?.timeTaken).length || 0;
    const total = subtopics?.length || 0;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    return (
      <div className="topic_bar_wrapper" style={style}>
        <div className="topic_bar glass_card" style={{ "--clr": color }}>
          <div className="topic_bar_accent" style={{ background: color }} />
          <div className="topic_bar_header" onClick={() => setOpen(!open)}>
            <div className="topic_bar_left">
              <span className="week_label" style={{ color }}>{week}</span>
              <h2 className="topic_label">{topic}</h2>
              <div className="topic_progress_row">
                <div className="topic_progress_track">
                  <div className="topic_progress_fill" style={{ width: `${percent}%`, background: color }} />
                </div>
                <span className="topic_progress_text" style={{ color }}>{completed}/{total} done</span>
              </div>
            </div>
            <button
              className="chevron_btn"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", color }}
            >
              <ChevronRight size={28} strokeWidth={2} />
            </button>
          </div>

          {open && (
            <div className="subtopics_list">
              {subtopics?.map((subtopic, i) => (
                <Subtopic
                  key={i}
                  subtopic={subtopic}
                  number={i + 1}
                  weekNum={weekNum}
                  quizStats={quizStats[i + 1] || {}}
                  style={{ "--clr": color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ResourcesSection = () => (
    <div className="resources_section">
      <h2 className="resources_title">Choose Resource Type</h2>
      <div className="resources_options">
  
        <button
          className="resource_option_btn primary_resource"
          onClick={() => {
            setLoading(true);
            axios.defaults.baseURL = "http://localhost:5000";
            axios({
              method: "POST",
              url: "/api/generate-resource",
              data: resourceParam,
              withCredentials: false,
              headers: { "Access-Control-Allow-Origin": "*" },
            })
              .then((res) => {
                setLoading(false);
                setResources(
                  <div className="res">
                    <h2 className="res_heading">{resourceParam.subtopic}</h2>
                    <Markdown>{res.data}</Markdown>
                  </div>
                );
                setTimeout(() => setConfettiExplode(true), 500);
              })
              .catch(() => {
                setLoading(false);
                alert("Error generating resources");
                navigate("/roadmap?topic=" + encodeURI(topic));
              });
          }}
        >
          <Bot size={40} strokeWidth={1} />
          <span>AI Resources</span>
          <p>Personalized content by AI</p>
        </button>
  
        <button
          className="resource_option_btn youtube_resource"
          onClick={() => {
            const query = encodeURIComponent(resourceParam.subtopic + " tutorial");
            window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ff0000" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>YouTube</span>
          <p>Watch video tutorials</p>
        </button>
  
        <button
          className="resource_option_btn udemy_resource"
          onClick={() => {
            const query = encodeURIComponent(resourceParam.subtopic);
            window.open(`https://www.udemy.com/courses/search/?q=${query}`, "_blank");
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#a435f0" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L5.81 3.573v3.574l6.189-3.574 6.191 3.574V3.573zM5.81 10.148v8.144c0 1.555.58 2.232 2.11 2.232h8.16c1.53 0 2.12-.677 2.12-2.232v-8.144l-2.12 1.215v6.927H7.93v-6.927z"/>
          </svg>
          <span>Udemy</span>
          <p>Find structured courses</p>
        </button>
  
      </div>
    </div>
  );

  return (
    <div className="roadmap_wrapper">
      <div className="bg_blob blob1" />
      <div className="bg_blob blob2" />
      <div className="bg_blob blob3" />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setResources(null); }}>
        {!resources ? <ResourcesSection /> : (
          <>
            {confettiExplode && <ConfettiExplosion zIndex={10000} style={{ margin: "auto" }} />}
            {resources}
          </>
        )}
      </Modal>

      <Header />
      <Loader style={{ display: loading ? "block" : "none" }}>Generating Resource...</Loader>

      <div className="roadmap_content">
        <div className="roadmap_header">
          <div className="roadmap_header_text">
            <h1 className="roadmap_title">{topic}</h1>
            <div className="roadmap_meta">
              <span className="meta_badge"><Clock size={14} /> {topicDetails?.time}</span>
              <span className="meta_badge"><BookOpen size={14} /> {topicDetails?.knowledge_level}</span>
            </div>
          </div>
        </div>

        <div className="roadmap_list">
          {Object.keys(roadmap)
            .sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]))
            .map((week, i) => (
              <TopicBar
                key={week}
                weekNum={i + 1}
                week={week}
                topic={roadmap[week].topic}
                subtopics={roadmap[week].subtopics}
                color={colors[i % colors.length]}
                quizStats={quizStats[i + 1] || {}}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;