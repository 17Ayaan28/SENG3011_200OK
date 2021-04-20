import React from 'react'

const Quotes = ({ quotes }) => {
  return (
    <div>
      {quotes.map((quote) => (
        <h1>{quotes.Quotes}</h1>
      ))}
    </div>
  )
};

export default Quotes;