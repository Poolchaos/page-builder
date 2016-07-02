export class GoogleChartConfig {

  TOOLTIP_TEMPLATE =
    '<div class="tooltip-wrapper"><img src="target/_assets/img/icon_legend_agent-utilisation.png" class="tooltip-icon"><div class="tooltipText"><span>#agentUtilisation</span></div></div>' + 
    '<div class="tooltip-wrapper"><img src="target/_assets/img/icon_legend_number-agents.png" class="tooltip-icon"><div class="tooltipText"><span>#agentsRequired</span></div></div>' + 
    '<div class="tooltip-wrapper"><img src="target/_assets/img/icon_legend_call-time.png" class="tooltip-icon"><div class="tooltipText"><span>#agentWaitTime</span></div></div>' + 
    '<div class="tooltip-wrapper"><img src="target/_assets/img/icon_legend_call-volume.png" class="tooltip-icon"><div class="tooltipText"><span>#numberOfCalls</span></div></div>';

  defaults = {
    width: '100%',
    chartType: 'LineChart',
    //dataTable: //configured in viewModel
    options: {
      setOption: {
        tooltipWidth: 400
      },
      chartArea: {
          'width': '100%',
          'height': '90%',
          'top': 0,
          'left': 80
        },
        crosshair: {
          trigger: 'both',
          color: '#4C4C4C'
        }, // Display crosshairs on focus and selection.
        annotations: {
          textStyle: {
            fontName: 'NeoTech',
            fontSize: 14,
            bold: false,
            italic: false,
            strokeWidth: 0,
            color: '#ffa801', // The color of the text.
            'fill-color': '#ffa801'
          },
          boxStyle: {
            // Color of the box outline.
            stroke: '#888',
            // Thickness of the box outline.
            strokeWidth: 0,
            // x-radius of the corner curvature.
            rx: 10,
            // y-radius of the corner curvature.
            ry: 10
          }
        },
        animation: {
          duration: 300,
          easing: 'out',
        },
        lineWidth: 1,
        backgroundColor: {
          fill: 'none'
        },
        titleTextStyle: {
          color: '#ffa801'
        },
        legendTextStyle: {
          color: '#ffa801'
        },
        colors: ['#0072bb'],
        hAxis: {
          title: 'Time of Calls',
          titleTextStyle: {
            fontName: 'NeoTech',
            fontSize: 16,
            bold: false,
            italic: false,
            color: '#ffffff', // The color of the text.
          },
          slantedText: true,
          slantedTextAngle: 45,
          viewWindowMode: 'pretty',
          viewWindow: {
            //min: //configured in viewModel
            //max: //configured in viewModel
          },
          scaleType: 'fixed',
          gridlines: {
            color: '#272727'
          },
          minValue: 0,
          textStyle: {
            color: '#D78003',
            fontSize: 11,
            fontName: 'NeoTech'
          }
        },
        vAxis: {
          title: 'Number of Calls',
          titleTextStyle: {
            fontName: 'NeoTech',
            fontSize: 16,
            bold: false,
            italic: false,
            color: '#ffffff', // The color of the text.
          },
          viewWindowMode: 'explicit',
          viewWindow: {
            //max: //configured in viewModel
            min: 0
          },
          minValue: 0,
          gridlines: {
            color: '#272727'
          },
          textStyle: {
            fontSize: 14,
            color: '#D78003',
            fontName: 'NeoTech'
          }
        },
        explorer: {
          maxZoomOut: 1,
          keepInBounds: true
        },
        tooltip: {
          isHtml: true,
        },
        title: '',
        /*curveType: 'function',*/
        pointSize: 10,
        /*pointShape: { type: 'star', sides: 4 },*/
        legend: {
          position: 'none'
        }
    },
    containerId: 'workforceChart'
  };

}