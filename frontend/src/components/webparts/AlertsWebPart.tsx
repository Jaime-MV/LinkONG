export function AlertsWebPart() {
  return (
    <div className="card mb-3">
      <h3 className="section-title mb-2">⚠️ Alertas Operativas</h3>
      <div className="alert alert-danger">
        <strong>Urgente:</strong> Actividad de mañana no cuenta con encargado de Primeros Auxilios.
      </div>
      <div className="alert alert-warning">
        <strong>Aviso:</strong> 3 voluntarios no han confirmado asistencia para la descarga de cemento.
      </div>
      <div className="alert alert-info">
        <strong>Info:</strong> Materiales entregados en sitio por proveedor "Construmex".
      </div>
    </div>
  );
}
