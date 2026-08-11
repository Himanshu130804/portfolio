function Footer({ name }) {
  return <footer><span>© {new Date().getFullYear()} {name}</span><a href="#home">Back to top ↑</a><a className="admin-link" href="/admin">Admin</a></footer>;
}
export default Footer;
