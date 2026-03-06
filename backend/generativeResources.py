import os
from groq import Groq

client = Groq(api_key=os.environ["GROQ_API_KEY"])

def generate_resources(course, knowledge_level, description, time):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are an AI tutor. Maintain a modest and calm language suitable for learning.
Format your response using markdown with the following structure:
- Use ## for main section headings
- Use ### for subsections  
- Use **bold** for key terms
- Use bullet points for lists
- Use > for important notes or tips
- Use --- to separate major sections
- Keep paragraphs short and scannable
- Add a ## Summary section at the end"""
            },
            {
                "role": "user",
                "content": f"I am learning {course}. My knowledge level in this topic is {knowledge_level}. I want to {description}. I want to learn it in {time}. Teach me."
            }
        ],
        temperature=1,
        max_tokens=8192,
    )
    text = response.choices[0].message.content
    print(text)
    return text
