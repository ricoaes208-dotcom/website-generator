import React, { useState } from 'react';

export default function WebsiteGenerator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    services: [],
    phone: '',
    email: '',
    address: '',
    color: '#3B82F6'
  });
  
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const value = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, services: value }));
  };

  const generateWebsite = async () => {
    if (!formData.companyName || !formData.email || !formData.description) {
      setError('Bitte fülle mindestens: Unternehmensname, E-Mail und Beschreibung aus!');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 3000,
          messages: [{
            role: "user",
            content: `Erstelle eine vollständige, professionelle HTML-Website mit folgendem Format. Alle Services sollen als ansprechende Cards dargestellt werden.

UNTERNEHMENSDATEN:
- Name: ${formData.companyName}
- Tagline: ${formData.tagline || 'Ihre digitale Lösung'}
- Beschreibung: ${formData.description}
- Services/Produkte: ${formData.services.length > 0 ? formData.services.join(', ') : 'Web Design, Marketing, Beratung'}
- Telefon: ${formData.phone || 'Nicht angegeben'}
- Email: ${formData.email}
- Adresse: ${formData.address || 'Nicht angegeben'}
- Primärfarbe: ${formData.color}

ANFORDERUNGEN:
1. Erstelle ein komplettes, valides HTML (mit <!DOCTYPE>, <html>, <head>, <body>)
2. Die Website muss:
   - Responsive und mobile-friendly sein
   - Modern und professionell wirken
   - Die angegebene Farbe verwenden
   - Alle Services als ansprechende Cards zeigen
   - Kontaktbereich mit allen Daten enthalten
3. Struktur:
   - Header mit Navigation
   - Hero-Section mit Tagline und CTA-Button
   - Über uns / Unternehmensbeschreibung
   - Services-Section mit Cards
   - Kontaktbereich
   - Footer
4. Inline CSS (alles im <head>)
5. Kein JavaScript, nur HTML + CSS
6. Professional Design mit Hover-Effekten

Gib AUSSCHLIESSLICH das komplette HTML aus!`
          }]
        })
      });

      const data = await response.json();
      const htmlContent = data.content[0].text;
      setGeneratedHTML(htmlContent);
      setStep(3);
    } catch (err) {
      setError('Fehler beim Generieren: ' + err.message);
    }
    setLoading(false);
  };

  const downloadHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.companyName.replace(/\s+/g, '_')}_website.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHTML);
    alert('HTML-Code kopiert!');
  };

  if (step === 3 && generatedHTML) {
    return (
      <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setStep(1)}
              style={{ 
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: 'white', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              ← Neue Website
            </button>
            <button 
              onClick={downloadHTML}
              style={{ 
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: '#3B82F6', 
                color: 'white', 
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              ⬇️ HTML herunterladen
            </button>
            <button 
              onClick={copyCode}
              style={{ 
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: 'white', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              📋 Code kopieren
            </button>
          </div>

          <div style={{ padding: '15px', background: '#e8f5e9', borderRadius: '6px', marginBottom: '20px', color: '#2e7d32' }}>
            ✅ Website erstellt! Lade die HTML-Datei herunter und öffne sie in deinem Browser oder lade sie auf deinen Server.
          </div>

          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '15px', background: '#f0f0f0', borderBottom: '1px solid #ddd', fontWeight: '500' }}>
              Vorschau: {formData.companyName}
            </div>
            <iframe 
              srcDoc={generatedHTML}
              style={{ width: '100%', height: '700px', border: 'none' }}
              title="Website Preview"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>🌐 Website Generator</h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>Erstelle professionelle Websites in Minuten</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {[1, 2].map(s => (
            <div 
              key={s}
              style={{ 
                flex: 1, 
                padding: '12px', 
                background: step >= s ? 'white' : 'rgba(255,255,255,0.2)',
                color: step >= s ? '#333' : 'white',
                borderRadius: '6px', 
                textAlign: 'center', 
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={() => setStep(s)}
            >
              {s === 1 ? 'Schritt 1: Daten' : 'Schritt 2: Erstellen'}
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Unternehmensname *</label>
                  <input 
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="z.B. Müller GmbH"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Tagline</label>
                  <input 
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="z.B. Ihre digitale Lösung"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Beschreibung *</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Beschreibe kurz dein Unternehmen..."
                    rows="4"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Services/Produkte (komma-getrennt)</label>
                  <textarea 
                    name="services"
                    value={formData.services.join(', ')}
                    onChange={handleServiceChange}
                    placeholder="z.B. Web Design, SEO, Marketing"
                    rows="2"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>E-Mail *</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kontakt@beispiel.de"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Telefon</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+49 (0) XXX XXXXXXX"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Adresse</label>
                  <input 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Straße 123, 12345 Stadt"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  style={{ 
                    padding: '12px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Weiter zum Design →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#333' }}>Primärfarbe</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'].map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      style={{
                        width: '50px',
                        height: '50px',
                        background: color,
                        border: formData.color === color ? '3px solid #333' : '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button 
                  onClick={() => setStep(1)}
                  style={{ 
                    flex: 1,
                    padding: '12px', 
                    background: '#f0f0f0', 
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  ← Zurück
                </button>
                <button 
                  onClick={generateWebsite}
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    padding: '12px', 
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? '⏳ Erstelle Website...' : '✨ Website erstellen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
