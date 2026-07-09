import os
from google import genai
from google.genai import types
import dotenv
dotenv.load_dotenv()

'''
To run the script please: 
- Log into Google AI Studio and set the GENAI_API_KEY environment variable with your API key.
- Install the required dependencies with the command: pip install google-genai
- Add an .env file in the same directory as this script with the following content:
        GENAI_API_KEY=your_api_key_here
- Run the script in your terminal with the command: python gemini.py
'''
client = genai.Client(api_key=os.environ.get("GENAI_API_KEY"))

queries = [
    "czy warto uniewaznic kredyt w euro",
    "plusy i minusy unieważnienia kredytu w euro",
    "co upowaznia mnie do uniewaznienia kredytu w euro"
]

for query in queries:
    print(f"Sending Prompt: '{query}'\n")
    print("Waiting for Gemini to process and generate fan-out queries...")

    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=query,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
        ),
    )

    print("\n=== FAN-OUT QUERIES ===")

    try:
        metadata = response.candidates[0].grounding_metadata
        search_queries = metadata.web_search_queries
        
        if search_queries:
            print(f"Gemini generated {len(search_queries)} fan-out queries:")
            for q in search_queries:
                print(f"\"{q}.\"")
        else:
            print("No background search queries were triggered for this prompt.")
            
    except AttributeError:
        print("Could not find grounding metadata. Ensure the Google Search tool is active.")

    print("\n=== URL SOURCES ===")
    chunks = metadata.grounding_chunks
    
    if chunks:
        seen_urls = set()
        for chunk in chunks:
            if chunk.web and chunk.web.uri:
                url = chunk.web.title
                if url not in seen_urls:
                    print(f'"{url}.",')
                    seen_urls.add(url)

    # print("\nGenerated Answer:")
    # print(response.text)

    