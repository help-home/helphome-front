'use client';

import { useState, useEffect } from 'react';

export default function LanguagePage() {
  const [languages, setLanguages] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [nextId, setNextId] = useState(5);

  const [searchCategory, setSearchCategory] = useState('공통');
  const [searchText, setSearchText] = useState('');

  // 페이지 로드 시 저장된 언어 데이터 가져오기
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const response = await fetch(`${apiUrl}/api/languages/active`);

      if (!response.ok) {
        throw new Error('데이터 로드 실패');
      }

      const data = await response.json();

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const categoryMap = {
        'common': '공통',
        'success': '성공',
        'error': '에러'
      };

      const formattedLanguages = data.map((lang, index) => ({
        id: lang.id || index,
        category: categoryMap[lang.category] || lang.category,
        korean: lang.koName || '',
        english: lang.enName || '',
        chinese: lang.chName || '',
        isEditing: false
      }));

      setLanguages(formattedLanguages);

      // nextId를 가장 큰 id + 1로 설정
      if (formattedLanguages.length > 0) {
        const maxId = Math.max(...formattedLanguages.map(lang => lang.id));
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error('언어 데이터 로드 에러:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === languages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(languages.map(lang => lang.id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRegister = async () => {
    // 선택된 언어들을 찾기
    const selectedLanguages = languages.filter(lang => selectedIds.includes(lang.id) && lang.isEditing);

    if (selectedLanguages.length === 0) {
      // 선택된 편집 중인 언어가 없으면 새 행 추가
      const newLanguage = {
        id: nextId,
        category: '공통',
        korean: '',
        english: '',
        chinese: '',
        isEditing: true,
      };
      setLanguages([newLanguage, ...languages]);
      setSelectedIds([nextId, ...selectedIds]);
      setNextId(nextId + 1);
      return;
    }

    // 선택된 언어들을 백엔드에 저장
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      for (const lang of selectedLanguages) {
        // 유효성 검사
        if (!lang.korean) {
          alert('한국어는 필수 항목입니다.');
          return;
        }

        // 구분 값을 영문 키로 변환
        const categoryMap = {
          '공통': 'common',
          '성공': 'success',
          '에러': 'error'
        };

        const response = await fetch(`${apiUrl}/api/languages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: categoryMap[lang.category],
            koName: lang.korean,
            enName: lang.english,
            chName: lang.chinese,
          }),
        });

        if (!response.ok) {
          throw new Error('저장 실패');
        }
      }

      // 저장 성공 시 편집 모드 해제
      setLanguages(languages.map(lang =>
        selectedIds.includes(lang.id) && lang.isEditing
          ? { ...lang, isEditing: false }
          : lang
      ));

      // 선택 해제
      setSelectedIds(selectedIds.filter(id => !selectedLanguages.some(lang => lang.id === id)));

      alert('저장되었습니다.');

      // 데이터 다시 로드
      await fetchLanguages();
    } catch (error) {
      console.error('저장 에러:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    console.log('수정 클릭, 선택된 항목:', selectedIds);
  };

  const handleDelete = () => {
    console.log('삭제 클릭, 선택된 항목:', selectedIds);
  };

  const handleSave = (id) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, isEditing: false } : lang
    ));
  };

  const handleCancel = (id) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>다국어 설정</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={{
              padding: '10px 20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              height: '42px'
            }}
          >
            <option value="공통">공통</option>
            <option value="성공">성공</option>
            <option value="에러">에러</option>
          </select>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="언어 검색"
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              width: '300px',
              height: '42px',
              boxSizing: 'border-box'
            }}
          />
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976D2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              height: '42px',
              fontSize: '14px'
            }}
          >
            검색
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRegister}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            등록
          </button>
          <button
            onClick={handleEdit}
            disabled={selectedIds.length !== 1}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedIds.length === 1 ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedIds.length === 1 ? 'pointer' : 'not-allowed'
            }}
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedIds.length > 0 ? '#f44336' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            삭제
          </button>
        </div>
      </div>

      <table style={{
        width: '100%',
        marginTop: '20px',
        borderCollapse: 'collapse',
        border: '1px solid #ddd'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd', width: '50px' }}>
              <input
                type="checkbox"
                checked={selectedIds.length === languages.length}
                onChange={handleSelectAll}
              />
            </th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>구분</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>국문</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>영문</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>중문</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang) => (
            <tr
              key={lang.id}
              style={{
                backgroundColor: selectedIds.includes(lang.id) ? '#e3f2fd' : 'white',
                cursor: lang.isEditing ? 'default' : 'pointer'
              }}
              onMouseOver={(e) => {
                if (!selectedIds.includes(lang.id) && !lang.isEditing) {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                }
              }}
              onMouseOut={(e) => {
                if (!selectedIds.includes(lang.id) && !lang.isEditing) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(lang.id)}
                  onChange={() => handleSelectOne(lang.id)}
                />
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {lang.isEditing ? (
                  <select
                    value={lang.category}
                    onChange={(e) => handleFieldChange(lang.id, 'category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="공통">공통</option>
                    <option value="성공">성공</option>
                    <option value="에러">에러</option>
                  </select>
                ) : (
                  lang.category
                )}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {lang.isEditing ? (
                  <input
                    type="text"
                    value={lang.korean}
                    onChange={(e) => handleFieldChange(lang.id, 'korean', e.target.value)}
                    placeholder="한국어 입력"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  lang.korean
                )}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {lang.isEditing ? (
                  <input
                    type="text"
                    value={lang.english}
                    onChange={(e) => handleFieldChange(lang.id, 'english', e.target.value)}
                    placeholder="영문 입력"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  lang.english
                )}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {lang.isEditing ? (
                  <input
                    type="text"
                    value={lang.chinese}
                    onChange={(e) => handleFieldChange(lang.id, 'chinese', e.target.value)}
                    placeholder="중문 입력"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  lang.chinese
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
