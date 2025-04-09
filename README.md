# Uhmegle Bot Chrome Extension

A Chrome extension that automatically filters and interacts with users on uhmegle.com based on their location.

## Features

- Monitors users on uhmegle.com
- Automatically skips non-Bangladesh users
- Sends a greeting message to users from Bangladesh
- Shows browser notifications when a Bangladeshi user is found
- Easy-to-use popup interface with Start/Stop buttons
- Activity logging

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right
3. Click "Load unpacked" and select the extension directory
4. The extension should now appear in your Chrome toolbar

## Usage

1. Navigate to https://uhmegle.com/
2. Click on the Uhmegle Bot extension icon in your toolbar
3. Click "Start Bot" to begin monitoring
4. The bot will automatically:
   - Skip users not from Bangladesh
   - Send "Hi" to users from Bangladesh
   - Stop the bot and notify you when a Bangladeshi user is found
5. Click "Stop Bot" at any time to stop the monitoring process

## Customization

The extension includes placeholder selectors that need to be updated with the actual selectors from uhmegle.com:

1. Open `content.js`
2. Update the following functions with the correct selectors:
   - `checkIfConnected()` - to detect when connected to a stranger
   - `getStrangerLocation()` - to get the stranger's location
   - `sendMessage()` - to find the chat input and send button
   - `skipUser()` - to find the skip button

## Note About Icons

Before using the extension, add icon files to the `images` directory:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)