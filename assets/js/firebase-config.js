// Configuración de Firebase
// Lee las credenciales desde el archivo .env

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Endpoint para enviar formularios (REST API de Firebase)
// Esta URL apunta a: /contactos/{timestamp}.json

export const FIREBASE_SUBMIT_ENDPOINT = `${FIREBASE_CONFIG.databaseURL}/contactos.json?auth=${FIREBASE_CONFIG.apiKey}`;