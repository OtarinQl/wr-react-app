import React, { Component } from 'react'
import axios from 'axios'

import './App.css'

class App extends Component {
  state = {
    city: '',
    weatherData: null,
    isLoaded: false
  }

  inputHandler = e => {
    this.setState({ city: e.target.value })
  }

  buttonHandler = e => {
    e.preventDefault()
    this.setState({ weatherData: (<div className="loader"></div>) })
    const location =  this.state.city 
    const token = 'pk.eyJ1Ijoib3RhcmlucXIiLCJhIjoiY2p4d2UyZGVsMGVzdjNkbXZtOGFpajRvcSJ9.IstlB__mcSeuqZmDAm8eEQ'
    const geoURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${token}&limit=1`
    return axios.get(geoURL)
    .then(res => {
      const coord = {
        long: res.data.features[0].center[0],
        lati: res.data.features[0].center[1]
      }
      const token = 'bbadd512123b32f96284d2b6c219714c'
      const weatherURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${token}/${coord.lati},${coord.long}?lang=es&units=si`
      return axios.get(weatherURL)
      .then(res => {
        const weatherData = res.data.currently
        const result = (
          <div className="Data">
            <h1>{ res.data.location }</h1>
            <h3>{ weatherData.summary }</h3>
            <p><strong>Temperatura: </strong>{ weatherData.temperature }C</p>
            <p><strong>Porcentaje de precipitación: </strong>{ weatherData.precipProbability * 100 }%</p>
          </div>
        )

        this.setState({ weatherData: result })

        return null
      })
      .catch(e => {
        this.setState({ weatherData: (
          <div>
            <h1>No se ha podido encontrar la localidad.</h1>
            <h3>Pruebe nuevamente.</h3>
          </div>
        ) })
      })
    })
    .catch(e => {
      this.setState({ weatherData: (
        <div>
          <h1>No se ha podido encontrar la localidad.</h1>
          <h3>Pruebe nuevamente.</h3>
        </div>
      ) })
    })
  }

  render () {
    return (
      <div className="Container">
        <div className="Header">
          <div className="Title">
            <h1>Weather Report</h1>
              <h4>Tu página favorita del clima hecho por tu panda favorito.</h4>
          </div>
          <div className="Img">
          </div>
        </div>
        <div className="Searcher">
          <form>
            <input
              onChange={ this.inputHandler }
              name="city"
              placeholder="Escriba la ciudad de la cual esté interesado en saber su clima." />
            <button onClick={ this.buttonHandler }>BUSCAR</button>
          </form>
            <div className="WeatherReport">{ this.state.weatherData }</div>
        </div>
      </div>
    )
  }
}

export default App
