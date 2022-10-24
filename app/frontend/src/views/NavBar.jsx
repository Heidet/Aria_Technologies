import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import { Button, UncontrolledDropdown, Input, DropdownToggle, DropdownMenu, DropdownItem, Container  } from 'reactstrap';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import Box from '@mui/material/Box';
import moment from 'moment-timezone';
import API from "../Api";
import AuthContext from "../context/AuthContext";
import Map from './Map';


export default function Navbar() {
  const [mapShow, setMapShow] = useState(false);
  const [valueHour, setValueHour] = useState('10:00');
  const [valueHourRequest, setValueHourRequest] = useState('10:00');
  const [navbarState, setNavbarState] = useState(false);
  const { user, logoutUser, authTokens } = useContext(AuthContext);
  const html = document.querySelector("html");
  const [isOpen, setIsOpen] = useState(false);
  const [dataSets, setDataSets] = useState([])
  const [varDataSet, setVarDataSets] = useState([])
  const [dataSetSelect, setDataSetSelect] = useState([])
  const [hourAvailable, setHourAvailable] = useState([])
  const [dateAvailable, setDateAvailable] = useState([])
  const [value, setValue] = useState(dayjs('2022-04-07'));
  const [mapData, setMapData] = useState('');


  const refreshDataDate = () => {
    API.get(`datasets/ARIAVIEW_USER_TEST_RESULT_LcS`, { 
      params: {
        'apikey': authTokens.access,
        'info':'dates',
        // 'dataset_name': 'ARIAVIEW_USER_TEST_RESULT_LcS'
      },
    })
    .then((res) => {
      const dateFormat = res.data.data.map((date) => moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'));
      setDateAvailable(dateFormat);
      setValue(dayjs(dateAvailable[0]).format('YYYY-MM-DD'))
    })
    .catch(console.error);
  };

  const refreshDataHour = (dateSelected) => {
    API.get(`datasets/ARIAVIEW_USER_TEST_RESULT_LcS`, { 
      params: {
        'apikey': authTokens.access,
        'info':'timeframes',
        'date': dateSelected,
        'is_atomic':'1'
        // 'dataset_name': 'ARIAVIEW_USER_TEST_RESULT_LcS'
      },
    })
    .then((res) => {
      
      const hourFormat = res.data.data.map((hour) => parseInt(hour.slice(11, 13)))
      setHourAvailable(hourFormat)
    })
    .catch(console.error);
  };
  console.log('hourAvailable =>',hourAvailable)
  const customDayRenderer = (date, selectedDates, pickersDayProps) => {
    if (dateAvailable.includes(date.format('YYYY-MM-DD'))) {
      return false
    }else {
      return true 
    }
  }

  const customTimeRenderer = (time, clockType) => {
    if (hourAvailable.includes(time)) {
      return false
    }else {
      return true 
    }
  }

  const refreshDataSet = () => {
    API.get(`datasets/ARIAVIEW_USER_TEST_RESULT_LcS`, { 
      params: {
        'apikey': authTokens.access
        // 'dataset_name': 'ARIAVIEW_USER_TEST_RESULT_LcS'
      },
      headers: {
        // 'Authorization': 'Bearer ' + authTokens.access
      }
    })
    .then((res) => {
      setVarDataSets(res.data.data.variables)
      setDataSets(res.data.data);
    })
    .catch(console.error);
  };

  if(varDataSet.length === 0){
    refreshDataSet()
    refreshDataDate()
  }

  const submitSearch = () => {
    var date = value.split('-')
    var dateFormatYYYYMMDD = date[0]+date[1]+date[2]
    const valueHourReq = valueHour.format('HH:mm:ss')
    setValueHourRequest(valueHourReq)
    setMapData("https://apibeta.aria.fr/py/v2/maps/{z}/{x}/{y}/?apikey=0e112b8e77c27ef2ff7c3dbd98631fc2e392189b&format=png&dataset=ARIAVIEW_USER_TEST_RESULT_LcS&date="+dateFormatYYYYMMDD+"&time="+value+"T"+valueHourReq+"&variable="+dataSetSelect+"&epsg="+dataSets.epsg+"&is_atomic=1")
  }


  return (
    
      <Container >
        <Nav>
          <div className="brand1">
            <a href="/">
              <p className="social-name">Aria Search</p>
            </a>
            <div className="toggle">
              {navbarState ? (
                <VscChromeClose onClick={() => setNavbarState(false)} />
              ) : (
                <GiMenu
                  onClick={(e) => {
                    e.stopPropagation();
                    setNavbarState(true);
                  }}
                />
              )}
            </div>
          </div>
          <div className="logout-button">
              {user ? (
                <>
                  <Button onClick={logoutUser}color="danger">
                    Déconnecter
                  </Button>
                  {' '}
                </>
              ) : (
                <>
                  {' '}
                </>
              )}
          </div>
          <ul className="links">
              {user ? (
                <>
                  <li>
                    <Input
                      id="exampleSelect"
                      name="select"
                      type="select"
                      onChange={(event) => setDataSetSelect(event.target.value)}
                      
                    >
                      {varDataSet.map((key) => {
                        return ( 
                          <option key={key.name} >
                            {key.name}
                          </option>
                        );
                      })}       
                    </Input>
                  </li>
                  <li>    
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Selection Date"
                        value={value}
                        minDate={new Date(dateAvailable[0])}
                        defaultCalendarMonth={new Date(dateAvailable[0])}
                        onChange={newValue => {
                          setValue(newValue.format('YYYY-MM-DD'))
                          refreshDataHour(newValue.format('YYYY-MM-DD'))
                        }}
                        // renderInput={params => <TextField {...params} />}
                        shouldDisableDate={customDayRenderer}
                        renderInput={({ inputRef, inputProps, InputProps }) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <input ref={inputRef} {...inputProps} />
                            {InputProps?.endAdornment}
                          </Box>
                        )}
                      />
                    </LocalizationProvider>                  
                  </li>
                  <li> 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Basic example"
                        value={valueHour}
                        views={['hours']}
                        ampm={false}
                        shouldDisableTime={customTimeRenderer}
                        onChange={(newValue) => {
                          setValueHour(newValue)
                        }}
                        renderInput={({ inputRef, inputProps, InputProps }) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <input ref={inputRef} {...inputProps} />
                            {InputProps?.endAdornment}
                          </Box>
                        )}

                        // renderInput={({ inputRef, inputProps, InputProps }) => (
                        //   <Box sx={{ display: 'flex', alignItems: 'center' }} >
                        //     <input ref={inputRef} {...inputProps} />
                        //     {InputProps?.endAdornment}
                        //   </Box>
                        // )}
                      />
                    </LocalizationProvider>
                    </li>
                  <li>
                    <Button
                        color="success"
                        size="sm"
                        onClick={() => submitSearch()}
                      >
                      Envoyer
                    </Button>
                    
                  </li>
                  {' '}
                  {/* <button onClick={logoutUser}>Logout</button> */}
                </>
              ) : (
                <>
                  {/* <Link to="/login">Login</Link> */}
                </>
              )}
            
          </ul>
        </Nav>
      <Map 
         data={mapData}
         valueDate={value}
         valueHour={valueHourRequest}
         dataSet={dataSetSelect}
         epsg={dataSets.epsg}
         hourAvailable={hourAvailable}
        />
      </Container>
      

  );
}

const GiMenu = styled(GiHamburgerMenu)`
  font-size: 20px;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 1vw;
  border-bottom: 2px solid #0f1e7a;
  .logout-button {
    margin-right: 10em;
  }
  a {
    text-decoration: none;
  }
  .brand1 {
    .social-name{
      color: #0f1e7a;
      font-family: Brush Script MT, Brush Script Std, cursive;
      font-size: 2em;
      margin-bottom: 0;
    }
    .social-name-two{
      color: black;
      font-family: Brush Script MT, Brush Script Std, cursive;
      font-size: 1.5em;
    }
    img {
      margin-top: 1rem;
      cursor: pointer;
    }
    .toggle {
      display: none;
    }
  }
  .links {
    display: flex;
    list-style-type: none;
    gap: 2rem;
    li {
      align-self: center;
      .nav-link {
        padding: 0;
      }
      .dropdown-menu{
        width: 15em;
      }
      a {
        color: #0f1e7a;
        font-weight: 600;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #f9c74f;
        }
      }
   
      .active {
        color: #f9c74f;
      }
    }
  }
`;
