import { echartStyles } from "../shared/echart-styles";

export class Chart{

    chartPie = {
        ...echartStyles.defaultOptions, ...{
            legend: {
                show: true,
                bottom: 0,
            },
            series: [{
                type: 'pie',
                ...echartStyles.pieRing,

                label: echartStyles.pieLabelCenterHover,
                data: [{
                    name: 'Completed',
                    value: 0,
                    itemStyle: {
                        color: '#663399',
                    }
                }, {
                    name: 'Pending',
                    value: 0,
                    itemStyle: {
                        color: '#ced4da',
                    }
                }]
            }]
        }
    };
    calcPending(val:number) {
        let def = 100
        return def - val
    }
    constructor(complete:number){

        this.chartPie.series[0].data[0].value = complete
        this.chartPie.series[0].data[1].value = this.calcPending(complete)
    }
}