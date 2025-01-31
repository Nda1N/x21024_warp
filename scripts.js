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

// 各マーカーごとの `currentVideoIndex`
const currentVideoIndices = {};

// 初期化
Object.keys(videoPaths).forEach(markerId => {
    currentVideoIndices[markerId] = 0;
});

// 動画を事前にロード
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
function showPopupVideo(markerId) {
    if (!videoPaths[markerId]) return;

    const videoPathsArray = videoPaths[markerId];
    let currentVideoIndex = currentVideoIndices[markerId];

    if (!isPlaying) {
        isPlaying = true;

        const video = popupVideo;
        video.pause();
        video.src = videoPathsArray[currentVideoIndex];
        video.load();

        video.oncanplay = () => {
            loadingCircle.style.display = 'none';
            videoPopup.style.display = 'block';
            updateMarkerStatus(true, true); // 動画再生中は「マーカーを検出中」と表示
            video.play();
            showTapHint();
        };

        loadingCircle.style.display = 'block';
        videoPopup.style.display = 'none';

        video.play(); // これを追加

        // `click` で動画を切り替えるイベントを最初に登録
        popupVideo.onclick = () => {
            video.pause();
            currentVideoIndex = (currentVideoIndex + 1) % 2;
            video.src = videoPathsArray[currentVideoIndex];
            video.load();
            video.play();
            currentVideoIndices[markerId] = currentVideoIndex; // インデックスを保存
        };
    }
}

// 閉じるボタンのイベント
closeButton.addEventListener('click', () => {
    popupVideo.pause();
    popupVideo.currentTime = 0;
    videoPopup.style.display = 'none';
    isPlaying = false;
    updateMarkerStatus(false); // ×ボタンを押したらステータス非表示
});

// マーカーイベントを処理
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        if (isPlaying) return;

        const markerId = marker.id;
        if (videoPaths[markerId]) {
            setTimeout(() => {
                showPopupVideo(markerId);
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
