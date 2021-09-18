import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export type Props = {
  href: string;
  activeClassName: string;
};

export function ActiveLink(props: React.PropsWithChildren<Props>) {
  const router = useRouter();
  const className = router.pathname === props.href ? props.activeClassName : "";

  return (
    <Link href={props.href} passHref={true}>
      <a className={className}>{props.children}</a>
    </Link>
  );
}
