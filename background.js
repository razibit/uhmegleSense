// Background script for Uhmegle Bot

// Listen for install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize extension state
    chrome.storage.local.set({
      botRunning: false,
      botLogs: []
    });
    
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    // Open onboarding page
    chrome.tabs.create({
      url: 'https://uhmegle.com/'
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle notification request from content script
  if (message.action === 'NOTIFICATION') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon128.png',
      title: message.title || 'Uhmegle Bot',
      message: message.message || '',
      priority: 2
    });
  }
});