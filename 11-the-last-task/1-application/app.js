import BrowserRouter from "./browser-router.js";
import { rules } from './app-pages.js';

const content = document.querySelector('#content');
const router = new BrowserRouter(content, rules);
await router.run();
