# Redux 사용 가이드

## 설치된 패키지
- `@reduxjs/toolkit`: Redux Toolkit (Redux의 공식 권장 방식)
- `react-redux`: React와 Redux 연동

## 프로젝트 구조

```
src/
├── store/
│   ├── index.js                 # Redux store 설정
│   └── slices/
│       └── exampleSlice.js      # 예제 slice
└── app/
    ├── providers.js             # Redux Provider wrapper
    └── layout.js                # Provider로 래핑됨
```

## 사용 방법

### 1. 새로운 Slice 만들기

`src/store/slices/yourSlice.js` 파일을 만듭니다:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 초기 상태 정의
};

export const yourSlice = createSlice({
  name: 'yourSliceName',
  initialState,
  reducers: {
    // 리듀서 함수들 정의
    yourAction: (state, action) => {
      // state 업데이트 로직
    },
  },
});

export const { yourAction } = yourSlice.actions;
export default yourSlice.reducer;
```

### 2. Store에 Slice 등록하기

`src/store/index.js`에 slice를 추가합니다:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import yourReducer from './slices/yourSlice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    yourSliceName: yourReducer,
  },
});
```

### 3. 컴포넌트에서 사용하기

```javascript
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '@/store/slices/exampleSlice';

export default function YourComponent() {
  // 상태 가져오기
  const value = useSelector((state) => state.example.value);

  // dispatch 함수 가져오기
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

## 주의사항

- Next.js App Router에서는 클라이언트 컴포넌트에서만 Redux hooks를 사용할 수 있습니다
- 컴포넌트 상단에 `'use client'` 지시어를 추가해야 합니다
- Provider는 이미 `src/app/layout.js`에 설정되어 있습니다

## 예제 Slice

예제 카운터 slice가 `src/store/slices/exampleSlice.js`에 준비되어 있습니다.
이를 참고하여 새로운 slice를 만들 수 있습니다.
