const loadingCircle = document.getElementById('loadingCircle');
const videoPopup = document.getElementById('videoPopup');
const popupVideo = document.getElementById('popupVideo');
const closeButton = document.getElementById('closeButton');
const tapHint = document.getElementById('tapHint');
const markerStatus = document.getElementById('markerStatus');

// 動画のパス
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

// 各マーカーごとに現在の動画インデックスを管理
const markerVideoIndexes = {};

// 初期化
Object.keys(videoPaths).forEach(markerId => {
    markerVideoIndexes[markerId] = 0;
});

// ログを出力する関数
function log(message) {
    console.log(`[DEBUG] ${message}`);
}

// UIヒントを表示
function showTapHint() {
    tapHint.style.display = 'block';
    tapHint.classList.add('show');
}

// 動画を再生する関数
function showPopupVideo(markerId) {
    if (!videoPaths[markerId]) return;

    log(`マーカー検出: ${markerId}`);
    isPlaying = true;

    let currentVideoIndex = markerVideoIndexes[markerId];
    const video = popupVideo;

    function playVideo(index) {
        video.src = `/Users/nd/Downloads/dlc_3.2/videos/${videoPaths[markerId][index]}`;
        video.load();
        video.loop = true;

        video.play().catch(() => {
            log("自動再生に失敗しました。タップしてください。");
            showTapHint();
        });

        log(`動画を変更: ${video.src}`);
    }

    loadingCircle.style.display = 'block';
    videoPopup.style.display = 'none';

    video.oncanplaythrough = () => {
        log("動画が完全にロードされました");
        loadingCircle.style.display = 'none';
        videoPopup.style.display = 'block';
        video.play();
    };

    video.onerror = () => {
        log("動画の読み込みに失敗: " + video.src);
        setTimeout(() => {
            video.load();
            video.play().catch(err => log("再生エラー: " + err));
        }, 1000);
    };

    playVideo(currentVideoIndex);

    video.addEventListener('click', () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoPaths[markerId].length;
        markerVideoIndexes[markerId] = currentVideoIndex;
        playVideo(currentVideoIndex);
    });

    closeButton.addEventListener('click', () => {
        log("動画を閉じる");
        video.pause();
        video.currentTime = 0;
        videoPopup.style.display = 'none';
        isPlaying = false;
    });
}

// **マーカーイベントを処理**
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        const markerId = marker.id;
        log(`markerFound: ${markerId}`);

        if (!isPlaying) {
            setTimeout(() => {
                showPopupVideo(markerId);
            }, 1000);
        }
    });

    marker.addEventListener('markerLost', () => {
        const markerId = marker.id;
        log(`markerLost: ${markerId}`);
    });
});

// **ページロード時の処理**
window.addEventListener('load', () => {
    log("ページロード完了");
});
