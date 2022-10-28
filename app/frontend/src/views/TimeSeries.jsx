import React, { createContext, Component, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { GrClose } from "react-icons/bs";


class TimeSeries extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    const {dataTimesChart} = props;
    const {dataValuesChart} = props;
  
      this.state = ({
        options: {
          chart: {
            toolbar: {
              tools: {
                customIcons: [{
                  icon: 'X',

                  click: function(e, chartContext) { 
                    console.log(e)
                    //  {onClick}
                    // console.log({onClick})
                    // this.setState({onClick})
                    // console.log(chartContext)
                    
                    // console.log(props)
                  },
                  appendTo: 'left' // left / top means the button will be appended to the left most or right most position
                }]
              }
            },
            width: '100%',
            id: "basic-bar"
          },
          xaxis: {
            // categories: [
            //   "2022-07-01T01:00:00.000Z",
            //   "2022-07-01T02:00:00.000Z",
            //   "2022-07-01T03:00:00.000Z",
            //   "2022-07-01T04:00:00.000Z",
            //   "2022-07-01T05:00:00.000Z",
            //   "2022-07-01T06:00:00.000Z",
            //   "2022-07-01T07:00:00.000Z",
            //   "2022-07-01T08:00:00.000Z",
            //   "2022-07-01T09:00:00.000Z",
            //   "2022-07-01T10:00:00.000Z",
            //   "2022-07-01T11:00:00.000Z",
            //   "2022-07-01T12:00:00.000Z",
            //   "2022-07-01T13:00:00.000Z",
            //   "2022-07-01T14:00:00.000Z",
            //   "2022-07-01T15:00:00.000Z",
            //   "2022-07-01T16:00:00.000Z",
            //   "2022-07-01T17:00:00.000Z",
            //   "2022-07-01T18:00:00.000Z",
            //   "2022-07-01T19:00:00.000Z",
            //   "2022-07-01T20:00:00.000Z",
            //   "2022-07-01T21:00:00.000Z",
            //   "2022-07-01T22:00:00.000Z",
            //   "2022-07-01T23:00:00.000Z"]
            categories: dataTimesChart

          }
        },
        series: [
          {
            name: "series-1",
            // data: [30, 40]
            // data : [0,0,0,0,0,0,0,0.05754915624856949,0,0,0,0.0648144856095314,0.09592505544424057,0,0,0,0,0,0,0,0,0,0]
            data: dataValuesChart

          }
        ]
      })
  }

  componentDidMount() {
    console.log(this.myRef.current.props.series[0].data)
  }

  componentDidUpdate() {
    // console.log(this.myRef.current)
    // console.log(this.props.dataTimesChart)
    console.log(this.props.dataValuesChart)
    // Chart.forceUpdate()
    // console.log(this.myRef.current.props.series[0].data)
    // this.getData();
    // console.log(this.state.options.xaxis)
    // this.myRef.current.props.series[0].data = this.props.dataValuesChart
    // console.log(this.myRef.current.props.series[0].data)
    // this.reRender()
  }
  
  reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };

  render() {
    const {onClick} = this.props;
    return (
      <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>,
      <script src="https://cdn.jsdelivr.net/npm/react-apexcharts"></script>,

      <div className="chart" style={{width: "100%"}}>
        <div className="row">
          <div className="mixed-chart">
          {/* <button onClick={onClick}>toggle</button> */}
          {/* { showing 
            ?  */}
            <Chart style={{width: "100%"}}
            
              // options={this.myRef}
              ref={this.myRef}
              // series={this.state.series}
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="500"
            />
            {/* : null
          } */}
          </div>
        </div>
      </div>
    );
  }
}

export default TimeSeries;