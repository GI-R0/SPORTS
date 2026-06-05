import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import ReservaForm from "../components/ReservaForm";
import "../styles/PistaDetail.css";

const defaultImages = {
  pádel: "/fallback-ball.svg",
  tenis: "/fallback-ball.svg",
  "fútbol 5": "/futbol-ball.svg",
  fútbol: "/futbol-user.jpg",
  baloncesto: "/fallback-ball.svg",
  voleibol: "/fallback-ball.svg",
  default: "/fallback-ball.svg",
};

const fallbackPath = "/fallback-ball.svg";

const isPlaceholderImage = (url) =>
  typeof url === "string" &&
  (url.includes("via.placeholder.com") ||
    url.includes("placeholder.com") ||
    url.includes("picsum.photos"));

const isRemoteImage = (url) =>
  typeof url === "string" && /^https?:\/\//.test(url);

export default function PistaDetail() {
  const { id } = useParams();
  const [pista, setPista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPista = async () => {
      try {
        const res = await API.get(`/pistas/${id}`);
        setPista(res.data);
        setError("");
      } catch {
        setError("No se pudo cargar la pista");
        setPista(null);
      } finally {
        setLoading(false);
      }
    };

    cargarPista();
  }, [id]);

  const getImageUrl = () => {
    const deporte = (pista?.deporte || "").toLowerCase();

    if (pista?.imagen && !isPlaceholderImage(pista.imagen)) {
      if (!isRemoteImage(pista.imagen)) {
        return pista.imagen;
      }
      return defaultImages[deporte] || defaultImages.default;
    }

    return defaultImages[deporte] || defaultImages.default;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-gray-600">Cargando pista...</p>
      </div>
    );
  }

  if (error || !pista) {
    return (
      <div className="error-state">
        <div className="error-box">
          <h3 className="error-title">Pista no encontrada</h3>
          <p className="error-desc">{error}</p>
          <Link to="/pistas" className="btn-back">
            Volver a pistas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pista-detail-container">
      <div className="pista-card">
        <img
          src={getImageUrl()}
          alt={pista.nombre}
          className="pista-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackPath;
          }}
        />

        <div className="pista-content">
          <h1 className="pista-title">{pista.nombre}</h1>

          <div className="pista-stats">
            <div className="stat-box">
              <p className="stat-icon">📍</p>
              <p className="stat-value location">{pista.ubicacion}</p>
            </div>
            <div className="stat-box">
              <p className="stat-icon">💰</p>
              <p className="stat-value price">{pista.precioHora}€/h</p>
            </div>
            <div className="stat-box">
              <p className="stat-icon">✅</p>
              <p className="stat-value status">Disponible</p>
            </div>
          </div>

          <div className="reservation-section">
            <h2 className="reservation-title">Reservar esta pista</h2>
            <ReservaForm
              pistaId={pista._id}
              precioHora={pista.precioHora}
              availableTimes={pista.horariosDisponibles || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
