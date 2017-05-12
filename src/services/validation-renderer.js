export class ValidationRenderer {

  render(instruction) {
    for (let {elements, result} of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let {elements, result} of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element, result) {
    // TODO: investigate why the property is not being removed
    // element.classList.add('error');

    const message = document.createElement('div');
    message.className = 'validation-message-container';
    message.textContent = result.message;
    message.id = `validation-message-${result.id}`;
    element.parentNode.insertBefore(message, element.nextSibling);
  }

  remove(element, result) {
    const message = element.parentElement.querySelector(`#validation-message-${result.id}`);
    if (message) {
      element.parentElement.removeChild(message);
      // TODO: investigate why the property is not being removed
      // element.classList.remove('error');
    }
  }
}
