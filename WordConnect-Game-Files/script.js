const words = [
  ["CAT", "แมว"], ["DOG", "สุนัข"], ["BIRD", "นก"], ["FISH", "ปลา"],
  ["COW", "วัว"], ["PIG", "หมู"], ["HORSE", "ม้า"], ["GOAT", "แพะ"],
  ["SHEEP", "แกะ"], ["CHICKEN", "ไก่"], ["DUCK", "เป็ด"], ["RABBIT", "กระต่าย"],
  ["MONKEY", "ลิง"], ["TIGER", "เสือ"], ["LION", "สิงโต"], ["BEAR", "หมี"],
  ["ELEPHANT", "ช้าง"], ["GIRAFFE", "ยีราฟ"], ["ZEBRA", "ม้าลาย"], ["PANDA", "แพนด้า"],
  ["SNAKE", "งู"], ["FROG", "กบ"], ["TURTLE", "เต่า"], ["CROCODILE", "จระเข้"],
  ["DOLPHIN", "โลมา"], ["WHALE", "วาฬ"], ["SHARK", "ฉลาม"], ["EAGLE", "นกอินทรี"],
  ["BUTTERFLY", "ผีเสื้อ"], ["SPIDER", "แมงมุม"]
];

let current = 0;
let score = 0;
let lives = 3;
let time = 30;
let timer = null;
let selected = [];

const $ = id => document.getElementById(id);

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startGame() {
  current = 0;
  score = 0;
  lives = 3;
  $("menu").classList.add("hidden");
  $("result").classList.add("hidden");
  $("game").classList.remove("hidden");
  updateStatus();
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  selected = [];
  time = 30;
  $("message").textContent = "";
  $("questionNo").textContent = current + 1;

  const [word, meaning] = words[current];
  $("meaning").textContent = "คำแปล: " + meaning;

  const letters = shuffle(word.split(""));
  $("letters").innerHTML = "";
  letters.forEach((letter, index) => {
    const btn = document.createElement("button");
    btn.className = "letter";
    btn.textContent = letter;
    btn.dataset.index = index;
    btn.onclick = () => chooseLetter(btn, letter);
    $("letters").appendChild(btn);
  });

  renderAnswer();
  updateStatus();

  timer = setInterval(() => {
    time--;
    updateStatus();
    if (time <= 0) {
      clearInterval(timer);
      wrongAnswer("หมดเวลา! เสีย 1 ชีวิต");
    }
  }, 1000);
}

function chooseLetter(btn, letter) {
  if (btn.disabled) return;

  btn.disabled = true;
  selected.push({ letter, btn });
  renderAnswer();

  if (selected.length === words[current][0].length) {
    const answer = selected.map(x => x.letter).join("");
    checkAnswer(answer);
  }
}

function renderAnswer() {
  $("answer").innerHTML = "";
  selected.forEach(item => {
    const span = document.createElement("span");
    span.className = "answer-letter";
    span.textContent = item.letter;
    $("answer").appendChild(span);
  });
}

function checkAnswer(answer) {
  clearInterval(timer);
  const correct = words[current][0];

  if (answer === correct) {
    score += 10;
    $("message").textContent = "✅ ถูกต้อง! +10 คะแนน";
    updateStatus();

    setTimeout(() => {
      current++;
      if (current >= words.length) endGame();
      else showQuestion();
    }, 700);
  } else {
    wrongAnswer("❌ ไม่ถูกต้อง! เสีย 1 ชีวิต");
  }
}

function wrongAnswer(text) {
  lives--;
  $("message").textContent = text;
  updateStatus();

  if (lives <= 0) {
    setTimeout(endGame, 700);
  } else {
    setTimeout(showQuestion, 700);
  }
}

function clearAnswer() {
  selected.forEach(item => item.btn.disabled = false);
  selected = [];
  renderAnswer();
}

function updateStatus() {
  $("score").textContent = score;
  $("lives").textContent = lives;
  $("time").textContent = time;
}

function endGame() {
  clearInterval(timer);
  $("game").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("finalScore").textContent = score;

  if (score === 300) {
    $("resultText").textContent = "🎉 ยอดเยี่ยม! ตอบถูกครบทุกข้อ";
  } else if (score >= 200) {
    $("resultText").textContent = "👏 เก่งมาก! ลองเล่นอีกครั้งเพื่อทำคะแนนให้สูงขึ้น";
  } else {
    $("resultText").textContent = "💪 ลองทบทวนคำศัพท์แล้วเล่นใหม่อีกครั้ง";
  }
}

$("startBtn").onclick = startGame;
$("restartBtn").onclick = startGame;
$("clearBtn").onclick = clearAnswer;
