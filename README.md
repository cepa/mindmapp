# MindMapp

An intuitive mind mapping application for organizing thoughts, brainstorming ideas, and creating visual representations of your concepts.

Try out MindMapp here: [https://mindm.app](https://mindm.app)

![](app/public/ogimage.jpg)

MindMapp was created by AI. Less than 1% of the code was written by human being.

## Features

- **Drag & Drop Interface**: Easily create, move, and organize nodes
- **Touch Support**: Full mobile device compatibility
- **Keyboard Shortcuts**: Quick access to all major functions
- **Import/Export**: Save and load mind maps as .mind files
- **Undo/Redo**: Full history support with up to 50 actions
- **Zoom & Pan**: Navigate large mind maps with ease
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Angular CLI

### Installation
```bash
cd app
npm install
```

### Development Server
```bash
npm start
```
Open `http://localhost:4200` in your browser.

### Build for Production
```bash
npm run build
```

## Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```
Access the application at `http://localhost:8080`

### Manual Docker Build
```bash
docker build -t mindmapp .
docker run -p 8080:8080 mindmapp
```

## Project Structure

```
rnd-mindmapp/
├── app/                  # Angular application source
│   ├── src/
│   │   ├── app/          # Application components and services
│   │   │   ├── components/  # UI components (MindMap, Navbar, HelpModal)
│   │   │   └── services/    # Application services (AppState, FileService)
├── Dockerfile            # Production build configuration
├── docker-compose.yml    # Docker Compose setup
├── demo.mind             # Example mind map file
└── MINDFILE.md           # Data model specification
```

## Usage

### Basic Operations
- **Create nodes**: Click "Add" button or press `+`
- **Edit nodes**: Double-click any node to edit text
- **Move nodes**: Click and drag nodes to reposition
- **Delete nodes**: Select a node and click "Del" or press `-`

### Navigation
- **Zoom**: Mouse wheel or pinch gesture
- **Pan**: Click and drag on empty space

## Keyboard Shortcuts

| Action          | Windows/Linux       | Mac                |
|-----------------|---------------------|--------------------|
| Add child node  | `+` or `=`          | `+` or `=`         |
| Delete node     | `-` or `_`          | `-` or `_`         |
| Undo            | `Ctrl+Z`            | `Cmd+Z`            |
| Redo            | `Ctrl+Y`            | `Cmd+Shift+Z`      |
| Save            | `Ctrl+S`            | `Cmd+S`            |
| Load            | `Ctrl+O`            | `Cmd+O`            |

## Data Format

MindMapp uses a versioned JSON format (.mind files) for storing mind maps:

```json
{
  "version": "1",
  "metadata": {
    "title": "My Mind Map",
    "created": "2023-10-15T10:30:00Z",
    "modified": "2023-10-15T14:45:00Z"
  },
  "nodes": [
    {
      "id": "node-1",
      "parentId": null,
      "text": "Main Topic",
      "type": "root",
      "position": { "x": 0, "y": 0 }
    }
  ]
}
```

See [MINDFILE.md](MINDFILE.md) for complete specification.

## Import/Export

### Export
1. Click the "Save" button in the navbar
2. A .mind file will be downloaded

### Import
1. Click the "Load" button in the navbar
2. Select a .mind file to import

## Development

### Running Tests
```bash
cd app
npm test
```

### Building for Mobile
The project includes Capacitor configuration for Android and iOS builds.

## Documentation

- [MINDFILE.md](MINDFILE.md) - Data model specification
- [VIBE.md](VIBE.md) - Development notes and requirements

## Links

- **Website**: [https://mindm.app](https://mindm.app)
- **GitHub**: [https://github.com/cepa/mindmapp](https://github.com/cepa/mindmapp)

## License

MIT
