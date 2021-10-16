import React from 'react'

/*
   Renders the legend of a map
*/
const Legend = (props) => (
  <table style={{ margin: '0 auto', marginTop: '.5em' }}>
    <tbody>
      {props.colors.map((color, index) => (
        <tr key={index}>
          <td
            style={{
              paddingRight: 20,
              textAlign: 'left'
            }}
          >
            {color.nom}
          </td>
          <td>
            {index === 0
              ? `> ${color.valor}`
              : `${color.valor}-${props.colors[index - 1].valor}`}
          </td>
          <td
            style={{
              backgroundColor: color.color,
              width: 50,
              border: '1px solid #000'
            }}
          />
        </tr>
      ))}
    </tbody>
  </table>
)

export default Legend
