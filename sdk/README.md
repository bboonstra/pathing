# Pathing.js SDK

Pathing.js is a lightweight analytics tracking library that helps you understand user behavior in your application without compromising privacy.

## Features

- Predefined events (e.g. `pathing.send.purchase({...})`)
- Dynamic element binding (e.g. `pathing.link.purchase(element, {...})`)
- Raw fallback API (`pathing.send.raw(...)`, `pathing.link.raw(...)`)
- Parameter wrapper support (`Parameter(label, key, value)`)
- Automatic pageview tracking
- Enhanced device and browser fingerprinting
- Session and user tracking across visits
- Performance and network data collection
- Scroll depth and engagement metrics

## Installation

### Option 1: Script Tag (Browser)

Add the following script tag before the closing `</body>` tag:

```html
<script src="https://www.pathing.cc/pathing.js" pathing-api-key="YOUR_API_KEY"></script>
```

### Option 2: NPM Package

Install the package:

```bash
npm install pathingjs
```

Then import and initialize in your application:

```js
// ESM import (recommended)
import { pathing } from 'pathingjs';

// Initialize with your API key
pathing.init('pk_[YOUR_API_KEY]');

// Or using default import
import pathing from 'pathingjs';
pathing.init('pk_[YOUR_API_KEY]');
```

## Usage

When loaded via script tag, the `pathing` object is now available globally as `window.pathing` (or just `pathing` in browser context).

### Tracking Events

#### Button Click

```js
// Track a button click
pathing.send.button({
  buttonId: "signup-button",
  location: "homepage",
  action: "signup_click"
});
```

#### Playback Event

```js
// Track a video or audio playback
pathing.send.playback({
  contentId: "video-123",
  timestamp: 42, // seconds into playback
  duration: 300, // total duration in seconds
  title: "How to Use Pathing.js"
});
```

#### Purchase Event

```js
// Track a purchase
pathing.send.purchase({
  product: "premium-plan",
  price: 49.99,
  currency: "USD",
  quantity: 1
});
```

#### Custom Event

```js
// Track any custom event
pathing.send.raw("form_submission", {
  formId: "contact-form",
  timeToComplete: 45, // seconds
  completed: true
});
```

### Automatically Track DOM Elements

#### Link Buttons

```js
// Automatically track when a button is clicked
const button = document.getElementById('signup-button');
pathing.link.button(button, {
  location: "homepage",
  action: "signup_click"
});
```

#### Link Playback

```js
// Automatically track when a play button is clicked
const playButton = document.getElementById('play-button');
pathing.link.playback(playButton, {
  contentId: "video-123",
  timestamp: 0,
  title: "Getting Started"
});
```

#### Link Purchase

```js
// Automatically track when a buy button is clicked
const buyButton = document.getElementById('buy-button');
pathing.link.purchase(buyButton, {
  product: "premium-plan",
  price: 49.99,
  currency: "USD"
});
```

## Tracked Data

The latest version of Pathing.js automatically collects a comprehensive set of data with each event:

### Device Information

- Browser details (user agent, language, screen dimensions)
- Device type and capabilities
- Platform and operating system information
- Connection speed and network type
- Browser fingerprint for cross-session tracking

### Session Information

- Session ID and duration
- First and last seen timestamps
- Page entry points and navigation paths
- Referrer information
- Visit count and frequency

### Engagement Metrics

- Time on page and scroll depth
- Tab visibility and focus tracking
- Page exit events with engagement data
- Element interactions (clicks, hovers)

### Performance Data

- Page load time and render metrics
- Navigation timing data
- Memory usage statistics
- Resource loading performance

## React Example

```jsx
import React, { useRef, useEffect } from 'react';
import { pathing } from 'pathingjs';

function SignupButton() {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (buttonRef.current) {
      pathing.link.button(buttonRef.current, {
        location: "pricing-page",
        action: "signup_click",
        buttonId: "premium-signup"
      });
    }
  }, [buttonRef]);
  
  return (
    <button ref={buttonRef} className="signup-button">
      Sign Up Now
    </button>
  );
}
```

## TypeScript Support

This library includes TypeScript definitions. You can import types directly:

```ts
import { pathing, ButtonData, EventResponse } from 'pathingjs';

// Initialize with your API key
pathing.init('pk_[YOUR_API_KEY]');

function trackButtonClick(data: ButtonData): Promise<EventResponse> {
  return pathing.send.button(data);
}
```

## API Reference

See [full documentation](https://pathing.cc/docs) for detailed API reference.

## License

MIT
