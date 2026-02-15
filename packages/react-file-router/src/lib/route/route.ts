import { ReactElement } from "react";
import { href } from "react-router-dom";

export const route = <Page extends (...args: any[]) => ReactElement>(page: Page, params?: Page extends (...args: [infer Args]) => ReactElement ? Args : never): string => {
    if (!window) throw new Error("window object not found!");
    if (!("__ENHANCD_REACT_FILE_ROUTER__" in window)) throw new Error("enhancd react router not found! Make sure vite plugin enabled");
    if (!window.__ENHANCD_REACT_FILE_ROUTER__?.has(page)) throw new Error("Page not found!");
    const value = window.__ENHANCD_REACT_FILE_ROUTER__.get(page);
    if (!value) throw new Error("Path not setteled!");
    if (!params) return value;
    return href(value, params);
}
