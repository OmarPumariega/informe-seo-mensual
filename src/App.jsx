import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [reportFile, setReportFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isReportDragActive, setIsReportDragActive] = useState(false);
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);

  const reportInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Drag and Drop Handlers for PDF Report
  const handleReportDragOver = (e) => {
    e.preventDefault();
    setIsReportDragActive(true);
  };

  const handleReportDragLeave = (e) => {
    e.preventDefault();
    setIsReportDragActive(false);
  };

  const handleReportDrop = (e) => {
    e.preventDefault();
    setIsReportDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setReportFile(file);
        setErrorMessage("");
      } else {
        alert('Por favor, sube un archivo PDF.');
      }
    }
  };

  const handleReportChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
      setErrorMessage("");
    }
  };

  // Drag and Drop Handlers for Logo Image
  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setIsLogoDragActive(true);
  };

  const handleLogoDragLeave = (e) => {
    e.preventDefault();
    setIsLogoDragActive(false);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsLogoDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
        setErrorMessage("");
      } else {
        alert('Por favor, sube un archivo de imagen válido.');
      }
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    if (!reportFile || !logoFile) return;

    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append('report', reportFile);
      formData.append('logo', logoFile);

      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/informe-seo';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor n8n: ${response.status} ${response.statusText}`);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error al enviar al webhook:", error);
      
      // Improve error message based on common issues like CORS or Offline Server
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setErrorMessage("⚠️ No se pudo conectar con n8n. Verifica que n8n esté ejecutándose en tu ordenador y que la URL del Webhook (en tu archivo .env) sea correcta.");
      } else {
        setErrorMessage(`❌ Hubo un problema enviando los archivos: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="app-container">
        <div className="main-content" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <div className="card" style={{ padding: '4rem 2rem' }}>
            <div style={{ color: '#10B981', marginBottom: '1rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '64px', height: '64px', margin: '0 auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="page-title" style={{ fontSize: '1.75rem' }}>¡Archivos enviados con éxito!</h2>
            <p className="page-subtitle" style={{ marginTop: '1rem' }}>Tu informe SEO y el logotipo están siendo procesados. En breve recibirás los resultados.</p>
            <button 
              className="btn-primary" 
              style={{ marginTop: '2rem' }}
              onClick={() => {
                setIsSuccess(false);
                setReportFile(null);
                setLogoFile(null);
              }}
            >
              Enviar otro informe
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">

        <header className="page-header">
          <h1 className="page-title">Informe SEO Mensual</h1>
          <p className="page-subtitle">Con este SaaS automatizamos la creación de informes SEO mensuales, subé el informe de tu herramienta SEO y el logotipo de marca.</p>
        </header>

        <main className="card">
          <h2 className="card-title">Sube aquí tus archivos</h2>

          <div className="grid-2">

            {/* Upload Report Zone */}
            <div
              className={`drop-zone ${isReportDragActive ? 'active' : ''}`}
              onDragOver={handleReportDragOver}
              onDragLeave={handleReportDragLeave}
              onDrop={handleReportDrop}
              onClick={() => reportInputRef.current.click()}
            >
              <input
                type="file"
                ref={reportInputRef}
                onChange={handleReportChange}
                accept=".pdf"
                style={{ display: 'none' }}
              />
              <div className="drop-zone-icon">
                <svg xmlns="http://www.w3.org/Dom/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="drop-zone-text">
                {reportFile ? reportFile.name : "Subir Informe PDF"}
              </p>
              {!reportFile && (
                <p className="drop-zone-hint">Arrastra y suelta tu archivo aquí, o haz clic para seleccionar</p>
              )}
            </div>

            {/* Upload Logo Zone */}
            <div
              className={`drop-zone ${isLogoDragActive ? 'active' : ''}`}
              onDragOver={handleLogoDragOver}
              onDragLeave={handleLogoDragLeave}
              onDrop={handleLogoDrop}
              onClick={() => logoInputRef.current.click()}
            >
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="drop-zone-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="drop-zone-text">
                {logoFile ? logoFile.name : "Subir Logotipo"}
              </p>
              {!logoFile && (
                <p className="drop-zone-hint">Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
              )}
            </div>

          </div>

          {errorMessage && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.875rem' }}>
              {errorMessage}
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button 
                className="btn-primary" 
                disabled={!reportFile || !logoFile || isLoading}
                onClick={handleSubmit}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
             >
                {isLoading ? (
                  <>
                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" style={{ opacity: 0.25 }}></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" style={{ opacity: 0.75 }}></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  "Siguiente Paso"
                )}
             </button>
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;