function buildPlots() {
    // Read in json file
    d3.json("samples.json").then(bellydata => {
        console.log(bellydata)
        
        var otuIds = bellydata.samples[0].otu_ids;
        console.log(otuIds)
        
        var sampleValues = bellydata.samples[0].sample_values.slice(0,10).reverse();
        console.log(sampleValues)
        
        var otuLabels = bellydata.samples[0].otu_labels.slice(0,10).reverse();
        console.log(`OTU labels: ${otuLabels}`)
        
        var topOtuIds = bellydata.samples[0].otu_ids.slice(0,10).reverse();
		
        var otuIdLabels = topOtuIds.map(d => "OTU " + d);
        console.log(`OTU ids: ${otuIdLabels}`)
		
        // Bar chart
        var trace1 = {
            x: sampleValues,
            y: otuIdLabels,
            text: otuLabels,
            marker: {
                color: "purple"
            },
            type: "bar",
            orientation: "h"
        };
        
        var data = [trace1];
        var layout = {
            title: "Top 10 OTUs",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Create bar plot
        Plotly.react("bar", data, layout);

        // Bubble plot
        var trace2 = {
            x: bellydata.samples[0].otu_ids,
            y: bellydata.samples[0].sample_values,
            mode: "markers",
            marker:{
                size: bellydata.samples[0].sample_values,
                color: bellydata.samples[0].otu_ids
            },
            text: bellydata.samples[0].otu_labels
        };

        
        var data1 = [trace2];
        var layout1 = {
            title: "Patient OTU Counts",
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1200
        };

        // Create bubble plot
        Plotly.react("bubble", data1, layout1);

        // Dropdown
        dropdown = document.getElementById('selDataset');
        defaultOption = document.createElement('option')
        options = bellydata.names
		
        for (i=0; i < options.length; i++){
            option = document.createElement('option');
            option.text = options[i];
            option.value = options[i];
            dropdown.add(option);
        };
        
        var metadata = bellydata.metadata;
        console.log(metadata)
        
        var id = 940;
        
        var result = metadata.filter(meta => meta.id === id)[0];
        console.log(result)
        
        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");
        
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
            });
        });
    };  

// Function for change
d3.selectAll("#selDataset").on("change", getData);

function getData() {

    dropDown = d3.select("#selDataset");
    idInfo = dropDown.property("value");
    console.log(idInfo)
    d3.json("samples.json").then(bellydata => {
        idNo = bellydata.names
        for (i = 0; i < idNo.length; i++) {
            if (idInfo == idNo[i]) {
				
                // Bar Plot
                console.log("success")
                var otuIds = bellydata.samples[i].otu_ids;
                var sampleValues = bellydata.samples[i].sample_values.slice(0,10).reverse();
                var otuLabels = bellydata.samples[i].otu_labels.slice(0,10).reverse();
                var topOtuIds = bellydata.samples[i].otu_ids.slice(0,10).reverse();
                var otuIdLabels = topOtuIds.map(d => "OTU " + d);

                var trace1 = {
                    x: sampleValues,
                    y: otuIdLabels,
                    text: otuLabels,
                    marker: {
                        color: "purple"
                    },
                    type: "bar",
                    orientation: "h"
                };

                var data1 = [trace1];
                var layout = {
                    title: "Top 10 OTUs",
                    margin: {
                        l: 100,
                        r: 100,
                        t: 100,
                        b: 100
                    }
                };

                // Bubble Chart
                var trace2 = {
                    x: bellydata.samples[i].otu_ids,
                    y: bellydata.samples[i].sample_values,
                    mode: "markers",
                    marker:{
                        size: bellydata.samples[i].sample_values,
                        color: bellydata.samples[i].otu_ids
                    },
                    text: bellydata.samples[i].otu_labels
                };

                var data2 = [trace2];
                var layout1 = {
                    title: "Patient OTU Counts",
                    xaxis: {title: "OTU ID"},
                    height: 600,
                    width: 1200
                };

                //Demographic Info
                var metadata = bellydata.metadata;

                console.log(metadata)
                var result = metadata.filter(meta => meta.id === +idInfo)[0];
        
                var demographicInfo = d3.select("#sample-metadata");

                demographicInfo.html("");
                console.log(result)
                Object.entries(result).forEach((key) => {
                    demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
                });
        updatePlotly(data1, data2, result)
            }
        }
    });
}

function updatePlotly(newdata1, newdata2, result) {
    var layout1 = {
        title: 'Top 10 OTUs',
        xaxis: {
            title: {
              text: 'OTU IDs'}}
        };
    
    var layout2 = {
        height: 600,
        width: 1200,
        title: 'Patient OTU Counts',
        xaxis: {
            title: {
              text: 'OTU IDs'}}
        };
    Plotly.react('bar',newdata1, layout1);
    Plotly.react('bubble', newdata2, layout2);

    box = d3.selectAll('#sample-metadata');
    box.html('');
    
    Object.entries(result).forEach(([key,value]) => {
        console.log(`${key}: ${value}`);
        box.append('ul').text(`${key}: ${value}`);
    });
}

getData();
buildPlots();