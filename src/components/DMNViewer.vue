<!-- src/components/DMNViewer.vue -->
<template>
  <div class="dmn-container">
    <!-- Toolbar for actions -->
    <button @click="createOrLoadDiagram" class="create-diagram-btn">Create New Diagram</button>
    <button @click="saveDiagram" class="save-diagram-btn">Save Diagram</button>
    <input type="file" @change="openDiagram" class="choose-file-btn" accept=".dmn, .xml" />
    
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
    saveDiagram() {
      // Save the current diagram
      this.dmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.error('Failed to save DMN diagram', err);
          alert('Failed to save DMN diagram: ' + err.message);
        } else {
          // Create a blob and trigger a download
          const blob = new Blob([xml], { type: 'application/xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'diagram.dmn';
          a.click();
          URL.revokeObjectURL(url); // Release the URL after downloading
          console.log('DMN diagram saved successfully');
        }
      });
    },
    openDiagram(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const xml = e.target.result;

        this.dmnModeler.importXML(xml, (err) => {
          if (err) {
            console.error('Failed to import DMN XML', err);
            alert('Failed to import DMN file: ' + err.message);
          } else {
            console.log('DMN file imported successfully');
            this.diagramLoaded = true; // Mark diagram as loaded after import
          }
        });
      };
      reader.readAsText(file); // Read the file as text
    },
  },
};
</script>

<style>
.dmn-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.dmn-diagram {
  width: 100%;
  height: 600px; /* Adjust height as needed */
  border: 1px solid #ccc;
  margin-top: 10px;
}

.create-diagram-btn,
.save-diagram-btn,
.choose-file-btn {
  padding: 8px 16px;
  margin: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.create-diagram-btn:hover,
.save-diagram-btn:hover {
  background-color: #0056b3;
}

.choose-file-btn {
  background-color: #28a745;
}

.choose-file-btn:hover {
  background-color: #218838;
}
.dmn-drd-container{
height :100%;
}
</style>
