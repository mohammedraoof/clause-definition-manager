import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import clausesReducer from "./slices/clausesSlice";
import tableReducer from "./slices/tableSlice";

// Persist configuration for table slice - only sorting and pageSize
const tablePersistConfig = {
	key: "table",
	storage,
	whitelist: ["sorting", "pageSize"], // Only persist sorting and pageSize
};

// Create persisted table reducer
const persistedTableReducer = persistReducer(tablePersistConfig, tableReducer);

export const store = configureStore({
	reducer: {
		clauses: clausesReducer,
		table: persistedTableReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					"persist/PERSIST",
					"persist/REHYDRATE",
					"persist/PAUSE",
					"persist/PURGE",
					"persist/REGISTER",
				],
			},
		}),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
