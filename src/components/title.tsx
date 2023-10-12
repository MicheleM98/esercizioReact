import { Typography } from "antd";

const { Title } = Typography;

const TitleMod: React.FC<{
  level: 5 | 1 | 2 | 3 | 4 | undefined;
  title: string;
}> = ({ level, title }) => {
  return (
    <Title level={level} style={{ color: "#141414" }}>
      {title}
    </Title>
  );
};

export default TitleMod;
