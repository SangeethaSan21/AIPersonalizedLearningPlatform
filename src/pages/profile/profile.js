import { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./profile.css";
import Header from "../../components/header/header";
import { ArrowRight, Plus, Camera, BookOpen, Brain, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const getStats = (roadmaps, quizStats) => {
  const stats = {};
  stats.progress = {};
  for (let topic in quizStats) {
    let numWeightage = 0;
    let completedWeightage = 0;
    Object.keys(roadmaps[topic]).forEach((week, i) => {
      roadmaps[topic][week].subtopics.forEach((subtopic, j) => {
        numWeightage += parseInt(subtopic.time.replace(/^\D+/g, ""));
        if (
          quizStats[topic] &&
          quizStats[topic][i + 1] &&
          quizStats[topic][i + 1][j + 1]
        ) {
          completedWeightage += parseInt(subtopic.time.replace(/^\D+/g, ""));
        }
      });
    });
    stats.progress[topic] = {
      total: numWeightage,
      completed: completedWeightage,
    };
  }
  return stats;
};

const ProfilePage = () => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const topics = JSON.parse(localStorage.getItem("topics")) || {};

  const colors = [
    "#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899",
  ];

  const [stats, setStats] = useState({});
  const [percentCompletedData, setPercentCompletedData] = useState({});
  const [avatarSrc, setAvatarSrc] = useState(localStorage.getItem("userAvatar") || null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Learner");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  useEffect(() => {
    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || {};
    const quizStats = JSON.parse(localStorage.getItem("quizStats")) || {};
    setStats(getStats(roadmaps, quizStats));
  }, []);

  useEffect(() => {
    let progress = stats.progress || {};
    let labels = Object.keys(progress);
    let data = Object.values(progress).map(
      (p) => (p.completed * 100) / p.total
    );
    let backgroundColors = labels.map((_, i) => colors[i % colors.length]);
    setPercentCompletedData({
      labels,
      datasets: [
        {
          label: "% Completed",
          data,
          backgroundColor: backgroundColors.map((c) => c + "cc"),
          borderColor: backgroundColors,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    });
  }, [stats]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarSrc(reader.result);
      localStorage.setItem("userAvatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNameSave = () => {
    setUserName(nameInput);
    localStorage.setItem("userName", nameInput);
    setEditingName(false);
  };

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const totalCourses = Object.keys(topics).length;
  const hardnessIndex = (parseFloat(localStorage.getItem("hardnessIndex")) || 1).toFixed(3);

  return (
    <div className="profile_wrapper">
      <Header />

      <div className="bg_blob blob1" />
      <div className="bg_blob blob2" />
      <div className="bg_blob blob3" />

      <div className="profile_content">

        <div className="profile_hero glass_card">
          <div className="avatar_section">
            <div className="avatar_container" onClick={() => fileInputRef.current.click()}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="avatar_img" />
              ) : (
                <div className="avatar_initials">
                  {getInitials(userName)}
                </div>
              )}
              <div className="avatar_overlay">
                <Camera size={24} color="white" />
                <span>Change</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="profile_info">
            {editingName ? (
              <div className="name_edit">
                <input
                  className="name_input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                  autoFocus
                />
                <button className="save_btn" onClick={handleNameSave}>Save</button>
              </div>
            ) : (
              <h1 className="profile_name" onClick={() => setEditingName(true)} title="Click to edit">
                {userName} <span className="edit_hint">✏️</span>
              </h1>
            )}
            <p className="profile_subtitle">AI-Powered Learner</p>
            <div className="stats_row">
              <div className="stat_pill">
                <BookOpen size={16} />
                <span>{totalCourses} Courses</span>
              </div>
              <div className="stat_pill">
                <Brain size={16} />
                <span>Index: {hardnessIndex}</span>
              </div>
              <div className="stat_pill">
                <TrendingUp size={16} />
                <span>Active</span>
              </div>
            </div>
          </div>

          <button className="new_topic_btn" onClick={() => navigate("/topic")}>
            <Plus size={20} />
            <span>New Course</span>
          </button>
        </div>

        <section className="section">
          <h2 className="section_title">Continue Learning</h2>
          {totalCourses === 0 ? (
            <div className="empty_state glass_card">
              <BookOpen size={48} color="#6366f1" />
              <p>No courses yet. Start learning something new!</p>
              <button className="new_topic_btn" onClick={() => navigate("/topic")}>
                <Plus size={18} /> Add Course
              </button>
            </div>
          ) : (
            <div className="courses_grid">
              {Object.keys(topics).map((course, i) => {
                const color = colors[i % colors.length];
                const progress = stats.progress?.[course];
                const percent = progress
                  ? Math.round((progress.completed * 100) / progress.total)
                  : 0;
                return (
                  <NavLink
                    key={course}
                    className="course_link"
                    to={"/roadmap?topic=" + encodeURI(course)}
                  >
                    <div className="course_card glass_card" style={{ "--clr": color }}>
                      <div className="course_color_bar" style={{ background: color }} />
                      <div className="course_body">
                        <div className="course_title">{course}</div>
                        <div className="course_meta">
                          <span className="badge">{topics[course].time}</span>
                          <span className="badge">{topics[course].knowledge_level}</span>
                        </div>
                        <div className="progress_bar_container">
                          <div className="progress_bar_track">
                            <div
                              className="progress_bar_fill"
                              style={{ width: `${percent}%`, background: color }}
                            />
                          </div>
                          <span className="progress_label">{percent}%</span>
                        </div>
                      </div>
                      <ArrowRight size={22} className="course_arrow" color={color} />
                    </div>
                  </NavLink>
                );
              })}
            </div>
          )}
        </section>

        {Object.keys(percentCompletedData).length > 0 && (
          <section className="section">
            <h2 className="section_title">Progress Overview</h2>
            <div className="chart_card glass_card">
              <Bar
                data={percentCompletedData}
                options={{
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  plugins: {
                    legend: { labels: { color: "#94a3b8" } },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#94a3b8" },
                      grid: { color: "#1e293b" },
                      max: 100,
                    },
                    y: {
                      ticks: { color: "#e2e8f0" },
                      grid: { color: "#1e293b" },
                    },
                  },
                }}
              />
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;