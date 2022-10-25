import { useState, useContext, useRef, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import API from "../Api";
import TimeSeries from "./TimeSeries";
import markerIcon from "../styles/marker-icon.png"
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import '../styles/styles.scss'


export default function Map (props) {
  const ref = useRef(null);
  const { loginUser, user, logoutUser } = useContext(AuthContext);
  const [pointMap, setPointMap] = useState([]);
  const [targetPointTimes, setTargetPointTimes] = useState([]);
  const [targetPointValues, setTargetPointValues] = useState([]);
  const [visibleChart, setVisibleChart] = useState(false);

  const mapPoint = (dateSelected) => {
    API.get(`points/receptors/`, { 
      params: {
        'client': 'test_user'
      },
      headers: {
        // 'Authorization': 'Bearer ' + authTokens.access
      }
    })
    .then((res) => {
        // console.log(res)
        setPointMap(res.data)
    })
    .catch(console.error);
  };

  const handleChildClick = () => {
    setVisibleChart(!visibleChart);
  }

  const dataPointSelected = (objectPointFormat, idPoint) => {
    API.post(`points/ts/ARIAVIEW_USER_TEST_RESULT_LcS`, objectPointFormat, { 
      params: {
        'apikey': '0e112b8e77c27ef2ff7c3dbd98631fc2e392189b',
        'variable': props.dataSet,
        'epsg': props.epsg,
        'start_date': props.valueDate+'T'+props.valueHour,
        'end_date': props.valueDate+'T'+props.hourAvailable[props.hourAvailable.length - 1]+':00:00',
        'is_atomic': 1,
        "tsmin": -1000 
      },
      headers: {
        // 'Authorization': 'Bearer ' + authTokens.access
      }
    })
    .then((res) => {
        // console.log(res)
        var dataSetProps = props.dataSet
        const timeSeriesTimes = res.data.data[dataSetProps].atomic.times
        const timeSeriesValues = res.data.data[dataSetProps].atomic.values[idPoint]
        // console.log('timeSeriesValues =>',timeSeriesValues)
        // console.log('timeSeriesTimes =>',timeSeriesTimes)
        setTargetPointTimes('')
        setTargetPointValues('')
        setTargetPointTimes(timeSeriesTimes)
        setTargetPointValues(timeSeriesValues)
        setVisibleChart(true)
    })
    .catch(console.error);
  };

  if(pointMap.length === 0){
    mapPoint()
  }
  
  useEffect(() => {
    if (ref.current) {
      ref.current.setUrl(props.data);
    }
  });

  const iconMarkup = renderToStaticMarkup(
      <ImgMarker src={markerIcon} />
  );

  const customMarkerIcon = divIcon({
      html: iconMarkup
  });


  return (
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
    integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
    crossorigin=""/>,
    <Container style={{width: "90%",display: "flex"}}>
        <MapContainer
            className="markercluster-map"
            center={[45.43200003998344, 9.225806119289835]}
            zoom={15}
            maxZoom={18}
        >
        {pointMap.map((i) => {
            return ( 
           
              <Marker 
                position={[i.lat, i.lon]} 
                icon={customMarkerIcon}
                eventHandlers={{
                  click: (e) => {
                    const idPoint = i.id
                    const r_indexPoint = i.r_index
                    const r_namePoint = i.r_name
                    const latPoint = i.lat
                    const lonPoint = i.lon
                    const heightPoint = i.height
                    const userPoint = i.user
                    const groupPoint = i.group
                    const clientPoint = i.client
                    const objectPointFormat = {
                      [idPoint]:{
                        "lat": latPoint,
                        "lon": lonPoint,
                        "r_name": r_namePoint,
                        "r_index": r_indexPoint,
                        "height": heightPoint,
                        "user": userPoint,
                        "group": groupPoint,
                        "client": clientPoint
                      }
                    }
                    // setVisibleChart(false)
                    dataPointSelected(objectPointFormat, idPoint)
                  },
                }}
                >
                <Popup>
                  Id: {i.id}<br />
                  Lat: {i.lat}<br />
                  Lon: {i.lon}<br />
                  r_index: {i.r_index}<br />
                  r_name: {i.r_name}<br />
                  client: {i.client}<br />
                  Group: {i.group}<br />
                  {/* Height{i.height}<br /> */}
                  {/* <TimeSeries/> */}
                </Popup>
              </Marker>
            );
        })},
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <TileLayer
            url={props.data}
            ref={ref}
            // url="https://apibeta.aria.fr/py/v2/maps/{z}/{x}/{y}/?apikey=0e112b8e77c27ef2ff7c3dbd98631fc2e392189b&format=png&dataset=ARIAVIEW_USER_TEST_RESULT_LcS&date=20220810&time=2022-08-10T18:00:00&variable=M011S002&epsg=32632&is_atomic=1"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        </MapContainer>
            {visibleChart && 
              <Container>
                <TimeSeries
                  onClick={handleChildClick.bind(this)}
                  dataTimesChart={targetPointTimes}
                  dataValuesChart={targetPointValues}
                > 
                </TimeSeries>
              </Container>
            }
    </Container>
  );
}

const ImgMarker = styled.img`
    width: 32px!important;
`

