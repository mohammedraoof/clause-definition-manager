import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";
import "./styles.css";

const router = createRouter();

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
