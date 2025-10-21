import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL, { code });
      setReview(response.data);
    } catch (err) {
      console.error(err);
      setReview('⚠️ Error fetching review. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <h1>💡 AI Code Reviewer</h1>
      </header>

      <main>
        <section className="editor-panel">
          <div className="panel-header">
            <h2>Code Editor</h2>
          </div>

          <div className="editor-container">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, 'javascript')
              }
              padding={20}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
              }}
            />
          </div>

          <button className="review-btn" onClick={reviewCode} disabled={loading}>
            {loading ? '⏳ Reviewing...' : '🚀 Review Code'}
          </button>
        </section>

        <section className="review-panel">
          <div className="panel-header">
            <h2>AI Review</h2>
          </div>
          {loading ? (
            <div className="loading">Analyzing your code...</div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review || "🧠 Your AI-generated review will appear here."}
            </Markdown>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Made with ❤️ by Abhishek Singh</p>
      </footer>
    </div>
  );
}

export default App;
