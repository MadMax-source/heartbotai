const cron = require("node-cron");
const { User } = require("../models/userModel");

function startNotifyUsersJob(bot) {
  // Run every 5 minutes
  cron.schedule("0 */6 * * *", async () => {
    try {
      const users = await User.find({});

      for (const user of users) {
        const name = user.first_name || user.username || "there";
        await bot.sendMessage(
          user.chat_id,
          `👋 Hi *${name}*,\n\n🔔 It's time to check out the latest filtered tokens!`,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "📊 View Filtered Tokens",
                    callback_data: "view_filtered_tokens",
                  },
                ],
              ],
            },
          }
        );
      }
    } catch (error) {
      console.error("Error sending scheduled notification:", error);
    }
  });
}

module.exports = startNotifyUsersJob;
