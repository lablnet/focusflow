export type Category = 'Deep Work' | 'Communication' | 'Meetings' | 'Utility' | 'Entertainment' | 'Other';

const CATEGORY_MAP: Record<string, Category> = {
  // Browsers usually need specific tab titles, but we categorize the app overall for now
  'Google Chrome': 'Other',
  'Safari': 'Other',
  'Arc': 'Other',
  'Firefox': 'Other',
  
  // Development
  'Visual Studio Code': 'Deep Work',
  'Cursor': 'Deep Work',
  'Terminal': 'Deep Work',
  'iTerm2': 'Deep Work',
  'Xcode': 'Deep Work',
  'IntelliJ IDEA': 'Deep Work',
  
  // Communication
  'Slack': 'Communication',
  'Microsoft Teams': 'Communication',
  'Discord': 'Communication',
  'WhatsApp': 'Communication',
  'Telegram': 'Communication',
  'Zoom': 'Meetings',
  'Google Meet': 'Meetings',
  
  // Productivity/Utility
  'Notion': 'Deep Work',
  'Obsidian': 'Deep Work',
  'Linear': 'Deep Work',
  'Trello': 'Deep Work',
  'Spotify': 'Utility',
  'Finder': 'Utility',
  'System Settings': 'Utility'
};

export function categorizeWindow(appName: string, windowTitle: string): Category {
  if (CATEGORY_MAP[appName]) {
    return CATEGORY_MAP[appName];
  }
  
  const title = windowTitle.toLowerCase();
  if (title.includes('github') || title.includes('gitlab') || title.includes('stack overflow')) return 'Deep Work';
  if (title.includes('gmail') || title.includes('outlook') || title.includes('mail')) return 'Communication';
  if (title.includes('youtube') || title.includes('netflix')) return 'Entertainment';
  
  return 'Other';
}

export function calculateFocusScore(keystrokes: number, mouseMoves: number, durationMinutes: number): number {
  if (durationMinutes === 0) return 0;
  
  // Weigh keystrokes more heavily (2x) as they usually indicate active "Deep Work"
  // Mouse moves are often supplementary
  const weightedInputs = (keystrokes * 2) + mouseMoves;
  const inputsPerMinute = weightedInputs / durationMinutes;
  
  // Rize-inspired calibration:
  // peakFocusThreshold: ~150 weighted points per minute is usually very high intensity
  const peakFocusThreshold = 150;
  
  const score = Math.min((inputsPerMinute / peakFocusThreshold) * 100, 100);
  return Math.round(score);
}
