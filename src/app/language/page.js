'use client';

import { useState } from 'react';

export default function LanguagePage() {
  const [languages, setLanguages] = useState([
    { id: 1, code: 'ko', name: '한국어', englishName: 'Korean', isEditing: false },
    { id: 2, code: 'en', name: 'English', englishName: 'English', isEditing: false },
    { id: 3, code: 'ja', name: '日本語', englishName: 'Japanese', isEditing: false },
    { id: 4, code: 'zh', name: '中文', englishName: 'Chinese', isEditing: false },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [nextId, setNextId] = useState(5);

  const availableLanguageCodes = [
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'ar', name: 'العربية (Arabic)' },
  ];

  const handleSelectAll = (e) => {
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

  const handleRegister = () => {
    const newLanguage = {
      id: nextId,
      code: '',
      name: '',
      englishName: '',
      isEditing: true,
    };
    setLanguages([newLanguage, ...languages]);
    setSelectedIds([nextId, ...selectedIds]);
    setNextId(nextId + 1);
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
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
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>코드</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>언어명</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>영문명</th>
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
                    value={lang.code}
                    onChange={(e) => handleFieldChange(lang.id, 'code', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">선택</option>
                    {availableLanguageCodes.map((langCode) => (
                      <option key={langCode.code} value={langCode.code}>
                        {langCode.code} - {langCode.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  lang.code
                )}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {lang.isEditing ? (
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => handleFieldChange(lang.id, 'name', e.target.value)}
                    placeholder="언어명 입력"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  lang.name
                )}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {lang.isEditing ? (
                  <input
                    type="text"
                    value={lang.englishName}
                    onChange={(e) => handleFieldChange(lang.id, 'englishName', e.target.value)}
                    placeholder="영문명 입력"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  lang.englishName
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
