import os
import google.generativeai as genai
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.environ["GROQ_API_KEY"])


def create_roadmap(topic, time, knowledge_level):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": '''You are an AI agent who provides good personalized learning paths based on user input. You have to provide subtopics to learn with a small description of the subtopic telling what exactly to learn and how much time each subtopic will take. Give more time to subtopics that require more understanding. Make sure to keep every key lowercase.
Example output:
{
  "week 1": {
    "topic":"Introduction to Python",
    "subtopics":[
      {
        "subtopic":"Getting Started with Python",
        "time":"10 minute",
        "description":"Learn Hello world in python"
      },
      {
        "subtopic":"Data types in Python",
        "time":"1 hour",
        "description":"Learn about int, string, boolean, array, dict and casting data types"
      }
    ]
  }
}
Output only valid JSON. No extra text, no markdown, no backticks.'''
            },
            {
                "role": "user",
                "content": f"Suggest a roadmap for learning {topic} in {time}. My Knowledge level is {knowledge_level}. I can spend total of 16 hours every week."
            }
        ],
        temperature=1,
        max_tokens=8192,
    )

    text = response.choices[0].message.content
    print(text)
    return json.loads(text)
