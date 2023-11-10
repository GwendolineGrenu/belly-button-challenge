// Specify the URL of the JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use the D3 library to read in samples.json from the URL 
d3.json(url).then(function(data) {
  console.log(data);
});

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual

function init() {
    
    var dropdownMenu = d3.select("#selDataset");
  
    d3.json(url).then(function(data) {
      
      var sampleNames = data.names;
    
      sampleNames.forEach(function(sample) {
        dropdownMenu.append("option").text(sample).property("value", sample);
      }); 
      
      buildBarChart(sampleNames[0]);
    });
  }

  function buildBarChart(sample) {
    
    d3.json(url).then(function(data) {
      
      var selectedSample = data.samples.find(function(element) {
        return element.id === sample;
      });
      
      //Use sample_values as the values for the bar chart
      var top10OTUs = selectedSample.sample_values.slice(0, 10).reverse();

      //Use otu_ids as the labels for the bar chart
      var otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

      //Use otu_labels as the hovertext for the chart
      var otuIDs = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  
      // Create the horizontal bar chart
      var trace = {
        type: "bar",
        orientation: "h",
        x: top10OTUs,
        y: otuIDs,
        text: otuLabels
      };
  
      var data = [trace];
  
      var layout = {
        xaxis: {},
        yaxis: {}
      };
  
      Plotly.newPlot("bar", data, layout);
    });
  }
  
  function optionChanged(newSample) { 
    buildBarChart(newSample);
  }
  
  init();
  
//Create a bubble chart that displays each sample

function buildBubbleChart(sample) {
    
    d3.json(url).then(function(data) {
      
      var selectedSample = data.samples.find(function(element) {
        return element.id === sample;
      });
  
      // Create the bubble chart
      var trace = {
        //Use otu_ids for the x values
        x: selectedSample.otu_ids,

        //Use sample_values for the y values
        y: selectedSample.sample_values,

        mode: 'markers',
        marker: {
          //Use sample_values for the marker size 
          size: selectedSample.sample_values,

          //Use otu_ids for the marker colors
          color: selectedSample.otu_ids,
          colorscale: 'Earth'
        },
        //Use otu_labels for the text values
        text: selectedSample.otu_labels
      };
  
      var data = [trace];
  
      var layout = {
        xaxis: {},
        yaxis: {}
      };
  
      Plotly.newPlot("bubble", data, layout);
    });
  }
  
  buildBubbleChart("940");

  function optionChanged(newSample) {
    buildBubbleChart(newSample);
  }
  
//Display the sample metadata, i.e., an individual's demographic information

function displayMetadata(sample) {
    var metadataDiv = d3.select("#sample-metadata");
  
    d3.json(url).then(function(data) {
      var selectedSampleMetadata = data.metadata.find(function(element) {
        return element.id == sample;
      });
  
      // Clear existing metadata
      metadataDiv.html("");
  
      //Display each key-value pair from the metadata JSON object somewhere on the page
      Object.entries(selectedSampleMetadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
      });
    });
  }
  
  displayMetadata("940");
  
  function optionChanged(newSample) {
    displayMetadata(newSample);
  }
  
//Update all the plots when a new sample is selected

function optionChanged(newSample) {
    buildBarChart(newSample);
    buildBubbleChart(newSample);
    displayMetadata(newSample);
  }

  init();
  