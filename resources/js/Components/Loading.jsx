import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ width: "300px" }}>
                <DotLottieReact
                    src="https://lottie.host/36ccf05e-665f-4796-b4fe-693df7cfc38b/AxAs2CzRIU.lottie"
                    loop
                    autoplay
                    style={{ width: "100%", height: "auto" }}
                />
            </div>
        </div>
    );
};

export default Loading;
