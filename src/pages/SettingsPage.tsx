import React from 'react'
import { usePreferencesStore } from '../shared/stores/preferencesStore'
import { Button } from '../components'

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = usePreferencesStore()
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">설정</h2>

      {/* 다크모드 */}
      <div className="flex items-center justify-between">
        <span>다크 모드</span>
        <Button variant="secondary" onClick={toggleDarkMode}>
          {darkMode ? '끄기' : '켜기'}
        </Button>
      </div>
    </div>
  )
}

export default SettingsPage
