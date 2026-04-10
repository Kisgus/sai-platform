import { loadConfig } from "./config.js";
import { createAgentServer } from "./server.js";
import { echoTool } from "./tools.js";

const config = loadConfig();
const server = createAgentServer(config, [echoTool]);

server.listen(config.port, () => {
  console.log(`Agent server listening on :${config.port}`);
});

process.on("SIGTERM", () => {
  console.log("Shutting down...");
  server.close(() => process.exit(0));
});
