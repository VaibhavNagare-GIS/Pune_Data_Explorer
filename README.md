# Pune Land Dynamics Atlas

A satellite based web atlas that tracks how Pune has changed since 1989, using free Landsat and Sentinel 2 imagery processed in Google Earth Engine.

<p align="left">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-black?style=flat-square">
  <img alt="Made with HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="Made with CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img alt="Made with JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="Google Earth Engine" src="https://img.shields.io/badge/Google%20Earth%20Engine-4285F4?style=flat-square&logo=googleearth&logoColor=white">
  <img alt="Chart.js" src="https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white">
</p>

<p align="left">
  <a href="https://vaibhavnagare-gis.github.io/Pune_Data_Explorer/" target="_blank">
    <img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-View%20the%20Atlas-red?style=for-the-badge&logo=googlechrome&logoColor=white">
  </a>
</p>

## About

Pune Land Dynamics Atlas is a single page web app that puts 37 years of satellite data about Pune in one place. It combines a live Google Earth Engine map of current conditions with a historical archive of yearly Landsat imagery, animated timelapse videos, and interactive charts, so the story of the city's growth is easy to read even for someone who has never worked with satellite data before.

The atlas tracks three indices calculated from satellite imagery every year from 1989 to 2025:

- **NDVI** (Normalized Difference Vegetation Index): how much healthy plant growth is present
- **MNDWI** (Modified Normalized Difference Water Index): how much open water is present
- **NDBI** (Normalized Difference Built-up Index): how much built-up, hard surface area is present

## Live Demo

**[vaibhavnagare-gis.github.io/Pune_Data_Explorer](https://vaibhavnagare-gis.github.io/Pune_Data_Explorer/)**

The live demo also embeds the [Google Earth Engine app](https://vaibhav-gee.projects.earthengine.app/view/pune-data-explorer) directly, which shows current Sentinel 2 and Landsat 9 conditions over Pune.

## Features

- Live embedded Google Earth Engine map showing current satellite conditions over Pune
- A plain language guide explaining what NDVI, MNDWI, and NDBI actually measure
- A year by year historical Landsat archive from 1989 to 2025
- Animated timelapse videos for each index across the full study period
- A first year versus latest year comparison for each index, with the actual percent change
- An interactive annual means chart built with Chart.js, with trend lines for each index
- Fully responsive layout with no build step or framework required

## Tech Stack

| Layer | Tools |
|---|---|
| Structure and styling | HTML5, CSS3 |
| Interactivity | Vanilla JavaScript |
| Charting | [Chart.js](https://www.chartjs.org/) |
| CSV parsing | [PapaParse](https://www.papaparse.com/) |
| Satellite processing | [Google Earth Engine](https://earthengine.google.com/) |
| Imagery sources | Sentinel 2 Harmonized Surface Reflectance, Landsat |
| Fonts | IBM Plex Mono, IBM Plex Sans, Space Grotesk (Google Fonts) |
| Hosting | GitHub Pages |

## Data Sources

- [Sentinel 2 Harmonized Surface Reflectance](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED) (Copernicus)
- [Landsat catalog](https://developers.google.com/earth-engine/datasets/catalog/landsat) (USGS)
- Annual index values are provided in [`data/Pune_Landsat_Annual_NDVI_MNDWI_NDBI_1989_2025.csv`](data/Pune_Landsat_Annual_NDVI_MNDWI_NDBI_1989_2025.csv), one row per year from 1989 to 2025, with the yearly mean NDVI, MNDWI, and NDBI value and the number of satellite images used for that year.

## Repository Structure

```
Pune_Data_Explorer/
├── index.html            Main page markup
├── styles.css             Core layout and design system
├── enhancements.css       Additional styling and refinements
├── script.js              Data loading, chart rendering, tab logic
├── enhancements.js        Supporting interactive behaviour
├── data/
│   └── Pune_Landsat_Annual_NDVI_MNDWI_NDBI_1989_2025.csv
├── assets/
│   ├── Pune_NDVI_Animation_1989_2025.mp4
│   ├── Pune_MNDWI_Animation_1989_2025.mp4
│   └── Pune_NDBI_Animation_1989_2025.mp4
├── LICENSE
└── README.md
```

## Running Locally

This is a static site, but the page loads the CSV data with `fetch`, which most browsers block when a file is opened directly from disk. Serve the folder with any local web server instead.

```bash
git clone https://github.com/VaibhavNagare-GIS/Pune_Data_Explorer.git
cd Pune_Data_Explorer
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## License

This project is licensed under the [MIT License](LICENSE).

## Connect

<p align="left">
  <a href="https://www.linkedin.com/in/vaibhav-nagare-gis" target="_blank">
    <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white">
  </a>
  <a href="https://github.com/VaibhavNagare-GIS" target="_blank">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

Made by Vaibhav Shivaji Nagare, a geoinformatics student, with thirty-six years of satellites doing the hard work.
