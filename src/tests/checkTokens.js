const WebSocket = require("ws");

function testPumpWebSocket() {
  const ws = new WebSocket("wss://pumpportal.fun/api/data");

  ws.on("open", () => {
    console.log("✅ Connected to Pump.fun WebSocket");
    ws.send(JSON.stringify({ method: "subscribeNewToken" }));
  });

  ws.on("message", (data) => {
    const jsonString = data.toString(); // Convert Buffer to String
    console.log("📥 Raw message as string:");
    console.log(jsonString);

    try {
      const parsed = JSON.parse(jsonString);
      console.log("✅ Parsed JSON:");
      console.log(parsed);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err.message);
    }
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket error:", err.message);
  });

  ws.on("close", () => {
    console.warn("🔌 WebSocket disconnected. Reconnecting in 5s...");
    setTimeout(testPumpWebSocket, 5000);
  });
}

testPumpWebSocket();
