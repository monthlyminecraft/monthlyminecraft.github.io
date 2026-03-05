const canvas=document.getElementById("bg")
const ctx=canvas.getContext("2d")

function resize(){
canvas.width=window.innerWidth
canvas.height=window.innerHeight
}

resize()
window.onresize=resize

let cubes=[]

for(let i=0;i<60;i++){
cubes.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:20+Math.random()*40,
speed:0.2+Math.random()
})
}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height)

cubes.forEach(c=>{

ctx.strokeStyle="#22c55e"
ctx.strokeRect(c.x,c.y,c.size,c.size)

c.y -= c.speed

if(c.y<-50){
c.y=canvas.height
}

})

requestAnimationFrame(animate)
}

animate()

function copyIP(){
navigator.clipboard.writeText("rowbot.in:25565")
alert("Server IP copied!")
}

fetch("https://api.mcsrvstat.us/2/rowbot.in:25565")
.then(res=>res.json())
.then(data=>{

document.getElementById("playercount").innerText=
data.players.online+" / "+data.players.max+" players online"

let container=document.getElementById("players")

if(data.players.list){

data.players.list.forEach(name=>{

let player=document.createElement("div")
player.className="player"

player.innerHTML=`
<img src="https://crafatar.com/renders/head/${name}?overlay">
<p>${name}</p>
`

container.appendChild(player)

})

}

})
