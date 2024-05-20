import React from 'react'
import spankbang from 'spankbang'
function SpankbangComponent() {
async function callApi(){
    const url = 'https://spankbang.com/7slau/video/new+sensations+my+girlfriend+calls+me+while+she+s+fucking+bbc+alyx+star'
const details = await spankbang.videos.details({url})
console.log(details)
}
  return (
    <div><button onClick={()=>callApi()}>Spankbang Testing</button></div>
  )
}

export default SpankbangComponent