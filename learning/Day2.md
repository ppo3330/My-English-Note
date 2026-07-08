# Day 2 - 세 노트와 데이터 구조

## 오늘 목표

- 단어, 구동사, 문장 노트를 구분한다.
- 항목을 문자열이 아니라 객체로 저장한다.
- 노트별 배열을 따로 관리해서 데이터가 섞이지 않게 한다.

## 오늘 만든 것

- `word`, `phrasalVerb`, `sentence` 세 노트를 선택하는 버튼을 만들었다.
- 선택한 노트에 따라 입력 라벨과 목록 제목이 바뀌게 했다.
- 항목을 다음 객체 구조로 저장했다.

```javascript
{
  id: "고유 ID",
  type: "word",
  english: "take off",
  korean: "벗다, 이륙하다",
  example: "The plane took off.",
  memo: "",
  source: "",
  status: "new",
  createdAt: "생성 날짜",
  updatedAt: "수정 날짜"
}
```

## 핵심 개념

배열은 여러 항목을 담기 좋고, 객체는 한 항목의 여러 정보를 묶기 좋다.

```javascript
const notebookItems = {
  word: [],
  phrasalVerb: [],
  sentence: [],
};
```

위 구조를 사용하면 현재 선택한 노트의 배열에만 새 항목을 추가할 수 있다.

## 완료 확인

- [x] 단어 노트에 저장한 항목은 단어 노트에서만 보인다.
- [x] 구동사 노트에 저장한 항목은 구동사 노트에서만 보인다.
- [x] 문장 노트에 저장한 항목은 문장 노트에서만 보인다.
- [x] 각 항목은 `id`, `type`, `english`, `korean` 같은 속성을 가진 객체로 저장된다.
