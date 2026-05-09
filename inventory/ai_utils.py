import os
import google.generativeai as genai
from django.conf import settings

def get_ai_insights(store_data):
    """
    Sends store data to Gemini and returns strategic insights.
    """
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            "summary": "AI Intelligence Offline. Please configure GEMINI_API_KEY.",
            "recommendations": ["Configure API key for real-time analysis."]
        }

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    You are the 'Matrix AI Brain', a high-velocity strategic assistant for a store manager.
    Based on the following real-time data, provide 3 punchy, high-impact strategic directives.
    Avoid generic advice. Be aggressive and profit-focused (matching an 'elite' startup culture).

    STORE DATA:
    {store_data}

    Format your response as:
    SUMMARY: [One sentence summary of health]
    DIRECTIVES:
    1. [Directive 1]
    2. [Directive 2]
    3. [Directive 3]
    """

    try:
        response = model.generate_content(prompt)
        text = response.text
        
        # Simple parsing
        lines = text.split('\n')
        summary = ""
        directives = []
        
        for line in lines:
            if line.startswith('SUMMARY:'):
                summary = line.replace('SUMMARY:', '').strip()
            elif line.strip() and (line.strip()[0].isdigit() or line.startswith('-')):
                directives.append(line.strip().lstrip('123456789.- ').strip())

        return {
            "summary": summary or "Analysis complete.",
            "recommendations": directives[:3]
        }
    except Exception as e:
        return {"error": str(e), "summary": "AI Analysis Failed.", "recommendations": []}
