# Pathing.cc

A privacy-first web analytics platform that helps you understand user journeys without sacrificing user privacy. No popups, no tracking pixels, just clarity.

## Features

- **1-line install**: Simple JavaScript snippet to add to your website
- **User journey visualization**: See how users navigate through your site
- **Domain verification**: Secure analytics for verified domains only
- **Real-time analytics**: Monitor traffic as it happens

## Getting Started

1. Create an account at [pathing.cc](https://pathing.cc)
2. Get an API key from the dashboard
3. Add the JavaScript snippet to your website:

```html
<script src="https://pathing.cc/pathing.js" pathing-api-key="YOUR_API_KEY"></script>
```

Page views are tracked automatically. Track custom events with:

```javascript
window.pathing.track("event_name", { 
  property1: "value1",
  property2: "value2"
});
```

### Viewing Analytics

1. Log in to your Pathing dashboard
2. Select a domain to view its analytics
3. Explore user journeys, page views, and custom events

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- Supabase (Auth & Database)
- Recharts (Data visualization)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
