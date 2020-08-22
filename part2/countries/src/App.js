import React, {useState, useEffect} from 'react'
import axios from 'axios'

const FilterForm = ({text, defaultValue, onChange}) => (
  <div>
    {text} <input value={defaultValue} onChange={onChange}/>
  </div>
)

const Results = ({countries, filter, onClick, weather, setWeather}) => {
  const filtered = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))

  if(filtered.length > 10){
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  
  if(filtered.length === 1) {
    return (
      <div>
        <Country country={filtered[0]}/>
        <Weather country={filtered[0]} weather={weather} setWeather={setWeather} />
      </div>
    )
  }
  
  return (
    filtered.map(country => <div key={country.name}>{country.name} <button onClick={() => onClick(country.name)}>show</button></div>)
  )
}

const Weather = ({country, weather, setWeather}) => {
  useEffect(() => {
    const api_key = process.env.REACT_APP_WEATHERSTACK_API_KEY
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
      .then(
        response => {
          setWeather(response.data)
        }
      )
  }, [country, setWeather])

  if(!weather.success){
    return (
      <div>
        <h3>Weather in {country.capital}</h3>
        <div>Unable to reach weather service</div>
      </div>
    )
  }

  return (
    <div>
      <h3>Weather in {country.capital}</h3>
      <div>
        <b>temperature: </b>
        {weather.current.temperature} celcius
      </div>
      <img src={weather.current.weather_icons[0]} alt={weather.current.weather_descriptions[0]} />
      <div>
        <b>wind: </b>
        {weather.current.wind_speed} mph {weather.current.wind_degree} {weather.current.wind_dir}
      </div>
    </div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>Lanuages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} width="200" height="100" alt={country.name} />
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState([])
  
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(
        response => {
          setCountries(response.data)
        }
      )
  }, [])

  return (
    <div>
      <FilterForm text="find countries" defaultValue={filter} onChange={(event) => setFilter(event.target.value)} />
      <Results countries={countries} filter={filter} onClick={(show) => setFilter(show)} weather={weather} setWeather={setWeather}/>
    </div>
  )
}

export default App;
