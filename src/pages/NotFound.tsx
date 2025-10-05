export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-lg">La ruta que intentaste no existe o ha sido movida.</p>
      <a href="/" className="mt-4 text-blue-500 underline">Regresar al inicio</a>
    </div>
  );
}

