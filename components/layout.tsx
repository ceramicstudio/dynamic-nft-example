import React from "react";
import styles from "../styles/layout.module.css";
import Link from "next/link";
import { ActiveLink } from "./active-link";
import { useCeramic } from "use-ceramic";

export function Layout(props: React.PropsWithChildren<{}>) {
  const ceramic = useCeramic();

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.topMenuLine}>
        <Link href={"/"} passHref={true}>
          <a className={"text-4xl"}>🔸🌱</a>
        </Link>
        <ul className={styles.topMenu}>
          <li>
            <ActiveLink href={"/mint"} activeClassName={styles.active}>
              Mint
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={"/view"} activeClassName={styles.active}>
              View
            </ActiveLink>
          </li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
}
