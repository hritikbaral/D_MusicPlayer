const player = document.getElementById("player");
const results = document.getElementById("results");
const playlistUI = document.getElementById("playlist");

let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

const demoSongs = [
 {title:"Song 1", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
 {title:"Song 2", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
 {title:"Song 3", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"}
];

function showResults(){

results.innerHTML="";

demoSongs.forEach(song=>{

 const div = document.createElement("div");

 div.className="song";

 div.innerText=song.title;

 div.onclick=()=>{
  addToPlaylist(song);
 };

 results.appendChild(div);

});

}

function addToPlaylist(song){

playlist.push(song);

localStorage.setItem("playlist",JSON.stringify(playlist));

renderPlaylist();

}

function renderPlaylist(){

playlistUI.innerHTML="";

playlist.forEach((song,index)=>{

 const li=document.createElement("li");

 li.innerText=song.title;

 li.onclick=()=>{

  player.src=song.url;

  player.play();

 };

 playlistUI.appendChild(li);

});

}

document.getElementById("shuffle").onclick=()=>{

playlist.sort(()=>Math.random()-0.5);

renderPlaylist();

};

showResults();
renderPlaylist();
