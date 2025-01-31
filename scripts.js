const loadingCircle = document.getElementById('loadingCircle');
const videoPopup = document.getElementById('videoPopup');
const popupVideo = document.getElementById('popupVideo');
const closeButton = document.getElementById('closeButton');
const tapHint = document.getElementById('tapHint');
const markerStatus = document.getElementById('markerStatus');

// 動画のパスを指定
const videoPaths = {
    city1: ['human_tb.mov', 'human_t.mov'],
    city2: ['dog_tb.mov', 'dog_t.mov'],
    city3: ['cat_tb.mov', 'cat_t.mov'],
    city4: ['crow_tb.mov', 'crow_t.mov'],
    grass1: ['giraffe_tb.mov', 'giraffe_t.mov'],
    grass2: ['meerkat_tb.mov', 'meerkat_t.mov'],
    grass3: ['horse_tb.mov', 'horse_t.mov'],
    grass4: ['kangaroo_tb.mov', 'kangaroo_t.mov'],
    jungle1: ['gibbon_tb.mov', 'gibbon_t.mov'],
    jungle2: ['bear_tb.mov', 'bear_t.mov'],
    jungle3: ['ezorisu_tb.mov', 'ezorisu_t.mov'],
    jungle4: ['deer_tb.mov', 'deer_t.mov'],
    ocean1: ['penguin_tb.mov', 'penguin_t.mov'],
    ocean2: ['seal_tb.mov', 'seal_t.mov'],
    ocean3: ['seaotter_tb.mov', 'seaotter_t.mov'],
    ocean4: ['seaturtle_tb.mov', 'seaturtle_t.mov']
};

// 各マーカーごとの動画インデックスを保存
let currentVideoIndices = {};
let isPlaying = false;

// 動画を事前に読み込む関数
const preloadVideos = () => {
    Object.values(videoPaths).forEach(paths => {
        paths.forEach(path => {
            const video = document.createElement('video');
            video.src = path;
            video.preload = 'auto';
            video.load();
            video.muted = true;
        });
    });
};

// マーカー検出ステータスを更新する関数
function updateMarkerStatus(show, isMarkerFound = false) {
    if (isPlaying) return;

    if (show) {
        if (isMarkerFound) {
            markerStatus.innerText = "マーカーを検出中...";
            markerStatus.style.color = "green";
        } else {
            markerStatus.innerText = "マーカーが見つかりません";
            markerStatus.style.color = "red";
        }
        markerStatus.style.display = "block";
    } else {
        markerStatus.style.display = "none";
    }
}

// UIヒントを表示する関数
function showTapHint() {
    tapHint.style.display = 'block';
    tapHint.classList.add('show');
}

// 動画を再生する関数（修正済み）
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

// マーカーイベントを処理
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

// ページロード時に動画を事前ロード
window.addEventListener('load', () => {
    preloadVideos();
    updateMarkerStatus(false);
});
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
