import React from 'react'

const Header = (props) => <h1>{props.course.name}</h1>

const Part = (props) => <p>{props.name} {props.exercises}</p>

const Content = (props) => (
  <div>
    {props.course.parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />
    )}
  </div>
)

const Total = (props) => {
  const total = props.course.parts.reduce((total, part) => total += part.exercises, 0)
  return (
    <div>
      <b>total of {total} exercises</b>
    </div>
  )
}

const Course = (props) => (
  <div>
    <Header course={props.course} />
    <Content course={props.course} />
    <Total course={props.course} />
  </div>
)

const Courses = (props) => (
  <div>
    {props.courses.map(course => <Course key={course.id} course={course} />)}
  </div>
)

export default Courses