import { path } from "@enhancd/react-file-router";
import { NavLink } from "react-router-dom";
import { AboutPage, ProductsPage } from "@router";

export const IndexPage = () => {
    return (
        <div>
            <h1>Index page</h1>
            <ul>
                <li>
                    <NavLink to={path(AboutPage)}>- About page</NavLink>
                </li>
                <li>
                    <NavLink to={path(ProductsPage)}>- Products page</NavLink>
                </li>
            </ul>
        </div>
    )
};

