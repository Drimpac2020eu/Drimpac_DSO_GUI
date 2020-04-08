import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ngx-line-chart',
    template:
        `<div echarts [options]="options" class="echart"></div>`,
})

export class LineChartComponent implements OnChanges {
    @Input() chartPrices: any;
    @Input() nameHorizonal: any;
    @Input() nameHorizonalDown: any;
    @Input() nameVerical: any;
    options: any; 

    xAxisdata=[];
    constructor() {
        for (let i=1; i<=96; i++)
        {
            this.xAxisdata.push(i.toString());
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.chartPrices = changes['chartPrices']['currentValue'];
        this.plotChart();
        console.log(changes);
    }

    plotChart() {
        const gradientLimit = Math.max.apply(Math, this.chartPrices) / 2
        this.options = {
            title: {
                text: this.nameHorizonal, 
                x: 'center',
                textStyle: {
                    color: '#000000',
                },
            },
            visualMap: [{
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: gradientLimit
            }],
            // backgroundColor: "#808080",
 
            xAxis: {
                type: 'category',
                data: this.xAxisdata,
                name: this.nameHorizonalDown,
                nameLocation: 'center',
                nameTextStyle: {
                    color: 'black',
                    fontSize: 22,
                },
                nameGap: 25,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'black',
                        fontSize: 8,
                    },
                },
                axisLabel: {
                    rotate: 45,
                },
            },
            yAxis: {
                type: 'value',
                name: this.nameVerical,
                nameLocation: 'center',
                nameTextStyle: {
                    color: 'black',
                    fontSize: 22,
                },
                nameGap: 40,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'black',
                    },
                },

            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: echarts.tooltipBackgroundColor,
                    },
                },
            },
            toolbox: {
                left: 'right',
                feature: {
                    dataView: {
                        show: true,
                        title: 'Data View',
                        readOnly: 'true',
                        lang: ['Data View', 'Close', 'Refresh'],
                    },
                    saveAsImage: {
                        show: true,
                        title: 'Save',
                    },
                },
            },
        
            dataZoom: [{
                type: 'inside',
                throttle: 50
            }],
            series: [{
                data: this.chartPrices,
                type: 'bar',
                smooth: true,
                /* label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#bfbfbf'
                    }
                }, */
              //  color: '#0033cc',
            }],
        };
        
    }
}