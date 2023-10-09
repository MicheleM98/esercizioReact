import { Image } from "antd";

const CardCover: React.FC<{ src: string }> = ({ src }) => {
  return (
    // <div style={{ maxWidth: 100, height: 200, backgroundImage: `url(${src})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }} />
    <Image height={200} src={src} />
  );
};

export default CardCover;
