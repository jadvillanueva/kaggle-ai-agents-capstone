import { useState } from 'react'
import './index.css'

interface DraftEmail {
  lead_name: string;
  lead_website: string;
  draft_subject: string;
  draft_body: string;
  research_summary: string;
}

function App() {
  const [formData, setFormData] = useState({
    business_name: '',
    service_offering: '',
    target_audience: '',
    city: '',
    num_leads: 3
  });
  
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<DraftEmail[]>([]);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDrafts([]);

    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background Decorative Shapes */}
      <div className="deco-shape shape-1"></div>
      <div className="deco-shape shape-2"></div>
      <div className="deco-shape shape-3"></div>

      <div className="app-container">
        <header className="geo-header">
          <h1>Vibe LeadGen</h1>
          <p>Local B2B Discovery Agents</p>
        </header>

        <main className="main-content">
          <section className="geo-panel setup-panel">
            <h2>1. Setup</h2>
            <form onSubmit={generateLeads} className="setup-form">
              <div className="form-group">
                <label>Your Business Name</label>
                <input required name="business_name" value={formData.business_name} onChange={handleChange} placeholder="e.g. Sparkle Clean" />
              </div>
              
              <div className="form-group">
                <label>Service Offering</label>
                <textarea required name="service_offering" value={formData.service_offering} onChange={handleChange} placeholder="e.g. Commercial deep cleaning for offices" />
              </div>

              <div className="form-group">
                <label>Target Audience</label>
                <input required name="target_audience" value={formData.target_audience} onChange={handleChange} placeholder="e.g. Dental clinics and small medical offices" />
              </div>

              <div className="form-group">
                <label>Target City</label>
                <input required name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Austin, TX" />
              </div>
              
              <div className="form-group">
                <label>
                  Number of Leads 
                  <span className="free-tier-note">
                    (Use 1 if on free tier)
                  </span>
                </label>
                <input type="number" required name="num_leads" value={formData.num_leads} onChange={handleChange} min={1} max={5} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <span className="spinner"></span> : 'Dispatch Agents'}
              </button>
            </form>
            {error && <p className="error-msg">{error}</p>}
          </section>

          <section className="geo-panel results-panel">
            <h2>2. Inbox</h2>
            {loading && (
              <div className="loading-state">
                <div className="geo-loader"></div>
                <p>Agents are scanning local listings & drafting pitches...</p>
              </div>
            )}
            
            {!loading && drafts.length === 0 && !error && (
              <div className="empty-state">
                <p>No drafts yet! Configure your business and dispatch.</p>
              </div>
            )}

            <div className="drafts-list">
              {drafts.map((draft, idx) => (
                <div key={idx} className="draft-card">
                  <div className="draft-header">
                    <h3>{draft.lead_name}</h3>
                    <a href={draft.lead_website} target="_blank" rel="noreferrer">Visit Site</a>
                  </div>
                  <div className="research-summary">
                    <strong>Agent Research</strong>
                    <p>{draft.research_summary}</p>
                  </div>
                  <div className="email-draft">
                    <div className="subject"><strong>Subject:</strong> {draft.draft_subject}</div>
                    <textarea readOnly value={draft.draft_body} className="email-body-textarea"></textarea>
                  </div>
                  <div className="draft-actions">
                    <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(draft.draft_body)}>Copy Body</button>
                    <button className="btn-success">Approve & Send</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default App
