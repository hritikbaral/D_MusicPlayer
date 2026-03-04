const player = document.getElementById("player");

function playSong(song) {

    document.getElementById("nowPlayingText").innerText = song.title;

    player.pause();
    player.src = "";

    setTimeout(() => {

        player.src = song.url;

        player.play().catch(() => { });

    }, 100);

}



player.onended = () => {

    let index = playlist.findIndex(s => s.url === player.src);

    if (index >= 0 && index < playlist.length - 1) {

        playSong(playlist[index + 1]);

    }

};


const results = document.getElementById("results");
const playlistUI = document.getElementById("playlist");

let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

// const demoSongs = [
//     { title: "Song 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
//     { title: "Song 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
//     { title: "Song 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
// ];

// function showResults() {

//     results.innerHTML = "";

//     demoSongs.forEach(song => {

//         const div = document.createElement("div");
//         div.className = "song";

//         div.innerHTML = `
//  ${song.title}
//  <button class="addBtn">+</button>
//  `;

//         div.onclick = () => playSong(song);

//         div.querySelector(".addBtn").onclick = (e) => {
//             e.stopPropagation();
//             addToPlaylist(song);
//         };

//         results.appendChild(div);

//     });

// }

const API_KEY = "AIzaSyA2gfj8NsvgoWyuz57vyPIa6WcvnnO7Jgg";

const searchInput = document.getElementById("search");

searchInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        searchYoutube(searchInput.value);

    }

});


async function searchYoutube(query) {

    results.innerHTML = "Searching...";

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

    if (!data.items) {
        results.innerHTML = "API Error. Check console.";
        return;
    }

    displayResults(data.items);

}



function displayResults(videos) {

    results.innerHTML = "";

    videos.forEach(video => {

        const videoId = video.id.videoId;

        const title = video.snippet.title;

        const thumbnail = video.snippet.thumbnails.medium.url;

        const song = {
            title: title,
            url: `https://YOUR_BACKEND/audio?videoId=${videoId}`
        };

        const div = document.createElement("div");

        div.className = "song";

        div.innerHTML = `
        <img src="${thumbnail}" width="120">
        <span>${title}</span>
        <button class="addBtn">+</button>
        `;

        div.onclick = () => playSong(song);

        div.querySelector(".addBtn").onclick = (e) => {

            e.stopPropagation();

            addToPlaylist(song);

        };

        results.appendChild(div);

    });

}



function addToPlaylist(song) {

    if (!playlist.some(s => s.url === song.url)) {

        playlist.push(song);

        localStorage.setItem("playlist", JSON.stringify(playlist));

        renderPlaylist();

    }

}


function renderPlaylist() {

    playlistUI.innerHTML = "";

    playlist.forEach((song, index) => {

        const li = document.createElement("li");

        li.className = "playlist-item";

        li.innerHTML = `
 <span>${song.title}</span>
 <div>
  <button class="playBtn">▶</button>
  <button class="deleteBtn">❌</button>
 </div>
 `;

        li.querySelector(".playBtn").onclick = () => {
            playSong(song);
        };

        li.querySelector(".deleteBtn").onclick = () => {
            playlist.splice(index, 1);
            localStorage.setItem("playlist", JSON.stringify(playlist));
            renderPlaylist();
        };

        playlistUI.appendChild(li);

    });

}


document.getElementById("shuffle").onclick = () => {

    playlist.sort(() => Math.random() - 0.5);

    renderPlaylist();

};

showResults();
renderPlaylist();



document.getElementById("playAll").onclick = () => {

    if (playlist.length > 0) {

        playSong(playlist[0]);

    }

};

document.getElementById("shuffle").onclick = () => {

    playlist.sort(() => Math.random() - 0.5);

    renderPlaylist();

};

document.getElementById("reset").onclick = () => {

    playlist = JSON.parse(localStorage.getItem("playlist")) || [];

    renderPlaylist();

};

