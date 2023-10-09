const CardCover: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div style={{ width: 300, height: 200, backgroundImage: `url(${src})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }} />
  );
}

export default CardCover;