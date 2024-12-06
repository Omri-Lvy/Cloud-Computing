import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const CONTAINER_NAME = "stock-portfolio-container";

export default async () => {
    console.log("\n🧹 Global Teardown: Cleaning up Docker container...");
    try {
        await execAsync(`docker stop ${CONTAINER_NAME}`);
        await execAsync(`docker rm ${CONTAINER_NAME}`);
        console.log("✅ Docker container cleaned up.");
    } catch (error) {
        console.error("❌ Failed to clean up Docker container:", error);
    }
};
