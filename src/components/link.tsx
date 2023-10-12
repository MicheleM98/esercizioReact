import { Link } from "react-router-dom";

const LinkMod: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  return (
    <Link style={{ color: "#FF6347" }} to={`/article/${id}`}>
      {title}
    </Link>
  );
};

export default LinkMod;
