import { useState, useRef } from "react";
import api from "../../../services/api";
import "./DetectorIA.css";

function DetectorIA() {

  // =========================
  // STATES
  // =========================

  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [fileName, setFileName] = useState("");
  const [results, setResults]   = useState([]);
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [mensaje, setMensaje]   = useState("");

  // =========================
  // IDs REQUERIDOS POR ADONIS
  // =========================

  const [idImagen, setIdImagen] = useState("");
  const [idEstado, setIdEstado] = useState("");

  const fileInputRef = useRef(null);

  // =========================
  // SELECCIONAR IMAGEN
  // =========================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setResults([]);
    setAnalisis(null);
    setError("");
    setMensaje("");

  };



  // =========================
  // ENVIAR A ADONIS → IA
  // =========================

  const handleSubmit = async () => {

    if (!image) {
      setError("Selecciona una imagen");
      return;
    }



    try {

      setLoading(true);
      setError("");
      setMensaje("");
      setResults([]);
      setAnalisis(null);

      // =========================
      // FORM DATA PARA ADONIS
      // =========================

      const formData = new FormData();
      formData.append("file",      image);
      formData.append("idImagen",  idImagen);
      formData.append("idEstado",  idEstado);

      // =========================
      // POST A ADONIS
      // =========================

      const response = await api.post(
        "/analisis_ia/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      // =========================
      // GUARDAR RESULTADOS
      // =========================

      setMensaje(data.message || "");
      setResults(data.detections  || []);
      setAnalisis(data.analisis   || null);
      if (data.error) console.error("Error detallado:", data.error);

    } catch (err) {

      console.error(err);

      const serverMsg =
        err?.response?.data?.message || "Error analizando imagen";

      setError(serverMsg);
      setResults([]);
      setAnalisis(null);

    } finally {

      setLoading(false);

    }

  };



  // =========================
  // CLASE CSS POR DETECCIÓN
  // =========================

  const getAlertClass = (className) => {

    if (className === "Enfermedad_ROYA") return "alert-box roya";
    if (className === "Hoja_Sana")       return "alert-box sana";
    if (className === "arbol_cafe")      return "alert-box arbol";

    return "alert-box";

  };



  // =========================
  // COMPONENTE
  // =========================

  return (

    <div className="detector-container">

      <div className="detector-wrapper">

        {/* HEADER */}
        <div className="detector-header">

          <h1 className="detector-title">
            Coffee Life IA
          </h1>

          <p className="detector-subtitle">
            Sistema inteligente para detección de roya
            en cultivos de café.
          </p>

        </div>



        {/* GRID */}
        <div className="detector-grid">

          {/* COLUMNA IZQUIERDA */}
          <div className="detector-card">

            {/* FILA IDS */}
            <div className="id-row">
              <div className="id-group">
                <label className="detector-label">
                  ID Imagen
                </label>
                <input
                  type="number"
                  placeholder="Ej: 1"
                  value={idImagen}
                  onChange={(e) => setIdImagen(e.target.value)}
                  className="id-input"
                />
              </div>
              <div className="id-group">
                <label className="detector-label">
                  ID Estado
                </label>
                <input
                  type="number"
                  placeholder="Ej: 1"
                  value={idEstado}
                  onChange={(e) => setIdEstado(e.target.value)}
                  className="id-input"
                />
              </div>
            </div>

            {/* INPUT ARCHIVO OCULTO */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              style={{ display: 'none' }}
            />

            {/* ZONA DE SUBIDA PERSONALIZADA */}
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <svg className="upload-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="upload-text">
                {fileName ? fileName : 'Selecciona una imagen'}
              </span>
              <span className="upload-hint">
                {fileName ? 'Toca para cambiar' : 'JPG, PNG o WEBP'}
              </span>
            </div>

            {/* PREVIEW */}
            {preview && (

              <div className="preview-container">

                <div className="preview-header">
                  <h2 className="preview-title">
                    Vista previa
                  </h2>
                  <button className="preview-clear" onClick={() => { setPreview(null); setImage(null); setFileName(""); fileInputRef.current.value = '' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <img
                  src={preview}
                  alt="preview"
                  className="preview-image"
                />

              </div>

            )}



            {/* BOTÓN */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="detect-button"
            >

              {loading
                ? "Analizando imagen..."
                : "Analizar Imagen"}

            </button>



            {/* LOADING */}
            {loading && (

              <div className="loading-box">
                Analizando cultivo con IA...
              </div>

            )}



            {/* ERROR */}
            {error && (

              <div className="error-box">
                {error}
              </div>

            )}

          </div>



          {/* COLUMNA DERECHA */}
          <div className="detector-card">

            <h2 className="results-title">
              Resultados IA
            </h2>



            {/* ESTADO VACÍO / MENSAJE */}
            {!loading && !error && results.length === 0 && !mensaje && (

              <p className="alert-text">
                Aquí aparecerán los resultados del análisis.
              </p>

            )}

            {!loading && !error && mensaje && (

              <p className="alert-text">
                {mensaje}
              </p>

            )}



            {/* =========================
                REGISTRO GUARDADO EN BD
            ========================= */}

            {analisis && (

              <div className="result-card">

                <h3 className="result-class">
                  Análisis guardado
                </h3>

                <p className="result-confidence">
                  ID Análisis:
                  <span> #{analisis.idAnalisis}</span>
                </p>

                <p className="result-confidence">
                  Resultado:
                  <span> {analisis.resultado}</span>
                </p>

                <p className="result-confidence">
                  Confianza:
                  <span> {analisis.porcentajeConfianza}%</span>
                </p>

                {analisis.idNivelRoya && (

                  <p className="result-confidence">
                    Nivel Roya ID:
                    <span> {analisis.idNivelRoya}</span>
                  </p>

                )}

              </div>

            )}



            {/* =========================
                DETECCIONES DE LA IA
            ========================= */}

            {results.map((item, index) => (

              <div
                key={index}
                className="result-card"
              >

                {/* CLASE */}
                <h3 className="result-class">
                  {item.class}
                </h3>

                {/* CONFIANZA */}
                <p className="result-confidence">
                  Confianza:
                  <span>
                    {" "}
                    {(item.confidence * 100).toFixed(1)}%
                  </span>
                </p>

                {/* =========================
                    ALERTA CON DATOS IA
                ========================= */}

                <div className={getAlertClass(item.class)}>

                  <h4 className="alert-title">
                    {item.message}
                  </h4>

                  {item.recommendations &&
                   item.recommendations.length > 0 && (

                    <div className="alert-recommendations">

                      <p>
                        <strong>Recomendaciones:</strong>
                      </p>

                      <ul>

                        {item.recommendations.map((rec, recIndex) => (

                          <li key={recIndex}>
                            {rec}
                          </li>

                        ))}

                      </ul>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}

export default DetectorIA;