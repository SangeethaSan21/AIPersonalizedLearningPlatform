import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./quiz.css";
import Header from "../../components/header/header";
import Loader from "../../components/loader/loader";
import { CircleCheck, CircleX, Trophy, Clock, Target } from "lucide-react";

const Question = ({ questionData, num, color }) => {
  const [attempted, setAttempted] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="question_card">
      <div className="question_num" style={{ color }}>Q{num}</div>
      <h3 className="question_text">{questionData.question}</h3>
      <div className="options_list">
        {questionData.options.map((option, index) => {
          const isCorrect = index == questionData.answerIndex;
          const isSelected = selected === index;
          let optionClass = "option_btn";
          if (attempted && isSelected && isCorrect) optionClass += " correct";
          else if (attempted && isSelected && !isCorrect) optionClass += " wrong";
          else if (attempted && isCorrect) optionClass += " reveal";

          return (
            <button
              key={index}
              className={optionClass}
              disabled={attempted}
              onClick={() => {
                if (attempted) return;
                setSelected(index);
                if (window.numAttmpt == window.numQues - 1) {
                  window.timeTaken = new Date().getTime() - window.startTime;
                }
                if (isCorrect) window.numCorrect++;
                window.numAttmpt++;
                setAttempted(true);
              }}
            >
              <span className="option_letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option_text">{option}</span>
              {attempted && isCorrect && (
                <CircleCheck size={20} strokeWidth={1.5} className="option_icon correct_icon" />
              )}
              {attempted && isSelected && !isCorrect && (
                <CircleX size={20} strokeWidth={1.5} className="option_icon wrong_icon" />
              )}
            </button>
          );
        })}
      </div>
      {attempted && (
        <div className="reason_box">
          <span className="reason_label">Explanation</span>
          <p>{questionData.reason}</p>
        </div>
      )}
    </div>
  );
};

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const [subtopic, setSubtopic] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const course = searchParams.get("topic");
  const weekNum = searchParams.get("week");
  const subtopicNum = searchParams.get("subtopic");

  const colors = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899"];

  if (!course || !weekNum || !subtopicNum) navigate("/");

  useEffect(() => {
    const topics = JSON.parse(localStorage.getItem("topics")) || {};
    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || {};
    if (!Object.keys(roadmaps).includes(course) || !Object.keys(topics).includes(course)) {
      navigate("/");
    }
    const week = Object.keys(roadmaps[course])[weekNum - 1];
    setTopic(roadmaps[course][week].topic);
    setSubtopic(roadmaps[course][week].subtopics[subtopicNum - 1].subtopic);
    setDescription(roadmaps[course][week].subtopics[subtopicNum - 1].description);
  }, [course, weekNum, subtopicNum]);

  useEffect(() => {
    if (!course || !topic || !subtopic || !description) return;
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || {};
    if (quizzes[course]?.[weekNum]?.[subtopicNum]) {
      setQuestions(quizzes[course][weekNum][subtopicNum]);
      window.numQues = quizzes[course][weekNum][subtopicNum].length;
      setLoading(false);
      window.startTime = new Date().getTime();
      window.numAttmpt = 0;
      window.numCorrect = 0;
      return;
    }
    axios.defaults.baseURL = "http://localhost:5000";
    axios({
      method: "POST",
      url: "/api/quiz",
      withCredentials: false,
      headers: { "Access-Control-Allow-Origin": "*" },
      data: { course, topic, subtopic, description },
    })
      .then((res) => {
        setQuestions(res.data.questions);
        quizzes[course] = quizzes[course] || {};
        quizzes[course][weekNum] = quizzes[course][weekNum] || {};
        quizzes[course][weekNum][subtopicNum] = res.data.questions;
        localStorage.setItem("quizzes", JSON.stringify(quizzes));
        window.numQues = res.data.questions.length;
        setLoading(false);
        window.startTime = new Date().getTime();
        window.numAttmpt = 0;
        window.numCorrect = 0;
      })
      .catch(() => alert("Error fetching quiz. Please try again."));
  }, [course, topic, subtopic, description]);

  const handleSubmit = () => {
    if (!window.timeTaken) {
      window.timeTaken = new Date().getTime() - window.startTime;
    }
    const quizStats = JSON.parse(localStorage.getItem("quizStats")) || {};
    quizStats[course] = quizStats[course] || {};
    quizStats[course][weekNum] = quizStats[course][weekNum] || {};
    quizStats[course][weekNum][subtopicNum] = {
      numCorrect: window.numCorrect,
      numQues: window.numQues,
      timeTaken: window.timeTaken,
    };
    let hi = parseFloat(localStorage.getItem("hardnessIndex")) || 1;
    hi = hi + ((window.numQues - window.numCorrect) / (window.numQues * 2)) *
      (window.timeTaken / (5 * 60 * 1000 * window.numQues));
    localStorage.setItem("hardnessIndex", hi);
    localStorage.setItem("quizStats", JSON.stringify(quizStats));
    navigate("/roadmap?topic=" + encodeURI(course));
  };

  return (
    <div className="quiz_wrapper">
      <div className="bg_blob blob1" />
      <div className="bg_blob blob2" />
      <div className="bg_blob blob3" />
      <Header />
      <Loader style={{ display: loading ? "block" : "none" }}>
        Generating Personalized Questions...
      </Loader>
      <div className="quiz_content">
        <div className="quiz_header">
          <div className="quiz_meta">
            <span className="quiz_badge"><Target size={13} /> {course}</span>
            <span className="quiz_badge"><Clock size={13} /> Timed Quiz</span>
          </div>
          <h1 className="quiz_title">{subtopic}</h1>
          <p className="quiz_desc">{description}</p>
          <div className="quiz_stats_row">
            <div className="quiz_stat">
              <Trophy size={16} color="#f59e0b" />
              <span>{questions.length} Questions</span>
            </div>
          </div>
        </div>

        <div className="questions_list">
          {questions.map((question, index) => (
            <Question
              key={index}
              questionData={question}
              num={index + 1}
              color={colors[index % colors.length]}
            />
          ))}
        </div>

        {questions.length > 0 && (
          <div className="quiz_submit">
            <button className="submit_btn" onClick={handleSubmit}>
              <Trophy size={20} />
              Submit & See Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;