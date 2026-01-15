# Mind Map Data Model (v1)

## Overview
- Single root node per mind map
- Flat array of nodes for easier serialization/deserialization
- Versioned schema for forward compatibility
- Extensible via optional `extra` fields
- Supports future feature additions

## JSON Structure (.mind file format)

```json
{
  "version": "1",
  "metadata": {
    "title": "My Mind Map",
    "author": "John Doe",
    "created": "2023-10-15T10:30:00Z",
    "modified": "2023-10-15T14:45:00Z",
    "description": "Project brainstorming",
    "tags": ["work", "planning"],
    "extra": {}
  },
  "nodes": [
    {
      "id": "node-1",
      "parentId": null,
      "text": "Main Topic",
      "type": "root",
      "position": { "x": 0, "y": 0 },
      "style": {
        "color": "#000000",
        "backgroundColor": "#ffffff",
        "fontSize": 16,
        "fontWeight": "bold"
      },
      "collapsed": false,
      "extra": {}
    },
    {
      "id": "node-2",
      "parentId": "node-1",
      "text": "Subtopic 1",
      "type": "topic",
      "position": { "x": 200, "y": -100 },
      "style": {
        "color": "#333333",
        "backgroundColor": "#f0f0f0",
        "fontSize": 14,
        "fontWeight": "normal"
      },
      "collapsed": false,
      "extra": {}
    },
    {
      "id": "node-3",
      "parentId": "node-1",
      "text": "Subtopic 2",
      "type": "topic",
      "position": { "x": 200, "y": 100 },
      "style": {
        "color": "#333333",
        "backgroundColor": "#f0f0f0",
        "fontSize": 14,
        "fontWeight": "normal"
      },
      "collapsed": false,
      "extra": {}
    }
  ]
}
```

## Node Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier (UUID recommended) |
| `parentId` | string \| null | ✓ | ID of parent node (`null` for root) |
| `text` | string | ✓ | Node content text |
| `type` | string | ✓ | Node type (`root` or `topic`) |
| `position` | object | ✓ | `{x: number, y: number}` coordinates |
| `style` | object | ✓ | Visual styling properties |
| `collapsed` | boolean | ✓ | Whether child nodes are hidden |
| `extra` | object | ✗ | Future-proofing extension point |

## Metadata Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | ✓ | Mind map title |
| `author` | string | ✗ | Creator name |
| `created` | string | ✓ | ISO 8601 creation timestamp |
| `modified` | string | ✓ | ISO 8601 last modification timestamp |
| `description` | string | ✗ | Optional description |
| `tags` | array | ✗ | Array of string tags |
| `extra` | object | ✗ | Future-proofing extension point |

## Design Notes
- **Flat structure**: All nodes stored in a single array, with parent-child relationships defined by `parentId`
- **Versioning**: Top-level `version` field enables backward/forward compatibility
- **Extensibility**: `extra` fields in both nodes and metadata allow adding new features without breaking existing implementations
- **Root identification**: Root node has `parentId: null` and `type: "root"`
- **Serialization**: Optimized for JSON but can be easily converted to XML if needed
