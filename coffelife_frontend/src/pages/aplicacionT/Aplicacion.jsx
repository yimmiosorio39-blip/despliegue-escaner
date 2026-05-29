import { useState, useEffect } from "react";
import "./aplicacion.css";
import api from "../../services/api";

export default function Aplicacion() {

  // ─────────────────────────────
  // FORMULARIO
  // ─────────────────────────────
  const [idTratamiento, setIdTratamiento] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  // ─────────────────────────────
  // ESTADOS
  // ─────────────────────────────
  const [aplicaciones, setAplicaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // ─────────────────────────────
  // CARGAR DATOS
  // ─────────────────────────────
  useEffect(() => {
    cargarAplicaciones();
  }, []);

  const cargarAplicaciones = async () => {

    try {

      const res = await api.get(
        "/aplicaciones_tratamientos"
      );

      const data = res.data;

      if (Array.isArray(data)) {

        setAplicaciones(data);

      } else if (Array.isArray(data.data)) {

        setAplicaciones(data.data);

      } else {

        setAplicaciones([]);

      }

    } catch (e) {

      console.log(e);

      setError(
        "Error al cargar aplicaciones"
      );

    }

  };

  // ─────────────────────────────
  // GUARDAR / ACTUALIZAR
  // ─────────────────────────────
  const guardar = async () => {

    if (
      !idTratamiento ||
      !idUsuario ||
      !dosis.trim()
    ) {

      setError(
        "ID tratamiento, ID usuario y dosis son obligatorios"
      );

      return;

    }

    setCargando(true);

    setError("");

    try {

      const payload = {

        id_tratamiento: Number(idTratamiento),

        dosis: dosis.trim(),

        frecuencia: frecuencia.trim(),

        observaciones: observaciones.trim(),

        id_usuario: Number(idUsuario),

      };

      console.log(payload);

      if (editando) {

        await api.put(
          `/aplicaciones_tratamientos/${idEditar}`,
          payload
        );

      } else {

        await api.post(
          "/aplicaciones_tratamientos",
          payload
        );

      }

      limpiarFormulario();

      await cargarAplicaciones();

    } catch (e) {

      console.log(
        e.response?.data || e.message
      );

      setError(
        e.response?.data?.message ||
        "Error al guardar"
      );

    } finally {

      setCargando(false);

    }

  };

  // ─────────────────────────────
  // EDITAR
  // ─────────────────────────────
  const editar = (aplicacion) => {

    setIdTratamiento(
      aplicacion.idTratamiento || ""
    );

    setDosis(
      aplicacion.dosis || ""
    );

    setFrecuencia(
      aplicacion.frecuencia || ""
    );

    setObservaciones(
      aplicacion.observaciones || ""
    );

    setIdUsuario(
      aplicacion.idUsuario || ""
    );

    setIdEditar(
      aplicacion.idAplicacion
    );

    setEditando(true);

  };

  // ─────────────────────────────
  // ELIMINAR
  // ─────────────────────────────
  const eliminar = async (id) => {

    const confirmar = confirm(
      "¿Seguro que deseas eliminar esta aplicación?"
    );

    if (!confirmar) return;

    try {

      await api.delete(
        `/aplicaciones_tratamientos/${id}`
      );

      await cargarAplicaciones();

    } catch (e) {

      console.log(e);

      setError(
        "Error al eliminar"
      );

    }

  };

  // ─────────────────────────────
  // LIMPIAR FORMULARIO
  // ─────────────────────────────
  const limpiarFormulario = () => {

    setIdTratamiento("");
    setDosis("");
    setFrecuencia("");
    setObservaciones("");
    setIdUsuario("");

    setEditando(false);
    setIdEditar(null);

    setError("");

  };

  return (

    <div className="rl-container">

      <h1 className="rl-title">
        Aplicación de Tratamientos
      </h1>

      {/* FORMULARIO */}
      <div className="rl-card">

        <p className="rl-label">

          {editando
            ? "Editar Aplicación"
            : "Nueva Aplicación"}

        </p>

        <div
          className="rl-form"
          style={{
            gridTemplateColumns:
              "repeat(2, 1fr)"
          }}
        >

          <div className="rl-field">

            <label>
              ID Tratamiento
            </label>

            <input
              type="number"
              placeholder="ID tratamiento"
              value={idTratamiento}
              onChange={(e) =>
                setIdTratamiento(
                  e.target.value
                )
              }
            />

          </div>

          <div className="rl-field">

            <label>
              ID Usuario
            </label>

            <input
              type="number"
              placeholder="ID usuario"
              value={idUsuario}
              onChange={(e) =>
                setIdUsuario(
                  e.target.value
                )
              }
            />

          </div>

          <div className="rl-field">

            <label>
              Dosis
            </label>

            <input
              type="text"
              placeholder="Ej: 20ml"
              value={dosis}
              onChange={(e) =>
                setDosis(
                  e.target.value
                )
              }
            />

          </div>

          <div className="rl-field">

            <label>
              Frecuencia
            </label>

            <input
              type="text"
              placeholder="Ej: Cada 7 días"
              value={frecuencia}
              onChange={(e) =>
                setFrecuencia(
                  e.target.value
                )
              }
            />

          </div>

          <div
            className="rl-field"
            style={{
              gridColumn: "1 / -1"
            }}
          >

            <label>
              Observaciones
            </label>

            <textarea
              placeholder="Observaciones"
              value={observaciones}
              onChange={(e) =>
                setObservaciones(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="rl-actions">

          <button
            className="rl-btn"
            onClick={guardar}
            disabled={cargando}
          >

            {cargando
              ? "Guardando..."
              : editando
              ? "Actualizar"
              : "Guardar"}

          </button>

          {editando && (

            <button
              className="rl-btn-cancel"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>

          )}

        </div>

        {error && (

          <p className="rl-error">
            {error}
          </p>

        )}

      </div>

      {/* TABLA */}
      <div className="rl-card">

        <p className="rl-label">
          Aplicaciones Registradas
        </p>

        <div style={{ overflowX: "auto" }}>

          <table className="rl-table">

            <thead>

              <tr>

                <th>ID</th>
                <th>ID Tratamiento</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Observaciones</th>
                <th>Fecha Registro</th>
                <th>Fecha Actualización</th>
                <th>ID Usuario</th>
                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {aplicaciones.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="rl-empty"
                  >
                    No hay aplicaciones registradas
                  </td>

                </tr>

              ) : (

                aplicaciones.map((aplicacion) => (

                  <tr
                    key={
                      aplicacion.idAplicacion
                    }
                  >

                    <td>
                      {aplicacion.idAplicacion}
                    </td>

                    <td>
                      {aplicacion.idTratamiento}
                    </td>

                    <td>
                      {aplicacion.dosis}
                    </td>

                    <td>
                      {aplicacion.frecuencia}
                    </td>

                    <td>
                      {aplicacion.observaciones}
                    </td>

                    <td>
                      {aplicacion.fechaRegistro
                        ? new Date(
                            aplicacion.fechaRegistro
                          ).toLocaleDateString()
                        : "Sin fecha"}
                    </td>

                    <td>
                      {aplicacion.fechaActualizacion
                        ? new Date(
                            aplicacion.fechaActualizacion
                          ).toLocaleDateString()
                        : "Sin fecha"}
                    </td>

                    <td>
                      {aplicacion.idUsuario}
                    </td>

                    <td>

                      <button
                        className="rl-icon-btn"
                        onClick={() =>
                          editar(aplicacion)
                        }
                        title="Editar"
                      >
                        ✏️
                      </button>

                      <button
                        className="rl-icon-btn rl-icon-btn--danger"
                        onClick={() =>
                          eliminar(
                            aplicacion.idAplicacion
                          )
                        }
                        title="Eliminar"
                      >
                        🗑️
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}