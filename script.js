const tracks = [{id: "6648906de52a0be7b6faf5de", tier: 2, name: "Beach Day"}, 
                {id: "661f32576a3327cdc66ebc8a", tier: 5, name: "unnamed"}]
let points = [];

let tiers = [];
for (let i = 0; i < 10; i++) {
  var tier = document.createElement("div");
  var bgcolor = "hsla(" + i * 36 + ", 100%, 5%, 1)"
  var outlinecolor = "hsla(" + i * 36 + ", 100%, 15%, 1)"
  tier.className = "tier";
  tier.innerHTML = "<h2 class='tier' style='background-color: " + bgcolor + "; border-color: " + outlinecolor + "'>Tier " + (i + 1) + "</h2>"

  var columns = []
  var table = document.createElement("table");
  table.innerHTML = "<tr><th style='border-color: " + outlinecolor + "'>Track</th><th style='border-color: " + outlinecolor + "'>Mapper</th><th style='border-color: " + outlinecolor + "'>Finishes</th></tr>"
  table.className = "tier";
  table.style.backgroundColor = bgcolor;
  table.style.borderColor = outlinecolor;
  tier.appendChild(table)
  
  tier.style.backgroundColor = bgcolor;
  tier.style.borderColor = outlinecolor;
  document.body.appendChild(tier);
  tiers.push(table)
}

function getData() {
  var fetches = [];
  for (let i = 0; i < tracks.length; i++) {
    fetches.push(fetch("https://api.dashcraft.io/trackv2/" + tracks[i].id + "?supportsLaps1=true", {
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM0NmMzNGExYmEyMjQyNGYyZTAwMzIiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcwNzM3MTU3Mn0.0JVw6gJhs4R7bQGjr8cKGLE7CLAGvyuMiee7yvpsrWg'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        json.tier = tracks[i].tier;
        json.name = tracks[i].name;
        return (json)
      })
    )
  }
  Promise.all(fetches)
  .then((data) => {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      if (data[i].isPublic && !data[i].leaderboard.find(x => x.user.username == data[i].user.username)) {

        if (points.find(x => x.username == data[i].user.username)) {
          points.find(x => x.username == data[i].user.username).points += 2**(10-data[i].tier)
        } else {
          points.push({username: data[i].user.username, points: 2**(10-data[i].tier)})
        }
        
      }
      
      var table = "";
      var outlinecolor = "border-color: hsla(" + (data[i].tier-1) * 36 + ", 100%, 15%, 1);"
      table += "<tr>"
      table += "<td style='" + outlinecolor + "'><a href='https://dashcraft.io/?t="+ data[i]._id + "' target='blank'>" + data[i].name + "</a></td>"
      table += "<td style='" + outlinecolor + "'>" + data[i].user.username + "</td>"
      table += "<td style='" + outlinecolor + "'>" + data[i].leaderboard.length + "</td>"
      table += "</tr>"
      tiers[data[i].tier - 1].innerHTML += table

      for (let j = 0; j < data[i].leaderboard.length; j++) {
        if (points.find(x => x.username == data[i].leaderboard[j].user.username)) {
          points.find(x => x.username == data[i].leaderboard[j].user.username).points += 2**(10-data[i].tier)
        } else {
          points.push({username: data[i].leaderboard[j].user.username, points: 2**(10-data[i].tier)})
        }
      }
    }
    console.log(points)


    points.sort((a, b) => b.points - a.points)
    
    var tableHTML = document.createElement("table")
    var style = " style='border-color: hsla(0, 100%, 15%, 1); background-color: hsla(0, 100%, 5%, 1);'"
    
    tableHTML.innerHTML =  "<tr><th" + style + ">Username</th><th" + style + ">Points</th></tr>"
    document.body.appendChild(tableHTML)
    for (let i = 0; i < points.length; i++) {
      var outlinecolor = "border-color: hsla(" + ((i)*360/points.length) + ", 100%, 15%, 1);"
      var backgroundColor = "background-color: hsla(" + ((i)*360/points.length) + ", 100%, 5%, 1)"
      var table = "<tr>"
      table += "<td style='" + outlinecolor + " " + backgroundColor + "'>" + points[i].username + "</td>"
      table += "<td style='" + outlinecolor + " " + backgroundColor + "'>" + points[i].points + "</td>"
      table += "</tr>"
      tableHTML.innerHTML += table
    }
  });
}


getData()
