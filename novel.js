//スポイラー設定
let spoilerOff =[]
console.log(localStorage.getItem('spoilerSaveData').split(','))
let spoilerSaveData = localStorage.getItem('spoilerSaveData').split(',');
spoilerOff = spoilerSaveData
for(i=0;i < spoilerSaveData.length; i++){
    if(!document.querySelector(`[data-scenario="${spoilerSaveData[i]}"]`))continue
    document.querySelector(`[data-scenario="${spoilerSaveData[i]}"]`).checked = true
}
document.querySelectorAll(".spoiler-btn").forEach(v => v.addEventListener("change", (e) => {
    if(e.target.checked){
        spoilerOff.push(e.target.dataset.scenario)
    }else{
        spoilerOff.splice(spoilerOff.indexOf(e.target.dataset.scenario), 1)
    }
    localStorage.setItem('spoilerSaveData',spoilerOff)
    console.log(spoilerOff)
    }));


    //シナリオ設定
    let scenes = []; // シナリオデータを格納する変数
    let currentScene = 0; // 現在のシーン番号
    let typingTimer; // タイピングアニメーション用のタイマー
    
    // HTML要素の取得
    const textElement = document.getElementById("text");
    const characterNameElement = document.getElementById("character-name");
    const characterContainer = document.getElementById("character-container");
    const gameContainer = document.getElementById("game-container");
    const menuContainer = document.getElementById("menu-container");
    const storyButtons = document.querySelectorAll(".story-button");
    
    // シナリオデータを読み込む関数
    async function loadScenario(scenarioFile) {
        try {
            const response = await fetch(`scenarios/${scenarioFile}`);
            if (!response.ok) throw new Error("シナリオの読み込みに失敗しました。");
            scenes = await response.json();
            currentScene = 0; // シーン番号をリセット
            showScene(0);
            menuContainer.style.display = "none"; // メニューを非表示
            gameContainer.style.display = "flex"; // ゲーム画面を表示
        } catch (error) {
            console.error(error);
        }
    }
    
    // シーンを表示する関数
    function showScene(sceneIndex) {
        const scene = scenes[sceneIndex];
        characterNameElement.textContent = scene.name || ""; // 話者の名前を表示
    
        // 前のキャラクターをクリア
        characterContainer.innerHTML = "";
    
        // キャラクターを表示
        scene.characters.forEach(character => {
            const img = document.createElement("img");
            img.src = `imge/${character.src}`; // "imge"フォルダから画像を取得
            img.classList.add("character", character.position);
            img.style.display = "block";
            characterContainer.appendChild(img);
        });
    
        // テキストを1文字ずつ表示
        typeText(scene.text);
    }
    
    // テキストを1文字ずつ表示する関数
    function typeText(text) {
        textElement.textContent = ""; // 以前のテキストをクリア
        let index = 0;
    
        clearInterval(typingTimer); // 以前のタイマーをクリア
        typingTimer = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index); // 1文字追加
                index++;
            } else {
                clearInterval(typingTimer); // テキストの表示が完了したらタイマーをクリア
            }
        }, 50); // 100msごとに次の文字を表示
    }
    
    // 次のシーンに進む関数
    function nextScene() {
        if (currentScene < scenes.length - 1) {
            currentScene++;
            showScene(currentScene);
        } else {
            returnToMenu(); // 最初のメニューに戻る
        }
    }
    
    // 最初のメニューに戻る関数
    function returnToMenu() {
        const overlay = document.getElementById("overlay");
        overlay.classList.add("visible"); // オーバーレイを表示
        setTimeout(() => {
            overlay.classList.remove("visible"); // オーバーレイを非表示
        }, 2000); // 1秒後にメニューに戻る
        setTimeout(() => {
            gameContainer.style.display = "none"; // ゲーム画面を非表示
            menuContainer.style.display = "block"; // メニューを表示
        }, 1600); // 1秒後にメニューに戻る
    }
    
    // ゲーム画面内のクリックで次に進むイベント
    gameContainer.addEventListener("click", nextScene);
    
    // キー押下で次に進むイベント（Enterまたはスペースキー）
    document.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
            nextScene();
        }
    });
    
    // 各ボタンにクリックイベントを追加して物語を選択
    storyButtons.forEach(button => {
        button.addEventListener("click", () => {
            const scenarioFile = button.getAttribute("data-scenario");
            loadScenario(scenarioFile);
        });
    });
    