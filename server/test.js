import storage from "./config/r2Client.js";

// Wait a few seconds for login callback
setTimeout(() => {
  console.log("You can now access your MEGA files using storage.getFile(nodeId)");
}, 3000);
