import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles`)

      const sorted = Array.isArray(res.data)
        ? res.data.sort((a, b) => b.id - a.id)
        : []

      setArticles(sorted)
    } catch (error) {
      console.error("Failed to fetch articles", error)
      setError("Could not load articles. Ensure the API is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>BeyondChats Blog</h1>
        <p>Explore articles and their AI-enhanced modern updates.</p>
      </header>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Loading contents...</div>
      ) : (
        <div className="grid">
          {articles.map(article => {
            const isUpdated = article.title.startsWith('[Updated]');
            const displayTitle = isUpdated ? article.title.replace('[Updated] ', '') : article.title;

            return (
              <div key={article.id} className="card">
                {isUpdated ? (
                  <span className="badge updated">Updated Version</span>
                ) : (
                  <span className="badge original">Original</span>
                )}

                <h2>{displayTitle}</h2>

                <div className="card-meta">
                  <span>{article.author || 'Unknown Author'}</span>
                  <span>{article.published_date ? article.published_date.substring(0, 10) : 'N/A'}</span>
                </div>

                <div className="card-excerpt">
                  {!article.content ? 'No content' :
                    (() => {

                      let cleanText = article.content
                        .replace(/[#*`]/g, '')
                        .replace(/\[Updated\]/g, '')
                        .trim();
                      return cleanText;
                    })()
                  }
                </div>

                <a href={article.link || '#'} target="_blank" rel="noopener noreferrer" className="btn">
                  {isUpdated ? 'Read Enhancements' : 'Read Full Article'}
                </a>
              </div>
            )
          })}
        </div>
      )}

      {!loading && articles.length === 0 && !error && (
        <div style={{ textAlign: 'center', color: '#666' }}>No articles found. Run the phase 2 script!</div>
      )}
    </div>
  )
}

export default App
