export const detectIconFromName = (categoryName: string, isDarkMode?: boolean): string => {
  const name = categoryName.toLowerCase().trim();

  const exactMatches: Record<string, string> = {
    'all': 'clipboard-list',
    'all tasks': 'clipboard-list',
    'notes': 'file-text',
    'notes-workspace': 'folder-symlink',
    'trash': 'trash-2',
    'recycle bin': 'history',
    'files': 'folder-open',
    'search': 'search',
    'sidebar': 'panel-right',
    'layout': 'panel-right',
    'favorites': 'bookmark', 
    'favorite': 'bookmark',  
    'appearance': isDarkMode ? 'sun' : 'moon',
    'settings': 'settings',
    'config': 'settings',
    'delete': 'x',
    'close': 'x',
    'remove': 'x',
  };

  if (exactMatches[name]) return exactMatches[name];

  const keywordMap: Record<string, string[]> = {
    'laptop': ['programming', 'code', 'coding', 'dev', 'software', 'tech', 'script'],
    'monitor': ['computer', 'pc', 'desktop', 'screen'],
    'globe': ['web', 'website', 'html', 'internet', 'online', 'browser'],
    'smartphone': ['mobile', 'app', 'ios', 'android', 'phone', 'cell'],
    'home': ['home', 'house', 'residence', 'apartment', 'living'],
    'users': ['family', 'kids', 'children', 'team', 'group', 'people', 'social'],
    'user': ['personal', 'private', 'me', 'profile', 'self'],
    'briefcase': ['work', 'office', 'job', 'business', 'corporate', 'career'],
    'calendar': ['meeting', 'conference', 'call', 'appointment', 'event', 'date'],
    'folder-kanban': ['project', 'task', 'management', 'plan', 'workflow'],
    'shopping-cart': ['shopping', 'buy', 'purchase', 'store', 'market', 'grocery'],
    'dollar-sign': ['finance', 'money', 'budget', 'payment', 'bill', 'tax', 'cash'],
    'wallet': ['bank', 'account', 'savings', 'crypto', 'wallet'],
    'heart': ['health', 'medical', 'doctor', 'medicine', 'wellness', 'love'],
    'activity': ['sport', 'fitness', 'exercise', 'gym', 'workout', 'running', 'training'],
    'utensils': ['food', 'meal', 'diet', 'cooking', 'restaurant', 'eat', 'dinner'],
    'graduation-cap': ['education', 'study', 'learn', 'school', 'course', 'college', 'uni'],
    'book': ['book', 'read', 'reading', 'library', 'literature'],
    'plane': ['travel', 'trip', 'vacation', 'holiday', 'flight', 'airport'],
    'car': ['car', 'vehicle', 'driving', 'transport', 'auto'],
    'film': ['movie', 'film', 'cinema', 'video', 'watch', 'netflix'],
    'music': ['music', 'song', 'audio', 'sound', 'playlist', 'spotify'],
    'gamepad-2': ['game', 'gaming', 'play', 'xbox', 'ps5', 'nintendo'],
    'palette': ['art', 'draw', 'paint', 'design', 'creative', 'color'],
    'mail': ['email', 'mail', 'message', 'inbox', 'letter'],
    'share-2': ['social', 'media', 'network', 'connect'],
    'flame': ['urgent', 'priority', 'important', 'asap', 'critical', 'hot', 'fire'],
    'sticky-note': ['note', 'memo', 'reminder', 'sticky'],
    'lightbulb': ['idea', 'brainstorm', 'think', 'insight', 'innovation'],
    'target': ['goal', 'target', 'objective', 'aim', 'mission'],
    'party-popper': ['event', 'party', 'celebration', 'birthday'],
    'lock': ['security', 'password', 'safe', 'secure', 'private'],
    'camera': ['photo', 'picture', 'image', 'photography', 'instagram'],
    'coffee': ['coffee', 'tea', 'drink', 'break', 'morning'],
    'bell': ['notification', 'alert', 'alarm', 'warn'],
    'cloud': ['cloud', 'weather', 'storage', 'server', 'backup'],
    'map': ['map', 'location', 'place', 'address', 'navigation'],
    'tool': ['tool', 'fix', 'build', 'maintain', 'repair', 'hardware'],
    'gift': ['gift', 'present', 'reward', 'bonus'],
    'panel-right': ['panel', 'sidebar-toggle', 'expand'],
    'bookmark': ['favorite', 'save', 'saved', 'star', 'bookmark'],
  };

  for (const [icon, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return icon;
    }
  }

  if (name.includes('?')) return 'help-circle';
  if (name.includes('!')) return 'alert-circle';

  return 'folder';
};