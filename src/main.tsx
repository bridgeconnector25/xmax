// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './app/App'
// import './styles/globals.css'

// const root = createRoot(document.getElementById('root')!)
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(<App />);  