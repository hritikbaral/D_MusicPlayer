const youtubeInput = document.getElementById("youtubeKey");
const backendInput = document.getElementById("backendKey");
////////////////
API_KEY = localStorage.getItem("youtubeKey");
/////////////////////
backendKey = localStorage.getItem("backendKey");

const BACKEND_URL = "https://dmusicplayerbackend-production.up.railway.app";

youtubeInput.value = localStorage.getItem("youtubeKey") || "";
backendInput.value = localStorage.getItem("backendKey") || "";

document.getElementById("saveKeys").onclick = () => {

    localStorage.setItem("youtubeKey", youtubeInput.value);
    localStorage.setItem("backendKey", backendInput.value);

    alert("Keys saved!");

    API_KEY = youtubeInput.value;
    backendKey = backendInput.value;

};


const player = document.getElementById("player");

player.setAttribute("preload", "auto");
player.setAttribute("playsinline", "");
player.setAttribute("controls", "true");

let currentIndex = -1;
let shuffleMode = false;
let loopMode = false;

async function playSong(song, index) {

    currentIndex = index;

    player.pause();
    player.src = "";

    document.getElementById("nowPlayingText").innerText = song.title;
    console.log("Playing:", song.title);
    const url =
        `${BACKEND_URL}/audio?videoId=${song.videoId}&key=${backendKey}&t=${Date.now()}`;

    player.src = url;
    player.load();

    if ("mediaSession" in navigator) {

        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: "YouTube",
            album: "D Music Player",
            artwork: [
                {
                    src: `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`,
                    sizes: "512x512",
                    type: "image/jpeg"
                }
            ]
        });

    }

    //player.play();
    player.play().catch(() => { });

}

/////////////////////

document.addEventListener("click", (e) => {

    const results = document.getElementById("results");
    const searchBox = document.getElementById("search");

    if (!results.contains(e.target) && !searchBox.contains(e.target)) {
        results.style.display = "none";
    }

});

navigator.mediaSession.setActionHandler("play", () => {
    player.play();
});

navigator.mediaSession.setActionHandler("pause", () => {
    player.pause();
});

navigator.mediaSession.setActionHandler("previoustrack", prevSong);
navigator.mediaSession.setActionHandler("nexttrack", nextSong);

player.addEventListener("play", () => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
    }
});

player.addEventListener("pause", () => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
    }
});

document.getElementById("results").addEventListener("focus", () => {

    const results = document.getElementById("results");

    if (results.children.length > 0) {
        results.style.display = "block";
    }

});

//////////////////////////

document.getElementById("copyPlaylist").onclick = () => {

    const text = JSON.stringify(playlist, null, 2);

    navigator.clipboard.writeText(text);

    alert("Playlist copied!");

};

document.getElementById("pastePlaylist").onclick = () => {
    openPlaylistModal();
};

function openPlaylistModal() {
    document.getElementById("playlistModal").style.display = "flex";
}

function closePlaylistModal() {
    document.getElementById("playlistModal").style.display = "none";
}

function submitPlaylist() {

    const text = document.getElementById("playlistInput").value;

    if (!text) return;

    try {

        const newSongs = JSON.parse(text);

        newSongs.forEach(song => {

            if (!playlist.some(s => s.videoId === song.videoId)) {
                playlist.push(song);
            }

        });

        localStorage.setItem("playlist", JSON.stringify(playlist));

        renderPlaylist();

        closePlaylistModal();

    } catch (err) {

        alert("Invalid playlist JSON");

    }

}


document.getElementById("nextBtn").onclick = nextSong;

document.getElementById("prevBtn").onclick = prevSong;


document.getElementById("shuffleToggle").onclick = () => {

    shuffleMode = !shuffleMode;

    document.getElementById("shuffleToggle").innerText =
        shuffleMode ? "Shuffle: ON" : "Shuffle: OFF";

};



player.onended = nextSong;


let results;
let playlistUI;

//let playlist = JSON.parse(localStorage.getItem("playlist")) || [
let playlist = [
  {
    title: "Coolie Disco - #COOLIE",
    videoId: "ReVGCvWIANA"
  },
  {
    title: "Taylor Swift - Opalite",
    videoId: "DN0G0Lbj6os"
  },
  {
    title: "Leo - Ordinary Person",
    videoId: "q6e_b0NERCA"
  },
  {
    title: "THE BANJO BEAT - RICKY DESKTOP",
    videoId: "htP6wfnjvGk"
  }
];


const searchInput = document.getElementById("search");

searchInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        searchYoutube(searchInput.value.trim());

    }

});

searchInput.addEventListener("focus", () => {

    if (results.children.length > 0) {
        results.style.display = "block";
    }

});

async function searchYoutube(query) {

    if (API_KEY == null || API_KEY === "") {
        alert("Please enter your YouTube API key");
        return;
    }

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



function nextSong() {

    if (playlist.length === 0) return;

    // LOOP MODE: replay same song
    if (loopMode) {
        playSong(playlist[currentIndex], currentIndex);
        return;
    }

    if (shuffleMode) {

        const randomIndex = Math.floor(Math.random() * playlist.length);
        playSong(playlist[randomIndex], randomIndex);

    } else {

        currentIndex++;

        if (currentIndex >= playlist.length) {
            currentIndex = 0;
        }

        playSong(playlist[currentIndex], currentIndex);

    }

}


function prevSong() {

    if (playlist.length === 0) return;

    // LOOP MODE: replay same song
    if (loopMode) {
        playSong(playlist[currentIndex], currentIndex);
        return;
    }

    if (shuffleMode) {

        const randomIndex = Math.floor(Math.random() * playlist.length);
        playSong(playlist[randomIndex], randomIndex);

    } else {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = playlist.length - 1;
        }

        playSong(playlist[currentIndex], currentIndex);

    }

}



function displayResults(videos) {

    results.style.display = "block";

    results.innerHTML = "";

    videos.forEach(video => {

        const videoId = video.id.videoId;

        const title = video.snippet.title;

        const thumbnail = video.snippet.thumbnails.medium.url;

        const song = {
            title: title,
            videoId: videoId
        };

        const div = document.createElement("div");

        div.className = "song";

        div.innerHTML = `
        <img src="${thumbnail}" width="120">
        <span>${title}</span>
        <button class="addBtn">+</button>
        `;

        div.onclick = () => {

            playSong(song, -1);

            results.style.display = "none";

        };

        div.querySelector(".addBtn").onclick = (e) => {

            e.stopPropagation();

            addToPlaylist(song);

        };

        results.appendChild(div);

    });

}



function addToPlaylist(song) {

    if (!song.videoId) return;

    const exists = playlist.some(s => s.videoId === song.videoId);

    if (!exists) {

        playlist.unshift(song);

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

        // play button
        li.querySelector(".playBtn").onclick = () => {
            playSong(song, index);
        };

        // delete button
        li.querySelector(".deleteBtn").onclick = () => {

            playlist.splice(index, 1);

            localStorage.setItem("playlist", JSON.stringify(playlist));

            renderPlaylist();

        };

        playlistUI.appendChild(li);

    });

}


document.getElementById("loopToggle").onclick = () => {

    loopMode = !loopMode;

    document.getElementById("loopToggle").innerText =
        loopMode ? "Loop: ON" : "Loop: OFF";

};


document.getElementById("playAll").onclick = () => {

    if (playlist.length === 0) return;

    currentIndex = 0;

    playSong(playlist[currentIndex], currentIndex);

};



document.addEventListener("DOMContentLoaded", () => {

    results = document.getElementById("results");
    playlistUI = document.getElementById("playlist");

    renderPlaylist();

});
