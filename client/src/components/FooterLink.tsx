import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom';
import '../styling/FooterLink.scss';

export default function FooterLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={match ? 'FooterLink active' : 'FooterLink'} to={to} {...props}>
      <div className="wrapper">{children}</div>
    </Link>
  );
}
