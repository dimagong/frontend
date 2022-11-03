import { createBrowserHistory } from "history";
export let history = createBrowserHistory ? createBrowserHistory({ basename: "" }) : [];
