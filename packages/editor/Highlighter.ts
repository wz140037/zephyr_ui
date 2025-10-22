import {
  BundledLanguage,
  BundledTheme,
  createHighlighter,
  HighlighterGeneric
} from 'shiki'

export class Highlighter {
  private highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null

  constructor() { }

  async init() {
    try {
      const highlighter = await createHighlighter({
        themes: ['github-dark', 'vitesse-dark'], // 示例
        langs: ['ts', 'vue']
      })
      this.highlighter = highlighter
    } catch (error) {
      console.log('高亮器初始化失败', error);
    }
  }

  // 获取高亮器
  getHighlighter() {
    return this.highlighter
  }

  // 获取高亮器注册的语言
  getLanguages() {
    return this.highlighter?.getLoadedLanguages() || []
  }

  // 获取高亮器注册的主题
  getThemes() {
    return this.highlighter?.getLoadedThemes() || []
  }

  // 注册语言
  registerLanguage(lang: BundledLanguage) {
    return new Promise((resolve, reject) => {
      try {
        if (this.highlighter && !this.getLanguages().includes(lang)) {
          this.highlighter.loadLanguage(lang)
        }
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }
  // 注册主题
  registerTheme(theme: BundledTheme) {
    return new Promise((resolve, reject) => {
      try {
        if (this.highlighter && !this.getThemes().includes(theme)) {
          this.highlighter.loadTheme(theme)
        }
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }
}