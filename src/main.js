import { loadItems, saveItems } from "./storage.js";

const itemForm = document.querySelector("#item-form");
const englishInput = document.querySelector("#english-input");
const koreanInput = document.querySelector("#korean-input");
const exampleInput = document.querySelector("#example-input");
const memoInput = document.querySelector("#memo-input");
const sourceInput = document.querySelector("#source-input");
const sourceField = document.querySelector("#source-field");
const itemList = document.querySelector("#item-list");
const emptyMessage = document.querySelector("#empty-message");
const currentNoteTitle = document.querySelector("#current-note-title");
const listTitle = document.querySelector("#list-title");
const englishLabel = document.querySelector("#english-label");
const koreanLabel = document.querySelector("#korean-label");
const noteTabs = document.querySelectorAll(".note-tab");
const searchInput = document.querySelector("#search-input");

const studyCard = document.querySelector('#study-card');
const checkAnswerButton = document.querySelector("#check-answer-button");
const englishToKoreanButton = document.querySelector("#english-to-korean-button");
const koreanToEnglishButton = document.querySelector("#korean-to-english-button");
const knownAnswerButton = document.querySelector("#known-answer-button");
const vagueAnswerButton = document.querySelector("#vague-answer-button");
const noAnswerButton = document.querySelector("#no-answer-button");
const studyStatus = document.querySelector("#study-status");


const noteLabels = {
  word: {
    title: "단어 노트",
    listTitle: "저장한 단어",
    english: "영어 단어",
    korean: "한국어 뜻",
  },
  phrasalVerb: {
    title: "구동사 노트",
    listTitle: "저장한 구동사",
    english: "구동사",
    korean: "한국어 뜻",
  },
  sentence: {
    title: "문장 노트",
    listTitle: "저장한 문장",
    english: "영어 문장",
    korean: "한국어 해석",
  },
};

const notebookItems = loadItems();

let currentNoteType = "word";
let editingItemId = null;
let currentStudyItem = null;
let studyDirection = "englishToKorean";

noteTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    currentNoteType = tab.dataset.noteType;
    updateNoteView();
  });
});

searchInput.addEventListener("input", function () {
  renderItems();
});

itemForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const english = englishInput.value.trim();
  const korean = koreanInput.value.trim();

  if (english === "" || korean === "") {
    alert("영어와 뜻을 모두 입력해주세요.");
    return;
  }

  const now = new Date().toISOString();
  const newItem = {
    id: crypto.randomUUID(),
    type: currentNoteType,
    english: english,
    korean: korean,
    example: exampleInput.value.trim(),
    memo: memoInput.value.trim(),
    source: sourceInput.value.trim(),
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  if (editingItemId === null){
    notebookItems[currentNoteType].push(newItem);
  }
  else{
    notebookItems[currentNoteType] = notebookItems[currentNoteType].map(function (savedItem) {
      if (savedItem.id === editingItemId){
        return {
          ...savedItem,
          english: english,
          korean: korean,
          example: exampleInput.value.trim(),
          memo: memoInput.value.trim(),
          source: sourceInput.value.trim(),
          updatedAt: now,
        };
      }

      return savedItem;
    });

    editingItemId = null;
  }

  saveItems(notebookItems);
  itemForm.reset();
  renderItems();
});

function updateNoteView() {
  const labels = noteLabels[currentNoteType];

  currentNoteTitle.textContent = labels.title;
  listTitle.textContent = labels.listTitle;
  englishLabel.textContent = labels.english;
  koreanLabel.textContent = labels.korean;
  sourceField.classList.toggle("hidden", currentNoteType !== "sentence");

  noteTabs.forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.noteType === currentNoteType);
  });

  itemForm.reset();
  renderItems();
  renderStudyCard();
}

function renderItems() {
  const currentItems = notebookItems[currentNoteType];
  const searchText = searchInput.value.trim().toLowerCase();

  const filteredItems = currentItems.filter(function (item) {
    return (
      item.english.toLowerCase().includes(searchText) ||
      item.korean.toLowerCase().includes(searchText)
    );
  });

  itemList.innerHTML = "";
  emptyMessage.classList.toggle("hidden", filteredItems.length > 0);

  filteredItems.forEach(function (item) {
    const listItem = document.createElement("li");
    const title = document.createElement("strong");
    const meaning = document.createElement("span");
    const details = document.createElement("small");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
  

    title.textContent = item.english;
    meaning.textContent = item.korean;
    details.textContent = getItemDetails(item);
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function (){
      notebookItems[currentNoteType] = notebookItems[currentNoteType].filter(function (savedItem){
        return savedItem.id !== item.id;
      });

      saveItems(notebookItems);
      renderItems();
    });

    editButton.textContent = "Edit";
    editButton.addEventListener("click", function (){
      editingItemId = item.id;

      englishInput.value = item.english;
      koreanInput.value = item.korean;
      exampleInput.value = item.example;
      memoInput.value = item.memo;
      sourceInput.value = item.source;
    });

    
    listItem.append(title, meaning);

    if (details.textContent !== "") {
      listItem.appendChild(details);
    }

    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    itemList.appendChild(listItem);
  });
}

function getItemDetails(item) {
  const details = [];

  if (item.example !== "") {
    details.push(`예문: ${item.example}`);
  }

  if (item.source !== "") {
    details.push(`출처: ${item.source}`);
  }

  if (item.memo !== "") {
    details.push(`메모: ${item.memo}`);
  }

  return details.join(" / ");
}

function renderStudyCard(){
  const currentItems = notebookItems[currentNoteType];
  const firstItem = currentItems[0];
  if (firstItem === undefined) {
    currentStudyItem = null;
    studyCard.textContent = "학습할 항목이 없습니다.";
    return;
  }
  currentStudyItem = firstItem;

  if (studyDirection === "englishToKorean"){
    studyCard.textContent = firstItem.english;
  }
  if (studyDirection === "koreanToEnglish"){
    studyCard.textContent = firstItem.korean;
  }

  if (currentStudyItem.status === "known"){
    studyStatus.textContent = "알고있음";
  }
  else if(currentStudyItem.status === "vague"){
    studyStatus.textContent = "헷갈림";
  }
  else if(currentStudyItem.status === "no"){
    studyStatus.textContent = "모름";
  }
}

checkAnswerButton.addEventListener("click",function(){
  if (currentStudyItem === null) {
    return;
  }

  if (studyDirection === "englishToKorean"){
    studyCard.textContent = currentStudyItem.korean;
  }
  if (studyDirection === "koreanToEnglish"){
    studyCard.textContent = currentStudyItem.english;
  }
})

englishToKoreanButton.addEventListener("click",function(){
  studyDirection = "englishToKorean";
  renderStudyCard();
})
koreanToEnglishButton.addEventListener("click",function(){
  studyDirection = "koreanToEnglish";
  renderStudyCard();
})

knownAnswerButton.addEventListener("click",function(){
  if (currentStudyItem === null) {
    return;
  }
  
  currentStudyItem.status = "known";
  renderStudyCard();
  saveItems(notebookItems);
})

vagueAnswerButton.addEventListener("click",function(){
  if (currentStudyItem === null) {
    return;
  }

  currentStudyItem.status = "vague";
  renderStudyCard();
  saveItems(notebookItems);
})

noAnswerButton.addEventListener("click",function(){
  if (currentStudyItem === null) {
    return;
  }

  currentStudyItem.status = "no";
  renderStudyCard();
  saveItems(notebookItems);
})


updateNoteView();
renderStudyCard();
