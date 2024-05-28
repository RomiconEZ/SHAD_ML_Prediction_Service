import React from 'react';
import { createRoot } from 'react-dom/client';
// @ts-ignore
import App from './App.tsx';

const container = document.getElementById('root');

if (container !== null) {
  const root = createRoot(container); // Создаем корневой узел, только если container не null
  root.render(<App />); // Рендерим приложение
} else {
  console.error('Failed to find the root element');
}
