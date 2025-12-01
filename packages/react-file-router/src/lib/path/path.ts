import { ReactElement } from "react";

export const path = (page: () => ReactElement, params?: Record<string, { toString(): string }>): string => {
    if (!window) throw new Error("window object not found!");
    if (!("__ENHANCD_REACT_FILE_ROUTER__" in window)) throw new Error("enhancd react router not found! Make sure vite plugin enabled");
    if (!window.__ENHANCD_REACT_FILE_ROUTER__?.has(page)) throw new Error("Page not found!");
    const value = window.__ENHANCD_REACT_FILE_ROUTER__.get(page);
    if (!value) throw new Error("Path not setteled!");
    if (!params) return value;
    const keys = Object.keys(params);
    return keys.reduce((acc, key) => {
        return acc?.replace(`:${key}`, params[key].toString());
    }, value);
}
