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
      const response = await axios.post('https://code-review-backend-vt7r.vercel.app/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      console.error(err);
      setReview('Error fetching review.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <main>
        <section className="editor-panel">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={20}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              height: '100%',
              width: '100%',
            }}
          />
          <button className="review-btn" onClick={reviewCode} disabled={loading}>
            {loading ? 'Reviewing...' : 'Review'}
          </button>
        </section>

        <section className="review-panel">
          {loading ? <div className="loading">Loading review...</div> :
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review || "Your code review will appear here."}
            </Markdown>
          }
        </section>
      </main>
    </div>
  );
}

export default App;
