Write me a simple mindmap application in single html file including html, css, javascript.

You are a software architect working on a new Mind Map application working in a desktop browser or mobile webview:
- create a data model for storing nodes including its properties
- assume a mindmap has only one root node
- the data model must be easy to serialize to JSON or to XML
- user will export/import data model to a JSON based .mind file
- create JSON structure to import/export data model
- assume the JSON structure in the .mind files can change in time when software will be extended and new features added
- the structure must be versioned, this is v1
- add optional "extra" field to nodes for future proofing
- add metadata about mindmap 
- keep the tree structure flat, easier to load/save flat data, nodes are kept as a flat array in the app code
- write simple markdown output

You are an expert Angular developer working on the MindMap app:
- analyze the mindmap-glm47-v1.html mockup
- create MindMapComponent scaffold
- the component renders at full width and height of the App
- use the background style from the mockup (grey with dots)
- make sure project builds, run: ng build
- dont create node logic or buttons

You are an expert Angular developer working on the MindMap app:
- analyze the mindmap-glm47-v1.html mockup
- analyze the mindmap-gptoss-v1.html mockup
- create data model for storing nodes
- create single root node, display it in the center of the screen
- each node must be dragable
- implement node drag logic
- make sure project builds, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- Create a help button component that shows a circular button in the bottom left corner with the '?' icon
- Display a help modal component using NgbModal in the center screen with a help lorem ipsum content when the help button component is clicked.
- Prefer to use bootstrap5 over custom UI elements
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze the mindmap-glm47-v1.html mockup
- create a flowing navbar displayed at the bottom of the view
- the navbar must have following buttons: add child node, delete selected node, download, upload, help
- dont implement button logic
- navbar must scale to full width on mobile devices, display icons only
- navbar must scale to floating positioned in the center on large screens (over 768px width), display icons with text on the right
- Prefer to use bootstrap5 over custom UI elements
- Build the project and make sure it works, run: ng build
- Remove help button, use the help button in the navbar to trigger display of the help modal

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze the mindmap-glm47-v1.html mockup
- analyze the mindmap-gptoss-v1.html mockup
- create the "add child node" logic, when user clicks the add node button in the navbar a new child node to the selected node should be created, if no node is selected a child to root node is created
- create the "delete selected node" logic, when user clicks the delete selected node button in the navbar the selected node is removed, user can't remove the root node
- connect nodes using bezier curve
- make sure selected node is dragable by mouse movement and touch movement (mobile devices!)
- Build the project and make sure it works, run: ng build
- Enable add child node button
- Enable delete selected node button
- The add child button is still disabled, fix it
- Fix the delete button, does not remove selected node
- The deleted node is still visible after being removed by click in the delete button
- Show the new child node at some random position around the parent node. Preffer empty space if possible / easy to calculate.

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- create components directory
- move existing components to components directory
- implement simple state management for the whole app (AppState)
- move nodes data from MindMapComponent to AppState
- create services/LocalStorageService and save each change of the nodes to local storage so when the app is refreshed the last state is loaded and nodes are rendered
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze the mindmap-glm47-v1.html mockup- 
- analyze the mindmap-gptoss-v1.html mockup
- implement node title edit logic
- one click or tap selects the node
- double click or double tap allows to edit the node title
- Build the project and make sure it works, run: ng build
- Fix the node editor, the double click changes the size of the node box but changing node title with keyboard does not work, input issue?
- Node editing still does not work
- analyze @/mockups/mindmap-glm47-v1.html and implement a simmilar solution
- Double tap changes the size of the node box but selecting other node or background does not change the size of the previous node back to its right size.
- After double click or double tap the node input should focus and allow for immediate editing
- Input is not working on the mobile webview, fix it
- In the desktop browser, the double click changes the size of a node, however one extra click is required to show input and edit text, it should work with double cick immediately
- In the mobile webviw, double tap changes the size of a node, but user is unable to edit any text, on screen keyboard does not appear.

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze the mindmap-glm47-v1.html mockup
- implement zoom in / zoom out with mouse scroll for desktop browsers
- implement zoom in / zoom out with fingers spread
- Build the project and make sure it works, run: ng build
- Disable interface scalling on mobile devices, likely meta in index.html
- When zooming in / zooming out update mindmap-container, connections div and node layer div to match the available viewport size

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- refactor event binding methods like handle* and use Angular HostListener
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze the mindmap-glm47-v1.html mockup
- implement background drag so the user can move viewport in any direction
- background drag must work for desktop browsers and for mobile webview
- Build the project and make sure it works, run: ng build
- Fix background drag for desktop browser, user can click down on background and move it in anydirection
- The background drag should work only when no node is selected

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- on desktop browser, when no node is selected, user can drag the background in any direction while holding the left mouse button down and moving mouse cursor
- on desktop browser, when node is selected, user can drag the background in any direction by holding the left mouse button outside of the node and moving mouse cursor, the node position must not change
- on mobile webview, when no node is selected, user can drag the background in any direction while moving finger
- on mobile webview, when node is selected, user can drag the background in any direction by holding the finger pressed outside of the node and moving finger, the node position must not change
- on desktop browser, user can zoom in / zoom out at any moment using mouse scroll
- on mobile webview, user can zoom in / zoom out at any moment using gesture
- background drag speed must be compensated for current scale
- if a node is selected, single click outside its box is canceling the select, the node position must not be changed
- node position can only be changed by dragging
- Implement fixes 
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- Remove the "reset view" button from the navbar and wipe out the functionality from the app state / mindmap component
- Create the "Reset Map" button (add to navbar) that resets the mindmap to initial state with a single root
- Create the "Fit view" button (add to navbar) that scales the viewport and renders the entire map centered
- Improve style of the root node, bold text font
- Build the project and make sure it works, run: ng build
- Max fit view scale is 1.0
- Fix the fit view scaling issue, when a single node is presented, its far too big, the maximum zoom level in fit view must be default scale/zoom.

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze the data model for the .mind file in the @/MINDFILE.md
- Create FileService in services that implement the data model import / export based on the MINDFILE.md
- Dont need the full MINDFILE.md implementation with all possible node properties
- Map existing node properties to a format in the MINDFILE.md
- The FileService must expose two methods: import and export
- The export method exports the MindMap to a .mind file (JSON format), triggers browser download of a file
- The import method imports the MindMap from a .mind file uploaded by a user
- Bind export to the Save button in the navbar
- Bind import to the Load button in the navbar
- Build the project and make sure it works, run: ng build
- Fit map to the view after import

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- fix the the following bug: on mobile webview, when user clicks a node, but do not drag and clicks somewhere outside in the background the node gets moved, but instead it should not change the position and be unselected
- detect touch finger press on mobile, only then drag note, if finger was lifted and clicked outside of a node, do not move the node, just unselect it
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- fix the the following bug: on mobile webview, when no node is selected, the user must be able to drag background in any direction
- fix background drag on mobile
- compensate drag speed for current view scale
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- fix the the following bug: on mobile webview, when a node is selected, clicking "add node" button or "delete node" button does not work, node just gets unselected
- Build the project and make sure it works, run: ng build
- The bug fix is not completed, the issue happens quite randomly when user interacts with a selected node.

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- fix the following bug: user can add and remove nodes on mobile, but the navbar buttons keep the "pressed" state after click untill user clicks outside of navbar

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- fix the following bug: on mobile webview, edit title of a node does not work properly, when uses double taps on a node, input should appear and be immediately focused so the user can start editing the title, the on screen keyboard should appear, now it does not

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- remove existing node edit functionality, it does not work for mobile due to a problem with input display or input focus
- create a new solution for editing nodes
- ideally: when user double clicks (desktop browser) or double taps (mobile webview) on a node, it display an input which allows to edit node title, in  case of mobile webview, the onscreen keyboard should appear
- the new solution for the node edit must work on desktop browser and mobile webview
- the new approach works on desktop and android, but there is a bug on ios
- on ios: it seems that for a fraction of the second input is rendered and immediately dissapears, so edition is not possible

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze createNodeElement from the @/mockups/mindmap-gptoss-v1.html, focus on how input work 
- the @/mockups/mindmap-glm47-v1.html also works on ios
- there is a bug on iOS, the input focus is broken
- on ios input.focus() does not show on screen keyboard unless there is user intent
- remove existing edit node solution
- copy the edit node solution from the mindmap-gptoss-v1.html for editing node titles, it is confirmed the mockup works on ios and android
- rewrtie the node edit completely based on the mindmap-gptoss-v1.html
- allow for multiline node titles
- Build the project and make sure it works, run: ng build

You are an expert Angular developer working on the MindMap app:
- analyze existing code base in the @/app/src
- analyze @/mockups/mindmap-gptoss-v1.html, focus on how input work 
- analyze @/mockups/mindmap-glm47-v1.html
- 1. currently there is a bug on mobile devices while editing node title, the caret sticks to the left side and letters are pushed to the right so the words are getting mirrored
- 2. when user clicks or taps on a ndoe it should be highlighted
- prefer the design from the mindmap-gptoss-v1.html
- fix the issues
- Build the project and make sure it works, run in the /app directory: ng build
- One issue remains: when user clicks inside the node, user see caret blinking and can edit text but the node is not getting selected.

@/rnd-mindmapp You are working on the MindMap app production deployment:
- Create Dockerfile and docker-compose.yml setup for this project
- Dockerfile should install dependencies and build the Angular application from the /app folder
- Docker must expose HTTP server listening at port :8080
- docker-compose should run the built docker container and map localhost:8080 to container:8080 port
