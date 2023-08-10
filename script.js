document.addEventListener('DOMContentLoaded', function() {
    const videoButton = document.getElementById('videoButton');
    const playlistButton = document.getElementById('playlistButton');
    const videoContent = document.getElementById('videoContent');
    const playlistContent = document.getElementById('playlistContent');

    videoButton.addEventListener('click', function() {
        videoContent.style.display = 'block';
        playlistContent.style.display = 'none';
        videoButton.classList.add('active');
        playlistButton.classList.remove('active');
    });

    playlistButton.addEventListener('click', function() {
        videoContent.style.display = 'none';
        playlistContent.style.display = 'block';
        playlistButton.classList.add('active');
        videoButton.classList.remove('active');
    });
});






document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const boxes = document.querySelectorAll(".box");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("underline"));
            tab.classList.add("underline");

            const targetBoxId = tab.id.replace("tab-", "box-");
            boxes.forEach(box => box.classList.remove("active"));
            document.getElementById(targetBoxId).classList.add("active");
        });
    });

    tabs[0].click(); // Display MP3 content by default
});
