import React from "react";
import styles from "../styles/layout.module.css";
import Link from "next/link";
import { ActiveLink } from "./active-link";

export function Layout(props: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.topMenuLine}>
        <Link href={"/"} passHref={true}>
          <a className={"text-4xl"}>🔸🌱</a>
        </Link>
        <ul className={styles.topMenu}>
          <li>
            <ActiveLink href={"/mint"} activeClassName={"active"}>
              Mint
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={"/view"} activeClassName={"active"}>
              View
            </ActiveLink>
          </li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
}
