import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const Header = (props) => {
  return (
    <div>
      <h1>{props.text}</h1>
    </div>
  )
}

const Anecdotes = (props) => {
  if(props.showMost) {
    let most = 0
    let i = 0
    for(i = 0; i<anecdotes.length-1; i++) {
      if(props.votes[most] < props.votes[i]) {
        most = i
      }
    }
    return (
      <div>
        <p>{anecdotes[most]}</p>
        <p>has votes {props.votes[most]}</p>
      </div>
    )
  }

  return (
    <div>
      <p>{anecdotes[props.select]}</p>
      <p>has votes {props.votes[props.select]}</p>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([0,0,0,0,0])

  const pickRandom = () => {
    let rand = 0
    do {
      rand = Math.floor(Math.random() * (anecdotes.length-1))
    }
    while (selected === rand)
    setSelected(rand)
  }

  const addVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <Header text="Anecdote of the Day" />
      <Anecdotes select={selected} votes={votes} />
      <Button onClick={addVote} text="vote" />
      <Button onClick={pickRandom} text="next anecdote" />

      <Header text="Anecdote with most votes" />
      <Anecdotes votes={votes} showMost="true" />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)