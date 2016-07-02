// All chart specific functionality is configured here to make it
// easier to swap out charting frameworks.
import {inject} from 'aurelia-framework';
import {GoogleChartConfig} from './google.chart.config';
import {WorkforceDashboardStore} from '../workforce.dashboard.store';

@inject(WorkforceDashboardStore, GoogleChartConfig)
export class GoogleChartAPI {

  constructor(workforceDashboardStore, googleChartConfig) {

    this.workforceDashboardStore = workforceDashboardStore;
    this.config = googleChartConfig;
  }

  initChart(callback) {

    google.load('visualization', '1', {'callback': ()=> {callback();}, 'packages': ['corechart']}); // Load the google Visualization API and the chart package.

    /*setTimeout(()=> {
      callback();
    }, 2000); // Workaround for known google chart bug e.g. http://stackoverflow.com/questions/9519673/why-does-google-load-cause-my-page-to-go-blank*/
  }

  formatChartData(rawData, isFilter) {
    
    let chart = [];
    let data = rawData.data;
    let sla = rawData.sla;

    this.workforceDashboardStore.sla = sla; // TODO move to store

    for (let i = 1; i < data.length; i++) {

      if (i % 4 !== 1) {
        continue;
      }

      let chartRow = [];
      let row = data[i - 1];
      
      row.points[0] = new Date(row.points[0]); // Convert timestamp to date
      for (let rowi in row.points) {
        let point = row.points[rowi];
        chartRow.push(point);
      }
      
      row.tooltip.numberOfCalls = row.points[1];
      row.tooltip.agentUtilisation = Math.ceil(row.tooltip.agentUtilisation) + '%';
      row.tooltip.agentWaitTime = Number(row.tooltip.agentWaitTime.toString().match(/^\d+(?:\.\d{0,2})?/)) + 's';//ath.floor(row.tooltip.agentWaitTime * 100) / 100; 10.07452038704596

      let tooltip = this.buildTooltip(row.tooltip);
      let agentsRequired = row.tooltip.agentsRequired + '';

      if (row.points[1] > this.workforceDashboardStore.maxGraphVal)
        this.workforceDashboardStore.maxGraphVal = row.points[1] * 1.1;

      chartRow.push(tooltip);
      chartRow.push(agentsRequired);
      chartRow.push('point { size: 5; shape-type: circle; fill-color: #fff; color: #00fffc;}');
      chart.push(chartRow);
    }
    
    return chart;
  }

  buildTooltip(tooltip) {

    let tooltipHtml = this.config.TOOLTIP_TEMPLATE;
    for (let tooltipProp in tooltip) {
      let tooltipVal = tooltip[tooltipProp];
      let regex = '#' + tooltipProp;
      tooltipHtml = tooltipHtml.replace(new RegExp(regex, 'g'), tooltipVal);
    }

    return tooltipHtml;
  }

  setChartData(data) {

    let chartAPI = this.config.defaults;

    // CREATE DATA TABLE
    let dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Call Volume');
    dataTable.addColumn({
      type: 'string',
      role: 'tooltip',
      p: {
        html: true
      }
    });
    dataTable.addColumn({
      type: 'string',
      role: 'annotation'
    });
    dataTable.addColumn({
      type: 'string',
      role: 'style'
    });

    dataTable.addRows(data);
    chartAPI.dataTable = dataTable;
    chartAPI.options.hAxis.viewWindow.min = new Date(data[0][0].getTime() - 60 * 60000);
    chartAPI.options.hAxis.viewWindow.max = new Date(data[data.length - 1][0].getTime());
    chartAPI.options.vAxis.viewWindow.max = this.workforceDashboardStore.maxGraphVal; // TODO get from viewModel

    let chart = new google.visualization.ChartWrapper(chartAPI);
    chart.draw();
  }

}
