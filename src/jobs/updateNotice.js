const cron = require("node-cron");
const { User } = require("../models/userModel");

function startRealTimeUpdateNotification(bot) {
  // Run every 1 hour at minute 0
  cron.schedule("0 * * * *", async () => {
    try {
      const users = await User.find({});

      for (const user of users) {
        const name = user.first_name || user.username || "there";
        await bot.sendMessage(
          user.chat_id,
          `⚠️👋 Hi *${name}*,\n\n🔔 Please note that the *Real-Time Trigger* feature ⚡️ is currently undergoing updates 🔧. We appreciate your patience 🙏!`,
          {
            parse_mode: "Markdown",
          }
        );
      }
    } catch (error) {
      console.error("Error sending real-time trigger update notification:", error);
    }
  });
}

module.exports = startRealTimeUpdateNotification;
