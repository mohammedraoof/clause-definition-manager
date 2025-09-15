import { TanstackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "../components/ui/sonner";

import Layout from "../components/Layout";
import { persistor, store } from "../store";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Layout>
					<Outlet />
				</Layout>
				<Toaster position="top-right" theme="light" />
				<TanstackDevtools
					config={{
						position: "bottom-left",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
			</PersistGate>
		</Provider>
	);
}
