<template>
  <div class="dmn-container">
    <!-- Toolbar for actions -->
    <button @click="createOrLoadDiagram" class="create-diagram-btn">Create New Diagram</button>
    <button @click="saveDiagramAsJSON" class="save-diagram-btn">Save Diagram as JSON</button>
    <input type="file" @change="openDiagram" class="choose-file-btn" accept=".dmn, .xml, .json" />

    <!-- DMN Diagram Editor Container -->
    <div ref="dmnContainer" class="dmn-diagram"></div>
  </div>
</template>

<script>
import DmnModeler from 'dmn-js/lib/Modeler'; // Import DmnModeler for editing capabilities
// Import necessary styles for DMN modeler
import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';

export default {
  name: 'DMNViewer',
  data() {
    return {
      dmnModeler: null,
      diagramLoaded: false, // State to track if any diagram has been loaded
    };
  },
  mounted() {
    // Initialize the DMN Modeler without loading a diagram
    this.initializeModeler();
  },
  beforeUnmount() {
    // Destroy the modeler instance when the component is destroyed
    if (this.dmnModeler) {
      this.dmnModeler.destroy();
    }
  },
  methods: {
    initializeModeler() {
      this.dmnModeler = new DmnModeler({
        container: this.$refs.dmnContainer,
        keyboard: { bindTo: window }, // Allows keyboard shortcuts
      });
      this.dmnModeler.get('canvas').zoom('fit-viewport');
    },
    createOrLoadDiagram() {
      if (!this.diagramLoaded) {
        this.loadInitialDiagram(); // Load initial diagram if not loaded
      } else {
        this.createNewDiagram(); // Create new diagram if already loaded
      }
    },
    loadInitialDiagram() {
      this.diagramLoaded = true; // Mark diagram as loaded

      // Load an initial DMN 1.3 diagram
      const dmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" 
  xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" 
  xmlns:dc="http://www.omg.org/spec/DMN/20191111/DC/" 
  xmlns:di="http://www.omg.org/spec/DMN/20191111/DI/" 
  id="definitions" name="definitions" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="decision" name="Decision">
    <decisionTable id="decisionTable">
      <input id="input1">
        <inputExpression id="inputExpression1" typeRef="string">
          <text>Input Expression</text>
        </inputExpression>
      </input>
      <output id="output1" name="Output" typeRef="string" />
    </decisionTable>
  </decision>
</definitions>`;

      // Import the DMN XML into the modeler
      this.dmnModeler.importXML(dmnXML, (err) => {
        if (err) {
          console.error('Failed to import DMN XML', err);
          alert('Failed to import initial DMN diagram: ' + err.message);
        } else {
          console.log('DMN XML imported successfully');
        }
      });
    },
    createNewDiagram() {
      // New DMN 1.3 diagram XML template
      const newDiagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" 
  xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" 
  xmlns:dc="http://www.omg.org/spec/DMN/20191111/DC/" 
  xmlns:di="http://www.omg.org/spec/DMN/20191111/DI/" 
  id="definitions" name="New Decision" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="decision" name="New Decision">
    <decisionTable id="decisionTable">
      <input id="input1">
        <inputExpression id="inputExpression1" typeRef="string">
          <text></text>
        </inputExpression>
      </input>
      <output id="output1" name="Output" typeRef="string" />
    </decisionTable>
  </decision>
</definitions>`;

      // Import the new DMN XML into the modeler
      this.dmnModeler.importXML(newDiagramXML, (err) => {
        if (err) {
          console.error('Failed to create new DMN diagram', err);
          alert('Failed to create new DMN diagram: ' + err.message); // Show alert for user feedback
        } else {
          console.log('New DMN diagram created successfully');
          alert('New DMN diagram created successfully!'); // Confirm diagram creation
        }
      });
    },
    saveDiagramAsJSON() {
      // Save the current diagram as JSON
      this.dmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.error('Failed to save DMN diagram', err);
          alert('Failed to save DMN diagram: ' + err.message);
        } else {
          const json = this.xmlToJson(xml);
          const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'diagram.json';
          a.click();
          URL.revokeObjectURL(url); // Release the URL after downloading
          console.log('DMN diagram saved as JSON successfully');
        }
      });
    },
    openDiagram(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        if (file.type === 'application/json') {
          // Load JSON and convert to XML
          const json = JSON.parse(content);
          const xml = this.jsonToXml(json);
          this.loadDiagramXML(xml);
        } else {
          // Load DMN XML directly
          this.loadDiagramXML(content);
        }
      };
      reader.readAsText(file); // Read the file as text
    },
    loadDiagramXML(xml) {
      this.dmnModeler.importXML(xml, (err) => {
        if (err) {
          console.error('Failed to import DMN XML', err);
          alert('Failed to import DMN file: ' + err.message);
        } else {
          console.log('DMN file imported successfully');
          this.diagramLoaded = true; // Mark diagram as loaded after import
        }
      });
    },
    xmlToJson(xml) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const obj = {};

      function traverse(node, obj) {
        if (node.nodeType === 3) {
          obj['#text'] = node.nodeValue.trim();
          return;
        }

        obj['name'] = node.nodeName;
        if (node.attributes) {
          obj['attributes'] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            obj['attributes'][node.attributes[i].nodeName] = node.attributes[i].nodeValue;
          }
        }
        if (node.childNodes && node.childNodes.length) {
          obj['children'] = [];
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = {};
            traverse(node.childNodes[i], child);
            obj['children'].push(child);
          }
        }
      }

      traverse(xmlDoc.documentElement, obj);
      return obj;
    },
    jsonToXml(json) {
      const buildXml = (obj) => {
        let xml = '';

        if (obj.name) {
          xml += `<${obj.name}`;
          if (obj.attributes) {
            for (const [key, value] of Object.entries(obj.attributes)) {
              xml += ` ${key}="${value}"`;
            }
          }
          xml += '>';
        }

        if (obj['#text']) {
          xml += obj['#text'];
        }

        if (obj.children) {
          obj.children.forEach(child => {
            xml += buildXml(child);
          });
        }

        if (obj.name) {
          xml += `</${obj.name}>`;
        }

        return xml;
      };

      return `<?xml version="1.0" encoding="UTF-8"?>${buildXml(json)}`;
    }
  }
};
</script>

<style>

 

/* Container for the entire DMN viewer */
.dmn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa; /* Light gray background */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}

/* Toolbar styling */
.dmn-toolbar {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 1200px; /* Limiting max width */
  background: #ffffff; /* White background for toolbar */
  padding: 10px;
  border-radius: 8px; /* Rounded corners for toolbar */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Shadow for separation */
}

/* Individual buttons in the toolbar */
.create-diagram-btn,
.save-diagram-btn,
.choose-file-btn {
  background-color: #007bff; /* Primary button color */
  color: #ffffff; /* Button text color */
  border: none;
  border-radius: 4px; /* Rounded button corners */
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.create-diagram-btn:hover,
.save-diagram-btn:hover,
.choose-file-btn:hover {
  background-color: #0056b3; /* Darker shade on hover */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

.create-diagram-btn:focus,
.save-diagram-btn:focus,
.choose-file-btn:focus {
  outline: none; /* Remove default focus outline */
  box-shadow: 0 0 0 2px rgba(0,123,255,0.5); /* Custom focus outline */
}

/* Styling for the diagram container */
.dmn-diagram {
  width: 100%;
  height: 100vh; /* Full viewport height */
  max-height: 1000px; /* Maximum height */
  border: 1px solid #dcdcdc; /* Light gray border */
  border-radius: 8px; /* Rounded corners for the diagram container */
  background-color: #ffffff; /* White background for diagram */
  overflow: hidden; /* Hide overflow to maintain clean appearance */
}
</style>