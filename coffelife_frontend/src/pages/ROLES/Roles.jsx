import { useState, useEffect } from "react";
import "./roles.css";
import api from "../../services/api";

export default function Roles() {

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [roles, setRoles] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // ─────────────────────────────
  // CARGAR ROLES
  // ─────────────────────────────
  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {

    try {

      const res = await api.get("/cat_roles");

      const data = res.data;

      if (Array.isArray(data)) {

        setRoles(data);

      } else if (Array.isArray(data.data)) {

        setRoles(data.data);

      } else {

        setRoles([]);

      }

    } catch (e) {

      console.log(e);

      setError("Error al cargar roles");

    }

  };

  // ─────────────────────────────
  // GUARDAR / ACTUALIZAR
  // ─────────────────────────────
  const guardar = async () => {

    if (!nombre.trim() || !descripcion.trim()) {

      setError("Todos los campos son obligatorios");

      return;

    }

    setCargando(true);

    setError("");

    try {

      const payload = {
        nombre_rol: nombre,
        descripcion: descripcion,
      };

      if (editando) {

        await api.put(
          `/cat_roles/${idEditar}`,
          payload
        );

      } else {

        await api.post(
          "/cat_roles",
          payload
        );

      }

      limpiarFormulario();

      await cargarRoles();

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
  const editar = (rol) => {

    setNombre(
      rol.nombreRol ||
      rol.nombre_rol ||
      ""
    );

    setDescripcion(
      rol.descripcion || ""
    );

    setIdEditar(
      rol.idRol ||
      rol.id_rol ||
      rol.id
    );

    setEditando(true);

  };

  // ─────────────────────────────
  // ELIMINAR
  // ─────────────────────────────
  const eliminar = async (id) => {

    const confirmar = confirm(
      "¿Seguro que quieres eliminar este rol?"
    );

    if (!confirmar) return;

    try {

      await api.delete(
        `/cat_roles/${id}`
      );

      await cargarRoles();

    } catch (e) {

      console.log(e);

      setError("Error al eliminar");

    }

  };

  // ─────────────────────────────
  // LIMPIAR FORMULARIO
  // ─────────────────────────────
  const limpiarFormulario = () => {

    setNombre("");

    setDescripcion("");

    setEditando(false);

    setIdEditar(null);

    setError("");

  };

  return (

    <div className="rl-container">

      <h1 className="rl-title">
        Gestión de Roles
      </h1>

      {/* FORMULARIO */}
      <div className="rl-card">

        <p className="rl-label">
          {editando
            ? "Editar Rol"
            : "Nuevo Rol"}
        </p>

        <div className="rl-form">

          <div className="rl-field">

            <label htmlFor="nombre">
              Nombre del rol
            </label>

            <input
              id="nombre"
              type="text"
              placeholder="Nombre del rol"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
            />

          </div>

          <div className="rl-field">

            <label htmlFor="descripcion">
              Descripción
            </label>

            <input
              id="descripcion"
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
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
          Roles Registrados
        </p>

        <table className="rl-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {roles.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="rl-empty"
                >
                  No hay roles registrados
                </td>

              </tr>

            ) : (

              roles.map((rol) => (

                <tr
                  key={
                    rol.idRol ||
                    rol.id_rol ||
                    rol.id
                  }
                >

                  <td>
                    {rol.idRol ||
                     rol.id_rol ||
                     rol.id}
                  </td>

                  <td>
                    {rol.nombreRol ||
                     rol.nombre_rol}
                  </td>

                  <td>
                    {rol.descripcion}
                  </td>

                  <td>

                    <button
                      className="rl-icon-btn"
                      onClick={() =>
                        editar(rol)
                      }
                      title="Editar"
                    >
                      ✏️
                    </button>

                    <button
                      className="rl-icon-btn rl-icon-btn--danger"
                      onClick={() =>
                        eliminar(
                          rol.idRol ||
                          rol.id_rol ||
                          rol.id
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

  );

}