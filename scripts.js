const loadingCircle = document.getElementById('loadingCircle');
const videoPopup = document.getElementById('videoPopup');
const popupVideo = document.getElementById('popupVideo');
const closeButton = document.getElementById('closeButton');
const tapHint = document.getElementById('tapHint');
const markerStatus = document.getElementById('markerStatus');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

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


// 再生中のフラグと現在の動画インデックス
let isPlaying = false;
let currentVideoIndex = 0;

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
    if (isPlaying) return; // 映像再生中は表示しない

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

// 動画を再生する関数
function showPopupVideo(videoPathsArray) {
    if (isPlaying) return;

    isPlaying = true;
    currentVideoIndex = 0;
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
        updateMarkerStatus(true, true); // 動画再生中はステータスを表示
        video.play();
    };

    video.onerror = () => {
        setTimeout(() => {
            playVideo(currentVideoIndex);
        }, 500);
    };

    playVideo(currentVideoIndex);

    video.addEventListener('click', () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoPathsArray.length;
        playVideo(currentVideoIndex);
    });

    closeButton.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        videoPopup.style.display = 'none';
        isPlaying = false;
        updateMarkerStatus(false); // ×ボタンを押したらステータス非表示
    });
}

// マーカーイベントを処理
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        if (isPlaying) return;

        const markerId = marker.id;
        if (videoPaths[markerId]) {
            setTimeout(() => {
                showPopupVideo(videoPaths[markerId]);
            }, 1000);
        }

        updateMarkerStatus(true, true);  // マーカーが見つかった時に緑色で表示
    });

    marker.addEventListener('markerLost', () => {
        if (!isPlaying) {
            updateMarkerStatus(true, false);  // マーカーが見つからない場合は赤色で表示
        }
    });
});

// ページロード時に動画を事前ロード
window.addEventListener('load', () => {
    preloadVideos();
    updateMarkerStatus(false); // 初期状態は非表示
});