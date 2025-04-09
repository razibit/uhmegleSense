# Uhmegle Bot

A smart Chrome extension that filters and connects you with users from your preferred countries on uhmegle.com chat platform.

![Uhmegle Bot Logo](images/icon128.svg)

## 🌟 Features

- **Country-Based Filtering**: Automatically finds users from your selected target countries
- **Multi-Country Support**: Choose from a comprehensive list of 100+ countries 
- **Smart Detection**: Recognizes country mentions in chat, flags, and location indicators
- **Instant Notifications**: Visual and audio alerts when a matching user is found
- **Intuitive UI**: Clean, user-friendly popup interface with live status updates
- **Detailed Logging**: Tracks all actions for better monitoring
- **Customizable Settings**: Enable/disable sound notifications

## 📋 Requirements

- Google Chrome or Chromium-based browser (Edge, Brave, etc.)
- Chrome extensions enabled

## 🔧 Installation

### From Source (Developer Mode)

1. Download or clone this repository to your computer
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right
4. Click "Load unpacked" and select the Uhmegle-Bot directory
5. The extension icon will appear in your browser toolbar

## 🚀 How to Use

1. Visit [https://uhmegle.com/](https://uhmegle.com/)
2. Click the Uhmegle Bot icon in your browser toolbar
3. Select your target countries from the dropdown menu
4. Click "Start Bot" to begin monitoring
5. The bot will:
   - Skip users not from your selected countries
   - Send a greeting message to matching users
   - Alert you with sound and visual notifications when a match is found
   - Show detailed status in the logs panel
6. Click "Stop Bot" any time to pause the bot

## 📱 User Interface

The extension popup provides several sections:
- **Controls**: Start and stop buttons with current status indicator
- **Country Selection**: Add multiple target countries from a dropdown list
- **Selected Countries**: View and remove your currently selected target countries
- **Logs Panel**: Real-time activity and event tracking

## ⚙️ Advanced Configuration

The extension is designed to work out-of-the-box with uhmegle.com, but you can customize the behavior:

### Custom Greetings

By default, the bot sends "Hi" as a greeting message. To modify:

1. Open `content.js`
2. Find the `checkStranger()` function
3. Modify the `sendMessage('Hi')` line with your preferred greeting

### Country Detection

The bot uses multiple strategies to detect country information:
- Flag indicators
- Status messages
- Chat messages
- User's shared interests

## 🔔 Notifications

When a user from your target country is found:
- A sound notification plays (can be enabled/disabled)
- Browser tab title flashes
- Red visual overlay appears
- Browser notification is displayed (requires permission)

## 🛠️ Troubleshooting

### Sound Not Working
- Make sure notifications are enabled in the settings
- Check that your browser allows audio playback
- Try clicking on the page first to enable audio (browser autoplay policies)

### Country Not Detected
- The bot uses various methods to detect countries, but some users may not display location info
- Try adding variations of the country name or major cities to improve detection

### Extension Not Starting
- Ensure you're on the uhmegle.com website
- Check browser console for any errors
- Try reloading the extension from the chrome://extensions page

## 📝 License

This project is provided for educational purposes. Use responsibly and in accordance with uhmegle.com's terms of service.

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to submit a pull request or open an issue.