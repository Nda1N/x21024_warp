// マーカーごとの現在の動画インデックスを保持するオブジェクト
let currentVideoIndices = {};

// 動画を再生する関数（修正）
function showPopupVideo(markerId, videoPathsArray) {
    if (isPlaying) return;

    isPlaying = true;

    // もし初回ならインデックスを 0 に設定
    if (!(markerId in currentVideoIndices)) {
        currentVideoIndices[markerId] = 0;
    }
    
    let currentVideoIndex = currentVideoIndices[markerId];
    const video = popupVideo;

    function playVideo(index) {
        video.src = videoPathsArray[index];
        video.load();
        video.loop = true;
        video.play();
        showTapHint();
    }

    loadingCircle.style.display = 'block';
    videoPopup.style.display = 'none';

    video.oncanplaythrough = () => {
        loadingCircle.style.display = 'none';
        videoPopup.style.display = 'block';
        updateMarkerStatus(true, true);
        video.play();
    };

    video.onerror = () => {
        setTimeout(() => {
            playVideo(currentVideoIndex);
        }, 500);
    };

    playVideo(currentVideoIndex);

    // `click` で動画を切り替えるイベントを最初に登録
    popupVideo.onclick = () => {
        video.pause();
        currentVideoIndex = (currentVideoIndex + 1) % 2;
        video.src = videoPathsArray[currentVideoIndex];
        video.load();
        video.play();
        currentVideoIndices[markerId] = currentVideoIndex; // インデックスを保存
    };

    closeButton.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        videoPopup.style.display = 'none';
        isPlaying = false;
        updateMarkerStatus(false);
    });
}

// マーカーイベントを処理（修正）
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        if (isPlaying) return;

        const markerId = marker.id;
        if (videoPaths[markerId]) {
            setTimeout(() => {
                showPopupVideo(markerId, videoPaths[markerId]);
            }, 1000);
        }

        updateMarkerStatus(true, true);
    });

    marker.addEventListener('markerLost', () => {
        if (!isPlaying) {
            updateMarkerStatus(true, false);
        }
    });
});
