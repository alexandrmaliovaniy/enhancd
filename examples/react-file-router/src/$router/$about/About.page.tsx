import { path } from "@better/react-file-router"
import { NavLink } from "react-router-dom"
import { IndexPage } from "@router"

export const AboutPage = () => {
    return (
        <div>
            <h1>About page</h1>
            <ul>
                <li>
                    <NavLink to={path(IndexPage)}>Back to Index page</NavLink>
                </li>
            </ul>
        </div>
    )
}
