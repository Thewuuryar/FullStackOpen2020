import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Filter = ({text, defaultValue, onChange}) => (
  <div>
    {text} <input value={defaultValue} onChange={onChange} />
  </div>
)

const PersonForm = ({onSubmit, newName, setNewName, newNumber, setNewNumber}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={setNewName}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={setNewNumber}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons, filter, onClick}) => (
  <div>
    {persons
      .filter(person => person.name.toLowerCase().includes(filter))
      .map(person => 
        <div key={person.name}>
          {person.name} {person.number} 
          <button onClick={() => onClick(person.id,person.name)}>delete</button>
        </div>)}
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
          setPersons(initialPersons)
        }
      )
  }, [])

  const addNewPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if(existingPerson) {
      if(existingPerson.number !== newNumber) {
        if(window.confirm(`${newName} is already added to the phonebook. Replace old number with new one?`)) {
          personService
            .update(existingPerson.id, newPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
              setErrorMessage(
                `${newName}'s number has been changed`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
            .catch(error => {
              setErrorMessage(
                `Information of ${newName} has already been deleted from the server.`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
        }
      }
      else {
        setErrorMessage(
          `${newName} is already added to the phonebook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setErrorMessage(
            `${newName} added`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id, name) => {
    if(window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter text="filter shown with" defaultValue={newFilter} onChange={(event) => setFilter(event.target.value.toLowerCase())}/>
      <h2>add a new</h2>
      <PersonForm onSubmit={addNewPerson} 
        newName={newName} setNewName={(event) => setNewName(event.target.value)}
        newNumber={newNumber} setNewNumber={(event) => setNewNumber(event.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} onClick={deletePerson}/>
    </div>
  )
}

export default App