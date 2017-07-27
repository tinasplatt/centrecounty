function loadMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2VudHJlY291bnR5IiwiYSI6IjBFWVVnczgifQ.njqaUJ7PfP_-HQQV0cmV7g';
  createPopupHTML = function(object){
    console.log(object);
    var html = "<h3>" + object.properties.title + "</h3>"
    if (object.properties.Location) {
      html += "<p>" + object.properties.Location + "</p>"
    }
    html += "<p>" + object.properties.description + "</p>"
    return html
  }


  var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/centrecounty/cj1h2wyoi001c2smolueurtva',
      center: [-77.830679, 40.952537],
      zoom: 9,
      minZoom: 8.5,
      maxZoom: 15
  });
  map.on('load', function () {
    map.addLayer({
        "id": "historic_districts",
        "type": "fill",
        "source": {
            type: 'vector',
            url: 'mapbox://centrecounty.cj0m6llmt004f2wpe2pbpvvw8-8fs6s'
        },
        "source-layer": "Historic_Districts",
        "paint": {
            "fill-color": "#23a523",
            "fill-opacity": 0.5,
            "fill-outline-color": "#000000"
        }
    });
    map.addLayer({
        "id": "historic_districts_hover",
        "type": "fill",
        "source": {
            type: 'vector',
            url: 'mapbox://centrecounty.cj0m6llmt004f2wpe2pbpvvw8-8fs6s'
        },
        "source-layer": "Historic_Districts",
        "layout": {},
        "paint": {
            "fill-color": "#23a523",
            "fill-opacity": 1
        },
        "filter": ["==", "title", ""]
    });
    map.addLayer({
        "id": "markers",
        "type": "circle",
        "source": {
            type: 'vector',
            url: 'mapbox://centrecounty.cj0m6ntyg00472qp9ef8sxpq2-20b6v'
        },
        "source-layer": "Markers",
        "paint": {
            "circle-color": {
                property: 'marker-color',
                type: 'identity'
            },
            "circle-radius":{
                stops: [[8, 4], [11, 6], [16, 40]]
            },
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 2
        }
    });
    map.addLayer({
        "id": "historic_sites",
        "type": "circle",
        "source": {
            type: 'vector',
            url: 'mapbox://centrecounty.cj0m6kxns004b2xrrbu5xs0xg-41k9s'
        },
        "source-layer": "Historic_Sites",
        "paint": {
            "circle-color": {
                property: 'marker-color',
                type: 'identity'
            },
            "circle-radius":{
                stops: [[8, 4], [11, 6], [16, 40]]
            },
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 2
        }
    });
    map.addLayer({
        "id": "museums",
        "type": "circle",
        "source": {
            type: 'vector',
            url: 'mapbox://centrecounty.cj0m6mai4003x32tfjjoegr9v-4n58q'
        },
        "source-layer": "Museums",
        "paint": {
            "circle-color": {
                property: 'marker-color',
                type: 'identity'
            },
            "circle-radius":{
                stops: [[8, 4], [11, 6], [16, 40]]
            },
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 2
        }
    });
    map.addLayer({
        "id": "points_of_interest",
        "type": "circle",
        "source": {
            type: 'vector',
            url: 'mapbox://centrecounty.cj0m6ots0004q33noovs04odw-0b2m3'
        },
        "source-layer": "Points_of_Interest",
        "paint": {
            "circle-color": {
                property: 'marker-color',
                type: 'identity'
            },
            "circle-radius":{
                stops: [[8, 4], [11, 6], [16, 40]]
            },
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 2
        }
    });

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'historic_districts', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.title)
            .addTo(map);
    });

    map.on('mouseleave', 'historic_districts', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on("mousemove", "historic_districts"  , function(e) {
        map.setFilter("historic_districts_hover", ["==", "title", e.features[0].properties.title]);
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "historic_districts", function() {
        map.setFilter("historic_districts_hover", ["==", "title", ""]);
    });

    var interactiveLayers = ['historic_sites', 'museums', 'points_of_interest', 'markers']
    for (var i = 0; i < interactiveLayers.length; i++) {
      var layer = interactiveLayers[i];
      map.on('click', layer, function (e) {
          new mapboxgl.Popup()
              .setLngLat(e.features[0].geometry.coordinates)
              .setHTML(createPopupHTML(e.features[0]))
              .addTo(map);
      });
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', layer, function () {
          map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', layer, function () {
          map.getCanvas().style.cursor = '';
      });

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = layer.replace(/_/g, " ");

      link.onclick = function (e) {
          var clickedLayer = this.textContent.replace(/ /g, "_");
          e.preventDefault();
          e.stopPropagation();

          // var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

          if (this.className == 'active') {
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');
              this.className = '';
          } else {
              this.className = 'active';
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
          }
      };

      var layers = document.getElementById('menu');
      layers.appendChild(link);
      }

    });
}
