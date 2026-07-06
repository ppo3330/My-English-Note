const wordForm = document.querySelector("#word-form");
const englishInput = document.querySelector("#english-input");
const koreanInput = document.querySelector("#korean-input");
const wordList = document.querySelector("#word-list");

const words = [];

wordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (englishInput.value === "" || koreanInput.value === "") {
    alert("영어와 뜻을 모두 입력해주세요.");
    return;
  }

  const newWord = {
    english: englishInput.value,
    korean: koreanInput.value,
  };
  
  words.push(newWord);

  renderWords();

  englishInput.value = "";
  koreanInput.value = "";

  console.log(words);
});

function renderWords(){
    wordList.innerHTML = "";

    words.forEach(function (word){
        const listItem = document.createElement("li");

        listItem.textContent = word.english + " - " + word.korean;

        wordList.appendChild(listItem);
    });
}