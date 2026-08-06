import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 🎯 JDoodle API ke liye Language aur Version map
const jdoodleLanguageMap = {
    "cpp": { language: "cpp17", versionIndex: "0" },
    "java": { language: "java", versionIndex: "4" },
    "python": { language: "python3", versionIndex: "4" },
    "javascript": { language: "nodejs", versionIndex: "4" }
};

const executeCode = asyncHandler(async (req, res) => {
    const { language, code, input } = req.body;

    if (!language || !code) {
        throw new ApiError(400, "Language and Source Code are required!");
    }

    const jdoodleConfig = jdoodleLanguageMap[language.toLowerCase()];
    if (!jdoodleConfig) {
        throw new ApiError(400, "Oops! This language is not supported yet.");
    }

    try {
        // 🚀 Using Official JDoodle Enterprise API
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clientId: process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                script: code,
                stdin: input || "",
                language: jdoodleConfig.language,
                versionIndex: jdoodleConfig.versionIndex
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("JDoodle API Error:", data);
            throw new ApiError(500, "Code Execution Engine failed to respond.");
        }

        // JDoodle memory aur CPU time bhi return karta hai
        return res
        .status(200)
        .json(
            new ApiResponse(200, { 
                output: data.output, 
                error: "", // JDoodle runtime errors ko bhi 'output' string me hi deta hai
                memory: data.memory,
                time: data.cpuTime    
            }, "Code executed successfully")
        );

    } catch (error) {
        console.error("Execution Controller Error =>", error);
        throw new ApiError(500, "Something went wrong while executing the code");
    }
});

export {
    executeCode
}