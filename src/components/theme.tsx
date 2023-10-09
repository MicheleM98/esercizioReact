import { ConfigProvider, theme } from "antd";
import App from "../app";

const Theme: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        colorPrimary: '#FF6347',
                        itemColor: '#7E7E6D',
                    },
                    Button: {
                        primaryColor: '#7E7E6D',
                        colorPrimary: '#141414',
                        colorPrimaryHover: '#B24531',
                        colorPrimaryActive: '#B24531'
                    },
                    Card: {
                        colorPrimary: '#FF6347'
                    }
                },
                algorithm: theme.darkAlgorithm,
            }}
        >
            <App />
        </ConfigProvider>
  );
}

export default Theme;