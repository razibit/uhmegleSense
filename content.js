// Bot state management
let botRunning = false;
let botInterval = null;
const CHECK_INTERVAL = 1000; // Check every second
let targetCountries = ['bangladesh']; // Default target country
let notificationSound = true; // Enable sound notifications by default

// Country name variations for better matching
const COUNTRY_VARIATIONS = {
  'United States': ['USA', 'United States', 'America', 'US', 'United States of America'],
  'United Kingdom': ['UK', 'United Kingdom', 'Great Britain', 'Britain', 'England', 'Scotland', 'Wales'],
  'India': ['India', 'Bharat', 'Hindustan'],
  'China': ['China', 'PRC', 'People\'s Republic of China'],
  'Japan': ['Japan', 'Nippon', 'Nihon'],
  'Russia': ['Russia', 'Russian Federation', 'RF'],
  'Brazil': ['Brazil', 'Brasil'],
  'Canada': ['Canada', 'Canadian'],
  'Australia': ['Australia', 'Aussie'],
  'Germany': ['Germany', 'Deutschland'],
  // ... Add more countries as needed
};

// List of all supported countries with their variations
const COUNTRY_VARIATIONS_FULL = {
  'afghanistan': ['afghan', 'kabul'],
  'albania': ['albanian', 'tirana'],
  'algeria': ['algerian', 'algiers'],
  'andorra': ['andorran'],
  'angola': ['angolan', 'luanda'],
  'argentina': ['argentinian', 'buenos aires'],
  'armenia': ['armenian', 'yerevan'],
  'australia': ['aussie', 'sydney', 'melbourne', 'brisbane', 'perth'],
  'austria': ['austrian', 'vienna'],
  'azerbaijan': ['azerbaijani', 'baku'],
  'bahamas': ['bahamian', 'nassau'],
  'bahrain': ['bahraini', 'manama'],
  'bangladesh': ['bangla', 'dhaka', 'bd', 'bangladeshi'],
  'belarus': ['belarusian', 'minsk'],
  'belgium': ['belgian', 'brussels'],
  'bhutan': ['bhutanese', 'thimphu'],
  'bolivia': ['bolivian', 'la paz'],
  'brazil': ['brazilian', 'rio', 'sao paulo'],
  'brunei': ['bruneian', 'bandar seri begawan'],
  'bulgaria': ['bulgarian', 'sofia'],
  'cambodia': ['cambodian', 'phnom penh'],
  'cameroon': ['cameroonian', 'yaounde'],
  'canada': ['canadian', 'toronto', 'vancouver', 'montreal'],
  'china': ['chinese', 'beijing', 'shanghai'],
  'colombia': ['colombian', 'bogota'],
  'croatia': ['croatian', 'zagreb'],
  'cuba': ['cuban', 'havana'],
  'cyprus': ['cypriot', 'nicosia'],
  'czech republic': ['czech', 'prague'],
  'denmark': ['danish', 'copenhagen'],
  'egypt': ['egyptian', 'cairo'],
  'estonia': ['estonian', 'tallinn'],
  'ethiopia': ['ethiopian', 'addis ababa'],
  'finland': ['finnish', 'helsinki'],
  'france': ['french', 'paris'],
  'germany': ['german', 'berlin', 'munich'],
  'ghana': ['ghanaian', 'accra'],
  'greece': ['greek', 'athens'],
  'india': ['indian', 'delhi', 'mumbai', 'bangalore'],
  'indonesia': ['indonesian', 'jakarta'],
  'iran': ['iranian', 'tehran'],
  'iraq': ['iraqi', 'baghdad'],
  'ireland': ['irish', 'dublin'],
  'israel': ['israeli', 'jerusalem', 'tel aviv'],
  'italy': ['italian', 'rome', 'milan'],
  'japan': ['japanese', 'tokyo', 'osaka'],
  'jordan': ['jordanian', 'amman'],
  'kazakhstan': ['kazakh', 'almaty'],
  'kenya': ['kenyan', 'nairobi'],
  'kuwait': ['kuwaiti', 'kuwait city'],
  'laos': ['laotian', 'vientiane'],
  'latvia': ['latvian', 'riga'],
  'lebanon': ['lebanese', 'beirut'],
  'libya': ['libyan', 'tripoli'],
  'malaysia': ['malaysian', 'kuala lumpur'],
  'maldives': ['maldivian', 'male'],
  'mexico': ['mexican', 'mexico city'],
  'mongolia': ['mongolian', 'ulaanbaatar'],
  'morocco': ['moroccan', 'rabat'],
  'myanmar': ['burmese', 'yangon'],
  'nepal': ['nepali', 'kathmandu'],
  'netherlands': ['dutch', 'amsterdam'],
  'new zealand': ['kiwi', 'auckland', 'wellington'],
  'nigeria': ['nigerian', 'lagos'],
  'north korea': ['north korean', 'pyongyang'],
  'norway': ['norwegian', 'oslo'],
  'oman': ['omani', 'muscat'],
  'pakistan': ['pakistani', 'karachi', 'lahore', 'islamabad'],
  'palestine': ['palestinian', 'gaza'],
  'philippines': ['filipino', 'manila'],
  'poland': ['polish', 'warsaw'],
  'portugal': ['portuguese', 'lisbon'],
  'qatar': ['qatari', 'doha'],
  'romania': ['romanian', 'bucharest'],
  'russia': ['russian', 'moscow', 'saint petersburg'],
  'saudi arabia': ['saudi', 'riyadh', 'jeddah'],
  'singapore': ['singaporean', 'singapore'],
  'south africa': ['south african', 'johannesburg', 'cape town'],
  'south korea': ['korean', 'seoul', 'busan'],
  'spain': ['spanish', 'madrid', 'barcelona'],
  'sri lanka': ['sri lankan', 'colombo'],
  'sudan': ['sudanese', 'khartoum'],
  'sweden': ['swedish', 'stockholm'],
  'switzerland': ['swiss', 'zurich', 'geneva'],
  'syria': ['syrian', 'damascus'],
  'taiwan': ['taiwanese', 'taipei'],
  'thailand': ['thai', 'bangkok'],
  'turkey': ['turkish', 'istanbul', 'ankara'],
  'ukraine': ['ukrainian', 'kyiv'],
  'united arab emirates': ['uae', 'dubai', 'abu dhabi'],
  'united kingdom': ['uk', 'british', 'london', 'england', 'scotland', 'wales'],
  'united states': ['usa', 'us', 'american', 'new york', 'los angeles', 'chicago'],
  'vietnam': ['vietnamese', 'hanoi', 'ho chi minh city'],
  'yemen': ['yemeni', 'sanaa']
};

// Initialize bot state from local storage
chrome.storage.local.get(['botRunning', 'targetCountries', 'notificationSound'], (result) => {
  if (result.targetCountries && Array.isArray(result.targetCountries)) {
    targetCountries = result.targetCountries;
  }
  
  if (result.notificationSound !== undefined) {
    notificationSound = result.notificationSound;
  }
  
  if (result.botRunning === true) {
    startBot();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_BOT') {
    // Update target countries if provided
    if (message.targetCountries && Array.isArray(message.targetCountries)) {
      targetCountries = message.targetCountries;
      chrome.storage.local.set({ targetCountries });
    }
    
    // Update notification sound setting if provided
    if (message.notificationSound !== undefined) {
      notificationSound = message.notificationSound;
      chrome.storage.local.set({ notificationSound });
    }
    
    startBot();
  } else if (message.action === 'STOP_BOT') {
    stopBot();
  } else if (message.action === 'TOGGLE_SOUND') {
    notificationSound = message.enabled;
    chrome.storage.local.set({ notificationSound });
    logMessage(`Sound notifications ${notificationSound ? 'enabled' : 'disabled'}`, 'info');
  }
});

// Log messages (sends to popup and shows in console)
function logMessage(message, type = 'info') {
  console.log(`[Uhmegle Bot] ${message}`);
  chrome.runtime.sendMessage({
    action: 'LOG',
    message: message,
    type: type
  });
}

// Start the bot monitoring
function startBot() {
  if (botRunning) return;
  
  botRunning = true;
  chrome.storage.local.set({ botRunning: true });
  logMessage(`Bot started monitoring for countries: ${targetCountries.join(', ')}`);
  
  botInterval = setInterval(checkStranger, CHECK_INTERVAL);
}

// Stop the bot
function stopBot() {
  if (!botRunning) return;
  
  botRunning = false;
  chrome.storage.local.set({ botRunning: false });
  logMessage('Bot stopped monitoring');
  
  if (botInterval) {
    clearInterval(botInterval);
    botInterval = null;
  }
}

// Check if we're connected to a stranger and process accordingly
function checkStranger() {
  try {
    // Check if we're connected to someone
    const isConnected = checkIfConnected();
    
    // Run page structure extraction occasionally for debugging
    if (Math.random() < 0.1) { // 10% chance to run extraction each check
      extractPageStructure();
    }
    
    if (!isConnected) {
      logMessage('Waiting for connection...', 'info');
      return;
    }
    
    // Get location info from the page
    const locationInfo = getStrangerLocation();
    
    if (!locationInfo) {
      logMessage('Unable to detect location, waiting...', 'info');
      return;
    }
    
    // Extract country and source from location info
    const { country, source } = parseLocationInfo(locationInfo);
    
    logMessage(`Detected location: ${country} (${source})`, 'info');
    
    // Check if location matches any target country
    if (isTargetCountry(country)) {
      // Add a small delay to ensure UI has stabilized
      setTimeout(() => {
        logMessage(`MATCH FOUND! User from ${country} (${source})`, 'success');
        
        // Play sound notification
        if (notificationSound) {
          playNotificationSound();
        }
        
        // Send a greeting message
        sendMessage('Hi');
        
        // Show browser notification
        showNotification('Target Country User Found!', `Location: ${country} (${source})`);
        
        // Stop the bot - we found what we're looking for
        stopBot();
      }, 500); // Short delay of 500ms
    } else {
      handleNonTargetUser(country);
    }
  } catch (error) {
    logMessage(`Error: ${error.message}`, 'skip');
  }
}

// Extract the location of the stranger from the page
function getStrangerLocation() {
  // Method 1: Check for shared interests/tags in status messages
  const statusLogs = document.querySelectorAll('.logitem, .statuslog');
  for (const log of statusLogs) {
    const text = log.textContent.toLowerCase();
    // Look for "You both like..." or similar shared interests text
    if (text.includes('you both like') || text.includes('you\'re now chatting with a random stranger') || 
        text.includes('you have common interests')) {
      
      // Generic check for any target country in shared interests
      for (const country of targetCountries) {
        const countryLower = country.toLowerCase();
        if (text.includes(countryLower)) {
          logMessage(`Found ${country} in shared interests: "${text}"`, 'info');
          return `${country} (from shared interests)`;
        }
        
        // Special case handling for country variations
        switch(countryLower) {
          case 'bangladesh':
            if (text.includes('dhaka') || text.includes('bd')) {
              logMessage(`Found Bangladesh in shared interests: "${text}"`, 'info');
              return 'Bangladesh (from shared interests)';
            }
            break;
          case 'india':
            if (text.includes('delhi') || text.includes('mumbai')) {
              logMessage(`Found India in shared interests: "${text}"`, 'info');
              return 'India (from shared interests)';
            }
            break;
          case 'usa':
            if (text.includes('american') || text.includes('united states') || text.includes('us ')) {
              logMessage(`Found USA in shared interests: "${text}"`, 'info');
              return 'USA (from shared interests)';
            }
            break;
          case 'uk':
            if (text.includes('britain') || text.includes('england') || text.includes('london')) {
              logMessage(`Found UK in shared interests: "${text}"`, 'info');
              return 'UK (from shared interests)';
            }
            break;
        }
      }
    }
    
    // Look for explicit country mentions in status logs
    if (text.includes('country') || text.includes('location') || text.includes(' from ')) {
      const countryText = log.textContent.trim();
      
      // Check for each target country in the status message
      for (const country of targetCountries) {
        const countryLower = country.toLowerCase();
        if (countryText.toLowerCase().includes(countryLower)) {
          logMessage(`Found ${country} in status message: "${countryText}"`, 'info');
          return `${country} (from status message)`;
        }
      }
      
      return countryText;
    }
  }
  
  // Method 2: Look for country flag indicator
  const flagElements = document.querySelectorAll('img[alt*="flag"], .flag, [class*="flag"], [class*="country"]');
  for (const flag of flagElements) {
    // Check visible elements near the flag for country name
    if (flag.offsetParent !== null) {
      // Check the flag element itself
      const flagAlt = flag.getAttribute('alt') || '';
      const flagTitle = flag.getAttribute('title') || '';
      const flagText = flag.textContent || '';
      
      // Check for any target country in flag attributes
      for (const country of targetCountries) {
        const countryLower = country.toLowerCase();
        if (flagAlt.toLowerCase().includes(countryLower) || 
            flagTitle.toLowerCase().includes(countryLower) || 
            flagText.toLowerCase().includes(countryLower)) {
          logMessage(`Found ${country} flag indicator`, 'info');
          return `${country} (from flag)`;
        }
      }
      
      // If we found a flag with country info but it's not in our target countries,
      // still return it for processing by isTargetCountry which has more advanced matching
      if (flagAlt && (flagAlt.includes('flag') || flagTitle.includes('flag'))) {
        const possibleCountry = flagAlt || flagTitle;
        logMessage(`Found possible country flag: ${possibleCountry}`, 'info');
        return possibleCountry;
      }
      
      // Check surrounding elements (parent and siblings)
      const parent = flag.parentElement;
      if (parent) {
        const parentText = parent.textContent.toLowerCase();
        
        // Check for any target country in parent text
        for (const country of targetCountries) {
          const countryLower = country.toLowerCase();
          if (parentText.includes(countryLower)) {
            logMessage(`Found ${country} in flag parent element`, 'info');
            return `${country} (from flag parent)`;
          }
        }
        
        // Check siblings
        const siblings = Array.from(parent.children);
        for (const sibling of siblings) {
          const siblingText = sibling.textContent.toLowerCase();
          
          // Check for any target country in sibling text
          for (const country of targetCountries) {
            const countryLower = country.toLowerCase();
            if (siblingText.includes(countryLower)) {
              logMessage(`Found ${country} in flag sibling element`, 'info');
              return `${country} (from flag sibling)`;
            }
          }
        }
      }
    }
  }
  
  // Method 3: Check if the stranger has mentioned their country in chat
  const strangerMsgs = document.querySelectorAll('.strangermsg');
  for (const msg of strangerMsgs) {
    const text = msg.textContent.toLowerCase();
    
    // Check for country mentions in messages
    for (const country of targetCountries) {
      const countryLower = country.toLowerCase();
      if (text.includes(countryLower)) {
        logMessage(`Found ${country} in chat message: "${text}"`, 'info');
        return `${country} (from chat message)`;
      }
      
      // Special case handling for country variations in chat
      switch(countryLower) {
        case 'usa':
          if (text.includes('american') || text.includes('united states') || (text.includes('us') && !text.includes('use'))) {
            logMessage(`Found USA in chat message: "${text}"`, 'info');
            return 'USA (from chat message)';
          }
          break;
        case 'uk':
          if (text.includes('britain') || text.includes('england') || text.includes('london')) {
            logMessage(`Found UK in chat message: "${text}"`, 'info');
            return 'UK (from chat message)';
          }
          break;
      }
    }
    
    // Check for location patterns in messages
    const countryPatterns = [
      /i(?:'|'|'m|\s+am)\s+from\s+(\w+)/i,
      /from\s+(\w+)/i,
      /i(?:'|'|m|\s+am)\s+in\s+(\w+)/i
    ];
    
    for (const pattern of countryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const possibleCountry = match[1].trim();
        logMessage(`Possible country mention: "${possibleCountry}" in "${text}"`, 'info');
        return `${possibleCountry} (from chat pattern)`;
      }
    }
  }
  
  // Method 4: Look specifically for elements containing shared interests
  const allElements = document.querySelectorAll('*');
  for (const elem of allElements) {
    if (elem.offsetParent !== null) { // Only consider visible elements
      const text = elem.textContent.trim().toLowerCase();
      if (text.includes('you both like') || text.includes('common interests')) {
        // Check for any target country in shared interests
        for (const country of targetCountries) {
          const countryLower = country.toLowerCase();
          if (text.includes(countryLower)) {
            logMessage(`Found ${country} in shared interests element: "${text}"`, 'info');
            return `${country} (from interests)`;
          }
          
          // Special cases for common variations
          switch(countryLower) {
            case 'bangladesh':
              if (text.includes('dhaka') || text.includes('bd')) {
                logMessage(`Found Bangladesh in shared interests element: "${text}"`, 'info');
                return 'Bangladesh (from interests)';
              }
              break;
            case 'india':
              if (text.includes('delhi') || text.includes('mumbai')) {
                logMessage(`Found India in shared interests element: "${text}"`, 'info');
                return 'India (from interests)';
              }
              break;
            case 'usa':
              if (text.includes('american') || text.includes('united states')) {
                logMessage(`Found USA in shared interests element: "${text}"`, 'info');
                return 'USA (from interests)';
              }
              break;
            case 'uk':
              if (text.includes('britain') || text.includes('england') || text.includes('london')) {
                logMessage(`Found UK in shared interests element: "${text}"`, 'info');
                return 'UK (from interests)';
              }
              break;
            case 'australia':
              if (text.includes('aussie') || text.includes('sydney')) {
                logMessage(`Found Australia in shared interests element: "${text}"`, 'info');
                return 'Australia (from interests)';
              }
              break;
          }
        }
      }
    }
  }
  
  // If we can't find specific location but we're connected, use placeholder
  if (checkIfConnected()) {
    return "Unknown Location";
  }
  
  return null;
}

// Parse location info into country and source
function parseLocationInfo(locationInfo) {
  // Handle the case where locationInfo is already a detected location with source
  if (locationInfo.includes('(from')) {
    const parts = locationInfo.split('(from');
    return {
      country: parts[0].trim().toLowerCase(),
      source: `from ${parts[1].replace(')', '').trim()}`
    };
  }
  
  // Handle the case where it might contain a country name
  for (const country of targetCountries) {
    const countryLower = country.toLowerCase();
    if (locationInfo.toLowerCase().includes(countryLower)) {
      return {
        country: country.toLowerCase(),
        source: 'detected in text'
      };
    }
    
    // Special cases for country variations
    switch(countryLower) {
      case 'usa':
        if (locationInfo.toLowerCase().includes('american') || 
            locationInfo.toLowerCase().includes('united states') || 
            locationInfo.toLowerCase().includes('us ')) {
          return {
            country: 'usa',
            source: 'detected variation'
          };
        }
        break;
      case 'uk':
        if (locationInfo.toLowerCase().includes('britain') || 
            locationInfo.toLowerCase().includes('england') || 
            locationInfo.toLowerCase().includes('london')) {
          return {
            country: 'uk',
            source: 'detected variation'
          };
        }
        break;
    }
  }
  
  // Default case - just the location string
  return {
    country: locationInfo.toLowerCase(),
    source: 'detected'
  };
}

// Check if the location matches any target country
function isTargetCountry(location) {
  if (!location) return false;
  
  const text = location.toLowerCase();
  logMessage(`Checking if "${text}" matches any target country: ${targetCountries.join(', ')}`, 'info');
  
  // Check for each target country
  for (const country of targetCountries) {
    const countryLower = country.toLowerCase();
    
    // Get variations for this country
    const variations = COUNTRY_VARIATIONS[countryLower] || [];
    
    // Check exact match
    if (text === countryLower) {
      logMessage(`Found exact match for country: ${country}`, 'info');
      return true;
    }
    
    // Check if text contains the country name
    if (text.includes(countryLower)) {
      logMessage(`Found country name in text: ${country}`, 'info');
      return true;
    }
    
    // Check all variations
    for (const variation of variations) {
      if (text.includes(variation.toLowerCase())) {
        logMessage(`Found country variation: ${variation} for ${country}`, 'info');
        return true;
      }
    }
  }
  
  logMessage(`No match found for: ${text}`, 'info');
  return false;
}

// Handle a non-target country user
function handleNonTargetUser(location) {
  logMessage(`Skipping user from ${location}`, 'skip');
  
  // Click the skip button to move to next user
  skipUser();
}

// Check if we're connected to a stranger
function checkIfConnected() {
  // Method 1: Check for active chat input
  const chatInput = document.querySelector('textarea') || 
                   document.querySelector('input[type="text"]');
  if (chatInput && !chatInput.disabled) {
    return true;
  }
  
  // Method 2: Check for specific status messages
  const statusLogs = document.querySelectorAll('.logitem, .statuslog');
  for (const log of statusLogs) {
    const text = log.textContent.toLowerCase();
    if (text.includes('connected') || 
        text.includes('you\'re now chatting with') ||
        text.includes('stranger is typing') ||
        text.includes('you: ') || 
        text.includes('stranger: ')) {
      return true;
    }
  }
  
  // Method 3: Check for disconnect/skip button
  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    const text = button.textContent.toLowerCase();
    if ((button.offsetParent !== null) && // is visible
        (text.includes('disconnect') || text.includes('stop') || 
         text.includes('next') || text.includes('skip'))) {
      return true;
    }
  }
  
  // Method 4: Check if stranger has sent a message
  const strangerMsgs = document.querySelectorAll('.strangermsg');
  if (strangerMsgs && strangerMsgs.length > 0) {
    return true;
  }
  
  return false;
}

// Send a message in the chat
function sendMessage(text) {
  try {
    // Find the chat input field using multiple strategies
    let chatInput = null;
    
    // METHOD 1: Try common chat input selectors
    chatInput = document.querySelector('textarea.chatmsg') ||
               document.querySelector('#chatmsg') ||
               document.querySelector('textarea[name="chatmsg"]') ||
               document.querySelector('input[type="text"]') ||
               document.querySelector('textarea');
    
    if (!chatInput) {
      // METHOD 2: Find any enabled text input that looks like a chat box
      const allInputs = Array.from(document.querySelectorAll('textarea, input[type="text"]'));
      chatInput = allInputs.find(input => !input.disabled);
    }
    
    if (!chatInput) {
      throw new Error('Chat input not found');
    }
    
    // Clear existing text first
    chatInput.value = '';
    
    // Set the value of the input
    chatInput.value = text;
    
    // Dispatch events to simulate typing
    chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    chatInput.dispatchEvent(new Event('change', { bubbles: true }));
    chatInput.focus();
    
    // Find and click the send button using multiple strategies
    let sendButton = null;
    
    // METHOD 1: Common send button selectors
    sendButton = document.querySelector('button.sendbtn') ||
                document.querySelector('button[data-key="enter"]') ||
                document.querySelector('input[type="submit"]');
    
    // METHOD 2: Find by text
    if (!sendButton) {
      const buttons = Array.from(document.querySelectorAll('button'));
      sendButton = buttons.find(btn => {
        const text = btn.textContent.trim().toLowerCase();
        return (text === 'send' || text === '>' || text.includes('send')) && btn.offsetParent !== null;
      });
    }
    
    // METHOD 3: Look for a button near the chat input
    if (!sendButton) {
      // Try to find a nearby button (often the send button is adjacent to the input)
      const parent = chatInput.parentElement;
      if (parent) {
        const nearbyButtons = parent.querySelectorAll('button');
        if (nearbyButtons.length > 0) {
          // Assume the last button in the container is the send button
          sendButton = Array.from(nearbyButtons).find(btn => btn.offsetParent !== null);
        }
      }
    }
    
    if (sendButton) {
      // Click the send button
      sendButton.click();
      logMessage(`Message sent via button click: ${text}`, 'info');
    } else {
      // Fallback: Try to submit by pressing Enter
      chatInput.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true
      }));
      
      // Also try keyup and keypress
      chatInput.dispatchEvent(new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true
      }));
      
      chatInput.dispatchEvent(new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true
      }));
      
      logMessage(`Message sent by pressing Enter: ${text}`, 'info');
    }
    
    // Final trick: If there's a form, try to submit it
    const form = chatInput.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
    
    return true;
  } catch (error) {
    logMessage(`Failed to send message: ${error.message}`, 'skip');
    return false;
  }
}

// Click the skip button to move to next user
function skipUser() {
  try {
    // Find all buttons on the page
    const allButtons = Array.from(document.querySelectorAll('button'));
    let skipButton = null;
    
    // METHOD 1: Find by common skip/disconnect button text
    const skipButtonTexts = ['skip', 'next', 'disconnect', 'stop', 'new'];
    for (const btn of allButtons) {
      const btnText = btn.textContent.trim().toLowerCase();
      // Check if this button has skip-related text and is visible
      if (skipButtonTexts.some(text => btnText.includes(text)) && btn.offsetParent !== null) {
        skipButton = btn;
        logMessage(`Found skip button by text: ${btnText}`, 'info');
        break;
      }
    }
    
    // METHOD 2: Find by key attributes
    if (!skipButton) {
      skipButton = document.querySelector('button[data-key="esc"]') || 
                 document.querySelector('button.disconnectbtn') ||
                 document.querySelector('#disconnectbtn') ||
                 document.querySelector('.skipbtn');
      
      if (skipButton && skipButton.offsetParent !== null) {
        logMessage('Found skip button by attribute', 'info');
      } else {
        skipButton = null;
      }
    }
    
    // METHOD 3: Try to find by position or appearance
    if (!skipButton) {
      // In many chat sites, the skip button is at the bottom or right side
      // Check for buttons that are visible and might be positioned at the bottom
      const visibleButtons = allButtons.filter(btn => btn.offsetParent !== null);
      
      if (visibleButtons.length > 0) {
        // Often the skip button is the last visible button or has specific styling
        skipButton = visibleButtons[visibleButtons.length - 1];
        logMessage('Using last visible button as skip button (fallback)', 'info');
      }
    }
    
    if (skipButton) {
      // Click the skip button
      skipButton.click();
      logMessage('Skipped to next user', 'info');
      
      // Additional safety measure: add a small delay to prevent rapid skipping
      setTimeout(() => {
        // Force reload connections if needed
        const startButtons = document.querySelectorAll('button');
        for (const btn of startButtons) {
          const btnText = btn.textContent.trim().toLowerCase();
          if (btnText.includes('start') || btnText.includes('new chat') || btnText.includes('new')) {
            if (btn.offsetParent !== null) {
              btn.click();
              logMessage('Clicked start/new chat button', 'info');
              break;
            }
          }
        }
      }, 300);
      
      return true;
    }
    
    throw new Error('Skip button not found with any method');
  } catch (error) {
    logMessage(`Failed to skip user: ${error.message}`, 'skip');
    
    // Try keyboard shortcuts as fallback
    try {
      // Try pressing Escape key
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        which: 27,
        keyCode: 27,
        bubbles: true
      }));
      
      logMessage('Attempted to skip using Escape key', 'info');
      
      // After a short delay, try F2 as well (common shortcut in some chat sites)
      setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'F2',
          code: 'F2',
          which: 113,
          keyCode: 113,
          bubbles: true
        }));
      }, 300);
      
      return true;
    } catch (err) {
      logMessage(`All skip methods failed: ${err.message}`, 'skip');
      return false;
    }
  }
}

// Show a browser notification
function showNotification(title, message) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: chrome.runtime.getURL('images/icon48.svg')
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showNotification(title, message);
      }
    });
  }
}

// Extract and log page structure for debugging
function extractPageStructure() {
  try {
    logMessage("Starting page structure extraction", "info");
    
    // Log the basic structure
    const chatContainer = document.querySelector('#chatbox') || 
                          document.querySelector('.chatbox') || 
                          document.querySelector('#chat_container');
    
    if (chatContainer) {
      logMessage(`Found chat container: ${chatContainer.className || chatContainer.id}`, "info");
    } else {
      logMessage("No chat container found, logging body structure", "info");
    }
    
    // Specifically look for shared interests or "you both like" sections
    const interestTexts = [];
    const allElements = document.querySelectorAll('*');
    for (const elem of allElements) {
      if (elem.offsetParent !== null) { // Only visible elements
        const text = elem.textContent.trim().toLowerCase();
        if (text.includes('you both like') || 
            text.includes('common interests') || 
            text.includes('shared') || 
            text.includes('tags')) {
          interestTexts.push({
            text: elem.textContent.trim(),
            class: elem.className,
            id: elem.id,
            tag: elem.tagName
          });
        }
      }
    }
    
    if (interestTexts.length > 0) {
      logMessage(`Found ${interestTexts.length} shared interest elements:`, "info");
      interestTexts.forEach((elem, i) => {
        logMessage(`Interest ${i+1}: [${elem.tag}.${elem.class}#${elem.id}] "${elem.text}"`, "info");
      });
    } else {
      logMessage("No shared interest elements found", "info");
    }
    
    // Log all buttons on the page
    const buttons = document.querySelectorAll('button');
    logMessage(`Found ${buttons.length} buttons on page:`, "info");
    buttons.forEach((btn, i) => {
      const btnText = btn.textContent.trim();
      const btnClass = btn.className;
      const btnId = btn.id;
      const isVisible = btn.offsetParent !== null;
      logMessage(`Button ${i+1}: Text="${btnText}" Class=${btnClass} ID=${btnId} Visible=${isVisible}`, "info");
    });
    
    // Specifically look for country flags
    const flagElements = document.querySelectorAll('img[alt*="flag"], .flag, [class*="flag"], [class*="country"]');
    if (flagElements.length > 0) {
      logMessage(`Found ${flagElements.length} potential flag elements:`, "info");
      flagElements.forEach((flag, i) => {
        const flagAlt = flag.getAttribute('alt') || '';
        const flagTitle = flag.getAttribute('title') || '';
        const flagClass = flag.className;
        const flagId = flag.id;
        const isVisible = flag.offsetParent !== null;
        logMessage(`Flag ${i+1}: Alt="${flagAlt}" Title="${flagTitle}" Class=${flagClass} ID=${flagId} Visible=${isVisible}`, "info");
        
        // Also log parent text if visible
        if (isVisible && flag.parentElement) {
          logMessage(`Flag ${i+1} parent: "${flag.parentElement.textContent.trim()}"`, "info");
        }
      });
    } else {
      logMessage("No flag elements found", "info");
    }
    
    // Log all chat messages and status logs
    const messages = document.querySelectorAll('.logitem, .statuslog, .strangermsg, .youmsg, .servermsg');
    logMessage(`Found ${messages.length} message elements:`, "info");
    messages.forEach((msg, i) => {
      const msgText = msg.textContent.trim();
      const msgClass = msg.className;
      logMessage(`Message ${i+1}: [${msgClass}] "${msgText}"`, "info");
    });
    
    // Check for location/country indicators
    const locationElems = [];
    for (const elem of allElements) {
      const text = elem.textContent.trim().toLowerCase();
      if (text.includes('country') || text.includes('location') || 
          text.includes('from') || text.includes('bangladesh') ||
          text.includes('dhaka') || text.includes('bd')) {
        locationElems.push({
          text: elem.textContent.trim(),
          class: elem.className,
          id: elem.id,
          tag: elem.tagName,
          visible: elem.offsetParent !== null
        });
      }
    }
    
    if (locationElems.length > 0) {
      logMessage(`Found ${locationElems.length} potential location elements:`, "info");
      locationElems.forEach((elem, i) => {
        logMessage(`Location element ${i+1}: [${elem.tag}.${elem.class}#${elem.id}] Visible=${elem.visible} "${elem.text}"`, "info");
      });
    } else {
      logMessage("No obvious location elements found", "info");
    }
    
    // Find chat input and send button
    const inputs = document.querySelectorAll('input, textarea');
    logMessage(`Found ${inputs.length} input elements:`, "info");
    inputs.forEach((input, i) => {
      const inputType = input.type;
      const inputClass = input.className;
      const inputId = input.id;
      const inputName = input.name;
      const isDisabled = input.disabled;
      logMessage(`Input ${i+1}: Type=${inputType} Class=${inputClass} ID=${inputId} Name=${inputName} Disabled=${isDisabled}`, "info");
    });
  } catch (error) {
    logMessage(`Error extracting page structure: ${error.message}`, "skip");
  }
}

// Play notification sound when a match is found
function playNotificationSound() {
  try {
    logMessage("Playing notification sound...", "info");
    
    // Use the Web Audio API to create a sound directly (no decoding needed)
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      
      // Create an oscillator (simple beep sound generator)
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Configure the beep sound
      oscillator.type = 'sine'; // Sine wave - smooth beep
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      
      // Configure volume envelope
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      
      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Play the beep
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
      
      logMessage("Notification sound played via oscillator", "info");
      
      // Use a second beep after a short delay for the alert pattern
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(988, audioCtx.currentTime); // B5 note - higher pitch
        
        gain2.gain.setValueAtTime(0, audioCtx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.01);
        gain2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 700);
      
      return; // Exit if successful
    } catch (audioError) {
      logMessage(`Web Audio oscillator error: ${audioError}`, "skip");
      // Continue to fallback methods
    }
    
    // If Web Audio API fails, try using a very simple beep via data URI
    try {
      // This is a very small, simple WAV file encoded as data URI
      const snd = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT18A");
      snd.volume = 1.0;
      snd.play().catch(e => {
        logMessage(`Simple WAV failed: ${e}`, "skip");
      });
    } catch (simpleAudioError) {
      logMessage(`Simple audio error: ${simpleAudioError}`, "skip");
    }
    
    // Always use visual notifications as backup
    useVisualNotifications();
    
  } catch (error) {
    logMessage(`Sound notification system error: ${error}`, "skip");
    useVisualNotifications();
  }
  
  // Visual notification methods (always run these)
  function useVisualNotifications() {
    try {
      // Try vibration API if available
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
        logMessage("Used device vibration as notification", "info");
      }
      
      // Visual notification by flashing the title
      const originalTitle = document.title;
      const notifyTitle = "🔔 TARGET COUNTRY FOUND!";
      
      // Flash the title
      const titleInterval = setInterval(() => {
        document.title = document.title === originalTitle ? 
          notifyTitle : originalTitle;
      }, 800);
      
      // Stop flashing after 10 seconds
      setTimeout(() => {
        clearInterval(titleInterval);
        document.title = originalTitle;
      }, 10000);
      
      // Alert in console with large, visible message
      console.log("%c TARGET COUNTRY FOUND! ", 
                  "background: #ff0000; color: #ffffff; font-size: 24px; font-weight: bold;");
                  
      // Try to create a more noticeable visual effect on the page
      try {
        // Create a flashing notification overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '15px';
        overlay.style.borderRadius = '5px';
        overlay.style.zIndex = '9999';
        overlay.style.fontWeight = 'bold';
        overlay.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        overlay.textContent = '⚠️ TARGET COUNTRY FOUND!';
        
        document.body.appendChild(overlay);
        
        // Flash the overlay
        let visible = true;
        const flashInterval = setInterval(() => {
          visible = !visible;
          overlay.style.display = visible ? 'block' : 'none';
        }, 500);
        
        // Remove after 10 seconds
        setTimeout(() => {
          clearInterval(flashInterval);
          if (overlay.parentNode) {
            document.body.removeChild(overlay);
          }
        }, 10000);
      } catch (overlayError) {
        logMessage(`Overlay notification error: ${overlayError}`, "skip");
      }
    } catch (fallbackError) {
      logMessage(`Visual notification error: ${fallbackError}`, "skip");
    }
  }
}

// Function to handle new chat messages
function handleNewMessage(message) {
  if (!isRunning) return;
  
  const messageText = message.textContent || '';
  
  if (isTargetCountry(messageText)) {
    console.log('Target country found in message:', messageText);
    playNotificationSound();
    // Additional handling for target country messages
  }
}