// Configuración de Firebase
// Lee las credenciales desde el archivo .env

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'API_KEY_NOT_SET',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'PROJECT_ID_NOT_SET',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'DATABASE_URL_NOT_SET'
};

// Endpoint para enviar formularios (REST API de Firebase)
// Esta URL apunta a: /contactos/{timestamp}.json

const FIREBASE_SUBMIT_ENDPOINT = `${FIREBASE_CONFIG.databaseURL}/contactos.json?auth=${FIREBASE_CONFIG.apiKey}`;