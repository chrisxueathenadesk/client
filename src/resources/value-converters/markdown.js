import  MarkdownIt from 'markdown-it';

export class MarkdownValueConverter {
  constructor() {
    this.md = new MarkdownIt();
  }

  toView(text) {
    if (text === null || text === undefined) {
      return '';
    }
    return this.md.render(text);
  }
}

