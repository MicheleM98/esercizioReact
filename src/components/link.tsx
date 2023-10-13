import { Link } from "react-router-dom";

const LinkTitle: React.FC<{ page: string; id: string; title: string }> = ({
  page,
  id,
  title,
}) => {
  return (
    <Link style={{ color: "#FF6347" }} to={`/${page}/${id}`}>
      {title}
    </Link>
  );
};

export default LinkTitle;
