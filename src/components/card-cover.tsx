import { Image } from "antd";

const CardCover: React.FC<{ src: string }> = ({ src }) => {
  return <Image height={200} src={src} style={{ objectFit: "none" }} />;
};

export default CardCover;
