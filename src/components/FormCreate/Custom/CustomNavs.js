import React, {useState} from "react";
import { GENERIC_NAV } from "react-jsonschema-form-pagination/lib/utils";
import { Tabs, Tab } from "react-bootstrap";
// todo not used anymore
function CustomNavs({ navs: { links }, onNavChange }) {
    let relLinks = links.filter(({ nav }) => nav !== GENERIC_NAV);
    // const [active, setActive] = useState(0);
    return (
            <ul className="nav nav-tabs">
                     {relLinks.map(({ nav, name, icon, isActive }, i) => (
                         <li key={i} onClick={() => onNavChange(nav)} className="nav-item">
                             <a className={isActive ? "nav-link active" : 'nav-link'} href="#">{name || nav}</a>
                         </li>
                     ))}
            </ul>
        // <nav className="">
        //     <div className="">
        //         <div className="">
        //             <ul className="">
        //                 {relLinks.map(({ nav, name, icon, isActive }, i) => (
        //                     <li key={i} onClick={() => onNavChange(nav)} className={isActive ? "active" : null}>
        //                         <div>
        //                             {icon && <span className={icon} aria-hidden="true"/>}
        //                             &nbsp;{name || nav}
        //                         </div>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     </div>
        // </nav>
    );
}

export default CustomNavs;
