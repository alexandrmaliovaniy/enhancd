import { ReactElement } from "react";
import { Navigate, useNavigate, NavigateProps, NavLink, Link, NavLinkProps, LinkProps } from "react-router-dom"
import { route } from "../reactFileRouter";

export const useNavigateToPage = () => {
  const navigate = useNavigate();
  return <Page extends (...args: any[]) => ReactElement>(page: Page, params?: Page extends (...args: [infer Args]) => ReactElement ? { params?: Args } & NavigateProps : { params: {} }) => navigate(route(page, params?.params), params);
}

export const NavigateToPage = <Page extends (...args: any[]) => ReactElement>(props: Omit<NavigateProps, "to"> & { to: Page, params?: Page extends (...args: [infer Args]) => ReactElement ? Args : { params: {} }}) => {
  const {to, params: prms, ...prps} = props;
  return <Navigate to={route(to, prms)} {...prps} />;
}

export const NavLinkToPage = <Page extends (...args: any[]) => ReactElement>(props: Omit<NavLinkProps, "to"> & { to: Page, params?: Page extends (...args: [infer Args]) => ReactElement ? Args : { params: {} }}) => {
  const {to, params: prms, ...prps} = props;
  return <NavLink to={route(to, prms)} {...prps} />;
}

export const LinkToPage = <Page extends (...args: any[]) => ReactElement>(props: Omit<LinkProps, "to"> & { to: Page, params?: Page extends (...args: [infer Args]) => ReactElement ? Args : { params: {} }}) => {
  const {to, params: prms, ...prps} = props;
  return <Link to={route(to, prms)} {...prps} />;
}
