import AbstractComponent from "./abstract-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {tripTypes} from '../const.js';
import moment from "moment";

const emoji = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚆`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`,
};

export default class StatisticsComponent extends AbstractComponent {
  constructor() {
    super();
    this._data = null;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeStampChart = null;
  }

  getTemplate() {
    return `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`.trim();
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
    this._destroy();
  }

  show(data) {
    if (!data.length) {
      return;
    }
    this._data = data;
    this.getElement().classList.remove(`visually-hidden`);
    this._init();
  }

  _getChart(ctx, {labels, data}, chartTitle, formitterCb) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#e4e4e4`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 15,
              weight: `bold`,
            },
            anchor: `end`,
            align: `left`,
            clamp: true,
            color: `#000000`,
            formatter(value) {
              return formitterCb(value);
            }
          }
        },
        aspectRatio: 3.25,
        scales: {
          yAxes: [{
            barThickness: 25,
            ticks: {
              beginAtZero: true,
              display: true,
              fontSize: 13,
              fontColor: `#000000`,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }]
        },
        tooltips: {
          enabled: false,
        },
        title: {
          display: true,
          position: `left`,
          padding: 30,
          text: chartTitle,
          fontSize: 28,
          fontColor: `#000000`
        },
        legend: {
          display: false,
        }
      }
    });
  }

  _getFilteredMoneyData() {
    const resultData = {};
    const labelsWithEmoji = [];

    this._data.forEach((it) => {
      if (resultData[it.type]) {
        resultData[it.type] = resultData[it.type] + it.base_price;
      } else {
        resultData[it.type] = it.base_price;
        labelsWithEmoji.push(`${emoji[it.type]} ${it.type.toUpperCase()}`);
      }
    });

    return {
      labels: labelsWithEmoji,
      data: Object.values(resultData),
    };
  }

  _getFilteredTransportData() {
    const resultData = {};
    const labelsWithEmoji = [];

    this._data.forEach((it) => {
      if (resultData[it.type]) {
        resultData[it.type]++;
      } else {
        const isTransport = tripTypes[0].list.find((elem) => (elem.name === it.type));
        if (isTransport) {
          resultData[it.type] = 1;
          labelsWithEmoji.push(`${emoji[it.type]} ${it.type.toUpperCase()}`);
        }
      }
    });

    return {
      labels: labelsWithEmoji,
      data: Object.values(resultData),
    };
  }

  _getFilteredTimeData() {
    const resultData = {};
    const labelsWithEmoji = [];

    this._data.forEach((it) => {
      if (resultData[it.type]) {
        resultData[it.type] = resultData[it.type] + Math.round(moment.duration(moment(it.date_to).diff(it.date_from)).asHours());
      } else {
        resultData[it.type] = Math.round(moment.duration(moment(it.date_to).diff(it.date_from)).asHours());
        labelsWithEmoji.push(`${emoji[it.type]} ${it.type.toUpperCase()}`);
      }
    });

    return {
      labels: labelsWithEmoji,
      data: Object.values(resultData),
    };
  }

  _renderMoneyChart() {
    const moneyChartData = this._getFilteredMoneyData();

    const chartMoneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const chartTitle = `MONEY`;
    const formitter = (value) => value !== 0 ? `$ ${value}` : ``;

    this._moneyChart = this._getChart(chartMoneyCtx, moneyChartData, chartTitle, formitter);
  }

  _renderTransportChart() {
    const transportChartData = this._getFilteredTransportData();

    const chartMoneyCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const chartTitle = `TRANSPORT`;
    const formitter = (value) => value !== 0 ? `${value}x` : ``;

    this._transportChart = this._getChart(chartMoneyCtx, transportChartData, chartTitle, formitter);
  }

  _renderTimeSpentChart() {
    const timeChartData = this._getFilteredTimeData();
    const chartTimeCtx = this.getElement().querySelector(`.statistics__chart--time`);
    const chartTitle = `TIME SPENT`;
    const formitter = (value) => value !== 0 ? `${value}H` : ``;

    this._transportChart = this._getChart(chartTimeCtx, timeChartData, chartTitle, formitter);
  }

  _init() {
    this._renderMoneyChart();
    this._renderTransportChart();
    this._renderTimeSpentChart();
  }

  _destroy() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
    }

    if (this._transportChart) {
      this._transportChart.destroy();
    }

    if (this._timeStampChart) {
      this._timeStampChart.destroy();
    }
  }
}
