# NASA APOD Wallpaper Updater

[![Node.js](https://img.shields.io/badge/Node.js-18+-success?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ESNext-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-blue)](https://opensource.org/licenses/ISC)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Manual Execution](#manual-execution)
  - [Automated Scheduling (Recommended)](#automated-scheduling-recommended)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [License](#license)

## Introduction

The **NASA APOD Wallpaper Updater** is a light-weight, automated tool designed to keep your desktop background fresh and inspiring with the latest Astronomy Picture of the Day (APOD) from NASA. This utility fetches high-definition astronomical images directly from the official NASA APOD Basic API and automatically sets them as your operating system's wallpaper, offering a new glimpse into the cosmos daily.

## Features

*   **Automated Content Retrieval:** Fetches the most recent APOD image from `science.nasa.gov` without manual intervention.
*   **High-Resolution Support:** Prioritizes the `hdurl` (High-Definition URL) for the best possible image quality.
*   **Intelligent Media Handling:** Gracefully skips updates if today's APOD is a video or another non-image media type, logging the reason.
*   **Local Wallpaper Management:** Downloads images to a dedicated, automatically created directory (`~/Pictures/NASA_APOD`) and cleans up previous downloads to maintain disk space.
*   **Cross-Platform Compatibility:** Leverages the `wallpaper` npm package to support setting wallpapers on Windows, macOS, and Linux.
*   **Robust Error Handling:** Implements comprehensive `try-catch` blocks to manage network failures, API errors, and file system issues, logging details to the console and a `run.log` file for scheduled tasks.

## How It Works

Upon execution, the script performs the following sequence of operations:

1.  **API Request:** Initiates an asynchronous `fetch` request to the NASA APOD Basic API endpoint (`https://science.nasa.gov/wp-json/wp/v2/apod-basic`).
2.  **Response Parsing:** Processes the JSON response, extracting key details such as the image title, date, explanation, and crucially, the `hdurl` for high-resolution images.
3.  **Media Type Validation:** Checks if the APOD is an actual image. If the `media_type` is anything other than `'image'` (e.g., `'video'`), the script logs this and exits, preserving the current wallpaper.
4.  **Image Download:** If a valid image `hdurl` is found, the script downloads the image file to memory.
5.  **Directory Management:** Ensures the target wallpaper directory (`~/Pictures/NASA_APOD`) exists. It then clears out any previously downloaded APOD images from this directory to prevent clutter.
6.  **File Storage:** Saves the newly downloaded image to the designated directory, naming it `nasa_apod.<extension>`.
7.  **Wallpaper Update:** Utilizes the `wallpaper` library to set the newly saved image as the desktop background.
8.  **Logging & Error Reporting:** Provides console output for successful operations and detailed error messages for any issues encountered during the process. For scheduled runs, these logs are typically redirected to `run.log`.

## Prerequisites

Ensure you have the following installed on your system:

*   **Node.js**: Version 18.x or higher. This project uses modern JavaScript features and Node.js APIs (e.g., `AbortSignal.timeout`, `node:` protocol imports) that require a recent Node.js version.
*   **npm** (Node Package Manager) or **Yarn**: Used for installing project dependencies.

## Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/wallpaper.git
    cd wallpaper
    ```
    *(Note: Replace `your-username/wallpaper.git` with the actual repository URL if available, otherwise assume `wallpaper` is the project name based on `package.json`.)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Build the TypeScript project:**
    ```bash
    npm run build
    ```
    This command compiles the TypeScript source code from the `src/` directory into executable JavaScript files located in the `dist/` directory.

## Usage

### Manual Execution

To run the script once and update your wallpaper immediately:

```bash
npm start
# Alternatively, you can run the compiled JavaScript directly:
# node dist/index.js
```

### Automated Scheduling (Recommended)

For a seamless experience, it is highly recommended to schedule this script to run daily using your operating system's task scheduler. This ensures your wallpaper is consistently updated without manual intervention.

#### Windows

You can use the provided `run-silent.vbs` script in conjunction with Windows Task Scheduler to run the wallpaper updater silently in the background.

1.  **Open Task Scheduler:** Search for "Task Scheduler" in the Windows Start Menu.
2.  **Create Basic Task:**
    *   Click "Create Basic Task..." in the Actions pane.
    *   Give it a name (e.g., "Daily NASA APOD Wallpaper").
    *   Set the trigger to "Daily" and choose your preferred time (e.g., 9:00 AM).
    *   For the action, select "Start a program".
    *   **Program/script:** `wscript.exe`
    *   **Add arguments (optional):** `run-silent.vbs`
    *   **Start in (optional):** Navigate to your project's root directory (e.g., `C:\Path\To\Your\wallpaper`).
3.  **Review and Finish:** Confirm your settings and create the task.

The `run-silent.vbs` script will execute `npm start` (which runs `node dist/index.js`) and redirect its output to `run.log` in the project root, allowing you to review execution logs.

#### macOS / Linux

Use `cron` to schedule the script to run at a specific time daily.

1.  **Open your crontab for editing:**
    ```bash
    crontab -e
    ```
2.  **Add a new line** to schedule the script. For example, to run it daily at 9:00 AM:
    ```cron
    0 9 * * * /usr/local/bin/node /path/to/your/wallpaper/dist/index.js >> /path/to/your/wallpaper/run.log 2>&1
    ```
    *   **Important:** Replace `/path/to/your/wallpaper` with the actual absolute path to your project directory.
    *   Replace `/usr/local/bin/node` with the correct path to your Node.js executable (you can find it using `which node`).
    *   The `>> run.log 2>&1` part redirects both standard output and standard error to `run.log` for logging.

## Project Structure

```
.
├── package.json           # Defines project metadata, scripts, and dependencies.
├── tsconfig.json          # TypeScript compiler configuration, specifying how source files are compiled.
├── src/
│   └── index.ts           # The main application logic: fetches APOD, downloads, and sets wallpaper.
├── dist/                  # Output directory for compiled JavaScript files.
│   ├── index.js           # The compiled main application script.
│   ├── index.d.ts         # TypeScript declaration file for `index.js`.
│   └── index.js.map       # Source map for debugging `index.js`.
├── run-silent.vbs         # A Windows Script Host (WSH) file to execute the `npm start` command silently.
└── run.log                # Log file where the output of scheduled runs is redirected for review.
```

## Dependencies

*   [`wallpaper`](https://www.npmjs.com/package/wallpaper): A cross-platform library used to programmatically set the desktop background.
*   [`typescript`](https://www.npmjs.com/package/typescript): The TypeScript language compiler, used for developing the application with strong typing.
*   [`@types/node`](https://www.npmjs.com/package/@types/node): Type definitions for Node.js, enabling type-safe Node.js development in TypeScript.

## License

This project is licensed under the **ISC License**.