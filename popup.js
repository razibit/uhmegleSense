document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-bot');
  const stopButton = document.getElementById('stop-bot');
  const botStatus = document.getElementById('bot-status');
  const logContainer = document.getElementById('log');
  const countrySelect = document.getElementById('country-select');
  const addCountryButton = document.getElementById('add-country');
  const selectedCountriesContainer = document.getElementById('selected-countries');
  const greetingInput = document.getElementById('greeting-text');
  const saveGreetingButton = document.getElementById('save-greeting');
  const continuousModeCheckbox = document.getElementById('continuous-mode');
  
  // Selected countries array
  let selectedCountries = [];
  // Default greeting message
  let greetingMessage = 'Hi';
  // Continuous mode setting
  let continuousMode = false;

  // List of all countries
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 
    'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bhutan', 
    'Bolivia', 'Brazil', 'Brunei', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'China', 'Colombia', 
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Ethiopia', 
    'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 
    'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Laos', 
    'Latvia', 'Lebanon', 'Libya', 'Malaysia', 'Maldives', 'Mexico', 'Mongolia', 'Morocco', 
    'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'North Korea', 'Norway', 'Oman', 
    'Pakistan', 'Palestine', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 
    'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 
    'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 
    'United Kingdom', 'United States', 'Vietnam', 'Yemen'
  ];

  // Populate the country select dropdown
  function populateCountryDropdown() {
    // Clear existing options
    countrySelect.innerHTML = '';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a country...';
    countrySelect.appendChild(defaultOption);
    
    // Add all countries to the dropdown
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.toLowerCase();
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  }

  // Update UI based on bot's running status
  function updateBotStatus(isRunning) {
    if (isRunning) {
      botStatus.textContent = 'Running';
      botStatus.style.color = '#4caf50';
      startButton.disabled = true;
      stopButton.disabled = false;
    } else {
      botStatus.textContent = 'Stopped';
      botStatus.style.color = '#f44336';
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  }

  // Add log entry to the popup
  function addLogEntry(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
  
  // Save greeting message to storage
  function saveGreeting() {
    const message = greetingInput.value.trim();
    if (message) {
      greetingMessage = message;
      chrome.storage.local.set({ greetingMessage: message }, () => {
        addLogEntry(`Greeting message saved: "${message}"`, 'success');
        
        // Update active bot if running
        if (botStatus.textContent === 'Running') {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url.includes('uhmegle.com')) {
              chrome.tabs.sendMessage(tabs[0].id, { 
                action: 'UPDATE_GREETING',
                greetingMessage: message
              });
            }
          });
        }
      });
    } else {
      greetingInput.value = greetingMessage; // Reset to previous value
      addLogEntry('Greeting message cannot be empty', 'skip');
    }
  }
  
  // Toggle continuous mode
  function toggleContinuousMode() {
    continuousMode = continuousModeCheckbox.checked;
    chrome.storage.local.set({ continuousMode }, () => {
      addLogEntry(`Continuous mode ${continuousMode ? 'enabled' : 'disabled'}`, 'info');
      
      // Update active bot if running
      if (botStatus.textContent === 'Running') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url.includes('uhmegle.com')) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'UPDATE_CONTINUOUS_MODE',
              continuousMode: continuousMode
            });
          }
        });
      }
    });
  }
  
  // Render selected countries as tags
  function renderSelectedCountries() {
    selectedCountriesContainer.innerHTML = '';
    
    if (selectedCountries.length === 0) {
      const emptyMessage = document.createElement('span');
      emptyMessage.textContent = 'No countries selected. Bot will skip all users.';
      emptyMessage.style.fontSize = '12px';
      emptyMessage.style.color = '#666';
      selectedCountriesContainer.appendChild(emptyMessage);
      return;
    }
    
    selectedCountries.forEach(country => {
      const countryTag = document.createElement('div');
      countryTag.className = 'country-tag';
      
      const countryName = document.createElement('span');
      countryName.textContent = country.charAt(0).toUpperCase() + country.slice(1); // Capitalize country name
      
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-country';
      removeButton.textContent = '×';
      removeButton.addEventListener('click', () => {
        removeCountry(country);
      });
      
      countryTag.appendChild(countryName);
      countryTag.appendChild(removeButton);
      selectedCountriesContainer.appendChild(countryTag);
    });
    
    // Save to storage
    chrome.storage.local.set({ targetCountries: selectedCountries });
  }
  
  // Add a country to the selected list
  function addCountry() {
    const country = countrySelect.value.trim().toLowerCase();
    if (!country) return;
    
    if (!selectedCountries.includes(country)) {
      selectedCountries.push(country);
      renderSelectedCountries();
      addLogEntry(`Added ${country} to target countries`, 'info');
    }
    
    countrySelect.value = ''; // Reset select
  }
  
  // Remove a country from the selected list
  function removeCountry(country) {
    selectedCountries = selectedCountries.filter(c => c !== country);
    renderSelectedCountries();
    addLogEntry(`Removed ${country} from target countries`, 'info');
  }

  // Initialize the country dropdown
  populateCountryDropdown();

  // Check current bot status and load saved settings
  chrome.storage.local.get(['botRunning', 'targetCountries', 'greetingMessage', 'continuousMode'], (result) => {
    updateBotStatus(result.botRunning === true);
    
    // Load saved countries
    if (result.targetCountries && Array.isArray(result.targetCountries)) {
      selectedCountries = result.targetCountries;
      renderSelectedCountries();
    } else {
      // Default to Bangladesh if no countries are set
      selectedCountries = ['bangladesh'];
      renderSelectedCountries();
    }
    
    // Load saved greeting message
    if (result.greetingMessage) {
      greetingMessage = result.greetingMessage;
      greetingInput.value = greetingMessage;
    }
    
    // Load continuous mode setting
    if (result.continuousMode !== undefined) {
      continuousMode = result.continuousMode;
      continuousModeCheckbox.checked = continuousMode;
    }
  });

  // Get and display log history
  chrome.storage.local.get(['botLogs'], (result) => {
    if (result.botLogs && result.botLogs.length > 0) {
      result.botLogs.forEach(log => {
        addLogEntry(log.message, log.type);
      });
    }
  });
  
  // Add country button click handler
  addCountryButton.addEventListener('click', addCountry);
  
  // Also add country on Enter key in select
  countrySelect.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addCountry();
      e.preventDefault();
    }
  });
  
  // Save greeting button click handler
  saveGreetingButton.addEventListener('click', saveGreeting);
  
  // Also save on Enter key in greeting input
  greetingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveGreeting();
      e.preventDefault();
    }
  });
  
  // Continuous mode checkbox handler
  continuousModeCheckbox.addEventListener('change', toggleContinuousMode);

  // Start bot button click handler
  startButton.addEventListener('click', () => {
    // Only start if there are selected countries
    if (selectedCountries.length === 0) {
      addLogEntry('Please select at least one target country first', 'skip');
      return;
    }
    
    chrome.storage.local.set({ botRunning: true }, () => {
      updateBotStatus(true);
      addLogEntry('Bot started', 'info');
      
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('uhmegle.com')) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'START_BOT',
            targetCountries: selectedCountries,
            greetingMessage: greetingMessage,
            continuousMode: continuousMode
          });
        } else {
          addLogEntry('Please navigate to uhmegle.com first', 'skip');
        }
      });
    });
  });

  // Stop bot button click handler
  stopButton.addEventListener('click', () => {
    chrome.storage.local.set({ botRunning: false }, () => {
      updateBotStatus(false);
      addLogEntry('Bot stopped', 'info');
      
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('uhmegle.com')) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'STOP_BOT' });
        }
      });
    });
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'LOG') {
      addLogEntry(message.message, message.type || 'info');
      
      // Store logs for persistence
      chrome.storage.local.get(['botLogs'], (result) => {
        const logs = result.botLogs || [];
        logs.push({
          message: message.message,
          type: message.type || 'info',
          timestamp: Date.now()
        });
        
        // Keep only last 100 logs
        if (logs.length > 100) {
          logs.shift();
        }
        
        chrome.storage.local.set({ botLogs: logs });
      });
    } else if (message.action === 'UPDATE_STATUS') {
      updateBotStatus(message.isRunning);
    }
  });
});