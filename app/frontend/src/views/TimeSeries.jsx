import React, { Component } from "react";
import Chart from "react-apexcharts";
import { GrClose } from "react-icons/bs";

class TimeSeries extends Component {
  constructor(props) {
    super(props);
    const { name, placeholder } = props
    console.log(name)
    console.log(placeholder)


        this.state = ({
          options: {
            chart: {
              toolbar: {
                tools: {
                  customIcons: [{
                    icon: '<div>X</div>',

                    click: function(e, chartContext) { 
                      console.log(e)
                      // console.log(chartContext)
                      
                      // console.log(props)
                    },
                    appendTo: 'left' // left / top means the button will be appended to the left most or right most position
                  }]
                }
              },
              id: "basic-bar"
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
          },
          series: [
            {
              name: "series-1",
              data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
          ]
        })
  }

  render() {
    return (
      
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>,
        <script src="https://cdn.jsdelivr.net/npm/react-apexcharts"></script>,
        
      <div className="chart">
        <div className="row">
          <div className="mixed-chart">
            
            <Chart
            
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TimeSeries;