import { createBrowserHistory, createMemoryHistory } from "history";
export const history = createBrowserHistory ? createBrowserHistory({ basename: "" }) : createMemoryHistory();
