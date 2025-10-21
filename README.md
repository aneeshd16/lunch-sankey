# Lunch Sankey

Generate beautiful Sankey diagrams from your [Lunch Money](https://lunchmoney.app) transaction data to visualize your financial flows.

Access the website here: https://lunch-sankey.vercel.app/

## About

Lunch Sankey is a web application that transforms your Lunch Money transaction data into intuitive Sankey diagrams, helping you better understand your money flow patterns. The application runs entirely in your browser, ensuring your financial data remains private and secure.

## Features

- **Privacy-First**: All data processing happens in your browser - no server storage
- **Interactive Visualization**: Dynamic Sankey diagrams powered by Google Charts
- **Date Range Selection**: Filter transactions by custom date ranges
- **Export Capability**: Download diagrams for external use

## Getting Started

### Prerequisites

You'll need a [Lunch Money](https://lunchmoney.app) account and an API access token to use this application.

### How to Get Your Access Token

1. Log in to your Lunch Money account
2. Navigate to [Settings > Developer Settings](https://my.lunchmoney.app/developers)
3. Under "New Access Token", click "Request new access token"
4. Copy the generated Access Token

### Usage

1. Visit the [Lunch Sankey website](https://lunch-sankey.vercel.app/)
2. Paste your Lunch Money access token in the input field
3. Click "Generate Diagram"
4. Use the date range picker to filter transactions
5. Click "Refresh Diagram" to update the visualization
6. Use "Download" to save the diagram

## Technical Details

### Built With

- HTML/CSS/JavaScript
- [Tailwind CSS](https://tailwindcss.com) - For styling
- [Google Charts](https://developers.google.com/chart) - For Sankey diagram visualization
- [Flowbite](https://flowbite.com) - For the date range picker component

### Security

- No server-side storage of access tokens or transaction data
- All processing occurs client-side
- Unminified source code for transparency

## Development

### Local Setup

1. Clone the repository
```bash
git clone https://github.com/aneeshd16/lunch-sankey.git
cd lunch-sankey
```

2. Install dependencies
```bash
npm install
```

3. Start the watch process
```bash
npm run watch
```

4. Open `src/index.html` directly in your browser.

5. After making changes, simply reload the tab.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [Lunch Money](https://lunchmoney.app) for providing the API
- The open source community for the tools and libraries used in this project

## Author

Aneesh Devasthale - [Website](https://aneesh.xyz)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/aneeshd16/lunch-sankey/issues) on GitHub.
