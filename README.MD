## 🦙 Llama Talk: AI Gaming Voice Chat

Llama Talk is a web-based voice chat app powered by an AI model (default: gemma3:1b). Just speak, and it responds — in English or any other language — like a chill conversational llama.

Built with Flask (Python backend) and JavaScript (frontend), it integrates with local or remote AI APIs (e.g., Ollama) to simulate live llama talk.

---

## Make sure you have ollama install

```sh
ollama run gemma3:1b # Change for your prefered model
```

## 🎯 Features

- 🎤 Voice-to-text via browser Speech Recognition
- 🤖 AI responses in any language
- 🧠 Default model: gemma3:1b (configurable)
- 💬 Real-time connection/status feedback
- 🌐 Clean, simple web UI
- ⚙️ Easy configuration via `.env` file

---

## ⚙️ Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/FilipeAlcaide04/llama_talk
   cd llama_talk
   ```

2. **Create and Activate a Virtual Environment**
   ```sh
   python3 -m venv venv
   source venv/bin/activate      # macOS/Linux
   # OR
   venv\Scripts\activate         # Windows
   ```

3. **Install Dependencies**
   ```sh
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**

   Check if `.env` file is ok for you:
   ```
   SYSTEM_PROMPT=" I like Turtles "
   API_KEY="http://localhost:11434/api/chat"
   MODEL="gemma3:1b"
   ```
   ✅ Customize `MODEL` and `API_KEY` if needed for your AI backend.

5. **Start the AI Backend**

   Run Ollama or your compatible chat API before launching the app.

6. **Launch the App**
   ```sh
   ./venv/bin/python app.py
   ```
   Then open [http://localhost:9000](http://localhost:9000) in your browser.

---

## 🗂 Project Structure

```
app.py
.env
requirements.txt
static/
│   styles.css
│   script.js
templates/
    index.html
```
- `app.py`: Flask API backend
- `static/`: Frontend assets (JS/CSS)
- `templates/`: HTML frontend

---

## 🚀 Usage

- Open the app in Chrome (recommended).
- Click the microphone button and speak.
- The AI replies in English (But can return in almost any language).
- Responses are displayed and read aloud.

---



## ⚠️ Notes

- Requires a browser that supports the Web Speech API (Chrome preferred).
- Ensure your AI API endpoint is up and matches the expected JSON format.
- In case you want to change the bot language, acess to js code and change ( recognition.lang = 'en-US'; utterance.lang = 'en-US';)

---



## 📝 License

No License, feeling like a criminal :)

---

🦙 Made by llamas, for llamas.
