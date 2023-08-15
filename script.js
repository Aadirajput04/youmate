
const api = 'https://youmatebackend.youmateteamflax.repl.co'



// tab change
function changeTab(index) {

    const items = document.querySelectorAll('.tabs span')
    const contents = document.querySelectorAll('table')
    for (let i = 0; i < items.length; i++) {
        items[i].className = ''
        contents[i].classList.remove('active')

        if(i == index){
            items[i].className = 'active'
            contents[i].classList.add('active')
        }
        
    }

}




function numberToK(number = 0) {

    if (number < 1000) {
        return number.toString()
    } else {
        const newNumber = number / 1000
        return Math.round(newNumber * 10) / 10 + 'K'
    }

}

function urlToPageUrl(url = '') {
    let page = window.location.href

    // remove query param if exist
    if (page.indexOf('?') != -1) {
        page = page.split('?')[0]
    }

    return page + '?url=' + url
}


function byteToMb(bytes = 0){
    return Math.round(bytes / (1024 * 1024)) + 'mb'
}



// api call

const search = document.querySelector('#search')
let isSearchedForVideo = true
let isLoading = false


document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault()
    fetchData()
})



async function fetchData(){
    if (isLoading) return
    toggleOutput(false)
    isLoading = true
    // check for playlist or video

    if (search.value.indexOf('playlist') == -1) {
        // do video request

        // clear previous video
        clearVideos()

        isSearchedForVideo = true
        toggleLoading()
        await getVideo(search.value)
    } else {
        // do playlist task

        // clear the playlist
        clearPlaylist()

        isSearchedForVideo = false
        toggleLoading()
        await getPlaylist(search.value)
    }

    isLoading = false
    toggleLoading()
}


async function getPlaylist(url) {
    try {
        const res = await fetch(api + '/api/playlist?url=' + url)
        const json = await res.json()

        // show the playlist
        renderPlaylist(json)
        toggleOutput(true)
    } catch (error) {
        console.log(error)
        alert('something went wrong')
    }
}

function toggleLoading() {
    if (isLoading) {
        document.querySelector('form button').className = 'loading'
        document.querySelector('#output').style.display = 'none'
    } else {
        document.querySelector('form button').className = ''
        document.querySelector('#output').style.display = 'block'
    }
}


function renderPlaylist(data) {
    const parent = document.querySelector('#playlist')
    parent.innerHTML = playlistStructure
    parent.querySelector('h2').innerText = data.title

    // rendering playlist card
    data.videos.forEach(element => {

        const div = document.createElement('div')
        div.className = 'card'
        div.innerHTML = playlistCardStructure

        // updating data
        div.querySelector('img').src = element.thumbnail
        div.querySelector('h4').innerText = element.title
        div.querySelector('.views').innerText = numberToK(element.views)
        div.querySelector('.likes').innerText = numberToK(element.likes)
        div.querySelector('.dislikes').innerText = numberToK(element.dislikes)
        div.querySelector('a').href = urlToPageUrl(element.url)

        parent.appendChild(div)
    });


    // hide the video area if playlist is visible and vise versa
    document.querySelector('#video').style.display = 'none'
}

function clearPlaylist() {
    const parent = document.querySelector('#playlist')
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
}


function toggleOutput(isVisible = false){
    if(isVisible){
        document.querySelector('#output').style.display  = 'block'
    }else{
        document.querySelector('#output').style.display  = 'none'
    }
}


// ------------video -----------

async function getVideo(url) {
    try {
        const res = await fetch(api + '/api/video?url=' + url)
        const json = await res.json()

        // show the video
        renderVideo(json)
        toggleOutput(true)
    } catch (error) {
        console.log(error)
        alert('something went wrong')
    }
}


function renderVideo(data) {
    const parent = document.querySelector('#video')

    // updating data
    parent.querySelector('img').src = data.thumbnail
    parent.querySelector('h4').innerText = data.title
    parent.querySelector('.views').innerText = numberToK(data.views)
    parent.querySelector('.likes').innerText = numberToK(data.likes)
    parent.querySelector('.dislikes').innerText = numberToK(data.dislikes)

    const filter = filterData(data.downloads)

    // creating table rows

    for (let index = 0; index < filter.length; index++) {

        let parent = null
        if (index == 0) {
            parent = document.querySelector('.audio tbody')
        } else if (index == 1) {
            parent = document.querySelector('.mp4 tbody')
        } else if (index == 2) {
            parent = document.querySelector('.webm tbody')
        }

        filter[index].forEach(element => {

            const tr = document.createElement('tr')
            tr.className = 'table-item'
            tr.innerHTML = videoCardStructure
            tr.querySelector('.quality').innerText = element.quality
            tr.querySelector('.format').innerText = element.format
            tr.querySelector('.size').innerText = byteToMb(element.size)
            tr.querySelector('a').href = element.url

            parent.appendChild(tr)
        });
    }

}

function filterData(data) {
    const audio = []
    const mp4 = []
    const webm = []

    data.forEach(element => {
        if (element.format == '3gp') {
            audio.push(element)
        } else if (element.format == 'mp4') {
            mp4.push(element)
        } else if (element.format == 'webm') {
            webm.push(element)
        }
    });


    return [audio, mp4, webm]
}


function clearVideos() {
    const items = document.querySelectorAll('.table-item')
    let index = 0
    const len = items.length
    while (index < len) {
        items[index].remove()
        index += 1
    }
}







const playlistStructure = `

<p class="label">Playlist</p>
<h2>TypeScript: The Vue Parts</h2>
<div class="result">

    <!-- playlist card structure -->
   
</div>
`

const playlistCardStructure = `

<img src="https://i.ytimg.com/vi_webp/O9QSg09c2xw/maxresdefault.webp">
<div>
    <h4>Which Vue Developers should learn TypeScript? - TypeScript: The Vue Parts, Part 1
    </h4>
    <div class="chips">

        <!-- views -->
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path
                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path
                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
            </svg>
            <span class="views">10K</span>
        </div>

        <!-- like -->
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                <path
                    d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
            </svg>
            <span class="likes">2K</span>
        </div>

        <!-- dislike -->
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                <path
                    d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
            </svg>
            <span class="dislikes">1K</span>
        </div>
        <a href="#"><button>Download</button></a>
    </div>
</div>

`


const videoCardStructure = `

<td class="quality">720p</td>
<td class="format">MP4</td>
<td class="size">400mb</td>
<td><a href="#" target="blank">Download</a></td>

`






// --------------- fetch data if url not empty ---------------------

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('url');

// if url contain youtube url then start fetch
if(myParam){
    document.querySelector('#search').value = myParam
    fetchData()
}
