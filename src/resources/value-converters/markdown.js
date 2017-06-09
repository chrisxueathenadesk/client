import  MarkdownIt from 'markdown-it';

export class MarkdownValueConverter {
  constructor() {
    this.md = new MarkdownIt({html: true});
  }

  toView(text) {
    if (text === null || text === undefined) {
      return '';
    }
    return this.md.render(text);
  }
}

