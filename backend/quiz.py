import os
import json
from groq import Groq

client = Groq(api_key=os.environ["GROQ_API_KEY"])

def get_quiz(course, topic, subtopic, description):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are an AI agent who provides quizzes to test understanding of user on a topic. The quiz will be based on topic, subtopic and the description of subtopic which describes what exactly to learn. The questions must be Multiple Choice Questions, can include calculation if necessary. Decide the number of questions based on description of the subtopic. Try to make as many questions as possible. Include questions that require deep thinking.
Output only valid JSON in this exact format, no extra text, no markdown, no backticks:
{"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "reason": "..."}]}"""
            },
            {
                "role": "user",
                "content": f'The user is learning the course {course}. In the course the user is learning topic "{topic}". Create quiz on subtopic "{subtopic}". The description of the subtopic is "{description}".'
            }
        ],
        temperature=1,
        max_tokens=8192,
    )

    text = response.choices[0].message.content
    print(text)
    return json.loads(text)
