import React from "react";

interface Props {
  names: string[];
  links: (string | (() => void))[];
}

function Navbar({ names, links }: Props) {
  return (
    <ul className="nav justify-content-center">
      {names.map((name, index) => (
        <li className="nav-item" key={index}>
          {typeof links[index] === "string" ? (
            <a
              className="nav-link active"
              aria-current="page"
              href={links[index] as string}
            >
              {name}
            </a>
          ) : (
            <button
              className="nav-link btn btn-link"
              onClick={links[index] as () => void}
            >
              {name}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default Navbar;
